import "../components/HomePage.css";
import "../components/HelperComponents.css";
import "../components/ProfilePage.css";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { twitterContext } from "./Contexts/Context";

const TweetBox = (props) => {
  const { loginDetails, tweetFunction } = useContext(twitterContext);
  const tweetObj = props.tweetObj;
  const currentTweetImg = props.currentTweetImg;
  const setCurrentTweetImg = props.setCurrentTweetImg;
  const setFile = props.setFile;
  const setCurrentTweetText = props.setCurrentTweetText;
  const currentTweetText = props.currentTweetText;
  const replyingTo = props.replyingTo;
  const position = props.class;

  const tweetBoxHeight = (tweetLength, character, lastKey) => {
    let boxHeight = 0;

    if (tweetLength > 100 && tweetLength < 125) {
      return tweetLength * 0.8;
      if (character.key === "Enter") {
        return boxHeight + 40;
      } else {
        return boxHeight;
      }
    } else if (tweetLength >= 125) {
      return 90 + (tweetLength - 100) * 0.55;
    } else {
      return 80;
    }
  };
  const tweetBoxMaxCharacters = () => {};

  return (
    <div id="HomePageTweetingDiv" className={position}>
      <img
        src={loginDetails.profilePicture}
        className="HomePageTweetProfilePicture"
        style={{ top: "10px" }}
      ></img>
      <div>
        <form
          onSubmit={(e) => {
            tweetObj.submitTweet(e);
          }}
          className="HomePageTweetDivInputContainer"
        >
          {currentTweetImg && (
            <div id="IndividualTweetImagePreview">
              <img
                className="IndividualTweetImageDisplay"
                src={currentTweetImg}
              ></img>
              <div
                onClick={() => {
                  setCurrentTweetImg(null);
                  setFile(null);
                }}
                id="IndividualTweetImagePreviewRemoveBtn"
              >
                X
              </div>
            </div>
          )}
          <textarea
            className="HomePageTweetInput"
            placeholder="What is happening?"
            onChange={(e) => {
              setCurrentTweetText(e.target.value);
            }}
            onKeyDown={(e) => {
              // setCurrentKey(e);
            }}
            value={currentTweetText}
            maxLength="200"
            style={{
              height: `${tweetBoxHeight(currentTweetText.length)}px`,
            }}
          >
            DD
          </textarea>

          <div className="HomePageTweetInputBts">
            <label style={{ width: "13px" }}>
              {" "}
              img
              <input
                type="file"
                accept="image/png, image/jpeg, image/gif, imgage/jpg"
                onChange={tweetObj.viewImgHandler}
                className="HomePageUploadImgBtn"
              ></input>
            </label>
            <div>{tweetBoxMaxCharacters(currentTweetText.length)}</div>
            <button type="submit" className="HomePageTweetButton">
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FollowingFollowerDisplay = (props) => {
  const loginDetails = props.loginDetails;
  const arrayOfFollowedFollowing = props.followingOrFollowedUsers;
  const allUsers = props.allProfiles;
  const followAccount = props.followAccount;
  const followButton = props.followButton;
  const setDisplayFollowScreen = props.setDisplayFollowScreen;

  return (
    <div className="HomePageTweetsDisplay">
      {" "}
      {arrayOfFollowedFollowing.map((user) => {
        return allUsers.map((allUsers) => {
          if (user === allUsers.email) {
            return (
              <div className="IndividualTweetFormatMain">
                <Link
                  to={{
                    pathname: `/ProfilePage/${allUsers.email}`,
                    state: {
                      accountEmail: allUsers.email,
                    },
                  }}
                >
                  <img
                    src={allUsers.profilePicture}
                    className="HomePageTweetProfilePicture"
                    onClick={() => {
                      setDisplayFollowScreen(false);
                    }}
                  ></img>
                </Link>
                <div className="IndividualTweetFormatRS">
                  <div className="IndividualFollowingFormatUserInfo">
                    <div className="IndvidualTweetFormatUserText">
                      <b>{allUsers.userName}</b>
                    </div>
                    <div className="IndvidualTweetFormatUserText">
                      @{allUsers.at}
                    </div>
                    <div className="IndvidualTweetFormatUserText">
                      {allUsers.bio !== "Your bio here." && allUsers.bio}
                    </div>
                  </div>
                  {loginDetails.email !== allUsers.email && (
                    <button
                      id="ProfileEdit"
                      onClick={() => {
                        followAccount(allUsers);
                      }}
                    >
                      {followButton(allUsers)}
                    </button>
                  )}
                </div>
              </div>
            );
          }
        });
      })}
    </div>
  );
};

const renderTweet = (
  tweetData,
  tweetObj,
  loginDetails,
  allProfilesRef,
  allTweetsRef,
  replyingTo
) => {
  const allProfilesRefCopy = [...allProfilesRef];
  const allTweetsRefCopy = [...allTweetsRef];
  let replyingStatus = replyingTo;
  if (!replyingStatus) {
    replyingStatus = false;
  }
  const deleteTweetOption = () => {
    if (
      tweetData.email === loginDetails.email &&
      tweetData.retweetedByDisplay === "" &&
      replyingStatus === false
    ) {
      return (
        <div
          onClick={() => {
            tweetObj.deleteTweet(tweetData);
          }}
        >
          Remove
        </div>
      );
    }
  };

  const getDisplayName = (tweetData) => {
    let answer;
    allProfilesRefCopy.filter((profile) => {
      if (profile.email === tweetData.retweetedByDisplay) {
        answer = `@${profile.at}`;
      }
    });
    return answer;
  };

  const getRepliedToName = (tweetData) => {
    let answer;
    allTweetsRefCopy.filter((tweet) => {
      if (tweet.replies.includes(tweetData.timeStamp)) {
        answer = `@${tweet.at}`;
      }
    });
    return answer;
  };

  return (
    <div>
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
          {tweetData.retweetedCopy && (
            <div className="IndvidualTweetFormatUserText">
              <div className="IndvidualTweetFormatUserText">
                {" "}
                {getDisplayName(tweetData)} RT
              </div>{" "}
            </div>
          )}
          {tweetData.replyingTo && (
            <div className="IndvidualTweetFormatUserText">
              <div className="IndvidualTweetFormatUserText">
                {" "}
                Replying to {getRepliedToName(tweetData)}
              </div>{" "}
            </div>
          )}
          <div className="IndividualTweetFormatUserInfo">
            <div className="IndvidualTweetFormatUserText">
              <b>{tweetData.userName}</b>
            </div>
            <div className="IndvidualTweetFormatUserText">@{tweetData.at}</div>
            <div className="IndvidualTweetFormatUserText">
              <div className="IndividualTweetDateSeperator">.</div>{" "}
              {tweetData.date}
            </div>
          </div>
          <div className="IndividualTweetFormatTweet">{tweetData.tweet}</div>
          {tweetData.tweetImg && (
            <img
              className="IndividualTweetImageDisplay"
              src={tweetData.tweetImg}
            ></img>
          )}
          <div className="IndividualTweetInteractionDisplay">
            <div className="IndividualTweetInteractionDisplayMain">
              <div
                onClick={() => {
                  tweetObj.launchReplyScreen(tweetData);
                  console.log("Hi");
                }}
              >
                Reply {tweetData.replies.length}
              </div>
              <div
                onClick={() => {
                  tweetObj.retweetCount(tweetData);
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
    </div>
  );
};

export { TweetBox, FollowingFollowerDisplay, renderTweet };
