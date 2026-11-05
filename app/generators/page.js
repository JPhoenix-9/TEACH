import PageFrame from "../components/PageFrame";
import styles from "../components/page-frame.module.css";

export const metadata={title:"Generators | TEACH",description:"Activity planning and thoughtful tools for your family's learning."};

export default function Page(){
 return <PageFrame eyebrow="TOOLS FOR YOUR FAMILY" title="Generators" image="/Icons/generators.png" introduction="Thoughtful tools for the ideas, learning, and experience your family is building.">
  <section className={styles.sectionNarrow} aria-labelledby="activity-generator">
   <h2 id="activity-generator">Activity &amp; Enrichment Generator</h2>
   <p>Explore a topic together with activities shaped around your children, available time, budget, and supplies. Choose from three ideas, develop a full plan, or look for related field trip opportunities.</p>
   <div className={styles.actions}><a className={styles.primary} href="/generators/activity">Open Activity Generator →</a></div>
   <p className={styles.muted}>Sign in with the TEACH account that has generator access. New subscriptions are still being prepared.</p>
  </section>
  <section className={`${styles.section} ${styles.soft}`} aria-labelledby="more-generators">
   <h2 id="more-generators">More tools in preparation</h2>
   <div className={styles.gridTwo}>
    <article className={styles.card}><span className={`${styles.badge} ${styles.pending}`}>In preparation</span><h3>Transcript Architect</h3><p>Turn completed coursework and substantial learning experiences into a polished, accurate transcript. $79 per student, three years of updates, and checks for 12 unique colleges.</p><a className={styles.primary} href="/generators/transcript">Open Transcript Architect →</a></article>
    <article className={styles.card}><span className={`${styles.badge} ${styles.pending}`}>Coming soon</span><h3>Legacy Generator</h3><p>Preserve meaningful experience and the stories that matter.</p></article>
   </div>
  </section>
 </PageFrame>;
}
