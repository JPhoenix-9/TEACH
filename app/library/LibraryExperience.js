'use client';

import {useEffect, useRef, useState} from 'react';
import s from './library.module.css';

export default function LibraryExperience({articles}) {
  const root = useRef(null);
  const dialog = useRef(null);
  const dialogBody = useRef(null);
  const dialogHeading = useRef(null);
  const [mode, setMode] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All articles');
  const isOpen = mode !== null;
  const selected = articles.find(article => article.slug === selectedSlug);
  const featured = articles.find(article => article.slug === 'i-dont-have-the-patience') || articles[0];
  const topics = ['All articles', ...new Set(articles.map(article => article.topic))];
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = articles.filter(article =>
    (topic === 'All articles' || article.topic === topic) &&
    (!normalizedQuery || [article.title, article.summary, article.topic, ...article.paragraphs].join(' ').toLocaleLowerCase().includes(normalizedQuery))
  );

  useEffect(() => {
    const header = document.querySelector('.site-header');
    const band = document.querySelector('.atmosphere-band');
    const measure = () => root.current?.style.setProperty('--library-header-height', `${Math.ceil((header?.getBoundingClientRect().height || 0) + (band?.getBoundingClientRect().height || 0))}px`);
    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    if (band) observer.observe(band);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen && !dialog.current.open) dialog.current.showModal();
    if (!isOpen && dialog.current.open) dialog.current.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  useEffect(() => {
    if (dialogBody.current) dialogBody.current.scrollTop = 0;
    dialogHeading.current?.focus({preventScroll:true});
  }, [mode, selectedSlug]);

  function read(article) {
    setSelectedSlug(article.slug);
    setMode('article');
  }

  function readLink(event, article) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    read(article);
  }

  function close() { setMode(null); }

  return <main className={s.library} ref={root}>
    <section className={s.room} aria-labelledby="library-title">
      <img className={s.roomImage} src="/library-room-v1.webp" alt="Inside the TEACH Library: sunlit wooden bookshelves, an arched window, a brass globe, a library ladder, and a comfortable chair beside an open book." fetchPriority="high"/>
      <div className={s.welcome}>
        <p className={s.eyebrow}>FREE TO READ · NO ACCOUNT NEEDED</p>
        <h1 id="library-title">The Library</h1>
        <p>Come in. Take your time.<br/>There’s a good place for you here.</p>
      </div>
      <nav className={s.roomControls} aria-label="Explore the Library room">
        <button type="button" className={`${s.roomPlaque} ${s.shelfSpot}`} onClick={() => setMode('shelves')} aria-haspopup="dialog">
          <span className={s.plaqueEyebrow}>A LITTLE GUIDANCE & ENCOURAGEMENT</span>
          <strong>Browse the shelves <span aria-hidden="true">→</span></strong>
          <span>Find something for the question in front of you.</span>
        </button>
        <button type="button" className={`${s.roomPlaque} ${s.tableSpot}`} onClick={() => read(featured)} aria-haspopup="dialog">
          <span className={s.plaqueEyebrow}>ON THE READING TABLE</span>
          <strong>Take a seat & read <span aria-hidden="true">→</span></strong>
          <span>{featured.title}</span>
        </button>
      </nav>
      <a className={s.catalogLink} href="#articles">See all articles <span aria-hidden="true">↓</span></a>
    </section>

    <section className={s.collection} id="articles" aria-labelledby="collection-title">
      <div className={s.collectionHeading}><div><p className={s.eyebrow}>FROM JANA’S ARCHIVES</p><h2 id="collection-title">Something worth sitting down with.</h2></div><p>Thoughtful guidance for learning and life at home. Choose an article to read here in the Library.</p></div>
      <div className={s.articleGrid}>{articles.map((article, index) => <a className={s.articleCard} href={`/library/${article.slug}`} onClick={event => readLink(event, article)} key={article.slug}>
        <span className={s.articleNumber} aria-hidden="true">0{index + 1}</span><p className={s.topic}>{article.topic}</p><h3>{article.title}</h3><p>{article.summary}</p><div className={s.cardBottom}><span>{article.minutes} min read · {article.author}</span><strong>Open article <span aria-hidden="true">→</span></strong></div>
      </a>)}</div>
      <div className={s.otherRooms}><p>Another way to spend a little time at TEACH.</p><a href="/webinars">Webinars & Videos <span aria-hidden="true">→</span></a><a href="/my-desk">My Desk <span aria-hidden="true">→</span></a></div>
    </section>

    <dialog className={`${s.dialog} ${mode === 'article' ? s.readingDialog : s.shelvesDialog}`} ref={dialog} aria-labelledby="library-dialog-title" onCancel={close} onClose={close}>
      <div className={s.dialogBar}><span>TEACH · THE LIBRARY</span><button className={s.closeButton} type="button" onClick={close} aria-label="Close and return to the Library">Close <span aria-hidden="true">×</span></button></div>
      <div className={s.dialogBody} ref={dialogBody}>
        {mode === 'shelves' && <section className={s.shelfContents}>
          <p className={s.eyebrow}>PULL UP A CHAIR</p><h2 id="library-dialog-title" ref={dialogHeading} tabIndex={-1}>Browse the shelves.</h2><p className={s.dialogIntro}>A little help for wherever you are in your homeschool.</p>
          <label className={s.searchLabel}>Find an article<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by title, topic or a word on your mind…"/></label>
          <div className={s.topics} aria-label="Filter articles by topic">{topics.map(item => <button key={item} type="button" aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}</div>
          <p className={s.resultCount} role="status">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}{normalizedQuery ? ` matching “${query.trim()}”` : ''}</p>
          <div className={s.shelfList}>{filtered.map(article => <a key={article.slug} href={`/library/${article.slug}`} onClick={event => readLink(event, article)}><div><span className={s.topic}>{article.topic}</span><h3>{article.title}</h3><p>{article.summary}</p><small>{article.author} · {article.minutes} min read</small></div><span className={s.openArrow} aria-hidden="true">↗</span></a>)}</div>
          {!filtered.length && <div className={s.empty}><h3>Nothing on this shelf matches yet.</h3><p>Try a different word or look through all the articles.</p><button type="button" onClick={() => {setQuery('');setTopic('All articles');}}>Show all articles</button></div>}
          <p className={s.archiveNote}>These articles retain their original text and publication dates from Homeschool-911.</p>
        </section>}
        {mode === 'article' && selected && <article className={s.readingPage}>
          <button className={s.backToShelves} type="button" onClick={() => setMode('shelves')}>← Back to the shelves</button>
          <header><p className={s.eyebrow}>{selected.topic}</p><h2 id="library-dialog-title" ref={dialogHeading} tabIndex={-1}>{selected.title}</h2><p className={s.byline}>By {selected.author} · {selected.minutes} min read<br/><span>Originally published {selected.date}</span></p></header>
          <div className={s.articleBody}>{selected.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          <footer className={s.readingFooter}><p>Originally published on Homeschool-911. Original text and publication date preserved.</p><div><button type="button" onClick={() => setMode('shelves')}>Choose another article →</button><a href={`/library/${selected.slug}`}>Open on its own page</a></div><small>© {new Date().getFullYear()} Higher Ground Publishing</small></footer>
        </article>}
      </div>
    </dialog>
  </main>;
}
