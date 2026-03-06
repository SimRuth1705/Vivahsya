import "./Hero.css";

function Hero() {
  const handlePlanClick = () => {
    const inquirySection = document.getElementById("inquiry-section");
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="heading">
          <h1>We manage the details. <span className="h1-c">You live the moment.</span></h1>
        </div>
        <div className="support-para">
          <p>We handle every element with precision so your wedding feels effortless and unforgettable.</p>
          <button className="inquiry-btn" onClick={handlePlanClick}>Plan With Experts</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
