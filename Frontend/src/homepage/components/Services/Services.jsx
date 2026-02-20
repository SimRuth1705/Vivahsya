import React, { useEffect, useRef } from "react";
import "./Services.css";

const Services = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const servicesData = [
    { id: 1, title: "Decor", description: "Our team will design the decors with your expectation" },
    { id: 2, title: "Events", description: "The whole events will be managed from end to end by our team" },
    { id: 3, title: "Budgeting", description: "Just say the budget we will create a sample for your event as per your choice" },
    { id: 4, title: "End-to-End", description: "Our team will complete the event from start to finish" },
    { id: 5, title: "Planning", description: "Strategic and thoughtful planning" },
    { id: 6, title: "Execution", description: "Every detail handled with care" },
    { id: 7, title: "Coordination", description: "Perfect vendor coordination" },
    { id: 8, title: "Customization", description: "Tailored experiences for you" },
    { id: 9, title: "Logistics", description: "Smooth operational management" },
    { id: 10, title: "Support", description: "On-ground support till the last minute" },
  ];

  /* Scroll Horizontal Movement */
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1023) return;

      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const progress = Math.abs(rect.top) / totalScroll;
        const maxTranslate = track.scrollWidth - window.innerWidth;
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Dynamic Height Calculation */
  useEffect(() => {
    if (window.innerWidth < 1023) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const setHeight = () => {
      const scrollWidth = track.scrollWidth;
      container.style.height = `${scrollWidth}px`;
    };

    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <section className="services-container">
      <div className="horizontal-section" ref={containerRef}>
        <div className="horizontal-sticky">
          <h1 className="main-title">Our Services</h1>

          <div className="services-grid" ref={trackRef}>
            {servicesData.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image-wrapper">
                  <div className="service-image" />
                </div>

                <div className="service-text">
                  <h3 className="card-title">
                    <span className="quote-mark">“</span>
                    {service.title}
                  </h3>
                  <p className="card-desc">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="service-btn">
            <div className="btn-wrapper">
              <div className="css-swirl-arrow"></div>
              <button className="btn">Services</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
