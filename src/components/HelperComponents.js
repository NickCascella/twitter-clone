import "../components/HomePage.css";

const TweetBox = (props) => {
  const tweetObj = props.tweetObj;
  const loginDetails = props.loginDetails;
  const currentTweetImg = props.currentTweetImg;
  const setCurrentTweetImg = props.setCurrentTweetImg;
  const setFile = props.setFile;
  const setCurrentTweetText = props.setCurrentTweetText;
  const currentTweetText = props.currentTweetText;

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
          {/* {tweetBox()} */}
          <div className="HomePageTweetInputBts">
            <label className="HomePageTweetButton" style={{ width: "100px" }}>
              {" "}
              Upload Files
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

export { TweetBox };
