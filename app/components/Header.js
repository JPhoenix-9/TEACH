const approvedBotanicalMark = "data:image/png;base64,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";

function BotanicalMark() {
  return <img className="brand-mark" src={approvedBotanicalMark} alt="" aria-hidden="true" />;
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
