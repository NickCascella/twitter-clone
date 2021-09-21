import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { twitterContext } from "./components/Contexts/Context";
import firebase from "./firebase";
import SignInPage from "./components/SignInPage";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import { useState } from "react";
import eggAvatar from "./components/images/eggProfilePic.png";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    email: "test@gmail.com",
    profilePicture: { eggAvatar },
    id: "102655259027678858283",
  });
  const [tweets, setTweets] = useState([]);

  if (!signedIn) {
    return (
      <twitterContext.Provider value={{ loginDetails, setLoginDetails }}>
        <SignInPage setSignedIn={setSignedIn}></SignInPage>;
      </twitterContext.Provider>
    );
  }

  return (
    <Router>
      <div className="App">
        <twitterContext.Provider
          value={{ loginDetails, setLoginDetails, tweets, setTweets }}
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
