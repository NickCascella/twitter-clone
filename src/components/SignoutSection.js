import "../components/SignoutSection.css";
import { useContext } from "react";
import { twitterContext } from "./Contexts/Context";
const SignoutSection = () => {
  const { setLoginDetails, setSignedIn } = useContext(twitterContext);

  return (
    <div id="SignoutSection">
      <button
        className="LogoutBtn"
        onClick={() => {
          setSignedIn(false);
          setLoginDetails(null);
        }}
      >
        Logout
      </button>
      <div id="TwitterWelcome">
        Hello and welcome to this <i>sort of working</i> twitter messaging
        system! You can tweet, retweet, reply, like, follow, change your
        profile, etc. Some of the count tracking is a bit off in some edge case
        scenarios and has not been fully tested. Enjoy!
      </div>
    </div>
  );
};

export default SignoutSection;
