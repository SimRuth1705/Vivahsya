import Hero from "../components/Hero/Hero";
import OurAesthetic from "../components/OurAesthetic/OurAesthetic.jsx";
import CelebrationScroll from "../components/CelebrationScroll/CelebrationScroll";
import Services from "../components/Services/Services";
import Testimonials from "../components/Testimonials/Testimonials";
import Inquiry from "../components/Inquiry/Inquiry";
import ContactFooter from "../components/ContactFooter/ContactFooter";
import Faq from "../components/Faq/Faq.jsx";

// Home.jsx
function Home({ introReady }) {
  return (
    <>
      <Hero />
      {/* Pass the loading state down */}
      <OurAesthetic introReady={introReady} />
      <CelebrationScroll />
      <Services />
      <Testimonials />
      <Inquiry />
      <Faq introReady={introReady} /> 
      <ContactFooter />
    </>
  );
}

export default Home;
