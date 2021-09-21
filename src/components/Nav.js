import "../components/Nav.css";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div id="Nav">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="NavTwitterLogo">O</div>
      </Link>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="NavMenuButtons">
          <div className="NavMenuButtonsImage">~</div>
          <div className="NavMenuButtonsText">Home</div>
        </div>
      </Link>
      <Link to="/ProfilePage" style={{ textDecoration: "none" }}>
        <div className="NavMenuButtons">
          <div className="NavMenuButtonsImage">#</div>
          <div className="NavMenuButtonsText">Profile</div>
        </div>
      </Link>
    </div>
  );
};

export default Nav;
