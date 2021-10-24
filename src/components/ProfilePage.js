import "../components/ProfilePage.css";
import eggBg from "./images/eggProfilePic.png";
import twitterBird from "./images/twitterBirdYelling.jpeg";
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
import { Link, useLocation } from "react-router-dom";
import { ProfilePageTweets } from "./Profile Components/ProfilePageComponents";
import { FollowingFollowerDisplay, loadingScreen } from "./HelperComponents";

const ProfilePage = () => {
  const { loginDetails, setLoginDetails, tweets, condition, setCondition } =
    useContext(twitterContext);
  const location = useLocation();
  const { accountEmail } = location.state || loginDetails.email;
  const [profileImage, setProfileImage] = useState(null);
  const [profileBgHeader, setProfileBgHeader] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [newProfile, setNewProfile] = useState({ ...loginDetails });
  const [displayFollowScreen, setDisplayFollowScreen] = useState(false);
  const [displayFollowTabs, setDisplayFollowTabs] = useState(true);
  const [displayedProfile, setDisplayedProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [updatingProfile, setUpdatingProfile] = useState(false);

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

    const followTabSelector = (condition) => {
      if (displayFollowTabs === condition) {
        return "bold";
      } else {
        return "initial";
      }
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
            <div
              onClick={() => {
                setDisplayFollowTabs(true);
              }}
              className="FollowScreenTabOptions"
              style={{ fontWeight: followTabSelector(true) }}
            >
              Following
            </div>
            <div
              onClick={() => {
                setDisplayFollowTabs(false);
              }}
              className="FollowScreenTabOptions"
              style={{ fontWeight: followTabSelector(false) }}
            >
              Followers
            </div>
          </div>
          <div className="ShowFollowersOrFollowing">
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
    setUpdatingProfile(true);
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
    setUpdatingProfile(false);
  };

  const editProfileScreen = () => {
    return (
      <div className="EditProfileOuter">
        <div className="EditProfileInner">
          <div
            className="EditProfileCloseBtn"
            onClick={() => {
              setProfileEdit(false);
            }}
          >
            X
          </div>
          <form
            onSubmit={(e) => {
              submitEdits(e);
              setNewProfile({ ...newProfile });
            }}
            className="EditProfileForm"
          >
            <div className="EditProfileTitle">Edit Profile</div>
            <div className="EditProfileArea">
              <div className="EditProfileSubHeading">Display Name </div>
              <input
                maxLength={20}
                minLength={1}
                required
                className="EditInputName"
                placeholder={loginDetails.userName}
                onChange={(e) => {
                  setNewProfile({ ...newProfile, userName: e.target.value });
                }}
                value={newProfile.userName}
              ></input>
            </div>
            <div className="EditProfileArea">
              <div className="EditProfileSubHeading">Bio</div>
              <textarea
                placeholder={loginDetails.bio}
                maxLength={100}
                required
                onChange={(e) => {
                  setNewProfile({ ...newProfile, bio: e.target.value });
                }}
                value={newProfile.bio}
                className="EditInputBio"
              ></textarea>
            </div>
            <div className="EditProfileImagesArea">
              <div className="EditProfileSubHeading">Profile picture</div>
              <input
                type="file"
                onChange={(e) => {
                  viewProfileImage(e);
                }}
                className="EditProfileImageSelectorBtn"
              ></input>
              {profileImage && (
                <img
                  src={profileImage.preview}
                  className="profileImagePreview"
                ></img>
              )}
              {!profileImage && (
                <img
                  src={loginDetails.profilePicture}
                  className="profileImagePreview"
                ></img>
              )}
            </div>
            <div
              className="EditProfileImagesArea"
              style={{ marginTop: "20px" }}
            >
              <div className="EditProfileSubHeading">
                Profile Background Image
              </div>
              <input
                type="file"
                onChange={(e) => {
                  viewProfileBackground(e);
                }}
                className="EditProfileImageSelectorBtn"
                style={{ width: "150px" }}
              ></input>
              {profileBgHeader && (
                <img
                  src={profileBgHeader.preview}
                  className="profileBgPreview"
                ></img>
              )}
              {!profileBgHeader && (
                <img
                  src={loginDetails.profileBgHeader || eggBg}
                  className="profileBgPreview"
                ></img>
              )}
            </div>
            <button type="submit" className="EditProfileChangeBtn">
              Change
            </button>
          </form>
        </div>
      </div>
    );
  };

  const tweetTabSelector = (tabId) => {
    if (tabId === condition) {
      return "bold";
    } else {
      return "initial";
    }
  };

  const plural = () => {
    if (displayedProfile.tweets === 1) {
      return "tweet";
    } else {
      return "tweets";
    }
  };

  return (
    <div id="ProfilePage">
      {profileEdit && editProfileScreen()}
      {displayFollowScreen && followScreen()}
      {updatingProfile && loadingScreen()}
      <div id="ProfilePageHeader">
        <img src={twitterBird} id="ProfileBackButton"></img>
        <div>
          <div className="ProfileNameDisplay">{displayedProfile.userName}</div>
          <div className="ProfileATDisplay">
            {displayedProfile.tweets} {plural()}
          </div>
        </div>
      </div>
      <div id="ProfilePageProfile">
        <img
          src={displayedProfile.profileBgHeader || eggBg}
          id="ProfileBgImage"
        ></img>
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
          <div className="ProfileNameDisplay">{displayedProfile.userName}</div>
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
            to={`/ProfilePage/${displayedProfile.email}/tweets`}
            className="ProfileNavElement"
          >
            <div
              onClick={() => {
                setCondition("selfTweets");
              }}
              style={{
                padding: "13px",
                fontWeight: tweetTabSelector("selfTweets"),
              }}
            >
              Tweets
            </div>
          </Link>
          <Link
            to={`/ProfilePage/${displayedProfile.email}/Replies`}
            className="ProfileNavElement"
          >
            <div
              onClick={() => {
                setCondition("reTweets");
              }}
              style={{
                padding: "13px",
                fontWeight: tweetTabSelector("reTweets"),
              }}
            >
              {" "}
              Tweets & Replies
            </div>
          </Link>
          <Link
            to={`/ProfilePage/${displayedProfile.email}/Media`}
            className="ProfileNavElement"
          >
            <div
              onClick={() => {
                setCondition("selfTweetsMedia");
              }}
              style={{
                padding: "13px",
                fontWeight: tweetTabSelector("selfTweetsMedia"),
              }}
            >
              Media
            </div>
          </Link>
          <Link
            to={`/ProfilePage/${displayedProfile.email}/Likes`}
            className="ProfileNavElement"
          >
            <div
              onClick={() => {
                setCondition("LikedTweets");
              }}
              style={{
                padding: "13px",
                fontWeight: tweetTabSelector("LikedTweets"),
              }}
            >
              Likes
            </div>
          </Link>
        </nav>
      </div>
      <div className="ProfileNavElementDisplay">
        <ProfilePageTweets
          displayedProfile={displayedProfile}
          condition={condition}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
