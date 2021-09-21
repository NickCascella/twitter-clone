import "../components/ProfilePage.css";
import { Link } from "react-router-dom";
import ProfileBg from "../components/images/eggProfilePic.png";

const ProfilePage = () => {
  return (
    <div id="ProfilePage">
      <div id="ProfilePageHeader">
        <Link to="/" className="ProfileBackButtonLink">
          <button id="ProfileBackButton"></button>
        </Link>
        <div>
          <div className="ProfileNameDisplay">Nick Cascella</div>
          <div className="ProfileATDisplay">0 Tweets</div>
        </div>
      </div>
      <div id="ProfilePageProfile">
        <img src={ProfileBg} id="ProfileBgImage"></img>
        <div id="ProfileUserImgEdit">
          <img id="ProfileUserImage"></img>
          <button id="ProfileEdit">Edit Profile</button>
        </div>
        <div>
          <div className="ProfileNameDisplay">Nick Cascella</div>
          <div className="ProfileATDisplay">@CascellaNick</div>
        </div>
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
      </div>
    </div>
  );
};

export default ProfilePage;
