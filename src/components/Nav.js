import "../components/Nav.css";
import { Link } from "react-router-dom";
import { twitterContext } from "./Contexts/Context";
import { useContext } from "react";

const Nav = () => {
  const { loginDetails } = useContext(twitterContext);
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
      <Link
        to={{
          pathname: `/ProfilePage/${loginDetails.email}`,
          state: {
            accountEmail: loginDetails.email,
          },
        }}
        style={{ textDecoration: "none" }}
      >
        <div className="NavMenuButtons">
          <div className="NavMenuButtonsImage">#</div>
          <div className="NavMenuButtonsText">Profile</div>
        </div>
      </Link>
    </div>
  );
};

export default Nav;
