import "../components/ProfilePage.css";
import { twitterContext } from "./Contexts/Context";
import { useContext, useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  collection,
} from "@firebase/firestore";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  ProfilePageTweets,
  ProfilePageReplies,
  ProfilePageMedia,
  ProfilePageLikes,
} from "./Profile Components/ProfilePageComponents";
import { FollowingFollowerDisplay } from "./HelperComponents";

const ProfilePage = () => {
  const { loginDetails, setLoginDetails } = useContext(twitterContext);
  const location = useLocation();
  const { accountEmail } = location.state || loginDetails.email;
  const { tweets } = useContext(twitterContext);
  const [profileImage, setProfileImage] = useState(null);
  const [profileBgHeader, setProfileBgHeader] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [newProfile, setNewProfile] = useState({ ...loginDetails });
  const [displayFollowScreen, setDisplayFollowScreen] = useState(false);
  const [displayFollowTabs, setDisplayFollowTabs] = useState(true);
  const [displayedProfile, setDisplayedProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "userProfiles"), (snapshot) => {
      const userProfiles = snapshot.docs.map((doc) => doc.data());
      setAllProfiles(userProfiles);
      userProfiles.filter((result) => {
        if (result.email === accountEmail) {
          setDisplayedProfile(result);
        }
      });
    });
  }, [accountEmail]);

  if (!displayedProfile) {
    return <div>Loading...</div>;
  }

  //Follow/Unfollow functionallity
  const followAccount = (displayedProfile) => {
    let displayedProfileCopy = { ...displayedProfile };
    let loginDetailsCopy = { ...loginDetails };
    if (displayedProfile.followerUsers.includes(loginDetails.email)) {
      const indexOfFollower = displayedProfileCopy.followerUsers.indexOf(
        loginDetailsCopy.email
      );
      displayedProfileCopy.followerUsers.splice(indexOfFollower, 1);
      const indexOfFollowed = loginDetailsCopy.followingUsers.indexOf(
        displayedProfileCopy.email
      );
      loginDetailsCopy.followingUsers.splice(indexOfFollowed, 1);
    } else if (!displayedProfile.followerUsers.includes(loginDetails.email)) {
      displayedProfileCopy.followerUsers.push(loginDetailsCopy.email);
      loginDetailsCopy.followingUsers.push(displayedProfileCopy.email);
    }
    setDoc(doc(db, "userProfiles", displayedProfile.email), {
      ...displayedProfile,
      followerUsers: displayedProfileCopy.followerUsers,
    });
    setDoc(doc(db, "userProfiles", loginDetails.email), {
      ...loginDetails,
      followingUsers: loginDetailsCopy.followingUsers,
    });
  };

  const followButton = (displayedProfile) => {
    return displayedProfile.followerUsers.includes(loginDetails.email) ? (
      <div>Unfollow</div>
    ) : (
      <div>Follow</div>
    );
  };

  const followScreen = () => {
    const displayedProfileCopy = { ...displayedProfile };
    const displayFollowingOrFollowers = () => {
      return displayFollowTabs
        ? displayedProfileCopy.followingUsers
        : displayedProfileCopy.followerUsers;
    };

    return (
      <div className="EditProfileOuter">
        <div className="EditProfileInner">
          <div
            className="EditProfileCloseBtn"
            onClick={() => {
              setDisplayFollowTabs(true);
              setDisplayFollowScreen(false);
            }}
          >
            X
          </div>
          <div id="FollowScreenTabs">
            <div>
              <div
                onClick={() => {
                  setDisplayFollowTabs(true);
                }}
              >
                Following
              </div>
            </div>
            <div
              onClick={() => {
                setDisplayFollowTabs(false);
              }}
            >
              Followers
            </div>
          </div>
          <div>
            <FollowingFollowerDisplay
              loginDetails={loginDetails}
              displayFollowTabs={displayFollowTabs}
              followingOrFollowedUsers={displayFollowingOrFollowers()}
              allProfiles={allProfiles}
              followAccount={followAccount}
              followButton={followButton}
              setDisplayFollowScreen={setDisplayFollowScreen}
            ></FollowingFollowerDisplay>
          </div>
        </div>
      </div>
    );
  };

  //All editing functionality for button
  const viewProfileImage = (e) => {
    let pickedFile = e.target.files[0];
    setProfileImage({
      preview: URL.createObjectURL(pickedFile),
      raw: pickedFile,
    });
    e.target.value = "";
  };

  const viewProfileBackground = (e) => {
    let pickedFile = e.target.files[0];
    setProfileBgHeader({
      preview: URL.createObjectURL(pickedFile),
      raw: pickedFile,
    });
    e.target.value = "";
  };

  const getProfileImageUrl = async () => {
    if (profileImage !== null) {
      const profileImageName = profileImage.raw.name;
      const profileImageData = profileImage.raw;
      await storage.ref(`/images/${profileImageName}`).put(profileImageData);
      let profileImageURL = await storage
        .ref("images")
        .child(profileImageName)
        .getDownloadURL();
      return profileImageURL;
    } else {
      return loginDetails.profilePicture;
    }
  };

  const getProfileBgImageUrl = async () => {
    if (profileBgHeader !== null) {
      const profileBgImageName = profileBgHeader.raw.name;
      const profileBgImageData = profileBgHeader.raw;
      await storage
        .ref(`/images/${profileBgImageName}`)
        .put(profileBgImageData);
      let profileBgImageURL = await storage
        .ref("images")
        .child(profileBgImageName)
        .getDownloadURL();
      return profileBgImageURL;
    } else {
      return loginDetails.profileBgHeader;
    }
  };

  const submitEdits = async (e) => {
    e.preventDefault();
    const returnedProfileImage = await getProfileImageUrl();
    const returnedProfileBgImage = await getProfileBgImageUrl();
    setProfileImage(null);
    setProfileBgHeader(null);
    postEdits(returnedProfileImage, returnedProfileBgImage);
  };

  const postEdits = (newProfileImage, newProfileBgImage) => {
    let newProfileCopy = { ...newProfile };
    let tweetArray = [...tweets];
    tweetArray.forEach((tweet) => {
      if (tweet.email === loginDetails.email) {
        deleteDoc(doc(db, "userTweets", `${tweet.at} ${tweet.timeStamp}`));
        if (newProfileImage !== null) {
          setDoc(
            doc(db, "userTweets", `${newProfileCopy.at} ${tweet.timeStamp}`),
            {
              ...tweet,
              userName: newProfileCopy.userName,
              profilePic: newProfileImage,
            }
          );
        } else {
          setDoc(
            doc(db, "userTweets", `${newProfileCopy.at} ${tweet.timeStamp}`),
            {
              ...tweet,
              userName: newProfileCopy.userName,
            }
          );
        }
      }
    });
    setLoginDetails({
      ...newProfile,
      profilePicture: newProfileImage,
      profileBgHeader: newProfileBgImage,
    });
    setDoc(doc(db, "userProfiles", `${loginDetails.email}`), {
      ...newProfile,
      profilePicture: newProfileImage,
      profileBgHeader: newProfileBgImage,
    });
  };

  const editProfileScreen = () => {
    return (
      <div className="EditProfileOuter">
        <div className="EditProfileInner">
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
                maxLength={20}
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
                maxLength={50}
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
              <input
                type="file"
                onChange={(e) => {
                  viewProfileBackground(e);
                }}
              ></input>
              {profileBgHeader && (
                <img
                  src={profileBgHeader.preview}
                  className="profileImagePreview"
                ></img>
              )}
            </div>
            <button type="submit">Change</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div id="ProfilePage">
      {profileEdit && editProfileScreen()}
      {displayFollowScreen && followScreen()}
      <Router>
        <div id="ProfilePageHeader">
          <Link to="/" className="ProfileBackButtonLink">
            <button id="ProfileBackButton"></button>
          </Link>
          <div>
            <div className="ProfileNameDisplay">
              {displayedProfile.userName}
            </div>
            <div className="ProfileATDisplay">
              {displayedProfile.tweets} Tweets
            </div>
          </div>
        </div>
        <div id="ProfilePageProfile">
          <img src={displayedProfile.profileBgHeader} id="ProfileBgImage"></img>
          <div id="ProfileUserImgEdit">
            <img
              id="ProfileUserImage"
              src={displayedProfile.profilePicture}
            ></img>
            {loginDetails.email === displayedProfile.email && (
              <button
                id="ProfileEdit"
                onClick={() => {
                  setProfileEdit(true);
                }}
              >
                Edit Profile
              </button>
            )}
            {loginDetails.email !== displayedProfile.email && (
              <button
                id="ProfileEdit"
                onClick={() => {
                  followAccount(displayedProfile);
                }}
              >
                {followButton(displayedProfile)}
              </button>
            )}
          </div>
          <div>
            <div className="ProfileNameDisplay">
              {displayedProfile.userName}
            </div>
            <div className="ProfileATDisplay">@{displayedProfile.at}</div>
          </div>
          <div className="ProfileBioDisplay">{displayedProfile.bio}</div>
          <div className="ProfileATDisplay" style={{ marginTop: "10px" }}>
            {displayedProfile.dateCreated}
          </div>
          <div id="ProfileFollowersDiv">
            <div
              className="ProfileFollowing"
              onClick={() => {
                setDisplayFollowScreen(true);
              }}
            >
              <b>{displayedProfile.followingUsers.length}</b> Following
            </div>
            <div
              className="ProfileFollowing"
              onClick={() => {
                setDisplayFollowScreen(true);
                setDisplayFollowTabs(false);
              }}
            >
              <b>{displayedProfile.followerUsers.length}</b> Followers
            </div>
          </div>

          <nav id="ProfileNav">
            <Link
              to={`/ProfilePage/${displayedProfile.email}`}
              className="ProfileNavElement"
            >
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
            <Route
              exact
              path={`/ProfilePage/${displayedProfile.email}`}
              render={(props) => {
                return (
                  <ProfilePageTweets
                    {...props}
                    displayedProfile={displayedProfile}
                  />
                );
              }}
            />
            <Route
              path="/ProfilePage/Replies"
              render={(props) => {
                return (
                  <ProfilePageReplies
                    {...props}
                    displayedProfile={displayedProfile}
                  />
                );
              }}
            />
            <Route
              path="/ProfilePage/Media"
              render={(props) => {
                return (
                  <ProfilePageMedia
                    {...props}
                    displayedProfile={displayedProfile}
                  />
                );
              }}
            />
            <Route
              path="/ProfilePage/Likes"
              render={(props) => {
                return (
                  <ProfilePageLikes
                    {...props}
                    displayedProfile={displayedProfile}
                  />
                );
              }}
            />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default ProfilePage;
