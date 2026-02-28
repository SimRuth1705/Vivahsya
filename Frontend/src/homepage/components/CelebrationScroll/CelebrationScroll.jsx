import React, { useEffect, useRef } from "react";
import "./CelebrationScroll.css";

const CelebrationScroll = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1023) return;

      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;
      const triggerPoint = window.innerHeight * 0.5;

      if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
        const progress =
          (triggerPoint - rect.top) / totalScroll;

        const maxTranslate =
          track.scrollWidth - window.innerWidth;

        track.style.transform =
          `translateX(-${progress * maxTranslate}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1023) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    container.style.height = `${track.scrollWidth}px`;

    const resize = () => {
      container.style.height = `${track.scrollWidth}px`;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
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