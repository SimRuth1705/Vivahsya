import React, { useEffect, useRef } from "react";
import "./CelebrationScroll.css";

const CelebrationScroll = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const isDesktop = () => window.innerWidth >= 1024;

    const handleScroll = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;
      if (!isDesktop()) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;
      const triggerPoint = window.innerHeight * 0.5;
      if (totalScroll <= 0) return;

      if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
        const rawProgress = (triggerPoint - rect.top) / totalScroll;
        const progress = Math.min(Math.max(rawProgress, 0), 1);

        const maxTranslate = Math.max(track.scrollWidth - window.innerWidth, 0);

        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
      }
    };

    const handleLayout = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      if (isDesktop()) {
        container.style.height = `${track.scrollWidth}px`;
        handleScroll();
      } else {
        container.style.height = "auto";
        track.style.transform = "translateX(0)";
      }
    };

    handleLayout();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleLayout);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleLayout);
    };
  }, []);

  return (
    <section className="celebration-section">
      <div className="horizontal-section" ref={containerRef}>
        <div className="horizontal-sticky">
          <div className="celebration-track" ref={trackRef}>
            <div className="horizontal-buffer"></div>
            <div className="image-container">
              <div className="group1">
                <div className="group-intro1">
                  <h2 className="title-1">SAHIL &  <br />NEHA</h2>
                </div>
              <div className="group-left">
                <div className="portrait-1 img"></div>
                <div className="text-g1">
                  <h3 className="heading t1">Rooted in tradition, designed with intention, and crafted to celebrate love in its purest form. </h3>
                </div>
              </div>
              <div className="group-middle">
                  <div className="landscape-2 img"></div>
                  <div className="portrait-2 img"></div>
              </div>
              <div className="group-right">
                <div className="landscape-1 img"></div>
                
                
              </div>
            </div>
            <div className="group2">
              <div className="group-intro2">
                  <h1 className="title-1">Satish &  <br />Keerthi</h1>
                </div>
              <div className="group-left">
                <div className="square-1 img"></div>
                
              </div>
              <div className="group-right">
                <div className="square-3 img"></div>
                <div className="square-2 img"></div>
                
                <div className="text-g2">
                  <h3 className="heading">Vibrant moments filled with color, laughter, and unforgettable emotion.</h3>
                </div>
              </div>
            </div>
            <div className="group3">
              <div className="group-intro3">
                  <h1 className="title-1">Siddu &  <br />Sahana</h1>
                </div>
              <div className="group-left">
                <div className="big-portrait img"></div>
                <div className="text-g3">
                  <h3 className="heading">Refined celebrations where elegance, ambiance, and intimacy come together beautifully.</h3>
                </div>
              </div>
              <div className="group-right">
                <div className="small-square img"></div>
                <div className="medium-square img"></div>
                
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebrationScroll;
