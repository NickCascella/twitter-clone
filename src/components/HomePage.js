import "../components/HomePage.css";
import { twitterContext } from "./Contexts/Context";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, deleteDoc } from "@firebase/firestore";
import { db, storage } from "../firebase";
import { formatDate, sortTweets } from "./HelperFunctions";
import { TweetBox } from "./HelperComponents";

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
  const [currentKey, setCurrentKey] = useState();

  useEffect(() => {
    //exporting tweet obj to be used elsewhere
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
        retweetedByDisplay: "",
        retweetedCopy: false,
        orginalTweetTimeStamp: null,
        email: loginDetails.email,
        timeStamp: Date.now(),
      };

      const newTweets = [...tweets];
      newTweets.push(tweetInfo);
      if (currentTweetText !== "" || currentTweetImg !== null) {
        setTweets(newTweets);
        setCurrentTweetImg(null);
        setCurrentTweetText("");
        tweetObj.updateTweetDatabase(tweetInfo, "Update tweet count");
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
        tweetObj.tweet(result);
      } else {
        tweetObj.tweet(null);
      }
    },
    updateTweetDatabase: (tweet, situation) => {
      //updating tweet count
      const userInfo = { ...loginDetails };
      switch (situation) {
        case "Update tweet count":
          userInfo.tweets += 1;
          break;
        case "Removing tweet":
          userInfo.tweets -= 1;
          break;
      }
      setLoginDetails(userInfo);
      //logging tweet
      setDoc(doc(db, "userTweets", `${tweet.at} ${tweet.timeStamp}`), tweet);
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
          // allTweets.filter((copy) => {

          // })
        } else if (tweet.timeStamp === newTweetData.timeStamp) {
          newTweetData.likes -= 1;
          tweet.likes = newTweetData.likes;
          let unlikedBy = tweet.likedBy.indexOf(loginDetails.email);
          tweet.likedBy.splice(unlikedBy, 1);
        }

        tweetObj.updateTweetDatabase(tweet, "Updating Likes");
      });
    },
    retweetCount: (tweetData) => {
      let allTweets = [...tweets];
      let newTweetData = { ...tweetData };
      let retweetedTweet = { ...newTweetData };
      allTweets.filter((tweet) => {
        //Retweet original tweet that isnt yours
        if (
          tweet.timeStamp === newTweetData.timeStamp &&
          !tweet.retweetedBy.includes(loginDetails.email) &&
          newTweetData.retweetedCopy === false &&
          !(tweet.email === loginDetails.email)
        ) {
          //update retweet count
          newTweetData.retweets += 1;
          tweet.retweets = newTweetData.retweets;
          tweet.retweetedBy.push(loginDetails.email);
          //make new retweet
          retweetedTweet = {
            ...newTweetData,
            retweetedCopy: true,
            orginalTweetTimeStamp: tweetData.timeStamp,
            timeStamp: Date.now(),
            retweetedBy: tweet.retweetedBy,
            retweetedByDisplay: loginDetails.email,
          };
          //update user tweet count
          // allTweets.push(retweetedTweet);
          tweetObj.updateTweetDatabase(retweetedTweet, "Update retweet");
          tweetObj.updateTweetDatabase(tweet, "Update tweet count");
          //Delete cloned tweet you made from orignal
        } else if (
          tweet.timeStamp === newTweetData.timeStamp &&
          tweet.retweetedCopy === false &&
          tweet.retweetedBy.includes(loginDetails.email)
        ) {
          //unretweeting original tweet
          newTweetData.retweets -= 1;
          tweet.retweets = newTweetData.retweets;
          let unretweetedBy = tweet.retweetedBy.indexOf(loginDetails.email);
          tweet.retweetedBy.splice(unretweetedBy, 1);
          allTweets.filter((retweetedTweet) => {
            if (
              retweetedTweet.orginalTweetTimeStamp === tweet.timeStamp &&
              retweetedTweet.retweetedBy.includes(loginDetails.email) &&
              retweetedTweet.retweetedByDisplay === loginDetails.email
            ) {
              deleteDoc(
                doc(
                  db,
                  "userTweets",
                  `${retweetedTweet.at} ${retweetedTweet.timeStamp}`
                )
              );
            }
          });

          //deleting copied retweet
          tweetObj.updateTweetDatabase(tweet, "Removing tweet");
          //Delete cloned tweet from cloned tweet
        } else if (
          tweet.timeStamp === newTweetData.timeStamp &&
          tweet.retweetedCopy === true &&
          tweet.retweetedBy.includes(loginDetails.email) &&
          tweet.retweetedByDisplay === loginDetails.email
        ) {
          console.log("Hi");
          console.log(newTweetData);
          allTweets.filter((originalTweet) => {
            if (
              originalTweet.timeStamp === newTweetData.orginalTweetTimeStamp
            ) {
              originalTweet.retweets = newTweetData.retweets;
              let unretweetedBy = originalTweet.retweetedBy.indexOf(
                loginDetails.email
              );
              originalTweet.retweetedBy.splice(unretweetedBy, 1);
              originalTweet.retweets -= 1;
              if (newTweetData.retweetedFrom) {
                newTweetData.retweetedFrom.retweets -= 1;
                tweetObj.updateTweetDatabase(
                  newTweetData.retweetedFrom,
                  "Removing tweet"
                );
              }
              tweetObj.updateTweetDatabase(originalTweet, "Removing tweet");
              deleteDoc(
                doc(
                  db,
                  "userTweets",
                  `${newTweetData.at} ${newTweetData.timeStamp}`
                )
              );
            }
          });
        } else if (
          tweet.retweetedByDisplay === loginDetails.email &&
          tweet.orginalTweetTimeStamp === newTweetData.orginalTweetTimeStamp
        ) {
          //Delete cloned tweet from cloned tweet
          deleteDoc(doc(db, "userTweets", `${tweet.at} ${tweet.timeStamp}`));
          // // tweetObj.updateTweetDatabase(originalTweet, "Update original tweet");

          allTweets.filter((originalTweet) => {
            if (
              originalTweet.timeStamp === newTweetData.orginalTweetTimeStamp
            ) {
              //remove tweet from retweeted by
              let unretweetedBy = originalTweet.retweetedBy.indexOf(
                loginDetails.email
              );
              originalTweet.retweetedBy.splice(unretweetedBy, 1);
              originalTweet.retweets -= 1;
              newTweetData.retweets -= 1;
              tweetObj.updateTweetDatabase(
                newTweetData,
                "Update retweet count"
              );
              tweetObj.updateTweetDatabase(originalTweet, "Removing tweet");
            }
          });
          //Enable retweet from cloned retweets IF I have not made one yet
          //disable being able to retweet your own tweet OR retweets of your own tweet
        } else if (
          tweet.retweetedByDisplay === "" &&
          tweet.timeStamp === newTweetData.orginalTweetTimeStamp &&
          !tweet.retweetedBy.includes(loginDetails.email) &&
          tweet.email !== loginDetails.email
        ) {
          tweet.retweets += 1;
          newTweetData.retweets += 1;
          tweet.retweetedBy.push(loginDetails.email);
          // //make new retweet
          retweetedTweet = {
            ...tweet,
            retweetedCopy: true,
            orginalTweetTimeStamp: tweet.timeStamp,
            timeStamp: Date.now(),
            retweetedBy: tweet.retweetedBy,
            retweetedByDisplay: loginDetails.email,
            retweetedFrom: newTweetData,
          };

          tweetObj.updateTweetDatabase(newTweetData, "Update retweet count");
          tweetObj.updateTweetDatabase(retweetedTweet, "Update retweets");
          tweetObj.updateTweetDatabase(tweet, "Update tweet count");
        }
      });
    },
    deleteTweet: (tweet) => {
      //add feature where if tweet is removed and original retweetedBy cotains a user, reduce users retweet count by 1
      //add display following or not feature
      const allTweets = [...tweets];
      allTweets.filter((tweetMatch) => {
        if (tweetMatch.timeStamp === tweet.timeStamp) {
          deleteDoc(doc(db, "userTweets", `${tweet.at} ${tweet.timeStamp}`));
          let tweetCount = loginDetails.tweets;
          tweetCount -= 1;
          setDoc(doc(db, "userProfiles", `${loginDetails.email}`), {
            ...loginDetails,
            tweets: tweetCount,
          });
          allTweets.filter((removedTweet) => {
            if (tweetMatch.timeStamp === removedTweet.orginalTweetTimeStamp) {
              deleteDoc(
                doc(
                  db,
                  "userTweets",
                  `${removedTweet.at} ${removedTweet.timeStamp}`
                )
              );
            }
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
                  {tweetData.retweetedCopy && (
                    <div className="IndvidualTweetFormatUserText">
                      <div className="IndvidualTweetFormatUserText">.</div>{" "}
                      {tweetData.retweetedByDisplay}
                    </div>
                  )}
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
          );
        })}
      </div>
    );
  };

  return (
    <div id="HomePage">
      <div id="HomePageTweetsLS">
        <div id="HomePageHomeHeaderText">Home</div>
        <TweetBox
          tweetObj={tweetObj}
          loginDetails={loginDetails}
          currentTweerImg={currentTweetImg}
          setCurrentTweetImg={setCurrentTweetImg}
          setFile={setFile}
          setCurrentTweetText={setCurrentTweetText}
          currentTweetText={currentTweetText}
        ></TweetBox>
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
