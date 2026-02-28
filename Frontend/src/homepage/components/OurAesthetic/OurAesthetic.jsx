import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./OurAesthetic.css";

gsap.registerPlugin(ScrollTrigger);

function OurAesthetic() {
  const sectionRef = useRef(null);

  
  useGSAP(() => {
    // 🛑 SAFETY CHECK: Ensure the ref is actually attached to the DOM
    if (!sectionRef.current) return;

    const triggerElement = sectionRef.current;

    // 🔹 Reveal: Big Image
    gsap.from(".story-big-img", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: triggerElement, // Use the ref variable here!
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // 🔹 Reveal: Small Cards Grid
    // Since this is nested deeper, we can still use a string if it's within the scope,
    // but using a class name that is unique to this component is best.
    gsap.from(".story-card", {
      y: 80,
      opacity: 0,
      stagger: 0.3,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".stories-small-grid", 
        start: "top 85%",
      }
    });

    // 🔹 Parallax: Big Image
    gsap.to(".story-big-img", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: triggerElement, // Use the ref variable here!
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // 🔹 Parallax: Small Images
    gsap.to(".story-img", {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: triggerElement, // Use the ref variable here!
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Refresh ScrollTrigger to ensure positions are correct
    ScrollTrigger.refresh();

  }, { scope: sectionRef });

  return (
    <section className="stories-section" ref={sectionRef}>
      <div className="stories-container">
        <div className="stories-left">
          <span className="stories-label">Stories We Crafted</span>
          <h2 className="stories-heading">
            A GALLERY OF JOY AND<br /> ELEGANCE
          </h2>
          <p className="stories-desc">
            Experience the glimpse into the beautiful stories we had the
            privilege of crafting. Each event is a testament to our
            dedication to blending elegance with heartfelt emotion.
          </p>

          <div className="stories-small-grid">
            <div className="story-card">
              <div className="story-img img-1"></div>
              <h4 className="card-title">Sahana & Siddu</h4>
              <span className="card-location">Goa</span>
            </div>

            <div className="story-card">
              <div className="story-img img-2"></div>
              <h4 className="card-title">Satish & Keerthi</h4>
              <span className="card-location">Delhi</span>
            </div>
          </div>
        </div>

        <div className="stories-right">
          <div className="story-big-img"></div>
        </div>
      </div>
    </section>
  );
}

export default OurAesthetic;