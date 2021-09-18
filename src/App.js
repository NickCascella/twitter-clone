import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";
import ExplorePage from "./components/ExplorePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav></Nav>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/ExplorePage" component={ExplorePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
