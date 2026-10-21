import { notFound } from "next/navigation";
import PageFrame from "../../components/PageFrame";
import styles from "./page.module.css";
import common from "../../components/page-frame.module.css";
import articles from "../articles.json";

export const dynamicParams = false;
export function generateStaticParams() { return articles.map(article => ({ slug: article.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  return article ? { title: `${article.title} | TEACH Library`, description: article.summary, authors: [{ name: article.author }] } : {};
}
export default async function Article({ params }) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  return <PageFrame eyebrow="TEACH LIBRARY · HOMESCHOOL-911 ARCHIVE" title={article.title} introduction={`By ${article.author} · Originally published ${article.date} · ${article.minutes} min read`}>
    <article className={styles.article}><a className={common.textLink} href="/library">← Back to the Library</a><div className={styles.body}>{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><p className={common.muted}>Originally published on Homeschool-911. Archived here with the original text and publication date.</p><div className={styles.actions}><a href="/library" className={common.primary}>More from the Library</a><a href="/webinars" className={common.textLink}>Explore free webinars →</a></div></article>
  </PageFrame>;
}
