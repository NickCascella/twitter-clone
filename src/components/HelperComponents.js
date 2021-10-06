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
import trashClosed from "./images/trashClosedIcon.jpg";
import trashOpen from "./images/trashOpenIcon.jpg";

const TweetBox = (props) => {
  const { loginDetails } = useContext(twitterContext);
  const tweetObj = props.tweetObj;
  const currentTweetImg = props.currentTweetImg;
  const setCurrentTweetImg = props.setCurrentTweetImg;
  const setFile = props.setFile;
  const setCurrentTweetText = props.setCurrentTweetText;
  const currentTweetText = props.currentTweetText;
  const position = props.class;

  const tweetBoxHeight = (tweetLength) => {
    if (tweetLength > 100 && tweetLength < 125) {
      return tweetLength * 0.9;
    } else if (tweetLength >= 125) {
      return 90 + (tweetLength - 100) * 0.6;
    } else {
      return 80;
    }
  };

  const displayTweetCharacters = () => {
    if (currentTweetText.length > 220) {
      return (
        <div style={{ color: "red" }}>{240 - currentTweetText.length}</div>
      );
    } else {
      return (
        <div style={{ color: "green" }}>{240 - currentTweetText.length}</div>
      );
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
            maxLength="240"
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
            {displayTweetCharacters()}
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
  const { tweetFunction } = useContext(twitterContext);
  const loginDetails = props.loginDetails;
  const arrayOfFollowedFollowing = props.followingOrFollowedUsers;
  const allUsers = props.allProfiles;
  const followAccount = props.followAccount;
  const followButton = props.followButton;
  const setDisplayFollowScreen = props.setDisplayFollowScreen;

  console.log(tweetFunction);
  const tweetObj = tweetFunction;

  if (arrayOfFollowedFollowing.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: "20px",
          fontSize: "20px",
        }}
      >
        No users yet!
      </div>
    );
  }

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
                    pathname: `/ProfilePage/${allUsers.email}/tweets`,
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
                      tweetObj.setProfileCondition();
                      tweetObj.setTab();
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
        <img
          className="tweetInteractionBtns"
          onClick={() => {
            tweetObj.deleteTweet(tweetData);
          }}
          onMouseEnter={(e) => {
            e.target.src = trashOpen;
          }}
          onMouseLeave={(e) => {
            e.target.src = trashClosed;
          }}
          src={trashClosed}
        ></img>
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
      return <img src={greenThumbsUp} className="tweetInteractionBtns"></img>;
    } else {
      return <img src={whiteThumbsUp} className="tweetInteractionBtns"></img>;
    }
  };

  const retweetStatus = (tweetData) => {
    if (tweetData.retweetedBy.includes(loginDetails.email)) {
      return (
        <img
          src={blueRetweet}
          style={{ height: "16px" }}
          className="tweetInteractionBtns"
        ></img>
      );
    } else {
      return (
        <img
          src={blackRetweet}
          style={{ height: "14px" }}
          className="tweetInteractionBtns"
        ></img>
      );
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
      return <img src={blueReply} className="tweetInteractionBtns"></img>;
    } else {
      return <img src={blackReply} className="tweetInteractionBtns"></img>;
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
            pathname: `/ProfilePage/${tweetData.email}/tweets`,
            state: {
              accountEmail: tweetData.email,
            },
          }}
        >
          <img
            src={tweetData.profilePic}
            className="HomePageTweetProfilePicture"
            onClick={() => {
              tweetObj.setTab();
              tweetObj.setProfileCondition();
            }}
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
              {deleteTweetOption()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TweetBox, FollowingFollowerDisplay, renderTweet };
