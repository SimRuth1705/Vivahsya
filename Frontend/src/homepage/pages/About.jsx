import "./About.css";

function About() {
  return (
    <div className="about-page">
      <header className="about-header">About Vivahasya</header>

      <section className="about-section">
        <div className="about-card">
          <h2>Who We Are</h2>
          <p>
            Vivahasya is a premier wedding planning company based in Bangalore,
            established in 2025 with the vision of redefining wedding
            experiences through creativity, elegance, and meticulous planning.
            We provide end-to-end planning so every celebration is thoughtfully
            curated and flawlessly executed.
          </p>
        </div>

        <div className="about-grid">
          <article className="about-card">
            <h3>Full-Service Expertise</h3>
            <p>
              We bring wedding planning, decor design, photography, styling,
              and more under one roof to ensure consistent quality, seamless
              communication, and personalized attention.
            </p>
          </article>

          <article className="about-card">
            <h3>Weddings We Design</h3>
            <p>
              From intimate ceremonies and traditional celebrations to grand
              luxury and destination weddings, each event is tailored to match
              your personality, traditions, and love story.
            </p>
          </article>

          <article className="about-card">
            <h3>Where We Work</h3>
            <p>
              We serve clients across South India in beautiful settings
              including beachside venues, heritage spaces, royal palaces, and
              culturally rich traditional locations.
            </p>
          </article>
        </div>

        <div className="about-card about-highlight">
          <h2>Our Promise</h2>
          <p>
            At Vivahasya, a wedding is more than an event. It is a once in a
            lifetime experience filled with emotion, tradition, and memories.
            With creativity, precision, and detail, we transform dreams into
            timeless celebrations that leave a lasting impression.
          </p>
        </div>
      </section>

      <footer className="about-footer">
        2026 Vivahasya Celebrations | Crafting Elegant Weddings with Heart
      </footer>
    </div>
  );
}

export default About;
