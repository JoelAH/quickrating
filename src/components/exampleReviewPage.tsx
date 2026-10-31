import classes from './exampleReviewPage.module.scss';

export default function ExampleReviewPage() {
  return (
    <div className={classes.preview}>
      <div className={classes.address}><span aria-hidden="true">↗</span> quickrating.page/your-business <span>EXAMPLE</span></div>
      <div className={classes.content}>
        <div className={classes.identity}><div className={classes.avatar}>S<span>✦</span></div><div><h3>Sunday Travel Studio</h3><p>Thoughtful trips. Lovely memories.</p></div></div>
        <div className={classes.intro}>A little reassurance for your next adventure.</div>
        <div className={classes.summary}><span aria-label="5 out of 5 stars">★★★★★</span><strong>Kind words from our travelers</strong></div>
        <article className={classes.review}><div className={classes.person}><span>AM</span><div><strong>Alex M.</strong><small>Sample testimonial</small></div><b aria-label="5 out of 5 stars">★★★★★</b></div><p>“Our first big trip together, and every little detail was taken care of. We felt looked after from the first message.”</p></article>
        <article className={classes.review}><div className={classes.person}><span>JR</span><div><strong>Jamie R.</strong><small>Sample testimonial</small></div><b aria-label="5 out of 5 stars">★★★★★</b></div><p>“So helpful with all our questions. Planning our holiday finally felt exciting instead of overwhelming.”</p></article>
        <p className={classes.disclaimer}>Illustrative page with fictional business and sample testimonials.</p>
        <div className={classes.powered}>Made with <span>✦</span> QuickRating</div>
      </div>
    </div>
  );
}
