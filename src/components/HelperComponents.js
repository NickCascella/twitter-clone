import "../components/HomePage.css";
import "../components/HelperComponents.css";
import "../components/ProfilePage.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { twitterContext } from "./Contexts/Context";
import uploadImgIcon from "./images/uploadImgIcon.PNG";
import whiteThumbsUp from "./images/thumbsUpIconWhite.png";
import greenThumbsUp from "./images/thumbsUpIconGreen.png";
import blackRetweet from "./images/retweetIconBlack.png";
import blueRetweet from "./images/retweetIconBlue.png";
import blueReply from "./images/replyIconBlue.png";
import blackReply from "./images/replyIconBlack.png";

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
    if (tweetLength > 100 && tweetLength < 125) {
      return tweetLength * 0.9;
    } else if (tweetLength >= 125) {
      return 90 + (tweetLength - 100) * 0.6;
    } else {
      return 80;
    }
  };

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
            value={currentTweetText}
            maxLength="200"
            style={{
              height: `${tweetBoxHeight(currentTweetText.length)}px`,
            }}
          ></textarea>

          <div className="HomePageTweetInputBts">
            <img src={uploadImgIcon} className="TweetBoxImgIcon"></img>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif, imgage/jpg"
              onChange={tweetObj.viewImgHandler}
              className="HomePageUploadImgBtn"
            ></input>

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
          Delete
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
    let replyName;
    allTweetsRefCopy.filter((tweet) => {
      if (tweet.replies.includes(tweetData.timeStamp)) {
        replyName = `@${tweet.at}`;
      }
    });
    if (replyName) {
      return replyName;
    } else {
      return "DELETED";
    }
  };

  const likeStatus = (tweetData) => {
    if (tweetData.likedBy.includes(loginDetails.email)) {
      return <img src={greenThumbsUp} style={{ width: "15px" }}></img>;
    } else {
      return <img src={whiteThumbsUp} style={{ width: "15px" }}></img>;
    }
  };

  const retweetStatus = (tweetData) => {
    if (tweetData.retweetedBy.includes(loginDetails.email)) {
      return <img src={blueRetweet} style={{ width: "15px" }}></img>;
    } else {
      return <img src={blackRetweet} style={{ width: "15px" }}></img>;
    }
  };

  const replyStatus = (tweetData) => {
    let timestamps = allTweetsRef.map((tweetTimeStamps) => {
      return tweetTimeStamps.timeStamp;
    });

    let checkReplyMatch = tweetData.replies.some((reply) => {
      return timestamps.includes(reply);
    });

    if (checkReplyMatch) {
      return <img src={blueReply} style={{ width: "15px" }}></img>;
    } else {
      return <img src={blackReply} style={{ width: "15px" }}></img>;
    }
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
                }}
              >
                {replyStatus(tweetData)} {tweetData.replies.length}
              </div>
              <div
                onClick={() => {
                  tweetObj.retweetCount(tweetData);
                }}
              >
                {retweetStatus(tweetData)} {tweetData.retweets}
              </div>
              <div
                onClick={() => {
                  tweetObj.likeTweet(tweetData);
                }}
              >
                {likeStatus(tweetData)} {tweetData.likes}
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
