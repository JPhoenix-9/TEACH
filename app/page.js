import Header from "./components/Header";

const destinations = [
  { image: "/Icons/courses-curriculum.png", title: "Courses & Curriculum", text: "Thoughtful resources for learning at home.", href: "/curriculum" },
  { image: "/Icons/generators.png", title: "Generators", text: "Tools that help turn ideas, learning, and experience into something useful.", href: "/generators" },
  { image: "/Icons/blueprint.png", title: "Homeschool Success Blueprint", text: "A practical path for building a homeschool that fits your family.", href: "/blueprint" },
  { image: "/Icons/planner.png", title: "Planner & Attendance", text: "Keep the essentials organized without turning home into school administration.", href: "/planner" },
  { image: "/Icons/library.png", title: "TEACH Library", text: "Free articles, guidance, ideas, and resources to return to whenever you need them.", href: "/library" },
  { image: "/Icons/webinars.png", title: "Webinars & Videos", text: "Watch practical teaching and homeschool guidance on your own time.", href: "/webinars" },
  { image: "/Icons/front-porch.png", title: "The Front Porch", text: "A welcoming place for conversation, encouragement, and community.", href: "/front-porch" },
  { image: "/Icons/my-desk.png", title: "My Desk", text: "Your personal TEACH home for the tools, resources, and work that belong to you.", href: "/my-desk" },
];

export default function Home() {
  return (
    <>
      <div className="atmosphere-band" aria-hidden="true" />
      <Header />
      <main>
        <section className="home-hero">
          <div className="hero-art" aria-hidden="true" />
          <img className="hero-children" src="/TEACH-hero-children.png" alt="" aria-hidden="true" />
          <div className="hero-desk-occlusion" aria-hidden="true" />
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
            <a href="/start">Help me find my way →</a>
          </div>
          <div className="guidance-card free-card">
            <span className="eyebrow">FREE TO EXPLORE</span>
            <h2>Come in before you buy anything.</h2>
            <p>Create a free account, browse the Library, discover free resources, and get to know TEACH. An account adds capability; it does not put the house behind a paywall.</p>
            <a href="/create-account">Create a free account →</a>
          </div>
        </section>

        <section className="home-belief">
          <p className="belief-quote">“Home is not where we recreate school. Home is the educational environment.”</p>
          <p className="belief-copy">TEACH exists to help parents use the relationships, rhythms, interests, work, books, conversations, and ordinary life already around them to give their children an extraordinary education.</p>
        </section>
      </main>
    </>
  );
}
