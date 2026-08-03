/**
 * Generate blog posts using OpenAI
 * Run with: npx tsx scripts/generateAIBlogPosts.ts
 * 
 * Setup: npm install openai
 * Add OPENAI_API_KEY to .env.local
 */

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

// Blog topics to generate
const topics = [
  {
    topic: "How to Ask Customers for Reviews Without Being Pushy",
    keywords: "customer reviews, review requests, small business"
  },
  {
    topic: "5 Ways Instagram Businesses Can Use Reviews to Boost Sales",
    keywords: "Instagram business, social proof, reviews"
  },
  {
    topic: "The Psychology Behind Customer Reviews: Why They Work",
    keywords: "social proof, customer psychology, trust"
  },
  {
    topic: "Review Management for Beginners: A Step-by-Step Guide",
    keywords: "review management, small business, getting started"
  },
  {
    topic: "How to Respond to Negative Reviews Professionally",
    keywords: "negative reviews, customer service, reputation management"
  }
];

async function generateBlogPost(topic: string, keywords: string): Promise<BlogPost> {
  // If you have OpenAI API key, uncomment and use this:
  /*
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a content writer for QuickRating, a review management platform for small businesses. Write engaging, SEO-optimized blog posts in HTML format."
      },
      {
        role: "user",
        content: `Write a blog post about: "${topic}". Include these keywords: ${keywords}. 
        
        Format as HTML with <p>, <h3>, <ul>, <li> tags. Make it 500-700 words. 
        Include a call-to-action mentioning QuickRating at the end.
        Return ONLY the HTML content, no title or subtitle.`
      }
    ]
  });
  
  const content = completion.choices[0].message.content;
  */
  
  // Template-based generation (no API needed)
  const content = generateTemplateContent(topic);
  
  const slug = topic.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  return {
    title: topic,
    subTitle: `Learn practical strategies for ${topic.toLowerCase()} with QuickRating.`,
    slug,
    content,
    date: new Date().toISOString()
  };
}

function generateTemplateContent(topic: string): string {
  // Simple template-based content
  return `
    <p>In today's competitive market, ${topic.toLowerCase()} is more important than ever for small businesses. Customer reviews have become a crucial factor in building trust and attracting new customers.</p>
    
    <h3>Why This Matters</h3>
    <p>Studies show that 93% of consumers read online reviews before making a purchase decision. For small businesses and Instagram sellers, this means that managing your reviews effectively can directly impact your bottom line.</p>
    
    <h3>Key Strategies</h3>
    <ul>
      <li><strong>Be Authentic:</strong> Customers can spot fake reviews from a mile away. Focus on collecting genuine feedback from real customers.</li>
      <li><strong>Make It Easy:</strong> The simpler your review process, the more reviews you'll collect. Use a dedicated review page that customers can access with one click.</li>
      <li><strong>Respond Promptly:</strong> Engage with your reviewers, both positive and negative. This shows you value customer feedback.</li>
      <li><strong>Showcase Your Best:</strong> Display your top reviews prominently on your website and social media.</li>
    </ul>
    
    <h3>How QuickRating Can Help</h3>
    <p>QuickRating makes it easy to collect, manage, and display customer reviews. With a custom review page and simple sharing options, you can start building social proof for your business today.</p>
    
    <p>Whether you're an Instagram business without a website or a small business looking to enhance your online presence, QuickRating provides the tools you need to leverage customer feedback effectively.</p>
    
    <p>Ready to get started? <a href="/">Create your free QuickRating page today</a> and start collecting reviews that drive growth.</p>
  `;
}

async function main() {
  console.log('Generating AI blog posts...\n');
  
  const newPosts: BlogPost[] = [];
  
  for (const { topic, keywords } of topics) {
    const post = await generateBlogPost(topic, keywords);
    newPosts.push(post);
    console.log(`✓ Generated: ${post.title}`);
  }
  
  // Combine with existing blogs
  const allBlogs = [...newPosts, ...blogs];
  
  // Update util.ts
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
