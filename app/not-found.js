import PageFrame from "./components/PageFrame";
import styles from "./components/page-frame.module.css";
export default function NotFound() {
  return <PageFrame eyebrow="PAGE NOT FOUND" title="Let’s find your way back." introduction="This page may have moved, or the address may have been mistyped."><section className={styles.sectionNarrow}><h2>There’s a place to begin.</h2><p>Take a look around TEACH, browse the free Library, or use the tour to find the help your family needs.</p><div className={styles.actions}><a className={styles.primary} href="/">Return home</a><a className={styles.textLink} href="/start">Take the Tour →</a><a className={styles.textLink} href="/library">Visit the Library →</a></div></section></PageFrame>;
}
