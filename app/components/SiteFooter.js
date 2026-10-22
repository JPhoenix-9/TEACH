import styles from "./page-frame.module.css";

export default function SiteFooter() {
  return <footer className={styles.footer}>
    <div><a href="/" className={styles.footerBrand}>TEACH</a><p>Teaching Excellence and Christianity at Home</p><small>© {new Date().getFullYear()} Higher Ground Publishing</small></div>
    <nav aria-label="Footer navigation"><a href="/start">Take the Tour</a><a href="/library">Free Library</a><a href="/about">About TEACH</a><a href="/contact">Contact & Help</a><a href="/privacy">Privacy</a><a href="/terms">Using TEACH</a></nav>
  </footer>;
}
