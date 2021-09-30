import "../components/HelperFunctions.css";
import "../components/HomePage.css";
import { doc, deleteDoc } from "@firebase/firestore";
import { db } from "../firebase";

const formatDate = (format) => {
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
  if (format === "Standard") {
    return `${weekday} ${month} ${date.getDate()}`;
  } else {
    return `Joined ${month} ${date.getFullYear()}`;
  }
};

const sortTweets = (array) => {
  return array.sort((a, b) => {
    return b.timeStamp - a.timeStamp;
  });
};

const deleteTweet = (tweet, allTweets) => {
  allTweets.filter((tweetMatch) => {
    if (tweetMatch.timeStamp === tweet.timeStamp) {
      deleteDoc(doc(db, "userTweets", `${tweet.at} ${tweet.timeStamp}`));
    }
  });
};

const tweetBoxxx = () => {
  return (
    <body id="tweetBoxBody">
      <div className="wrapper">
        <div className="input-box">
          <div className="tweet-area">
            <span className="placeholder">What's happening?</span>
            <div
              className="input editable"
              contentEditable="true"
              spellCheck="false"
            ></div>
            <div
              className="input readonly"
              contentEditable="true"
              spellCheck="false"
            ></div>
            <div className="privacy">
              <span>Everyone can reply</span>
            </div>
          </div>
        </div>
        <div className="bottom">
          <ul className="icons">
            <li>
              <i className="captureImage"></i>
            </li>
            <li>
              <i className="addImage"></i>
            </li>
            <li>
              <i className="mapMarker"></i>
            </li>
            <li>
              <i className="grin"></i>
            </li>
            <li>
              <i className="userProfile"></i>
            </li>
          </ul>
          <div className="content">
            <span className="counter">100</span>
            <button>Tweet</button>
          </div>
        </div>
      </div>
    </body>
  );
};

export { formatDate, sortTweets, deleteTweet };
