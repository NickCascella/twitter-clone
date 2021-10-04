import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { twitterContext } from "./components/Contexts/Context";
import SignInPage from "./components/SignInPage";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import { useState } from "react";
import eggAvatar from "./components/images/eggProfilePic.png";

function App() {
  const [allProfilesRef, setAllProfilesRef] = useState([]);
  const [allTweetsRef, setAllTweetsRef] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loginDetails, setLoginDetails] = useState();
  const [tweetFunction, setTweetFunction] = useState();
  const [tweets, setTweets] = useState([]);
  const [replyingTo, setReplyingTo] = useState(false);

  if (!signedIn || !loginDetails) {
    return (
      <twitterContext.Provider
        value={{
          loginDetails,
          setLoginDetails,
          setAllProfilesRef,
          setAllTweetsRef,
        }}
      >
        <SignInPage
          setSignedIn={setSignedIn}
          setTweets={setTweets}
        ></SignInPage>
        ;
      </twitterContext.Provider>
    );
  }

  return (
    <Router>
      <div className="App">
        <twitterContext.Provider
          value={{
            allProfilesRef,
            loginDetails,
            setLoginDetails,
            tweets,
            setTweets,
            tweetFunction,
            setTweetFunction,
            setSignedIn,
            replyingTo,
            setReplyingTo,
            allTweetsRef,
          }}
        >
          <Nav></Nav>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/ProfilePage" component={ProfilePage} />
          </Switch>
        </twitterContext.Provider>
      </div>
    </Router>
  );
}

export default App;
