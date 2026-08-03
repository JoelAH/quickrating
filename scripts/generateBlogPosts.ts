/**
 * Auto-generate blog posts from platform data
 * Run with: npx tsx scripts/generateBlogPosts.ts
 */

import dbConnect from '@/lib/db/dbConnect';
import User from '@/lib/models/server/user';
import Review from '@/lib/models/server/review';
import { blogs } from '@/lib/util';
import fs from 'fs';
import path from 'path';

interface BlogPost {
  title: string;
  subTitle: string;
  slug: string;
  content: string;
  date: string;
}

async function generateTopRatedBusinessesPost(): Promise<BlogPost> {
  await dbConnect();
  
  // Get businesses with most reviews
  const topBusinesses = await User.aggregate([
    { $match: { username: { $exists: true, $ne: null } } },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'userId',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        avgRating: { $avg: '$reviews.rating' }
      }
    },
    { $match: { reviewCount: { $gte: 5 } } },
    { $sort: { avgRating: -1, reviewCount: -1 } },
    { $limit: 10 }
  ]);

  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  let content = `<p>This month, we're celebrating the top-rated businesses on QuickRating. These businesses have consistently delivered exceptional service, earning glowing reviews from their customers.</p>`;
  
  content += `<h3>Top 10 Businesses in ${month}</h3><ol>`;
  
  topBusinesses.forEach((business, index) => {
    content += `<li><strong>${business.businessName || business.username}</strong> - ${business.reviewCount} reviews, ${business.avgRating.toFixed(1)}⭐ average rating. `;
    content += `<a href="https://quickrating.page/${business.username}">View their reviews</a></li>`;
  });
  
  content += `</ol><p>Want to join these top-rated businesses? <a href="/">Start collecting reviews with QuickRating today</a>.</p>`;

  return {
    title: `Top Rated Businesses on QuickRating - ${month}`,
    subTitle: `Discover the highest-rated businesses this month and see what makes them stand out.`,
    slug: `top-rated-businesses-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    content,
    date: new Date().toISOString()
  };
}

async function generateMilestonePost(userId: string): Promise<BlogPost | null> {
  await dbConnect();
  
  const user = await User.findById(userId);
  const reviews = await Review.find({ userId, published: true });
  
  if (!user || reviews.length < 10) return null;
  
  const milestones = [10, 25, 50, 100, 250, 500];
  const milestone = milestones.find(m => reviews.length >= m) || 10;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const recentReviews = reviews.slice(-3);
  
  let content = `<p>${user.businessName || user.username} has just reached an incredible milestone: ${milestone} customer reviews! This achievement showcases their commitment to customer satisfaction and quality service.</p>`;
  
  content += `<h3>By the Numbers</h3><ul>`;
  content += `<li><strong>Total Reviews:</strong> ${reviews.length}</li>`;
  content += `<li><strong>Average Rating:</strong> ${avgRating.toFixed(1)} out of 5 stars</li>`;
  content += `<li><strong>Customer Satisfaction:</strong> ${Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}% of customers rated 4+ stars</li>`;
  content += `</ul>`;
  
  content += `<h3>What Customers Are Saying</h3>`;
  recentReviews.forEach(review => {
    content += `<blockquote><p>"${review.review}"</p><p><em>- ${review.name}, ${review.rating}⭐</em></p></blockquote>`;
  });
  
  content += `<p>Want to see all their reviews? <a href="https://quickrating.page/${user.username}">Visit ${user.businessName || user.username}'s review page</a>.</p>`;
  content += `<p>Ready to build your own success story? <a href="/">Start collecting reviews with QuickRating</a>.</p>`;

  return {
    title: `Success Story: ${user.businessName || user.username} Reaches ${milestone} Reviews`,
    subTitle: `How ${user.businessName || user.username} built trust and credibility with ${milestone}+ customer reviews.`,
    slug: `success-story-${user.username}-${milestone}-reviews`,
    content,
    date: new Date().toISOString()
  };
}

async function generateIndustryInsightsPost(): Promise<BlogPost> {
  await dbConnect();
  
  const stats = await Review.aggregate([
    { $match: { published: true } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } }
      }
    }
  ]);
  
  const data = stats[0] || { totalReviews: 0, avgRating: 0, fiveStars: 0, fourStars: 0 };
  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  let content = `<p>Every month, we analyze thousands of customer reviews on QuickRating to uncover trends and insights. Here's what the data tells us about ${month}.</p>`;
  
  content += `<h3>Key Statistics</h3><ul>`;
  content += `<li><strong>Total Reviews Collected:</strong> ${data.totalReviews.toLocaleString()}</li>`;
  content += `<li><strong>Platform Average Rating:</strong> ${data.avgRating.toFixed(2)} stars</li>`;
  content += `<li><strong>5-Star Reviews:</strong> ${Math.round((data.fiveStars / data.totalReviews) * 100)}%</li>`;
  content += `<li><strong>4+ Star Reviews:</strong> ${Math.round(((data.fiveStars + data.fourStars) / data.totalReviews) * 100)}%</li>`;
  content += `</ul>`;
  
  content += `<h3>What This Means for Your Business</h3>`;
  content += `<p>The data shows that businesses actively collecting reviews see higher customer satisfaction rates. Customers who take the time to leave reviews are more engaged and likely to return.</p>`;
  content += `<p>Start building your review collection today with <a href="/">QuickRating</a> and join the growing community of businesses leveraging customer feedback.</p>`;

  return {
    title: `Review Trends & Insights - ${month}`,
    subTitle: `Data-driven insights from thousands of customer reviews on QuickRating.`,
    slug: `review-trends-insights-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    content,
    date: new Date().toISOString()
  };
}

async function main() {
  console.log('Generating blog posts...');
  
  const newPosts: BlogPost[] = [];
  
  // Generate monthly top businesses post
  const topRatedPost = await generateTopRatedBusinessesPost();
  newPosts.push(topRatedPost);
  console.log(`✓ Generated: ${topRatedPost.title}`);
  
  // Generate industry insights
  const insightsPost = await generateIndustryInsightsPost();
  newPosts.push(insightsPost);
  console.log(`✓ Generated: ${insightsPost.title}`);
  
  // Combine with existing blogs
  const allBlogs = [...newPosts, ...blogs];
  
  // Update util.ts file
  const utilPath = path.join(process.cwd(), 'src/lib/util.ts');
  const utilContent = fs.readFileSync(utilPath, 'utf-8');
  
  const blogsJson = JSON.stringify(allBlogs, null, 4);
  const updatedContent = utilContent.replace(
    /export const blogs: \{ title: string, subTitle: string, slug: string, content: string, date: string \}\[\] = \[[\s\S]*?\];/,
    `export const blogs: { title: string, subTitle: string, slug: string, content: string, date: string }[] = ${blogsJson};`
  );
  
  fs.writeFileSync(utilPath, updatedContent);
  console.log(`\n✓ Updated util.ts with ${newPosts.length} new blog posts`);
  console.log(`Total blog posts: ${allBlogs.length}`);
}

main().catch(console.error);
