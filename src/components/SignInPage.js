import "../components/SignInPage.css";
import { useContext, useEffect } from "react";
import { twitterContext } from "./Contexts/Context";
import twitterSignInPage from "./images/twitterWallpaperBg.jpg";
import googleG from "./images/googleG.JPG";
import firebase from "../firebase";
import { formatDate } from "./HelperFunctions";
import { db } from "../firebase";
import { onSnapshot, collection, doc, setDoc } from "@firebase/firestore";

const SignInPage = (props) => {
  const setSignedIn = props.setSignedIn;
  const setTweets = props.setTweets;
  const { loginDetails, setLoginDetails, setAllProfilesRef } =
    useContext(twitterContext);

  useEffect(() => {
    onSnapshot(collection(db, "userTweets"), (snapshot) => {
      const tweetsCollection = snapshot.docs.map((doc) => doc.data());
      setTweets(tweetsCollection);
    });
  }, [loginDetails]);

  const signIn = async () => {
    let googleProvider = new firebase.auth.GoogleAuthProvider();
    let profileInfo = await firebase.auth().signInWithPopup(googleProvider);
    let specificProfileInfo = profileInfo.additionalUserInfo.profile;
    if (profileInfo.additionalUserInfo.isNewUser) {
      let newUser = {
        firstName: specificProfileInfo.given_name,
        lastName: specificProfileInfo.family_name,
        userName: `${specificProfileInfo.given_name} ${specificProfileInfo.family_name}`,
        at: `${specificProfileInfo.family_name}${specificProfileInfo.given_name}`,
        email: specificProfileInfo.email,
        profilePicture: specificProfileInfo.picture,
        tweets: 0,
        followingUsers: [],
        followerUsers: [],
        bio: "Your bio here.",
        profileBgHeader: null,
        id: specificProfileInfo.id,
        dateCreated: formatDate("DateCreated"),
      };
      setLoginDetails(newUser);
      setDoc(doc(db, "userProfiles", `${specificProfileInfo.email}`), newUser);

      setSignedIn(true);
    } else {
      onSnapshot(collection(db, "userProfiles"), (snapshot) => {
        const userProfiles = snapshot.docs.map((doc) => doc.data());
        setAllProfilesRef(userProfiles);

        userProfiles.filter((result) => {
          if (result.email === specificProfileInfo.email) {
            setLoginDetails(result);
            setSignedIn(true);
          }
        });
      });
    }
  };

  return (
    <div
      id="signInPage"
      style={{ backgroundImage: `url(${twitterSignInPage})` }}
    >
      <div id="signInPageText">
        <div>
          <b>The platform you didn't ask for.</b>
        </div>
        <div>
          <b>Join now.</b>
        </div>
        <button id="signInBtn" onClick={signIn}>
          <img id="signInBtnPhoto" src={googleG}></img>Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
