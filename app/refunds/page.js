import PageFrame from '../components/PageFrame';
import s from '../components/page-frame.module.css';
export const metadata={title:'7-day money-back guarantee | TEACH',description:'GAP curriculum and Homeschool Success Blueprint purchases include a 7-day money-back guarantee.'};
export default function Refunds(){return <PageFrame eyebrow="BUY WITH CONFIDENCE" title="Give it a try." introduction="GAP and Blueprint come with a 7-day money-back guarantee.">
 <section className={s.sectionNarrow}>
  <h2>Seven days to decide.</h2>
  <p>If your purchase isn’t right for your family, request a full refund within 7 days of purchase. The guarantee covers each GAP grade-band package, each individual Homeschool Success Blueprint module, and the complete Blueprint course purchased through TEACH.</p>
  <p>You may download the GAP curriculum or begin watching Blueprint during those seven days. Downloading a file or starting the course does not disqualify you from the guarantee.</p>
  <h2>How to request a refund</h2>
  <p>Sign in to the family account used for your purchase and leave a private message through <a href="/contact">Contact &amp; Help</a>. Tell us which product you purchased and the purchase date. Include your order or receipt reference if you have it handy.</p>
  <p>Your request needs to reach us within 7 days of purchase. You do not need to give a reason to qualify, although feedback is welcome. Your bank or payment provider may need additional time to display an approved refund.</p>
  <h2>The terms you bought under stay with your purchase.</h2>
  <p>If we change this policy later, the terms offered when you purchased continue to apply to that order. Existing Homeschool-911 purchases remain subject to the terms offered when they were purchased.</p>
  <p>This guarantee does not limit any consumer rights that cannot be excluded by law.</p>
  <div className={s.actions}><a className={s.primary} href="/curriculum/gap">Explore GAP →</a><a className={s.textLink} href="/blueprint">Explore Blueprint →</a></div>
 </section>
 </PageFrame>;}
