import Header from "./components/Header";
import SiteFooter from "./components/SiteFooter";

const destinations = [
  { image: "/Icons/courses-curriculum.png", title: "Courses & Curriculum", text: "Thoughtful resources for learning at home.", href: "/curriculum", status: "Paid curriculum" },
  { image: "/Icons/generators.png", title: "Generators", text: "Tools that help turn ideas, learning, and experience into something useful.", href: "/generators", status: "Coming soon", upcoming: true },
  { image: "/Icons/blueprint.png", title: "Homeschool Success Blueprint", text: "A practical path for building a homeschool that fits your family.", href: "/blueprint", status: "Paid course" },
  { image: "/Icons/planner.png", title: "Planner & Attendance", text: "Keep the essentials organized without turning home into school administration.", href: "/planner", status: "Coming soon", upcoming: true },
  { image: "/Icons/library.png", title: "TEACH Library", text: "Free articles, guidance, ideas, and resources to return to whenever you need them.", href: "/library", status: "Free to read" },
  { image: "/Icons/webinars.png", title: "Webinars & Videos", text: "Watch practical teaching and homeschool guidance on your own time.", href: "/webinars", status: "Free with registration" },
  { image: "/Icons/front-porch.png", title: "The Front Porch", text: "Community included with Blueprint, curriculum, or generator purchases.", href: "/front-porch", status: "Coming soon", upcoming: true },
  { image: "/Icons/my-desk.png", title: "My Desk", text: "Your purchased resources and tools, together in one personal TEACH space.", href: "/my-desk", status: "Coming soon", upcoming: true },
];

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
          </div>
        </section>

        <section className="explore-section" id="explore">
          <div className="section-heading">
            <span>MAKE YOURSELF AT HOME</span>
            <h2>Explore TEACH</h2>
            <p>Start wherever your family needs help today. You never have to follow a prescribed path.</p>
          </div>
          <div className="destination-grid">
            {destinations.map((item) => (
              <a className="destination-card" href={item.href} key={item.title}>
                <img className="destination-image" src={item.image} alt="" aria-hidden="true" />
                <div className="destination-card-copy">
                  <span className={`destination-status${item.upcoming ? " destination-status-pending" : ""}`}>{item.status}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="destination-link">Explore →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="home-guidance">
          <div className="guidance-card start-card">
            <span className="eyebrow">NOT SURE WHERE TO START?</span>
            <h2>Tell us what you need.</h2>
            <p>You do not have to understand everything TEACH offers before you begin. Start with the problem in front of you and find the tools and guidance that fit.</p>
            <a href="/start">Take the Tour →</a>
          </div>
          <div className="guidance-card free-card">
            <span className="eyebrow">FREE TO EXPLORE</span>
            <h2>Come in before you buy anything.</h2>
            <p>Browse the free Library, explore the webinars, and get to know TEACH. Free family accounts are available; you can read the Library without one.</p>
            <a href="/library">Visit the free Library →</a>
          </div>
        </section>

        <section className="home-belief">
          <p className="belief-quote">“Home is not where we recreate school. Home is the educational environment.”</p>
          <p className="belief-copy">TEACH exists to help parents use the relationships, rhythms, interests, work, books, conversations, and ordinary life already around them to give their children an extraordinary education.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
