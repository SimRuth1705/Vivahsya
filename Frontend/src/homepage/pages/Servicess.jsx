    import "./Servicess.css";
import { useEffect, useRef } from "react";

const services = [
  {
    title: "End-to-End Wedding Planning",
    tag: "01",
    icon: "✦",
    image: "/images/c1.png",
    supporting:
      "From the first spark of an idea to the final farewell, we orchestrate every detail with grace and precision.",
  },
  {
    title: "Wedding Decor",
    tag: "02",
    icon: "❋",
    image: "/images/c2.png",
    supporting:
      "Your vision, elevated into a living, breathing space with immersive and layered design.",
  },
  {
    title: "Destination Weddings",
    tag: "03",
    icon: "◈",
    image: "/images/c1.png",
    supporting:
      "We handle permits, travel coordination, local vendors, and on-site management.",
  },
  {
    title: "Photography & Cinematography",
    tag: "04",
    icon: "◉",
    image: "/images/c3.png",
    supporting:
      "Editorial photography and cinematic film capturing timeless emotions.",
  },
  {
    title: "Budget & Financial Planning",
    tag: "05",
    image: "/images/c4.png",
    supporting:
      "Smart budgeting strategies tailored to your priorities.",
  },
  {
    title: "Venue Consultation",
    tag: "06",
    image: "/images/c6.png",
    supporting:
      "We scout, negotiate, and secure the perfect venue for your celebration.",
  },
  {
    title: "Bridal Makeup & Wardrobing",
    tag: "07",
    image: "/images/c5.png",
    supporting:
      "Internationally trained artists curate your bridal look.",
  },
  {
    title: "Wedding Invitations",
    tag: "08",
    image: "/images/c8.png",
    supporting:
      "Bespoke invitation suites that set the tone for your wedding.",
  },
  {
    title: "Food & Beverages",
    tag: "09",
    image: "/images/c3.png",
    supporting:
      "Curated culinary experiences reflecting your heritage and taste.",
  },
  {
    title: "Return Gifts",
    tag: "10",
    image: "/images/c3.png",
    supporting:
      "Personalized gifts that carry the warmth of your celebration.",
  },
  {
    title: "Entertainment",
    tag: "11",
    image: "/images/c3.png",
    supporting:
      "From live performances to DJs, we build unforgettable energy.",
  },
  {
    title: "On-the-Day Coordination",
    tag: "12",
    image: "/images/c3.png",
    supporting:
      "We manage vendors and timelines so you never worry.",
  },
  {
    title: "Hospitality",
    tag: "13",
    image: "/images/c3.png",
    supporting:
      "Airport pickups, accommodation, and guest experiences handled seamlessly.",
  },
];

function ServiceRow({ service, index }) {
  const rowRef = useRef(null);
  const isReversed = index % 2 !== 0;

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    el.style.setProperty("--row-delay", `${index * 0.08}s`);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
  className={`service-row animate-row${isReversed ? " row-reverse" : ""}`}
  ref={rowRef}
>
      <div className="row-image-box">
        <img
          src={service.image}
          alt={service.title}
          className="row-image"
        />
        <div className="row-image-overlay">
          <span className="row-tag">{service.tag}</span>
          <h3 className="row-image-title">{service.title}</h3>
          {service.icon && <span className="row-icon">{service.icon}</span>}
        </div>
      </div>

      <div className="row-content">
        <h3 className="row-heading">{service.title}</h3>
        <div className="row-divider" />
        <p className="row-supporting">{service.supporting}</p>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="services-section">
      <div className="block-wrap">
        <div className="block-header">
          <p className="section-label">What We Offer</p>
          <h1 className="section-title">Our Services</h1>
          <div className="section-divider" />
        </div>

        <div className="rows-list">
          {services.map((service, i) => (
            <ServiceRow service={service} index={i} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}