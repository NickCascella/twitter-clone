import "../components/HomePage.css";
import { twitterContext } from "./Contexts/Context";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, deleteDoc } from "@firebase/firestore";
import { db, storage } from "../firebase";
import { formatDate, sortTweets } from "./HelperFunctions";

const HomePage = () => {
  const {
    loginDetails,
    setLoginDetails,
    tweets,
    setTweets,
    setTweetFunction,
    setSignedIn,
  } = useContext(twitterContext);
  const [currentTweetText, setCurrentTweetText] = useState("");
  const [currentTweetImg, setCurrentTweetImg] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTweetFunction(tweetObj);
  }, []);

  const tweetObj = {
    tweet: (result) => {
      const tweet = currentTweetText;
      const tweetInfo = {
        profilePic: loginDetails.profilePicture,
        userName: loginDetails.userName,
        at: loginDetails.at,
        date: formatDate("Standard"),
        tweet: tweet,
        tweetImg: result,
        likes: 0,
        likedBy: [],
        retweets: 0,
        retweetedBy: [],
        retweetedCopy: false,
        oldTimeStamp: null,
        email: loginDetails.email,
        timeStamp: Date.now(),
      };

      const newTweets = [...tweets];
      newTweets.push(tweetInfo);
      if (currentTweetText !== "" || currentTweetImg !== null) {
        setTweets(newTweets);
        setCurrentTweetImg(null);
        setCurrentTweetText("");
        tweetObj.updateTweetDatabase(tweetInfo, "Creating Tweet");
      }
    },
    viewImgHandler: async (e) => {
      let pickedFile;
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setCurrentTweetImg(URL.createObjectURL(pickedFile));
      e.target.value = "";
    },
    submitTweet: async (e) => {
      e.preventDefault();
      if (file !== null) {
        storage.ref(`/images/${file.name}`).put(file);
        let result = await storage
          .ref("images")
          .child(file.name)
          .getDownloadURL();
        setFile(null);
        console.log(result);
        tweetObj.tweet(result);
      } else {
        tweetObj.tweet(null);
      }
    },
    updateTweetDatabase: (tweet, situation) => {
      //updating tweet count
      const userInfo = { ...loginDetails };
      switch (situation) {
        case "Creating Tweet":
          userInfo.tweets += 1;
          break;
      }
      setLoginDetails(userInfo);
      //logging tweet
      setDoc(
        doc(db, "userTweets", `${tweet.userName} ${tweet.timeStamp}`),
        tweet
      );
      //logging tweet count
      setDoc(doc(db, "userProfiles", `${loginDetails.email}`), {
        ...userInfo,
        tweets: userInfo.tweets,
      });
    },
    likeTweet: (tweetData) => {
      let allTweets = [...tweets];
      let newTweetData = { ...tweetData };
      allTweets.filter((tweet) => {
        if (
          tweet.timeStamp === newTweetData.timeStamp &&
          !tweet.likedBy.includes(loginDetails.email)
        ) {
          newTweetData.likes += 1;
          tweet.likes = newTweetData.likes;
          tweet.likedBy.push(loginDetails.email);
        } else if (tweet.timeStamp === newTweetData.timeStamp) {
          newTweetData.likes -= 1;
          tweet.likes = newTweetData.likes;
          let unlikedBy = tweet.likedBy.indexOf(loginDetails.email);
          tweet.likedBy.splice(unlikedBy, 1);
        }
        setTweets(allTweets);
        tweetObj.updateTweetDatabase(tweet, "Updating Likes");
      });
    },
    retweet: (tweetData) => {
      let allTweets = [...tweets];
      let newTweetData = { ...tweetData };

      allTweets.filter((tweet) => {
        if (
          tweet.timeStamp === newTweetData.timeStamp &&
          !tweet.retweetedBy.includes(loginDetails.email)
        ) {
          newTweetData.retweets += 1;
          tweet.retweets = newTweetData.retweets;
          tweet.retweetedBy.push(loginDetails.email);
        } else if (tweet.timeStamp === newTweetData.timeStamp) {
          newTweetData.retweets -= 1;
          tweet.retweets = newTweetData.retweets;
          let unlikedBy = tweet.retweetedBy.indexOf(loginDetails.email);
          tweet.retweetedBy.splice(unlikedBy, 1);
        }
        setTweets(allTweets);
        tweetObj.updateTweetDatabase(tweet, "Updating Retweets");
      });
    },
    deleteTweet: (tweet) => {
      const allTweets = [...tweets];
      allTweets.filter((tweetMatch) => {
        if (tweetMatch.timeStamp === tweet.timeStamp) {
          deleteDoc(
            doc(db, "userTweets", `${tweet.userName} ${tweet.timeStamp}`)
          );
          let tweetCount = loginDetails.tweets;
          tweetCount -= 1;
          setDoc(doc(db, "userProfiles", `${loginDetails.email}`), {
            ...loginDetails,
            tweets: tweetCount,
          });
        }
      });
    },
  };

  const TweetsDisplay = () => {
    const timeOrderedTweets = [...tweets];
    const newTweets = sortTweets(timeOrderedTweets);

    if (!newTweets) {
      return <div>Loading...</div>;
    }

    return (
      <div className="HomePageTweetsDisplay">
        {timeOrderedTweets.map((tweetData) => {
          const deleteTweetOption = () => {
            if (tweetData.email === loginDetails.email) {
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
        })}
      </div>
    );
  };

  return (
    <div id="HomePage">
      <div id="HomePageTweetsLS">
        <div id="HomePageHomeHeaderText">Home</div>
        <div id="HomePageTweetingDiv">
          <img
            src={loginDetails.profilePicture}
            className="HomePageTweetProfilePicture"
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
              ></textarea>
              <div className="HomePageTweetInputBts">
                <label
                  className="HomePageTweetButton"
                  style={{ width: "100px" }}
                >
                  {" "}
                  Upload Files
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif, imgage/jpg"
                    onChange={tweetObj.viewImgHandler}
                    className="HomePageUploadImgBtn"
                  ></input>
                </label>
                <button type="submit" className="HomePageTweetButton">
                  Tweet
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>{TweetsDisplay()}</div>
      </div>

      <div id="HomePageWhatIsHappeningRS">
        <div
          onClick={() => {
            setSignedIn(false);
          }}
        >
          Log out
        </div>
      </div>
    </div>
  );
};

export default HomePage;
