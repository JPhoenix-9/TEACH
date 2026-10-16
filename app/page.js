import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <div className="atmosphere-band" aria-hidden="true" />
      <Header />
      <main>
        <section className="home-hero">
          <div className="hero-art" aria-hidden="true" />
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-copy">
            <h1>Extraordinary<br />education happens<br />at <strong>HOME.</strong></h1>
            <p>Practical tools. Trusted guidance.<br />A more confident journey.</p>
            <div className="hero-actions">
              <a className="hero-primary" href="#explore">Explore TEACH</a>
              <a className="hero-secondary" href="/create-account">Create a Free Account</a>
            </div>
            <div className="hero-flourish" aria-hidden="true"><span /><b>❧</b><span /></div>
          </div>
        </section>
        <div id="explore" />
      </main>
    </>
  );
}
