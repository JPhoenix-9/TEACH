function BotanicalMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 42 66" aria-hidden="true" focusable="false">
      <path className="botanical-stem" d="M15 61 C7 53, 9 44, 17 38 C25 32, 25 23, 20 17 C17 13, 18 8, 25 4" />
      <path className="botanical-leaf" d="M13 51 C5 49, 3 44, 4 40 C10 40, 15 43, 16 47 C16 49, 15 50, 13 51 Z" />
      <path className="botanical-leaf" d="M17 40 C24 38, 29 34, 29 29 C23 28, 18 31, 16 35 C15 37, 16 39, 17 40 Z" />
      <path className="botanical-leaf" d="M19 28 C12 26, 9 22, 10 18 C16 18, 21 20, 23 24 C23 26, 21 27, 19 28 Z" />
      <path className="botanical-leaf" d="M22 17 C28 15, 32 11, 31 7 C26 7, 22 9, 20 12 C19 14, 20 16, 22 17 Z" />
    </svg>
  );
}

export default function Header() {
  const navItems = [
    ["Home", "/"],
    ["Curriculum", "/curriculum"],
    ["Generators", "/generators"],
    ["Blueprint", "/blueprint"],
    ["Planner", "/planner"],
    ["Library", "/library"],
    ["Webinars", "/webinars"],
    ["About", "/about"],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="TEACH home">
          <BotanicalMark />
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
            <label className="header-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" placeholder="Search TEACH" aria-label="Search TEACH" />
            </label>
            <a className="my-desk-button" href="/my-desk">My Desk</a>
            <a className="front-porch-button" href="/front-porch">Front Porch</a>
            <a className="create-account" href="/create-account">Create a Free Account</a>
            <a className="login-button" href="/login">Log In</a>
          </div>
        </div>
      </div>
    </header>
  );
}
