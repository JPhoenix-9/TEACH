import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <div className="atmosphere-band" aria-hidden="true" />
      <Header />
      <main className="homepage-start">
        <h1>Extraordinary education happens at <strong>HOME.</strong></h1>
        <p>Practical tools. Trusted guidance. A more confident journey.</p>
      </main>
    </>
  );
}
