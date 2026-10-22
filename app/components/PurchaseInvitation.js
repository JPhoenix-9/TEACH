import styles from "./page-frame.module.css";

export default function PurchaseInvitation({ desk = false }) {
  return <section className={styles.soft}><div className={styles.section}>
    <p className={styles.eyebrow}>{desk ? "CHOOSE WHAT YOUR FAMILY NEEDS" : "BLUEPRINT · CURRICULUM · GENERATORS"}</p>
    <h2>{desk ? "Find the help your family needs." : "Become part of the TEACH family."}</h2>
    <p>{desk ? "Your purchases will bring the resources you choose to My Desk when account features open. Explore a course for you, curriculum for your children, or the standalone Planner." : "A Blueprint, curriculum, or generator purchase will include entry to the Front Porch when the community opens. Choose the resource that fits your family."}</p>
    <div className={desk ? styles.grid : styles.gridTwo}>
      <a className={`${styles.card} ${styles.cardLink}`} href="/blueprint"><img src="/products/homeschool-success-blueprint-approved.jpg" alt="Homeschool Success Blueprint course cover" /><p className={styles.eyebrow}>GUIDANCE FOR PARENTS</p><h3>Homeschool Success Blueprint</h3><p>A six-module course to help you work through teaching methods, curriculum choices, and the practical decisions ahead.</p><strong>Explore Blueprint →</strong></a>
      <a className={`${styles.card} ${styles.cardLink}`} href="/curriculum/gap"><img src="/products/gap-curriculum-thumbnail.jpg" alt="GAP curriculum product artwork for all four grade bands" /><p className={styles.eyebrow}>CURRICULUM FOR CHILDREN</p><h3>GAP Curriculum</h3><p>Download and begin in 20 minutes. Complete curriculum, teaching methods, and instructions for 4–6 weeks. Zero worksheets.</p><strong>Find your GAP grade band →</strong></a>
      {desk && <a className={`${styles.card} ${styles.cardLink}`} href="/planner"><img src="/Icons/planner.png" alt="Closed leather TEACH planner" /><p className={styles.eyebrow}>STANDALONE PRODUCT · COMING SOON</p><h3>Planner & Attendance</h3><p>Planning and attendance tools, available to purchase separately when ready. A Planner purchase alone does not include Front Porch access.</p><strong>Explore Planner →</strong></a>}
    </div>
    <p className={styles.muted}>Front Porch access requires a Blueprint, curriculum, or generator purchase. A Planner-only purchase does not qualify.</p>
    <p className={styles.muted}>Already purchased? TEACH accounts and purchase recognition are still being prepared. Keep using the access instructions supplied with your existing purchase for now.</p>
  </div></section>;
}
