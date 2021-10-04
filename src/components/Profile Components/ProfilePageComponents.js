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
  condition,
  ref
) => {
  const tweets = tweetContext;
  const loginDetails = loginContext;
  const tweetFunction = tweetFunctionContext;
  const allTweets = [...tweets];
  const profile = props.displayedProfile;
  const timeOrderedTweets = sortTweets(allTweets);
  const tweetObj = { ...tweetFunction };
  const allProfilesRef = ref;

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
        if (
          tweetData.retweetedByDisplay === profile.email ||
          (tweetData.replyingTo === true &&
            tweetData.email === loginDetails.email)
        ) {
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
            return renderTweet(
              tweetData,
              tweetObj,
              loginDetails,
              allProfilesRef
            );
          }
        })}
      </div>
    </div>
  );
};

const ProfilePageTweets = (props) => {
  const { tweets, loginDetails, tweetFunction, allProfilesRef } =
    useContext(twitterContext);
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    "selfTweets",
    allProfilesRef
  );
};

const ProfilePageReplies = (props) => {
  const { tweets, loginDetails, tweetFunction, allProfilesRef } =
    useContext(twitterContext);
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    "reTweets",
    allProfilesRef
  );
};

const ProfilePageMedia = (props) => {
  const { tweets, loginDetails, tweetFunction, allProfilesRef } =
    useContext(twitterContext);
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    "selfTweetsMedia",
    allProfilesRef
  );
};

const ProfilePageLikes = (props) => {
  const { tweets, loginDetails, tweetFunction, allProfilesRef } =
    useContext(twitterContext);
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    "LikedTweets",
    allProfilesRef
  );
};

export {
  ProfilePageTweets,
  ProfilePageReplies,
  ProfilePageMedia,
  ProfilePageLikes,
  mappedTweets,
};
