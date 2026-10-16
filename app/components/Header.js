function BotanicalMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 54 72" aria-hidden="true">
      <path className="botanical-stem" d="M37 66C29 57 26 47 28 36C30 25 36 16 45 8" />
      <path className="botanical-stem" d="M29 43C21 39 15 33 11 25" />
      <path className="botanical-stem" d="M31 31C38 28 43 23 47 17" />
      <path className="botanical-stem" d="M27 52C20 50 14 46 9 40" />
      <path className="botanical-leaf" d="M12 25C17 24 22 27 24 32C18 33 13 30 12 25Z" />
      <path className="botanical-leaf" d="M46 16C42 15 37 18 35 23C40 24 45 21 46 16Z" />
      <path className="botanical-leaf" d="M9 40C14 39 19 42 21 47C15 48 10 45 9 40Z" />
      <path className="botanical-leaf" d="M44 8C39 8 35 11 34 16C39 16 43 13 44 8Z" />
      <path className="botanical-leaf" d="M29 42C34 40 39 42 42 46C37 49 32 47 29 42Z" />
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
    ["Front Porch", "/front-porch"],
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
