import PageFrame from "../components/PageFrame";
import styles from "../components/page-frame.module.css";

export const metadata = { title: "Take the Tour | TEACH", description: "Find your next step at TEACH: free homeschool guidance, courses for parents, and complete GAP curriculum for children." };
const paths = [
  { title: "I’m exploring homeschooling.", tag: "START WITH FREE GUIDANCE", text: "Browse Jana’s articles or explore a webinar before deciding what your family needs.", href: "/webinars", action: "Explore the webinars →", image: "/Icons/webinars.png" },
  { title: "I need curriculum now.", tag: "A STARTING PLACE FOR YOUR CHILD", text: "GAP includes 4–6 weeks of age-appropriate curriculum, teaching methods, and complete instructions. Start in 20 minutes, with zero worksheets and no additional purchase needed.", href: "/curriculum/gap", action: "Find your GAP grade band →", image: "/Icons/courses-curriculum.png" },
  { title: "I want to learn how to homeschool.", tag: "GUIDANCE FOR PARENTS", text: "The six-module Homeschool Success Blueprint helps you work through teaching methods, curriculum choices, organization, and the decisions ahead.", href: "/blueprint", action: "Explore Blueprint →", image: "/products/homeschool-success-blueprint-approved.jpg" },
  { title: "I could use something to read.", tag: "FREE TO EXPLORE", text: "Visit the Library for articles about beginning homeschooling, confidence, and family relationships. No account is needed to read.", href: "/library", action: "Open the Library →", image: "/Icons/library.png" },
];
export default function Tour() {
  return <PageFrame eyebrow="TAKE THE TOUR" title={<>Start with the question<br />in front of you.</>} introduction="You don’t need to understand everything TEACH offers before you begin. Choose the help that fits your family today.">
    <section className={styles.section} aria-label="Choose your next step"><div className={styles.gridTwo}>{paths.map(item => <a className={`${styles.card} ${styles.cardLink}`} href={item.href} key={item.href}><img src={item.image} alt="" aria-hidden="true" /><p className={styles.eyebrow}>{item.tag}</p><h2>{item.title}</h2><p>{item.text}</p><strong>{item.action}</strong></a>)}</div></section>
    <section className={styles.soft}><div className={`${styles.sectionNarrow} ${styles.faq}`}><p className={styles.eyebrow}>A FEW HELPFUL DISTINCTIONS</p><h2>Find the right fit.</h2>
      <details><summary>Is Blueprint the same as GAP?</summary><p>Blueprint is a course for parents. GAP is curriculum for children, with four grade bands: K–2, 3–5, 6–8, and 9–12. They are separate purchases and can be used together.</p></details>
      <details><summary>What can I explore free?</summary><p>The Library is free to read without an account. Our webinars are free with registration; the available webinar currently uses our original registration page.</p></details>
      <details><summary>What is still being prepared?</summary><p>Generators are Coming Soon. Free accounts, family profiles, My Desk and the purchaser-only Front Porch are available. The family Planner is built, while new-site checkout and some course and webinar files are still being prepared. Each resource page explains its current availability.</p></details>
      <details><summary>Who can use My Desk and the Front Porch?</summary><p>A free account can have a desk with product suggestions. Recognized purchases give you access to the resources you choose at My Desk. Earlier purchases may need to be matched to your account. The Front Porch requires a Blueprint, curriculum, or generator purchase. The Planner is sold separately, and buying it alone does not include community access.</p></details>
    </div></section>
  </PageFrame>;
}
