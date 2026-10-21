import Header from "../../components/Header";
import styles from "./page.module.css";

export const metadata = {
  title: "GAP Curriculum | TEACH",
  description: "Download GAP and be homeschooling in 20 minutes. Zero worksheets. Complete age-appropriate curriculum, teaching methods, and instructions for 4–6 weeks, with no other purchase needed.",
};

const packages = [
  { grades: "K–2", label: "Kindergarten through second grade", id: "k-2", image: "a869c008bf84480991c85f9fa18fd141", text: "An age-appropriate starting curriculum for your youngest learners, with teaching methods and complete instructions to guide you through each subject area." },
  { grades: "3–5", label: "Third through fifth grade", id: "3-5", image: "cffd2456ab344d298227d346207c1e20", text: "Subject-specific curriculum for the upper elementary years, with teaching guidance and full instructions prepared for this stage of learning." },
  { grades: "6–8", label: "Sixth through eighth grade", id: "6-8", image: "45df80b439d445ba83acd18c19c26da6", text: "A middle school starting plan with curriculum in each subject area, age-appropriate work, and the methods and instructions you need to teach it." },
  { grades: "9–12", label: "Ninth through twelfth grade", id: "9-12", image: "12ec34124c4f41ae9c3bc914ca76c241", text: "A high school starting curriculum, with subject-specific content, teaching methods, and complete instructions designed for the secondary years." },
];

export default function GAP() {
  return <>
    <div className="atmosphere-band" aria-hidden="true" />
    <Header />
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.eyebrow}>TEACH · COURSES & CURRICULUM · ZERO WORKSHEETS</p>
            <h1>Download GAP.<br /><em>Be homeschooling<br />in 20 minutes.</em></h1>
            <p className={styles.productName}>The GAP Curriculum</p>
            <p className={styles.lead}>Everything you need for 4–6 weeks.<br />No other purchase needed.</p>
            <p>Complete, age-appropriate curriculum for each subject area, with teaching methods and full instructions included. Choose your child’s grade band, download the package, and start homeschooling—while you take the time you need to choose your long-term curriculum.</p>
            <div className={styles.actions}><a className={styles.primary} href="#choose">Find your grade level ↓</a><a className={styles.textLink} href="#inside">See what’s included</a></div>
          </div>
          <div className={styles.heroArt}>
            <img src="/products/6f94c3e35ac1446ab67468d2b669274a.png" alt="GAP Get Away Plan curriculum product artwork showing all four grade bands" />
            <p>A complete starting curriculum.<br /><em>Ready when you need it.</em></p>
          </div>
        </div>
        <div className={styles.facts}><span>Start in 20 minutes</span><span>4–6 weeks of complete curriculum</span><span>Zero worksheets</span><span>No additional purchases</span></div>
      </section>

      <section className={`${styles.section} ${styles.opening}`}>
        <div><p className={styles.eyebrow}>A BRIDGE INTO HOMESCHOOLING</p><h2>You don’t need every answer<br />to take the first step.</h2></div>
        <div><p>Perhaps your child needs to leave a difficult school situation now. Perhaps you’ve already decided to homeschool, but haven’t chosen a long-term curriculum. You need to know both what to teach and how to teach it.</p><p>GAP supplies the curriculum, teaching methods, and complete instructions in one downloadable package. You can begin in 20 minutes, then use the next 4–6 weeks to settle into homeschooling and make thoughtful decisions about what comes next.</p></div>
      </section>

      <section className={styles.inside} id="inside">
        <div className={styles.section}>
          <p className={styles.eyebrow}>THE WHAT TO TEACH. THE HOW TO TEACH IT.</p><h2>A complete curriculum—not just a list of ideas.</h2>
          <p>GAP brings the content and the guidance together in a <strong>zero worksheet curriculum</strong>. You don’t have to buy another program or assemble a curriculum before you can begin.</p>
          <div className={styles.included}>
            <article><span aria-hidden="true">01</span><h3>Curriculum for each subject</h3><p>Subject-specific content gives you the actual curriculum for 4–6 weeks of homeschooling. It’s all included in the package.</p></article>
            <article><span aria-hidden="true">02</span><h3>Methods for teaching it</h3><p>Learn how to teach the material as well as what to cover, with teaching methods included alongside the curriculum.</p></article>
            <article><span aria-hidden="true">03</span><h3>Complete instructions</h3><p>Full instructions, reading lists, and checklists help you put the curriculum into practice without planning everything yourself.</p></article>
            <article><span aria-hidden="true">04</span><h3>The right age range</h3><p>Choose from four grade bands. The curriculum and creative learning ideas are prepared for your child’s stage, from kindergarten through high school.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.section} id="choose">
        <div className={styles.center}><p className={styles.eyebrow}>FOUR AGE-APPROPRIATE PACKAGES</p><h2>Choose your child’s grade band.</h2><p>Every package includes subject-specific curriculum, teaching methods, and complete instructions for 4–6 weeks. No other purchase is needed.</p></div>
        <div className={styles.packages}>{packages.map(item => <article key={item.id} id={`grades-${item.id}`}>
          <img className={styles.packagePhoto} src={`/products/${item.image}.png`} alt={`GAP Get Away Plan curriculum product cover for grades ${item.grades}`} />
          <h3><span>Grades</span>{item.grades}</h3><p className={styles.ageLabel}>{item.label}</p><p className={styles.packageDescription}>{item.text}</p><p className={styles.price}><strong>Christmas Sale</strong><br /><del>$129</del> <strong>$79</strong><br />Save $50</p><a className={styles.primary} href="https://www.homeschool-911.com/courses" target="_blank" rel="noopener noreferrer" aria-label={`Choose GAP grades ${item.grades} for $79`}>Choose this package · $79 ↗</a>
        </article>)}</div>
        <p className={styles.note}>Pricing and enrollment currently open on Homeschool-911. Select the matching grade band there.</p>
      </section>

      <section className={styles.testimonial}>
        <p className={styles.eyebrow}>FROM A FAMILY WHO STARTED WITH GAP</p>
        <blockquote>“We had no idea homeschooling could be so much fun, and so easy. We’ve had the best start we could have hoped for. Thanks for creating GAP!”</blockquote><p>— Annie and Grant Miller</p>
      </section>

      <section className={`${styles.section} ${styles.companion}`} id="blueprint">
        <img src="/products/homeschool-success-blueprint.jpg" width="1200" height="675" alt="The Homeschool Success Blueprint course product artwork" />
        <div><p className={styles.eyebrow}>A NATURAL COMPANION TO GAP</p><h2>Homeschool Success Blueprint</h2><p className={styles.companionLead}>A plan for your child. Guidance for you.</p><p>GAP gives your child a place to begin. The Homeschool Success Blueprint helps you learn about teaching methods, legal requirements, curriculum choices, and organizing life at home.</p><p>Use these first weeks to learn alongside your child and prepare for the longer journey.</p><a className={styles.textLink} href="/blueprint">Explore the Homeschool Success Blueprint →</a><p className={styles.note}>Blueprint is a separate course for parents.</p></div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.section}>
          <div className={styles.center}><p className={styles.eyebrow}>BEFORE YOU BEGIN</p><h2>A few practical questions.</h2></div>
          <div className={styles.faq}>
            <details><summary>Is GAP a full year of curriculum?</summary><p>No. GAP provides a 4–6 week bridge while you get organized and choose your long-term curriculum.</p></details>
            <details><summary>How quickly can we begin?</summary><p>You can download GAP and be homeschooling in 20 minutes. Choose your child’s grade band, download the package, and follow the complete instructions to begin.</p></details>
            <details><summary>Do I need to buy anything else?</summary><p>No. Everything you need for 4–6 weeks of homeschooling is in the package. There is no additional purchase required.</p></details>
            <details><summary>Does GAP explain how to teach the subjects?</summary><p>Yes. GAP includes teaching methods and complete instructions along with age-appropriate curriculum specific to each subject area.</p></details>
            <details><summary>Does GAP use worksheets?</summary><p>No. GAP is a zero worksheet curriculum across all four grade bands. The package supplies the curriculum, teaching methods, and complete instructions for learning without worksheets.</p></details>
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
