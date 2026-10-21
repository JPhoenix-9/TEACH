import Header from "./Header";
import SiteFooter from "./SiteFooter";
import styles from "./page-frame.module.css";

export default function PageFrame({ eyebrow, title, introduction, image, imageAlt = "", children }) {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      <section className={styles.hero}><div className={`${styles.heroInner} ${image ? styles.withArt : ""}`}>
        <div><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{introduction}</p></div>
        {image && <img className={styles.heroArt} src={image} alt={imageAlt} />}
      </div></section>
      {children}
    </main>
    <SiteFooter />
  </>;
}
