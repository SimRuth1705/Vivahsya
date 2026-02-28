import "./Inquiry.css";
import video from "../../assets/baos.mp4"; // Adjust the path as needed

function Inquiry() {
  return (
    <section className="inquiry-wrapper">

      <div className="video-wrapper">
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      <div className="inquiry-section">
        <h2 className="title">Let’s Plan Your Celebration</h2>
        <div className="underline"></div>

        <div className="form-card">
          <h3>Get in touch</h3>

          <form>
            <input type="text" placeholder="Name" />
            <input type="tel" placeholder="Phone" />

            <select className="location-dropdown">
              <option value="">Select Location</option>
              <option value="bangalore">Bangalore</option>
              <option value="mysore">Mysore</option>
              <option value="chennai">Chennai</option>
              <option value="hyderabad">Hyderabad</option>
            </select>

            <textarea placeholder="More"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </section>
  );
}

export default Inquiry;
