import "../components/HomePage.css";

const HomePage = () => {
  const tweetObj = {
    tweet: (e) => {
      e.preventDefault();
    },
  };

  return (
    <div id="HomePage">
      <div id="HomePageTweetsLS">
        <div id="HomePageHomeHeader">
          <div id="HomePageHomeHeaderText">Home</div>
        </div>
        <div id="HomePageTweetingDiv">
          <div className="HomePageTweetProfilePicture"></div>
          <div>
            <form
              onSubmit={(e) => {
                tweetObj.tweet(e);
              }}
              className="HomePageTweetDivInputContainer"
            >
              <textarea
                className="HomePageTweetInput"
                placeholder="What is happening?"
              ></textarea>
              <button type="submit" className="HomePageTweetButton">
                Tweet
              </button>
            </form>
          </div>
        </div>
        <div className="HomePageTweetsDisplay">
          <div className="IndividualTweetFormatMain">
            <div className="HomePageTweetProfilePicture"></div>
            <div className="IndividualTweetFormatRS">
              <div className="IndividualTweetFormatUserInfo">
                <div className="IndvidualTweetFormatUserText">
                  <b>UserName</b>
                </div>
                <div className="IndvidualTweetFormatUserText">@sososo</div>
                <div className="IndvidualTweetFormatUserText">Date</div>
              </div>
              <div className="IndividualTweetFormatTweet">Hello</div>
            </div>
          </div>
        </div>
      </div>
      <div id="HomePageWhatIsHappeningRS">
        <div>What is happening</div>
      </div>
    </div>
  );
};

export default HomePage;
