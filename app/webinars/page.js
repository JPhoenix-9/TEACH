import Header from "../components/Header";
import styles from "./page.module.css";

export const metadata = {
  title: "Webinars & Videos | TEACH",
  description: "Free homeschool webinars with Jana Sheridan. Explore 5 Shifts to Stress-Free Homeschooling and upcoming answers to common homeschooling questions.",
};

export default function Webinars() {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div><p className={styles.eyebrow}>FREE WITH REGISTRATION</p><h1>Webinars <em>& Videos</em></h1><p className={styles.lead}>A little guidance.<br />A more confident way forward.</p><p>Explore practical help for learning at home, with Jana Sheridan. Choose a webinar and register free to watch.</p><a className={styles.textLink} href="#webinars">Explore the webinars ↓</a></div>
          <img src="/Icons/webinars.png" alt="" aria-hidden="true" />
        </div>
      </section>

      <section className={styles.collection} id="webinars" aria-label="Homeschool webinars">
        <article className={styles.feature}>
          <div className={styles.cover} aria-hidden="true"><span>TEACH WEBINARS</span><div className={styles.numeral}>5</div><p>Shifts to<br /><em>Stress-Free Homeschooling</em></p><span>WITH JANA SHERIDAN</span></div>
          <div className={styles.featureCopy}>
            <p className={styles.eyebrow}>FREE WITH REGISTRATION · AVAILABLE NOW</p>
            <h2>5 Shifts to<br />Stress-Free Homeschooling</h2>
            <p>Discover five key things you need to understand to make homeschooling work for your family.</p><p>This webinar explores the understanding that helps parents move from struggling to get by toward mastering the art and science of homeschooling.</p>
            <p className={styles.presenter}>Presented by Jana Sheridan</p>
            <a className={styles.primary} href="https://www.homeschool-911.com/webinar-registration" target="_blank" rel="noopener noreferrer">Register to watch free ↗</a>
            <p className={styles.note}>Registration currently opens on Homeschool-911.</p>
          </div>
        </article>

        <article className={`${styles.feature} ${styles.upcoming}`}>
          <div className={`${styles.cover} ${styles.questionsCover}`} aria-hidden="true"><span>TEACH WEBINARS</span><div className={styles.numeral}>10</div><p>Common questions.<br /><em>A place to begin.</em></p><span>WITH JANA SHERIDAN</span></div>
          <div className={styles.featureCopy}>
            <p className={styles.eyebrow}>FREE WITH REGISTRATION · COMING SOON</p>
            <h2>Can I Really Homeschool?<br /><em>Your Top 10 Questions Answered</em></h2>
            <p>Jana addresses ten of the questions parents most often ask about homeschooling.</p><p>This new webinar has been filmed and is preparing for release. Check back here when it becomes available.</p>
            <p className={styles.presenter}>Presented by Jana Sheridan</p><span className={styles.status}>Coming Soon</span>
          </div>
        </article>
      </section>

      <section className={styles.about}>
        <div className={styles.aboutInner}><p className={styles.eyebrow}>YOUR PRESENTER</p><h2>Meet Jana Sheridan</h2><p>A veteran homeschool mom and former private Christian school principal, Jana brings more than 25 years of teaching experience across every grade level. She has led a homeschool support group of more than 100 families and written a newspaper column on parenting and children’s health.</p></div>
      </section>
      <section className={styles.next} id="next-step"><p className={styles.eyebrow}>WHEN YOU’RE READY FOR YOUR NEXT STEP</p><h2>Put what you learn into practice.</h2><div className={styles.nextLinks}>
        <a href="/blueprint"><img className={styles.productThumbnail} src="/products/homeschool-success-blueprint-approved.jpg" width="1200" height="800" alt="Homeschool Success Blueprint product cover" /><div><span>GUIDANCE FOR PARENTS</span><h3>Homeschool Success Blueprint</h3><p>A six-module course to help you build your homeschool with confidence.</p><strong>Explore Blueprint →</strong></div></a>
        <a href="/curriculum/gap"><img className={styles.productThumbnail} src="/products/gap-curriculum-thumbnail.jpg" width="800" height="450" alt="GAP Get Away Plan curriculum product artwork for all four grade bands" /><div><span>CURRICULUM FOR CHILDREN</span><h3>GAP Curriculum</h3><p>Start homeschooling in 20 minutes, with 4–6 weeks of complete curriculum. Zero worksheets. No additional purchases.</p><strong>Explore GAP →</strong></div></a>
      </div></section>
      <footer className={styles.footer}><a href="/">TEACH · Teaching Excellence and Christianity at Home</a><a href="/">Return to TEACH →</a></footer>
    </main>
  </>;
}
