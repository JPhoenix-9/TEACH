import PageFrame from "../components/PageFrame";
import PurchaseInvitation from "../components/PurchaseInvitation";
import styles from "../components/page-frame.module.css";
export const metadata = {"title":"My Desk | TEACH","description":"Your personal place for the resources and work that belong to you."};
export default function Page() {
  return <PageFrame eyebrow="MY DESK · PREPARING TO OPEN" title="My Desk" image="/Icons/my-desk.png" introduction="Explore the resources that can make this desk your own.">
    <PurchaseInvitation desk />
    <section className={styles.sectionNarrow}><span className={`${styles.badge} ${styles.pending}`}>Desk features coming soon</span><h2>A place for what you choose.</h2><p>Before your first purchase, your desk will introduce the products that can help your family and show what they offer. Once you’re a customer, it will bring together your purchased resources and unlocked tools.</p><p>The Planner will be available separately. Blueprint, curriculum, and generator purchases also include entry to the Front Porch when the community opens; a Planner purchase alone does not.</p><p className={styles.muted}>Free TEACH accounts and purchase recognition are still being prepared. This page currently offers a way to explore our products.</p><a className={styles.textLink} href="/library">Browse the free Library →</a></section>
  </PageFrame>;
}

