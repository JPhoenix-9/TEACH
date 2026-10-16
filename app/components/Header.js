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
