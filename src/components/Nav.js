import "../components/Nav.css";
import { Link } from "react-router-dom";
import { twitterContext } from "./Contexts/Context";
import { useContext, useState } from "react";
import homeIcon from "./images/homeIcon.png";
import maleIcon from "./images/profileIconMale.png";
import twitterBird from "./images/twitterBirdYelling.jpeg";

const Nav = () => {
  const { loginDetails, selectedTab, setSelectedTab } =
    useContext(twitterContext);

  const home = "Home";
  const profile = "Profile";

  const selectHome = (text) => {
    if (selectedTab === "Home") {
      return (
        <div className="NavMenuButtonsText" style={{ fontWeight: "bold" }}>
          {text}
        </div>
      );
    } else {
      return <div className="NavMenuButtonsText">{text}</div>;
    }
  };

  const selectProfile = (text) => {
    if (selectedTab === "Profile") {
      return (
        <div className="NavMenuButtonsText" style={{ fontWeight: "bold" }}>
          {text}
        </div>
      );
    } else {
      return <div className="NavMenuButtonsText">{text}</div>;
    }
  };

  return (
    <div id="Nav">
      <Link to="/" style={{ textDecoration: "none" }}>
        <img
          className="NavTwitterLogo"
          src={twitterBird}
          onClick={() => {
            setSelectedTab(home);
          }}
        ></img>
      </Link>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div
          className="NavMenuButtons"
          onClick={() => {
            setSelectedTab(home);
          }}
        >
          <img src={homeIcon} className="NavMenuButtonsImage"></img>
          {selectHome("Home")}
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
        <div
          className="NavMenuButtons"
          onClick={() => {
            setSelectedTab(profile);
          }}
        >
          <img src={maleIcon} className="NavMenuButtonsImage"></img>
          {selectProfile("Profile")}
        </div>
      </Link>
    </div>
  );
};

export default Nav;
