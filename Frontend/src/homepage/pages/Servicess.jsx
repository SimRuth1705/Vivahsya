import "./Servicess.css";

const SERVICES_DATA = [
  {
    title: "End-to-End Wedding Planning",
    tag: "01",
    category: "Planning",
    supporting:
      "Complete planning support from first idea to final farewell.",
  },
  {
    title: "Wedding Decor",
    tag: "02",
    category: "Design",
    supporting: "Theme-led decor concepts executed with elegant detailing.",
  },
  {
    title: "Destination Weddings",
    tag: "03",
    category: "Travel",
    supporting: "Travel, local vendors, permits, and onsite flow managed end to end.",
  },
  {
    title: "Photography & Cinematography",
    tag: "04",
    category: "Memories",
    supporting: "Editorial photos and cinematic films that preserve every emotion.",
  },
  {
    title: "Budget & Financial Planning",
    tag: "05",
    category: "Strategy",
    supporting: "Practical budget plans focused on your real priorities.",
  },
  {
    title: "Venue Consultation",
    tag: "06",
    category: "Venues",
    supporting: "Venue shortlisting, negotiations, and final booking assistance.",
  },
  {
    title: "Bridal Makeup & Wardrobing",
    tag: "07",
    category: "Styling",
    supporting: "Bridal styling, makeup, and wardrobe curation tailored to you.",
  },
  {
    title: "Wedding Invitations",
    tag: "08",
    category: "Stationery",
    supporting: "Custom invite designs that reflect your wedding personality.",
  },
  {
    title: "Food & Beverages",
    tag: "09",
    category: "Culinary",
    supporting: "Curated menus and beverage plans for every guest profile.",
  },
  {
    title: "Return Gifts",
    tag: "10",
    category: "Gifting",
    supporting: "Personalized gifting options your guests will remember.",
  },
  {
    title: "Entertainment",
    tag: "11",
    category: "Experience",
    supporting: "Artist curation and event programming to keep energy high.",
  },
  {
    title: "On-the-Day Coordination",
    tag: "12",
    category: "Operations",
    supporting: "Live execution support for timelines, teams, and transitions.",
  },
  {
    title: "Hospitality",
    tag: "13",
    category: "Guest Care",
    supporting: "Guest transport, stay coordination, and helpdesk management.",
  },
];

export default function Servicess() {
  return (
    <main className="services-page">
      <section className="services-shell">
        <header className="services-header">
          <p className="services-kicker">Our Expertise</p>
          <h1>Wedding Services Crafted Around Your Story</h1>
          <p className="services-subtitle">
            Thoughtful planning, strong execution, and design that feels personal.
            Explore the services we tailor for every celebration.
          </p>
          <div className="services-meta" aria-label="Service Highlights">
            <span>13 Curated Services</span>
            <span>Single Team Ownership</span>
            <span>Pan-India + Destination</span>
          </div>
        </header>

        <section className="services-journey" aria-label="Wedding Services">
          {SERVICES_DATA.map((service) => (
            <article className="service-strip" key={service.title}>
              <div className="strip-content">
                <p className="strip-tagline">
                  <span className="card-tag">{service.tag}</span>
                  <span>{service.category}</span>
                </p>
                <h2>{service.title}</h2>
                <p>{service.supporting}</p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
