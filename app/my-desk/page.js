import PageFrame from "../components/PageFrame";
import PurchaseInvitation from "../components/PurchaseInvitation";
import styles from "../components/page-frame.module.css";
export const metadata = {"title":"My Desk | TEACH","description":"Your personal place for the resources and work that belong to you."};
export default function Page() {
  return <PageFrame eyebrow="MY DESK · PREPARING TO OPEN" title="My Desk" image="/Icons/my-desk.png" introduction="Explore the resources that can make this desk your own.">
    <section className={styles.sectionNarrow}><a className={styles.textLink} href="/account">Open your family account →</a></section>
    <PurchaseInvitation desk />
    <section className={styles.sectionNarrow}><span className={`${styles.badge} ${styles.pending}`}>Planner design preview</span><h2>Open a little room for your days.</h2><p>Try the open-book Planner with a fictional sample family: daily attendance and notes, an editable calendar, and printable records. This preview does not save real family records.</p><a className={styles.primary} href="/planner/preview">Open the Planner preview →</a></section>
    <section className={styles.sectionNarrow}><span className={`${styles.badge} ${styles.pending}`}>Desk features coming soon</span><h2>A place for what you choose.</h2><p>Before your first purchase, your desk will introduce the products that can help your family and show what they offer. Once you’re a customer, it will bring together your purchased resources and unlocked tools.</p><p>The Planner will be available separately. Blueprint, curriculum, and generator purchases also include entry to the Front Porch when the community opens; a Planner purchase alone does not.</p><p className={styles.muted}>Free TEACH family accounts are available. Purchase recognition and the working desk dashboard are still being prepared.</p><a className={styles.textLink} href="/library">Browse the free Library →</a></section>
  </PageFrame>;
}

