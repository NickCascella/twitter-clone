import "../components/HomePage.css";
import "../components/ProfilePage.css";
import { twitterContext } from "./Contexts/Context";
import { useContext, useEffect, useState } from "react";
import { doc, setDoc, deleteDoc } from "@firebase/firestore";
import { db, storage } from "../firebase";
import { formatDate, sortTweets } from "./HelperFunctions";
import { TweetBox, renderTweet } from "./HelperComponents";

const HomePage = () => {
  const {
    allProfilesRef,
    loginDetails,
    setLoginDetails,
    tweets,
    setTweets,
    setTweetFunction,
    setSelectedTab,
    setCondition,
  } = useContext(twitterContext);
  const [currentTweetText, setCurrentTweetText] = useState("");
  const [currentTweetImg, setCurrentTweetImg] = useState(null);
  const [file, setFile] = useState(null);
  const [replyingTo, setReplyingTo] = useState(false);
  const [currentTweetReplyingToo, setCurrentTweetReplyingToo] = useState(null);

  useEffect(() => {
    //exporting tweet obj to be used elsewhere
    setTweetFunction(tweetObj);
  }, []);

  const tweetObj = {
    tweet: (result) => {
      const tweet = currentTweetText;
      let tweetInfo = {
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
        replyingTo: false,
        repliedTo: false,
        replies: [],
        orginalTweetTimeStamp: null,
        email: loginDetails.email,
        timeStamp: Date.now(),
      };

      const newTweets = [...tweets];
      newTweets.push(tweetInfo);
      if (currentTweetText !== "" || currentTweetImg !== null) {
        let tweetBeingRepliedToo = {
          ...currentTweetReplyingToo,
        };
        if (replyingTo) {
          tweetInfo = { ...tweetInfo, replyingTo: true };
          let repliesArray = tweetBeingRepliedToo.replies;
          repliesArray.push(tweetInfo.timeStamp);
          tweetBeingRepliedToo.repliedTo = true;
          tweetBeingRepliedToo.replies = repliesArray;
          if (tweetBeingRepliedToo.retweets > 0) {
            newTweets.map((oldTweets) => {
              if (
                oldTweets.orginalTweetTimeStamp ===
                  tweetBeingRepliedToo.timeStamp ||
                oldTweets.timeStamp ===
                  tweetBeingRepliedToo.orginalTweetTimeStamp ||
                (oldTweets.orginalTweetTimeStamp ===
                  tweetBeingRepliedToo.orginalTweetTimeStamp &&
                  oldTweets.orginalTweetTimeStamp !== null)
              ) {
                //retweeted copies

                oldTweets.replies = repliesArray;
                tweetObj.updateTweetDatabase(oldTweets, "Replying to tweet");
              }
            });
          }
          tweetObj.updateTweetDatabase(
            tweetBeingRepliedToo,
            "Replying to tweet"
          );
        }
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
          !tweet.likedBy.includes(loginDetails.email) &&
          tweet.email !== loginDetails.email
        ) {
          newTweetData.likes += 1;
          tweet.likes = newTweetData.likes;
          tweet.likedBy.push(loginDetails.email);
          allTweets.filter((oldTweet) => {
            if (
              oldTweet.timeStamp === newTweetData.orginalTweetTimeStamp &&
              newTweetData.orginalTweetTimeStamp !== null
            ) {
              oldTweet.likes = newTweetData.likes;
              oldTweet.likedBy = tweet.likedBy;
              tweetObj.updateTweetDatabase(oldTweet, "Updating Likes");
            } else if (
              oldTweet.orginalTweetTimeStamp === newTweetData.timeStamp
            ) {
              oldTweet.likes = newTweetData.likes;
              oldTweet.likedBy = tweet.likedBy;
              tweetObj.updateTweetDatabase(oldTweet, "Updating Likes");
            } else if (
              oldTweet.orginalTweetTimeStamp ===
                newTweetData.orginalTweetTimeStamp &&
              newTweetData.orginalTweetTimeStamp !== null
            ) {
              oldTweet.likes = newTweetData.likes;
              oldTweet.likedBy = tweet.likedBy;
              tweetObj.updateTweetDatabase(oldTweet, "Updating Likes");
            }
          });
          tweetObj.updateTweetDatabase(tweet, "Updating Likes");
        } else if (
          tweet.timeStamp === newTweetData.timeStamp &&
          tweet.email !== loginDetails.email
        ) {
          newTweetData.likes -= 1;
          tweet.likes = newTweetData.likes;
          let unlikedBy = tweet.likedBy.indexOf(loginDetails.email);
          tweet.likedBy.splice(unlikedBy, 1);
          allTweets.filter((oldTweet) => {
            if (
              oldTweet.timeStamp === newTweetData.orginalTweetTimeStamp &&
              newTweetData.orginalTweetTimeStamp !== null
            ) {
              oldTweet.likes = tweet.likes;
              oldTweet.likedBy = tweet.likedBy;
              tweetObj.updateTweetDatabase(oldTweet, "Updating Likes");
            } else if (
              oldTweet.orginalTweetTimeStamp === newTweetData.timeStamp
            ) {
              oldTweet.likes = tweet.likes;
              oldTweet.likedBy = tweet.likedBy;
              tweetObj.updateTweetDatabase(oldTweet, "Updating Likes");
            } else if (
              oldTweet.orginalTweetTimeStamp ===
                newTweetData.orginalTweetTimeStamp &&
              newTweetData.orginalTweetTimeStamp !== null
            ) {
              oldTweet.likes = tweet.likes;
              oldTweet.likedBy = tweet.likedBy;
              tweetObj.updateTweetDatabase(oldTweet, "Replying to tweet");
            }
          });
          tweetObj.updateTweetDatabase(tweet, "Updating Likes");
        }
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
          allTweets.map((originalTweet) => {
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
    launchReplyScreen: (tweetData) => {
      setReplyingTo(true);
      setCurrentTweetReplyingToo(tweetData);
    },
    replyToTweetScreen: () => {
      const tweet = { ...currentTweetReplyingToo };
      if (!replyingTo || !tweet) {
        return <div>Loading...</div>;
      }
      const generateReplies = (repliedTweet) => {
        if (repliedTweet.replies) {
          let allTweets = [...tweets];
          return repliedTweet.replies.map((aReply) => {
            return allTweets.map((aTweet) => {
              if (aReply === aTweet.timeStamp) {
                return renderTweet(
                  aTweet,
                  tweetObj,
                  loginDetails,
                  allProfilesRef,
                  tweets
                );
              }
            });
          });
        }
      };

      return (
        <div className="EditProfileOuter">
          <div
            className="EditProfileInner"
            style={{ height: "80vh", width: "600px" }}
          >
            <div
              className="EditProfileCloseBtn"
              onClick={() => {
                setReplyingTo(false);
                setCurrentTweetReplyingToo(null);
              }}
              style={{ marginLeft: "550px" }}
            >
              X
            </div>
            <div style={{ borderBottom: "2px solid black" }}>
              {renderTweet(
                tweet,
                tweetObj,
                loginDetails,
                allProfilesRef,
                tweets,
                replyingTo
              )}
              <TweetBox
                tweetObj={tweetObj}
                currentTweetImg={currentTweetImg}
                setCurrentTweetImg={setCurrentTweetImg}
                setFile={setFile}
                setCurrentTweetText={setCurrentTweetText}
                currentTweetText={currentTweetText}
                replyingTo={tweet}
                class={"ReplyText"}
              ></TweetBox>
            </div>
            <div className="generatedReplies">{generateReplies(tweet)}</div>
          </div>
        </div>
      );
    },
    deleteTweet: (tweet) => {
      //add display following or not feature
      const allTweets = [...tweets];
      const allUsers = [...allProfilesRef];
      const reply = { ...currentTweetReplyingToo };
      allTweets.filter((tweetMatch) => {
        if (tweetMatch.timeStamp === tweet.timeStamp) {
          deleteDoc(doc(db, "userTweets", `${tweet.at} ${tweet.timeStamp}`));
          let tweetCount = loginDetails.tweets;
          tweetCount -= 1;
          setDoc(doc(db, "userProfiles", `${loginDetails.email}`), {
            ...loginDetails,
            tweets: tweetCount,
          });
          if (replyingTo) {
            const removeReply = reply.replies.indexOf(tweet.timeStamp);
            reply.replies.splice(removeReply, 1);
            //updates current tweet replies
            setDoc(
              doc(db, "userTweets", `${reply.at} ${reply.timeStamp}`),
              reply
            );
            allTweets.filter((tweetData) => {
              if (
                tweetData.timeStamp === reply.orginalTweetTimeStamp ||
                tweetData.orginalTweetTimeStamp === reply.timeStamp
              ) {
                //updates database tweet replies
                setDoc(
                  doc(
                    db,
                    "userTweets",
                    `${tweetData.at} ${tweetData.timeStamp}`
                  ),
                  {
                    replies: reply.replies,
                  },
                  { merge: true }
                );
              }
            });
          }
          //handles removing reply tweets from not the reply screen - incomplete
          if (tweetMatch.replyingTo && !replyingTo) {
            allTweets.filter((tweetData) => {
              if (tweetData.replies.includes(tweetMatch.timeStamp)) {
                const removeReply = tweetData.replies.indexOf(
                  tweetMatch.timeStamp
                );
                tweetData.replies.splice(removeReply, 1);
                //updates database tweet replies
                setDoc(
                  doc(
                    db,
                    "userTweets",
                    `${tweetData.at} ${tweetData.timeStamp}`
                  ),
                  {
                    replies: tweetData.replies,
                  },
                  { merge: true }
                );
              }
            });
          }

          //handles removing retweets
          allTweets.filter((removedTweet) => {
            if (tweetMatch.timeStamp === removedTweet.orginalTweetTimeStamp) {
              deleteDoc(
                doc(
                  db,
                  "userTweets",
                  `${removedTweet.at} ${removedTweet.timeStamp}`
                )
              );
              allUsers.map((user) => {
                if (user.email === removedTweet.retweetedByDisplay) {
                  setDoc(
                    doc(
                      db,
                      "userProfiles",
                      `${removedTweet.retweetedByDisplay}`
                    ),
                    {
                      tweets: (user.tweets -= 1),
                    },
                    { merge: true }
                  );
                }
              });
            }
          });
        }
      });
    },
    setTab: () => {
      setSelectedTab("Profile");
    },
    setProfileCondition: () => {
      setCondition("selfTweets");
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
          if (tweetData.retweetedByDisplay !== loginDetails.email)
            return renderTweet(
              tweetData,
              tweetObj,
              loginDetails,
              allProfilesRef,
              tweets
            );
        })}
      </div>
    );
  };

  return (
    <div id="HomePage">
      <div id="HomePageTweetsLS">
        <div id="HomePageHomeHeaderText">Home</div>
        <div id="HomePageTweetBoxAndTweetsContainer" className="scrollbar">
          <TweetBox
            tweetObj={tweetObj}
            currentTweetImg={currentTweetImg}
            setCurrentTweetImg={setCurrentTweetImg}
            setFile={setFile}
            setCurrentTweetText={setCurrentTweetText}
            currentTweetText={currentTweetText}
            replyingTo={null}
            class={""}
          ></TweetBox>
          <div>{TweetsDisplay()}</div>
        </div>
        <div>{replyingTo && tweetObj.replyToTweetScreen()}</div>
      </div>
    </div>
  );
};

export default HomePage;
