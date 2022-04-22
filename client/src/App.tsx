import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import useMobileVH from "./hooks/useMobileVH";
import GameRoute from "./routes/GameRoute";
import IndexRoute from "./routes/IndexRoute";

function App(): JSX.Element {
  useMobileVH();

  return (
    <Router>
      {/* <ToastContainer autoClose={3000} draggablePercent={30} /> */}
      <main
        className="background"
        style={{
          backgroundImage: "url('/assets/cards.jpg')",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="active-area">
          <Switch>
            <Route exact path="/game/:gameId" component={GameRoute} />
            <Route path="/" component={IndexRoute} />
          </Switch>
        </div>
      </main>
    </Router>
  );
}

export default App;
