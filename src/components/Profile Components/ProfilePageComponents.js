import "../HomePage.css";
import "./ProfilePageComponents.css";
import { twitterContext } from "../Contexts/Context";
import { useContext } from "react";
import { sortTweets, deleteTweet } from "../HelperFunctions";
import { Link } from "react-router-dom";

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
        if (tweetData.email === profile.email) {
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
        console.log(tweetData);
        if (tweetData.likedBy.includes(profile.email)) {
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
      <div>This is {profile.email}</div>
      <div>
        {timeOrderedTweets.map((tweetData) => {
          if (conditionFunction(tweetData, profile)) {
            const deleteTweetOption = () => {
              if (tweetData.email === loginDetails.emailion) {
                return (
                  <div
                    onClick={() => {
                      deleteTweet(tweetData, allTweets);
                    }}
                  >
                    Remove
                  </div>
                );
              }
            };

            return (
              <div
                className="IndividualTweetFormatMain"
                id={`tweet ${tweetData.timeStamp}`}
              >
                <Link
                  to={{
                    pathname: `/ProfilePage/${tweetData.email}`,
                    state: {
                      accountEmail: tweetData.email,
                    },
                  }}
                >
                  <img
                    src={tweetData.profilePic}
                    className="HomePageTweetProfilePicture"
                  ></img>
                </Link>
                <div className="IndividualTweetFormatRS">
                  <div className="IndividualTweetFormatUserInfo">
                    <div className="IndvidualTweetFormatUserText">
                      <b>{tweetData.userName}</b>
                    </div>
                    <div className="IndvidualTweetFormatUserText">
                      @{tweetData.at}
                    </div>
                    <div className="IndvidualTweetFormatUserText">
                      <div className="IndividualTweetDateSeperator">.</div>{" "}
                      {tweetData.date}
                    </div>
                  </div>
                  <div className="IndividualTweetFormatTweet">
                    {tweetData.tweet}
                  </div>
                  {tweetData.tweetImg && (
                    <img
                      className="IndividualTweetImageDisplay"
                      src={tweetData.tweetImg}
                    ></img>
                  )}
                  <div className="IndividualTweetInteractionDisplay">
                    <div className="IndividualTweetInteractionDisplayMain">
                      <div>Reply</div>
                      <div
                        onClick={() => {
                          tweetObj.retweet(tweetData);
                        }}
                      >
                        Retweets {tweetData.retweets}
                      </div>
                      <div
                        onClick={() => {
                          tweetObj.likeTweet(tweetData);
                        }}
                      >
                        Likes {tweetData.likes}
                      </div>
                    </div>
                    {deleteTweetOption()}
                  </div>
                </div>
              </div>
            );
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

const ProfilePageReplies = () => {
  return <div>These are Replies</div>;
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

export {
  ProfilePageTweets,
  ProfilePageReplies,
  ProfilePageMedia,
  ProfilePageLikes,
};
