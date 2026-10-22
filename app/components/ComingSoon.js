import PageFrame from "./PageFrame";
import PurchaseInvitation from "./PurchaseInvitation";
import styles from "./page-frame.module.css";

export default function ComingSoon({ title, image, introduction, description, points = [], account = false, purchaseSuggestions = false }) {
  return <PageFrame eyebrow="COMING SOON" title={title} introduction={introduction} image={image}>
    <section className={styles.sectionNarrow}>
      <span className={`${styles.badge} ${styles.pending}`}>In preparation</span>
      <h2>{account ? "Your place at TEACH is taking shape." : "A little more is on the way."}</h2>
      <p>{description}</p>
      {points.length > 0 && <ul className={styles.list}>{points.map(point => <li key={point}>{point}</li>)}</ul>}
      {account && <p>Free TEACH accounts will be available to everyone. Purchases will add the resources you choose to My Desk when account features open. Front Porch access requires a Blueprint, curriculum, or generator purchase; a Planner-only purchase does not qualify. Account creation, sign-in, and password reset are not open yet.</p>}
      <div className={styles.notice}><p>In the meantime, you can read the free Library, explore the webinars, and learn about our courses and curriculum.</p></div>
      <div className={styles.actions}><a className={styles.primary} href="/library">Visit the free Library</a><a className={styles.textLink} href="/start">Take the Tour →</a></div>
    </section>
    {purchaseSuggestions && <PurchaseInvitation />}
  </PageFrame>;
}
