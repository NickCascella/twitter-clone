import "../components/ProfilePage.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfileBg from "../components/images/eggProfilePic.png";
import {
  ProfilePageTweets,
  ProfilePageReplies,
  ProfilePageMedia,
  ProfilePageLikes,
} from "./Profile Components/ProfilePageComponents";
const ProfilePage = () => {
  return (
    <div id="ProfilePage">
      <Router>
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
