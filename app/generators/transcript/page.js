import Link from "next/link";
import styles from "./transcript.module.css";

export const metadata = {
  title: "Transcript Generator | TEACH",
  description: "Turn your homeschool journey into a college-ready transcript.",
};

export default function TranscriptGeneratorPage() {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.sprig}>❧</span>
          <strong>TEACH</strong>
          <small>TRANSCRIPT GENERATOR</small>
        </div>
        <nav className={styles.nav} aria-label="Transcript Generator">
          <span className={styles.active}>⌂ <b>Home</b></span>
          <span>♙ Student Profile</span>
          <span>▣ Courses &amp; Activities</span>
          <span>☷ Credits &amp; Grades</span>
          <span>◇ College Requirements</span>
          <span>▤ Review &amp; Generate</span>
          <hr />
          <span>□ Saved Transcripts</span>
          <span>⚙ My Account</span>
          <span>? Help &amp; Resources</span>
        </nav>
      </aside>

      <section className={styles.workspace}>
        <Link className={styles.account} href="/account">Welcome to TEACH⌄</Link>

        <div className={styles.heroCard}>
          <div className={styles.heroBrand}>
            <span className={styles.leaf}>❧</span>
            <h1>TEACH</h1>
            <div>TRANSCRIPT GENERATOR</div>
          </div>
          <p className={styles.tagline}>Turn your homeschool journey<br />into a college-ready transcript.</p>
          <div className={styles.steps}>
            <div><span>▱</span><h2>Build</h2><p>Enter courses, activities and achievements with guidance at every step.</p></div>
            <div><span>◇</span><h2>Match</h2><p>Check your transcript against real college requirements.</p></div>
            <div><span>▤</span><h2>Generate</h2><p>Create a polished, professional transcript in minutes.</p></div>
          </div>
          <button className={styles.start} disabled>Get Started →</button>
          <p className={styles.promise}>You’ve done the teaching. <strong>We’ll help you tell the story.</strong></p>
        </div>

        <div className={styles.development} role="status">
          <div className={styles.developmentInner}>
            <span className={styles.kicker}>COMING SOON</span>
            <h2>The TEACH Transcript Generator is in development.</h2>
            <p>We’re building it now. When it’s ready, this tool will help you turn the learning your student has already done into a clear, professional transcript.</p>
            <Link href="/generators">Back to Generators</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
