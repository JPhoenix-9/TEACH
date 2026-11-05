import EmailContact from "./components/EmailContact";
import SupportForm from "./components/SupportForm";
import PageFrame from "../components/PageFrame";
import styles from "../components/page-frame.module.css";
export const metadata = { title: "Contact & Help | TEACH", description: "Contact TEACH for help with your account, purchases, and homeschool tools." };
export default function Contact() {
  return <PageFrame eyebrow="CONTACT & HELP" title="A little help finding your way." introduction="Find the right resource or get in touch with TEACH.">
    <section className={styles.sectionNarrow}><p className={styles.eyebrow}>TEACH SUPPORT</p><h2>How can we help?</h2><EmailContact/><p>You can also log in below to leave a private message for TEACH. For a purchase made through Homeschool-911, include the name and email address used for that order.</p>
      <div className={styles.actions}><a className={styles.primary} href="/start">Take the Tour</a><a className={styles.textLink} href="/library">Browse the free Library →</a></div>
    </section>
    <section className={styles.sectionNarrow}><h2>Leave a private message.</h2><SupportForm/></section>
    <section className={styles.soft}><div className={`${styles.sectionNarrow} ${styles.faq}`}><h2>Quick answers</h2>
      <details><summary>Where do purchases happen?</summary><p>You can compare GAP grade bands and Blueprint modules here on TEACH. Product selection pages show current checkout availability. Choosing a package does not take a payment; review and confirm your order securely with Stripe. Recognized purchases appear in Your Resources.</p></details>
      <details><summary>Can I create a TEACH account now?</summary><p>Yes. Choose Create a Free Account in the header, confirm your email, and complete your family profile. The Library is also available without an account.</p></details>
      <details><summary>How do I watch a webinar?</summary><p>Visit Webinars & Videos and register for the available webinar using its registration link. “Can I Really Homeschool?” is filmed and preparing for release.</p><a className={styles.textLink} href="/webinars">Explore the webinars →</a></details>
    </div></section>
  </PageFrame>;
}
