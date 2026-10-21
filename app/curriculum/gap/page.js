import Header from "../../components/Header";
import styles from "./page.module.css";

export const metadata = {
  title: "GAP Curriculum | TEACH",
  description: "A practical bridge into homeschooling. Four grade-band packages with plans, reading lists, checklists, and creative ideas for your first 4–6 weeks.",
};

const packages = [
  { grades: "K–2", label: "Kindergarten through second grade", id: "k-2" },
  { grades: "3–5", label: "Third through fifth grade", id: "3-5" },
  { grades: "6–8", label: "Sixth through eighth grade", id: "6-8" },
  { grades: "9–12", label: "Ninth through twelfth grade", id: "9-12" },
];

export default function GAP() {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.eyebrow}>TEACH · COURSES & CURRICULUM</p>
            <h1>A place to start.<br /><em>Room to find your way.</em></h1>
            <p className={styles.productName}>The GAP Curriculum</p>
            <p className={styles.lead}>Your first 4–6 weeks of homeschooling,<br />with a plan already in place.</p>
            <p>When it’s time to bring your child home, you need something you can begin with. GAP gives you written plans and practical ideas to start learning together while you choose what comes next.</p>
            <div className={styles.actions}><a className={styles.primary} href="#choose">Find your grade level ↓</a><a className={styles.textLink} href="#inside">See what’s included</a></div>
          </div>
          <div className={styles.heroArt}>
            <img src="/Icons/courses-curriculum.png" alt="Leather-bound subject books and a globe" />
            <p>Begin here.<br /><em>Build from here.</em></p>
          </div>
        </div>
        <div className={styles.facts}><span>4–6 weeks of curriculum</span><span>Four grade-band options</span><span>Download and begin</span></div>
      </section>

      <section className={`${styles.section} ${styles.opening}`}>
        <div><p className={styles.eyebrow}>A BRIDGE INTO HOMESCHOOLING</p><h2>You don’t need every answer<br />to take the first step.</h2></div>
        <div><p>Perhaps something needs to change at school. Perhaps you’ve made the decision to homeschool, but haven’t chosen a long-term curriculum. You still need a plan for the days in front of you.</p><p>GAP gives you a prepared starting point, so you can spend time with your child, settle into learning at home, and make your next decisions with more breathing room.</p></div>
      </section>

      <section className={styles.inside} id="inside">
        <div className={styles.section}>
          <p className={styles.eyebrow}>OPEN IT. FIND YOUR STARTING POINT.</p><h2>A practical plan at your fingertips.</h2>
          <div className={styles.included}>
            <article><span aria-hidden="true">01</span><h3>Written instructions</h3><p>Prepared guidance to help you get started and work through the first weeks.</p></article>
            <article><span aria-hidden="true">02</span><h3>Reading lists</h3><p>A starting place for choosing reading as part of your child’s learning.</p></article>
            <article><span aria-hidden="true">03</span><h3>Checklists</h3><p>Keep track of the plan without holding every detail in your head.</p></article>
            <article><span aria-hidden="true">04</span><h3>Creative ideas</h3><p>Explore things to do together beyond spending the day in front of a screen.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.section} id="choose">
        <div className={styles.center}><p className={styles.eyebrow}>FOUR PACKAGES. ONE CLEAR NEXT STEP.</p><h2>Choose your child’s grade band.</h2><p>Each GAP package is prepared for its grade range and provides a starting plan for 4–6 weeks.</p></div>
        <div className={styles.packages}>{packages.map(item => <article key={item.id} id={`grades-${item.id}`}>
          <p className={styles.eyebrow}>GAP CURRICULUM</p><h3><span>Grades</span>{item.grades}</h3><p>{item.label}</p><ul><li>4–6 week starting plan</li><li>Reading lists and checklists</li><li>Instructions and creative ideas</li></ul><a className={styles.primary} href="https://www.homeschool-911.com/courses" target="_blank" rel="noopener noreferrer" aria-label={`View pricing and options for GAP grades ${item.grades}`}>View options & pricing ↗</a>
        </article>)}</div>
        <p className={styles.note}>Pricing and enrollment currently open on Homeschool-911. Select the matching grade band there.</p>
      </section>

      <section className={styles.testimonial}>
        <p className={styles.eyebrow}>FROM A FAMILY WHO STARTED WITH GAP</p>
        <blockquote>“We had no idea homeschooling could be so much fun, and so easy. We’ve had the best start we could have hoped for. Thanks for creating GAP!”</blockquote><p>— Annie and Grant Miller</p>
      </section>

      <section className={`${styles.section} ${styles.companion}`}>
        <img src="/Icons/blueprint.png" alt="Homeschool Success Blueprint" />
        <div><p className={styles.eyebrow}>A NATURAL COMPANION</p><h2>A plan for your child.<br />Guidance for you.</h2><p>GAP gives your child a place to begin. The Homeschool Success Blueprint helps you learn about teaching methods, legal requirements, curriculum choices, and organizing life at home.</p><p>Use these first weeks to learn alongside your child and prepare for the longer journey.</p><a className={styles.textLink} href="/blueprint">Explore the Homeschool Success Blueprint →</a><p className={styles.note}>Blueprint is a separate course for parents.</p></div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.section}>
          <div className={styles.center}><p className={styles.eyebrow}>BEFORE YOU BEGIN</p><h2>A few practical questions.</h2></div>
          <div className={styles.faq}>
            <details><summary>Is GAP a full year of curriculum?</summary><p>No. GAP provides a 4–6 week bridge while you get organized and choose your long-term curriculum.</p></details>
            <details><summary>How do I get started?</summary><p>Choose the grade-band package for your child. GAP is downloadable so you can get started right away.</p></details>
            <details><summary>What grade levels are available?</summary><p>There are four packages: K–2, 3–5, 6–8, and 9–12.</p></details>
            <details><summary>Is GAP the same as Blueprint?</summary><p>No. GAP is curriculum for children. Blueprint is a six-module course that trains parents to homeschool. They are available separately and can be used together.</p></details>
          </div>
        </div>
      </section>
      <section className={styles.lastStep}><p className={styles.eyebrow}>START WITH THE DAYS IN FRONT OF YOU</p><h2>Take the first step together.</h2><p>A prepared plan for now. Time to choose what comes next.</p><a className={styles.primary} href="#choose">Choose your GAP curriculum ↑</a></section>
      <footer className={styles.footer}><a href="/">TEACH · Teaching Excellence and Christianity at Home</a><a href="/">Return to TEACH →</a></footer>
    </main>
  </>;
}
