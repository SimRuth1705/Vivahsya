import "./Loader.css";
import logo from "../../assets/vlogo.png";

function Loader() {
  return (
    <div className="gate-loader">
      <div className="gate left-gate"></div>
      <div className="gate right-gate"></div>

      <div className="gate-center">
        <img src={logo} alt="Vivahasya Celebrations" />
        <p>Weddings, Crafted with Heart</p>
      </div>
    </div>
  );
}

export default Loader;
