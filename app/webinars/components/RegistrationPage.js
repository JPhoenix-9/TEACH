import WebinarForm from "./WebinarForm";
import SiteFooter from "../../components/SiteFooter";
import Header from "../../components/Header";
import styles from "./registration.module.css";

export default function RegistrationPage({ title, subtitle, description, introduction, image, imageAlt = "A mother and two children learning together at home", upcoming = false, slug }) {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      
      <div className={styles.breadcrumb}><a href="/webinars">← Webinars & Videos</a></div>
      <section className={styles.registration} aria-labelledby="webinar-title">
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>A FREE WEBINAR WITH JANA SHERIDAN</p>
          <h1 id="webinar-title">{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {image && <img className={styles.webinarImage} src={image} alt={imageAlt} />}
          <p className={styles.lead}>{description}</p>
          {introduction && <p>{introduction}</p>}
          <div className={styles.details}><p><strong>Practical guidance for parents.</strong><br />Learn with Jana, a veteran homeschool mom and former Christian school principal.</p><p><strong>Free with registration.</strong><br />Share your name and email address, and agree to receive TEACH emails to access this webinar.</p></div>
          <p className={styles.invitation}>A little guidance can make the next step feel possible.</p>
        </div>
        <aside className={styles.panel} aria-labelledby="registration-heading">
          <p className={styles.eyebrow}>{upcoming ? "COMING SOON" : "MAKE YOURSELF AT HOME"}</p>
          <h2 id="registration-heading">{upcoming ? "Be ready to begin." : "Register free to watch."}</h2>
          <p>{upcoming ? "This webinar has been filmed and is preparing for release. Registration will open here when it’s ready." : "Your next step toward a more confident homeschool starts here."}</p>
          <WebinarForm slug={slug} upcoming={upcoming}/>
        </aside>
      </section>
      <section className={styles.about}><p className={styles.eyebrow}>MEET YOUR PRESENTER</p><h2>Jana Sheridan</h2><p>Jana brings more than 25 years of teaching experience across every grade level. A veteran homeschool mom and former private Christian school principal, she has also led a homeschool support group of more than 100 families.</p></section>
    </main>
    <SiteFooter />
  </>;
}
