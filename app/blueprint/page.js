import Header from "../components/Header";
import styles from "./page.module.css";

export const metadata = {
  title: "Homeschool Success Blueprint | TEACH",
  description: "A six-module, self-paced course helping parents homeschool with confidence, choose curriculum, teach effectively, and build a home life that supports learning.",
};

const topics = [
  ["A confident beginning", "Develop a mindset that supports your family as you begin—or find your footing again."],
  ["Understanding the requirements", "Learn about legal requirements and preparing to respond to legal challenges."],
  ["Teaching that makes sense", "Discover simple, effective teaching methods you can use across subjects."],
  ["Choosing curriculum wisely", "Make thoughtful decisions about long-term curriculum and avoid costly mistakes."],
  ["A home life that supports learning", "Get organized and find the support you need to keep going."],
  ["Relationships at the heart", "Make room for learning, shared time, and stronger relationships with your children."],
];

export default function Blueprint() {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.eyebrow}>TEACH · GUIDANCE FOR PARENTS</p>
            <h1>The Homeschool<br />Success <em>Blueprint</em></h1>
            <p className={styles.lead}>Homeschool with confidence.<br />Build a life of learning together.</p>
            <p>You want to give your children an excellent education. This six-module course helps you work through the practical decisions—and find a way forward that fits your family.</p>
            <div className={styles.actions}><a className={styles.primary} href="#enroll">Explore the course</a><a className={styles.textLink} href="#video">Watch the introduction ↓</a></div>
          </div>
          <img className={styles.art} src="/products/homeschool-success-blueprint-approved.jpg" width="1200" height="800" alt="Homeschool Success Blueprint by Jana Sheridan, with a blue and gold learning journey illustration" />
        </div>
        <div className={styles.facts}><span>6 modules</span><span>Learn at your own pace</span><span>Practical guidance for parents</span></div>
      </section>

      <section className={styles.section} id="video">
        <div className={styles.center}><p className={styles.eyebrow}>START WITH A LITTLE CLARITY</p><h2>You don’t have to figure it all out alone.</h2><p>Meet the Homeschool Success Blueprint and see how it can help you take your next step.</p></div>
        <div className={styles.videoBridge}>
          <span className={styles.play} aria-hidden="true">▶</span>
          <h3>Watch the Blueprint introduction</h3>
          <p>The existing sales presentation is available on our original website.</p>
          <a className={styles.primary} href="https://www.homeschool-911.com/hsb" target="_blank" rel="noopener noreferrer">Open the original presentation ↗</a>
        </div>
      </section>

      <section className={styles.topics}>
        <div className={styles.section}>
          <p className={styles.eyebrow}>PRACTICAL HELP, STEP BY STEP</p><h2>A foundation you can build on.</h2>
          <p className={styles.intro}>Across six modules, the Blueprint addresses the questions that shape everyday homeschooling. These are the areas you’ll explore.</p>
          <div className={styles.grid}>{topics.map(([title, text], i) => <article key={title}><span className={styles.number} aria-hidden="true">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.split}`}>
        <div><p className={styles.eyebrow}>MAKE IT WORK IN REAL LIFE</p><h2>Room to learn.<br />Room to be a family.</h2></div>
        <div><p>Work through the online video course at your own pace. Use what you learn to make decisions about curriculum, teaching, organization, and the support your family needs.</p><p>If you’re making an immediate transition out of school, GAP Curriculum can give your children a starting place while you work through the Blueprint.</p><p>For families who want individual help, personalized coaching is also available separately.</p></div>
      </section>

      <section className={styles.testimonial}>
        <p className={styles.eyebrow}>FROM A BLUEPRINT PARENT</p>
        <blockquote>“Anybody who is thinking about homeschooling should absolutely get the Homeschool Success Blueprint. It has saved me so much time and eliminated so much stress. Thank you for creating this!”</blockquote>
        <p>— Lisa R.</p>
      </section>

      <section className={styles.section}>
        <div className={styles.center}><p className={styles.eyebrow}>A FEW THINGS YOU MAY BE WONDERING</p><h2>Before you begin</h2></div>
        <div className={styles.faq}>
          <details><summary>Is this a curriculum for my children?</summary><p>The Blueprint is a course for parents. It helps you make decisions about homeschooling and develop the skills to teach your children. GAP is a separate curriculum for children.</p></details>
          <details><summary>Do I need to follow a class schedule?</summary><p>No. This is a self-paced online video course with six modules.</p></details>
          <details><summary>What will I learn?</summary><p>The course covers mindset, legal requirements, teaching methods, curriculum choices, organization, and finding support.</p></details>
          <details><summary>Can I get personal help?</summary><p>Personalized coaching is available separately if you would like help applying what you learn to your own situation.</p></details>
        </div>
      </section>

      <section className={styles.enroll} id="enroll">
        <p className={styles.eyebrow}>YOUR NEXT STEP</p><h2>Give your homeschool<br />a thoughtful beginning.</h2><p>Six modules. Your own pace. Guidance for the decisions ahead.</p>
        <p><strong>Christmas Special</strong><br /><del>$279</del> <strong>$199</strong><br />Save $80 this Christmas.</p>
        <a className={styles.primary} href="https://www.homeschool-911.com/courses" target="_blank" rel="noopener noreferrer">Enroll for $199 ↗</a>
        <p className={styles.small}>Enrollment currently opens on our Homeschool-911 website.</p>
      </section>
      <footer className={styles.footer}><a href="/">TEACH · Teaching Excellence and Christianity at Home</a><a href="/">Return to TEACH →</a></footer>
    </main>
  </>;
}
