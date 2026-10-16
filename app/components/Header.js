export default function Header() {
  const navItems = [
    ["Home", "/"],
    ["Curriculum", "/curriculum"],
    ["Generators", "/generators"],
    ["Blueprint", "/blueprint"],
    ["Planner", "/planner"],
    ["Library", "/library"],
    ["Webinars", "/webinars"],
    ["Front Porch", "/front-porch"],
    ["About", "/about"],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="TEACH home">
          <span className="brand-mark" aria-hidden="true">❧</span>
          <span className="brand-copy">
            <span className="brand-name">TEACH</span>
            <span className="brand-tagline">TEACHING EXCELLENCE AND<br />CHRISTIANITY AT HOME</span>
          </span>
        </a>

        <div className="header-actions">
          <nav className="primary-nav" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a key={label} className={label === "Home" ? "active" : ""} href={href}>{label}</a>
            ))}
          </nav>

          <div className="account-nav">
            <button className="search-button" type="button" aria-label="Search">⌕</button>
            <a href="/my-desk">My Desk</a>
            <a className="create-account" href="/create-account">Create a Free Account</a>
            <a href="/login">Log In</a>
          </div>
        </div>
      </div>
    </header>
  );
}
