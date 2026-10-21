import SiteFooter from "../components/SiteFooter";
import Header from "../components/Header";
import styles from "./page.module.css";

export const metadata = {
  title: "About TEACH | Jana Sheridan",
  description: "Meet Jana Sheridan and discover TEACH: practical homeschooling guidance rooted in Christian faith, family relationships, and everyday learning.",
};

export default function About() {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>ABOUT TEACH</p>
          <h1>An extraordinary education.<br /><em>A life you build together.</em></h1>
          <p className={styles.lead}>Teaching Excellence and Christianity at Home</p>
          <p>TEACH helps parents build a homeschool that fits their family—with practical tools, thoughtful guidance, and relationships at the heart of learning.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.split}`}>
        <div><p className={styles.eyebrow}>WHY TEACH EXISTS</p><h2>There is so much<br />to learn at home.</h2></div>
        <div><p>Books, conversations, interests, work, and ordinary moments all offer opportunities to learn. Home gives parents room to know their children, respond to their needs, and connect learning with real life.</p><p>TEACH brings that approach together with practical help. Whether you are considering homeschooling, making an immediate transition, or finding your footing again, you can begin with the question in front of you.</p><p>Our Christian foundation shapes the way we value children, family relationships, and the responsibility of helping young people grow.</p></div>
      </section>

      <section className={styles.founder}>
        <div className={`${styles.section} ${styles.split}`}>
          <div><p className={styles.eyebrow}>MEET THE FOUNDER</p><h2>Jana Sheridan</h2><p className={styles.lead}>Homeschool mom.<br />Educator. Writer.</p></div>
          <div><p>Jana is a veteran homeschool mom and former private Christian school principal, with more than 25 years of teaching experience across every grade level.</p><p>She has led a homeschool support group of more than 100 families and written a newspaper column on parenting and children’s health. Her work brings together the perspective of a parent, the experience of an educator, and a writer’s desire to make ideas clear and useful.</p><p>Through TEACH, Jana helps parents understand their options, develop their teaching skills, and take practical steps toward a more confident homeschool.</p></div>
        </div>
      </section>

      <section className={styles.belief}>
        <blockquote>“Home is not where we recreate school.<br />Home is the educational environment.”</blockquote>
        <p>The relationships, rhythms, and possibilities of family life belong at the center of learning.</p>
      </section>

      <section className={styles.section}>
        <p className={styles.eyebrow}>A THOUGHTFUL WAY FORWARD</p><h2>Start where your family is.</h2>
        <div className={styles.principles}>
          <article><h3>Know your child.</h3><p>Make room for your child’s interests, stage of development, and individual needs as you shape learning together.</p></article>
          <article><h3>Learn how to teach.</h3><p>Build your confidence with clear methods and practical guidance you can put to work in everyday life.</p></article>
          <article><h3>Take the next step.</h3><p>You don’t need every answer before you begin. Find the help you need now, then build from there.</p></article>
        </div>
      </section>

      <section className={styles.next}>
        <div className={styles.section}><p className={styles.eyebrow}>MAKE YOURSELF AT HOME</p><h2>Find a place to begin.</h2>
          <div className={styles.links}>
            <a href="/webinars"><span>FREE GUIDANCE</span><h3>Webinars & Videos</h3><p>Explore homeschooling questions and practical encouragement with Jana.</p><strong>Explore the webinars →</strong></a>
            <a href="/blueprint"><span>GUIDANCE FOR PARENTS</span><h3>Homeschool Success Blueprint</h3><p>A six-module course to help you make the decisions ahead with confidence.</p><strong>Explore Blueprint →</strong></a>
            <a href="/curriculum/gap"><span>CURRICULUM FOR CHILDREN</span><h3>GAP Curriculum</h3><p>Begin in 20 minutes with 4–6 weeks of complete curriculum. Zero worksheets.</p><strong>Explore GAP →</strong></a>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
