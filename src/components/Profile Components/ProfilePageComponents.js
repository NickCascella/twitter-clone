import "../HomePage.css";
import "./ProfilePageComponents.css";
import { twitterContext } from "../Contexts/Context";
import { useContext } from "react";
import { sortTweets, deleteTweet } from "../HelperFunctions";
import { Link } from "react-router-dom";
import { renderTweet } from "../HelperComponents";

const mappedTweets = (
  props,
  tweetContext,
  loginContext,
  tweetFunctionContext,
  condition
) => {
  const tweets = tweetContext;
  const loginDetails = loginContext;
  const tweetFunction = tweetFunctionContext;
  const allTweets = [...tweets];
  const profile = props.displayedProfile;
  const timeOrderedTweets = sortTweets(allTweets);
  const tweetObj = { ...tweetFunction };

  let conditionFunction = () => {
    return false;
  };

  switch (condition) {
    case "selfTweets":
      conditionFunction = (tweetData, profile) => {
        if (
          tweetData.email === profile.email &&
          tweetData.retweetedByDisplay === ""
        ) {
          return true;
        }
      };
      break;
    case "selfTweetsMedia":
      conditionFunction = (tweetData, profile) => {
        if (tweetData.email === profile.email && tweetData.tweetImg) {
          return true;
        }
      };
      break;
    case "LikedTweets":
      conditionFunction = (tweetData, profile) => {
        if (tweetData.likedBy.includes(profile.email)) {
          return true;
        }
      };
      break;
    case "reTweets":
      conditionFunction = (tweetData, profile) => {
        if (tweetData.retweetedByDisplay === profile.email) {
          return true;
        }
      };
      break;

    default:
      return <div>Error</div>;
  }

  if (!timeOrderedTweets || !tweetObj) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ProfilePageComponentDisplay">
      <div>
        {timeOrderedTweets.map((tweetData) => {
          if (conditionFunction(tweetData, profile)) {
            return renderTweet(tweetData, tweetObj, loginDetails);
          }
        })}
      </div>
    </div>
  );
};

const ProfilePageTweets = (props) => {
  const { tweets, loginDetails, tweetFunction } = useContext(twitterContext);
  return mappedTweets(props, tweets, loginDetails, tweetFunction, "selfTweets");
};

const ProfilePageReplies = (props) => {
  const { tweets, loginDetails, tweetFunction } = useContext(twitterContext);
  return mappedTweets(props, tweets, loginDetails, tweetFunction, "reTweets");
};

const ProfilePageMedia = (props) => {
  const { tweets, loginDetails, tweetFunction } = useContext(twitterContext);
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    "selfTweetsMedia"
  );
};

const ProfilePageLikes = (props) => {
  const { tweets, loginDetails, tweetFunction } = useContext(twitterContext);
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    "LikedTweets"
  );
};

const ReplyTweetChain = (props) => {
  const { tweets, loginDetails, tweetFunction } = useContext(twitterContext);
  return mappedTweets;
};

export {
  ProfilePageTweets,
  ProfilePageReplies,
  ProfilePageMedia,
  ProfilePageLikes,
  mappedTweets,
};
