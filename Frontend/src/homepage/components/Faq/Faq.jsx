import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Faq.css";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    question: "How far in advance should we book your services?",
    answer: "For wedding planning and design, we typically recommend booking 8-12 months in advance to ensure availability and ample time for meticulous planning."
  },
  {
    question: "Do you handle destination weddings?",
    answer: "Absolutely. We specialize in destination weddings across India and internationally, handling everything from guest logistics to venue sourcing."
  },
  {
    question: "Can we customize our wedding theme entirely?",
    answer: "Yes! Every wedding we craft is bespoke. We work closely with you to translate your personal story into a unique visual aesthetic."
  },
  {
    question: "What is your role on the actual wedding day?",
    answer: "Our team provides full on-site management, coordinating vendors, timelines, and logistics so you can focus entirely on celebrating."
  },
  // --- NEW RANDOM QUESTIONS ADDED ---
  {
    question: "Do you offer partial planning or just full-service?",
    answer: "While we specialize in full-service planning to ensure the highest quality, we do offer custom 'Day-of Coordination' packages for couples who have already secured their main vendors."
  },
  {
    question: "How do you handle unexpected weather changes for outdoor events?",
    answer: "We always create a 'Plan B' during the initial design phase. Whether it's high-quality marquees or a quick venue flip, we ensure the transition is seamless and aesthetic."
  },
  {
    question: "Do you work with specific vendors only?",
    answer: "We have a curated list of trusted partners, but we are always open to working with new vendors who meet our standards of excellence and reliability."
  },
  {
    question: "What is the typical investment for your services?",
    answer: "Because every wedding is unique, our fees vary based on the scale and complexity of the event. We provide a detailed proposal after our initial consultation."
  }
];


const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqRef = useRef(null); // Initialize as null

  useGSAP(() => {
    // 🛑 SAFETY: Ensure the DOM is ready
    if (!faqRef.current) return;

    const triggerElement = faqRef.current;

    // Reveal the title and label
    gsap.from(".faq-header", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: triggerElement, // 💡 Use the Ref, not the string class
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // Staggered reveal for each FAQ item
    gsap.from(".faq-item", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: triggerElement, // 💡 Use the Ref here too
        start: "top 85%",
      }
    });

    // Refresh triggers after setup
    ScrollTrigger.refresh();
  }, { scope: faqRef });

  const toggleFAQ = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="faq-section" ref={faqRef}>
      <div className="faq-header">
        <span className="faq-label">Common Questions</span>
        <h2 className="faq-title">EVERYTHING YOU <br />NEED TO KNOW</h2>
      </div>

      <div className="faq-container">
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              <div className="faq-icon">
                <div className="line line-v"></div>
                <div className="line line-h"></div>
              </div>
            </div>
            
            <div className="faq-answer">
              <div className="faq-answer-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;