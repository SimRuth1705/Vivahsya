import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Services.css";

gsap.registerPlugin(ScrollTrigger);

function Services() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // --- 1. Title Splitting Fix ---
    const titleText = titleRef.current;
    if (titleText && !titleText.dataset.split) {
      const content = titleText.innerText;
      const words = content.split(/\s+/); // Split by any whitespace
      titleText.innerHTML = "";
      
      words.forEach((word) => {
        const wrapper = document.createElement("span");
        wrapper.className = "title-word-wrapper";
        const inner = document.createElement("span");
        inner.className = "title-word";
        // &nbsp; ensures the space between words is preserved in the DOM
        inner.innerHTML = word + "&nbsp;"; 
        wrapper.appendChild(inner);
        titleText.appendChild(wrapper);
      });
      // Mark as split so it doesn't split again on re-renders
      titleText.dataset.split = "true";
    }

    // --- 2. Timeline with Fixed Repeat Logic ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        // Using 'onEnterBack' and 'onEnter' for fresh starts
        toggleActions: "play reverse play reverse",
      },
    });

    // Ensure the words start from below every single time
    tl.fromTo(
      ".title-word",
      { y: "110%" }, // Move slightly more for safety
      { 
        y: "0%", 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power4.out",
        immediateRender: false // Important for re-entry consistency
      }
    ).fromTo(
      ".editorial-card",
      { y: 60, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power3.out" 
      },
      "-=0.5"
    );

    return () => {
      if (ScrollTrigger.getById("services-trigger")) {
        ScrollTrigger.getById("services-trigger").kill();
      }
    };
  }, []);

  const services = [
    { title: "End to End Planning", desc: "Orchestrating every heartbeat of your day.", color: "#1a1a1a" },
    { title: "Wedding Decor", desc: "Sculpting environments that tell your story.", color: "#ff4d4d" },
    { title: "Destination Weddings", desc: "Seamless luxury across global borders.", color: "#ff8504" },
    { title: "Photography & Cinematography", desc: "Timeless frames for ephemeral moments.", color: "#2d3436" }
  ];

  return (
    <section className="services-section" ref={containerRef}>
      <h1 className="section-title" ref={titleRef}>
        WHY WE MATTER TO YOU.
      </h1>

      <div className="editorial-grid">
        {services.map((service, index) => (
          <div key={index} className="editorial-card">
            <div className="card-bg" style={{ backgroundColor: service.color }}></div>
            <div className="card-content">
              <span className="card-num">0{index + 1}</span>
              <div className="text-wrapper">
                <h3>{service.title}</h3>
                <p className="card-desc">{service.desc}</p>
              </div>
              <div className="card-line"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;