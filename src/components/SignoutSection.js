import "../components/SignoutSection.css";
import { useContext } from "react";
import { twitterContext } from "./Contexts/Context";
import { Link } from "react-router-dom";
const SignoutSection = () => {
  const { setLoginDetails, setSignedIn } = useContext(twitterContext);

  return (
    <div id="SignoutSection">
      <Link to="/">
        <button
          className="LogoutBtn"
          onClick={() => {
            setSignedIn(false);
            setLoginDetails(null);
          }}
        >
          Logout
        </button>
      </Link>
      <div id="TwitterWelcome">
        <p>
          Hello and welcome to this <i>sort of working</i> twitter messaging
          system! You can tweet, retweet, reply, like, follow, change your
          profile, etc.
        </p>
        <p>
          <b>
            It is purposefully designed for you to be unable to retweet or like
            self made tweets.
          </b>{" "}
          However, you may reply to them. In addition, any retweets you make
          will be visible to other users except yourself.
        </p>
        {/* <p>
          {" "}
          <b style={{ fontSize: "20px", display: "block" }}>PLEASE READ</b>This
          project is incomplete. With this in mind, note bugs are present. Most
          notably, attempting to interact with tweets from the profile page can
          cause issues so only do so from the main feed, thank you.
        </p> */}
      </div>
    </div>
  );
};

export default SignoutSection;
