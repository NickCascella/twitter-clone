import "../components/HomePage.css";
import { twitterContext } from "./Contexts/Context";
import { useContext, useEffect, useState, useRef } from "react";
import { doc, setDoc } from "@firebase/firestore";
import { db, storage } from "../firebase";

const HomePage = () => {
  const { loginDetails, setLoginDetails } = useContext(twitterContext);
  const { tweets, setTweets } = useContext(twitterContext);
  const [currentTweetText, setCurrentTweetText] = useState("");
  const [currentTweetImg, setCurrentTweetImg] = useState(null);
  const [file, setFile] = useState(null);

  const randomNum = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const tweetObj = {
    tweet: (result) => {
      const tweet = currentTweetText;
      const tweetInfo = {
        profilePic: loginDetails.profilePicture,
        userName: loginDetails.userName,
        at: loginDetails.at,
        date: tweetObj.formatDate(),
        tweet: tweet,
        tweetImg: result,
        email: loginDetails.email,
        timeStamp: Date.now(),
      };

      const newTweets = [...tweets];
      newTweets.push(tweetInfo);
      if (currentTweetText !== "" || currentTweetImg !== null) {
        setTweets(newTweets);
        setCurrentTweetImg(null);
        setCurrentTweetText("");
        tweetObj.updateTweetDatabase(tweetInfo);
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
    formatDate: () => {
      const date = new Date();
      let weekday = date.getDay();
      switch (weekday) {
        case 0:
          weekday = "Sun";
          break;
        case 1:
          weekday = "Mon";
          break;
        case 2:
          weekday = "Tue";
          break;
        case 3:
          weekday = "Wed";
          break;
        case 4:
          weekday = "Thur";
          break;
        case 5:
          weekday = "Fri";
          break;
        case 6:
          weekday = "Sat";
          break;
        default:
          weekday = "Cannot get date";
      }
      let month = date.getMonth();
      switch (month) {
        case 0:
          month = "Jan";
          break;
        case 1:
          month = "Feb";
          break;
        case 2:
          month = "Mar";
          break;
        case 3:
          month = "Apr";
          break;
        case 4:
          month = "May";
          break;
        case 5:
          month = "Jun";
          break;
        case 6:
          month = "Jul";
          break;
        case 7:
          month = "Aug";
          break;
        case 8:
          month = "Sep";
          break;
        case 9:
          month = "Oct";
          break;
        case 10:
          month = "Nov";
          break;
        case 11:
          month = "Dec";
          break;
        default:
          month = "N/A";
      }
      return `${weekday} ${month} ${date.getDate()}`;
    },
    updateTweetDatabase: (tweet) => {
      setDoc(
        doc(db, "userTweets", `${tweet.userName} ${tweet.timeStamp}`),
        tweet
      );
    },
  };

  const TweetsDisplay = () => {
    const timeOrderedTweets = [...tweets];
    const newTweets = timeOrderedTweets.sort((a, b) => {
      return b.timeStamp - a.timeStamp;
    });

    if (!newTweets) {
      return <div>Loading...</div>;
    }

    return (
      <div className="HomePageTweetsDisplay">
        {timeOrderedTweets.map((tweetData) => {
          return (
            <div className="IndividualTweetFormatMain">
              <img
                src={tweetData.profilePic}
                className="HomePageTweetProfilePicture"
              ></img>
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
        <div>What is happening</div>
      </div>
    </div>
  );
};

export default HomePage;
