import "../components/ProfilePage.css";
import { twitterContext } from "./Contexts/Context";
import { useContext, useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { updateDoc, setDoc, doc, deleteDoc } from "@firebase/firestore";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ProfileBg from "../components/images/eggProfilePic.png";
import {
  ProfilePageTweets,
  ProfilePageReplies,
  ProfilePageMedia,
  ProfilePageLikes,
} from "./Profile Components/ProfilePageComponents";

const ProfilePage = () => {
  const { loginDetails, setLoginDetails } = useContext(twitterContext);
  const { tweets, setTweets } = useContext(twitterContext);
  const [profileImage, setProfileImage] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [newProfile, setNewProfile] = useState({ ...loginDetails });

  useEffect(() => {
    console.log(loginDetails);
  }, [loginDetails]);

  const viewProfileImage = (e) => {
    console.log(e.target.files[0]);
    let pickedFile = e.target.files[0];
    setProfileImage({
      preview: URL.createObjectURL(pickedFile),
      raw: pickedFile,
    });
    e.target.value = "";
  };

  const submitEdits = async (e) => {
    e.preventDefault();
    if (profileImage !== null) {
      storage.ref(`/images/${profileImage.raw.name}`).put(profileImage.raw);
      let result = await storage
        .ref("images")
        .child(profileImage.raw.name)
        .getDownloadURL();
      setNewProfile({ ...newProfile, profilePicture: result });
      postEdits(result);
      console.log("Hi");
    } else {
      postEdits(null);
    }
  };

  const postEdits = (newProfileImage) => {
    let newDetails = { ...newProfile };
    let tweetArray = [...tweets];
    console.log(newProfileImage);
    tweetArray.forEach((tweet) => {
      if (tweet.email === loginDetails.email) {
        deleteDoc(
          doc(db, "userTweets", `${tweet.userName} ${tweet.timeStamp}`)
        );
        if (newProfileImage !== null) {
          setDoc(
            doc(db, "userTweets", `${newDetails.userName} ${tweet.timeStamp}`),
            {
              ...tweet,
              userName: newDetails.userName,
              profilePic: newProfileImage,
            }
          );
        } else {
          setDoc(
            doc(db, "userTweets", `${newDetails.userName} ${tweet.timeStamp}`),
            {
              ...tweet,
              userName: newDetails.userName,
            }
          );
        }
      }
    });
    console.log(newProfileImage);
    setProfileImage(null);
    setLoginDetails({ ...newProfile, profilePicture: newProfileImage });
    setDoc(doc(db, "userProfiles", `${loginDetails.email}`), newProfile);
  };

  const editProfileScreen = () => {
    return (
      <div id="EditProfileOuter">
        <div id="EditProfileInner">
          <div
            id="EditProfileCloseBtn"
            onClick={() => {
              setProfileEdit(false);
            }}
          >
            X
          </div>
          <form
            onSubmit={(e) => {
              submitEdits(e);
            }}
          >
            <div className="EditProfileArea">
              <div>Display Name: </div>
              <input
                placeholder={loginDetails.userName}
                onChange={(e) => {
                  setNewProfile({ ...newProfile, userName: e.target.value });
                }}
                value={newProfile.userName}
              ></input>
            </div>
            <div className="EditProfileArea">
              <div>Bio:</div>
              <input
                onChange={(e) => {
                  setNewProfile({ ...newProfile, bio: e.target.value });
                }}
              ></input>
            </div>
            <div className="EditProfileArea">
              <div>Profile picture: </div>
              <input
                type="file"
                onChange={(e) => {
                  viewProfileImage(e);
                }}
              ></input>
              {profileImage && (
                <img
                  src={profileImage.preview}
                  className="profileImagePreview"
                ></img>
              )}
            </div>
            <div className="EditProfileArea">
              <div>Profile Background Image: </div>
              <input type="file"></input>
            </div>
            <button type="submit">Change</button>
          </form>
        </div>
      </div>
    );
  };

  // if (profileEdit) {
  //   return <EditProfileScreen></EditProfileScreen>;
  // }

  return (
    <div id="ProfilePage">
      {profileEdit && editProfileScreen()}
      <Router>
        <div id="ProfilePageHeader">
          <Link to="/" className="ProfileBackButtonLink">
            <button id="ProfileBackButton"></button>
          </Link>
          <div>
            <div className="ProfileNameDisplay">{loginDetails.userName}</div>
            <div className="ProfileATDisplay">0 Tweets</div>
          </div>
        </div>
        <div id="ProfilePageProfile">
          <img src={ProfileBg} id="ProfileBgImage"></img>
          <div id="ProfileUserImgEdit">
            <img id="ProfileUserImage" src={loginDetails.profilePicture}></img>
            <button
              id="ProfileEdit"
              onClick={() => {
                setProfileEdit(true);
              }}
            >
              Edit Profile
            </button>
          </div>
          <div>
            <div className="ProfileNameDisplay">{loginDetails.userName}</div>
            <div className="ProfileATDisplay">@{loginDetails.at}</div>
          </div>
          <div className="ProfileBioDisplay">{loginDetails.bio}</div>
          <div className="ProfileATDisplay" style={{ marginTop: "10px" }}>
            Joined this date
          </div>
          <div id="ProfileFollowersDiv">
            <div className="ProfileFollowing">
              <b>35</b> Following
            </div>
            <div className="ProfileFollowing">
              <b>25</b> Followers
            </div>
          </div>

          <nav id="ProfileNav">
            <Link to="/ProfilePage" className="ProfileNavElement">
              <div>Tweets</div>
            </Link>
            <Link to="/ProfilePage/Replies" className="ProfileNavElement">
              <div> Tweets & Replies</div>
            </Link>
            <Link to="/ProfilePage/Media" className="ProfileNavElement">
              <div>Media</div>
            </Link>
            <Link to="/ProfilePage/Likes" className="ProfileNavElement">
              <div>Likes</div>
            </Link>
          </nav>
        </div>
        <div className="ProfileNavElementDisplay">
          <Switch>
            <Route exact path="/ProfilePage" component={ProfilePageTweets} />
            <Route path="/ProfilePage/Replies" component={ProfilePageReplies} />
            <Route path="/ProfilePage/Media" component={ProfilePageMedia} />
            <Route path="/ProfilePage/Likes" component={ProfilePageLikes} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default ProfilePage;
