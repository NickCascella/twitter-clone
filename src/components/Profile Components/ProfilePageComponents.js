import "../HomePage.css";
import "./ProfilePageComponents.css";
import { twitterContext } from "../Contexts/Context";
import { useContext } from "react";
import { sortTweets } from "../HelperFunctions";
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
          tweetData.retweetedByDisplay === "" &&
          tweetData.replyingTo === false
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
          (tweetData.replyingTo === true && tweetData.email === profile.email)
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

  const passedConditionTweets = timeOrderedTweets.filter((tweetData) => {
    if (conditionFunction(tweetData, profile)) {
      return tweetData;
    }
  });

  if (passedConditionTweets.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: "20px",
          paddingBottom: "20px",
          fontSize: "20px",
        }}
      >
        <div>Nothing to see here..</div>
      </div>
    );
  } else {
    return (
      <div className="ProfilePageComponentDisplay">
        <div>
          {passedConditionTweets.map((tweetData) => {
            return renderTweet(
              tweetData,
              tweetObj,
              loginDetails,
              allProfilesRef,
              tweets
            );
          })}
        </div>
      </div>
    );
  }
};

const ProfilePageTweets = (props) => {
  const { tweets, loginDetails, tweetFunction, allProfilesRef } =
    useContext(twitterContext);
  const condition = props.condition;
  return mappedTweets(
    props,
    tweets,
    loginDetails,
    tweetFunction,
    condition,
    allProfilesRef
  );
};

export { ProfilePageTweets, mappedTweets };
