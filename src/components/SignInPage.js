import "../components/SignInPage.css";
import { useContext, useEffect, useState } from "react";
import { twitterContext } from "./Contexts/Context";
import twitterSignInPage from "./images/twitterSignInBg.PNG";
import twitterBirdWhite from "./images/twitterBirdWhite.JPG";
import googleG from "./images/googleG.JPG";
import firebase from "../firebase";
import { getFirestore } from "../firebase";
import { onSnapshot, collection } from "@firebase/firestore";

const SignInPage = (props) => {
  const setSignedIn = props.setSignedIn;
  const setTweets = props.setTweets;
  const { loginDetails, setLoginDetails } = useContext(twitterContext);

  useEffect(() => {
    // onSnapshot(collection(db, "missingCharacters"), (snapshot) => {
    //   setTweets(snapshot.docs.map((doc) => doc.data()));
    // });
    onSnapshot(collection(getFirestore(), "userTweets"), (snapshot) => {
      const tweetsCollection = snapshot.docs.map((doc) => doc.data());
      console.log(tweetsCollection);
      setTweets(tweetsCollection);
    });
  }, [loginDetails]);

  const signIn = async () => {
    let googleProvider = new firebase.auth.GoogleAuthProvider();
    let profileInfo = await firebase.auth().signInWithPopup(googleProvider);
    let specificProfileInfo = profileInfo.additionalUserInfo.profile;
    console.log(profileInfo);
    setLoginDetails({
      firstName: specificProfileInfo.given_name,
      lastName: specificProfileInfo.family_name,
      email: specificProfileInfo.email,
      profilePicture: specificProfileInfo.picture,
      id: specificProfileInfo.id,
    });
    setSignedIn(true);
  };

  //set up default profile for inability to load

  return (
    <div id="signInPage">
      <img id="signInPageBg" src={twitterSignInPage}></img>
      {/* <img id="signInPageWTB" src={twitterBirdWhite}></img> */}
      <div id="signInPageRS">
        <div>Logo here</div>
        <h2>Happening Never</h2>
        <h5>Attempt to join this mess today.</h5>
        <button id="signInBtn" onClick={signIn}>
          <img id="signInBtnPhoto" src={googleG}></img>Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
