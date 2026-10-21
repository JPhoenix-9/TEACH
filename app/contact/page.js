import PageFrame from "../components/PageFrame";
import styles from "../components/page-frame.module.css";
export const metadata = { title: "Contact & Help | TEACH", description: "Find your way around TEACH and check support availability." };
export default function Contact() {
  return <PageFrame eyebrow="CONTACT & HELP" title="A little help finding your way." introduction="Find the right resource and check how to reach us as TEACH takes shape.">
    <section className={styles.sectionNarrow}><p className={styles.eyebrow}>TEACH SUPPORT</p><h2>Our new inbox is being prepared.</h2><p><strong>support@teachforlove.com</strong></p><div className={styles.notice}><p>This address is not receiving messages yet. Please wait until this notice is removed before sending an email.</p></div><p>If you purchased through Homeschool-911, use the contact or reply information in your existing order confirmation for questions about that purchase.</p>
      <div className={styles.actions}><a className={styles.primary} href="/start">Take the Tour</a><a className={styles.textLink} href="/library">Browse the free Library →</a></div>
    </section>
    <section className={styles.soft}><div className={`${styles.sectionNarrow} ${styles.faq}`}><h2>Quick answers</h2>
      <details><summary>Where do purchases happen?</summary><p>Blueprint and GAP enrollment currently open on our original Homeschool-911 website. The sales pages identify these links before you leave TEACH.</p></details>
      <details><summary>Can I create a TEACH account now?</summary><p>Account creation and sign-in are still being prepared. The Library is available to read without an account.</p></details>
      <details><summary>How do I watch a webinar?</summary><p>Visit Webinars & Videos and register for the available webinar using its registration link. “Can I Really Homeschool?” is filmed and preparing for release.</p><a className={styles.textLink} href="/webinars">Explore the webinars →</a></details>
    </div></section>
  </PageFrame>;
}
