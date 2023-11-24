import { BrowserRouter, Route, Switch } from "react-router-dom";
import Footer from "./Share/Footer/Footer";
import Header from "./Share/Header/Header";
import Home from "./Home/Home";
import Detail from "./Detail/Detail";
import Cart from "./Cart/Cart";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import Checkout from "./Checkout/Checkout";
import History from "./History/History";
import DetailHistory from "./History/Component/DetailHistory";
import Shop from "./Shop/Shop";
import Chat from "./Share/Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import UserAPI from "./API/UserAPI";
import { useEffect } from "react";
import { addSession, deleteSession } from "./Redux/Action/ActionSession";
import { addUser } from "./Redux/Action/ActionCart";
import ErrorPage from "./ErrorPage/Error";

import "./App.css";
import "./css/custom.css";
import "./css/style.default.css";
function App() {
  const dispatch = useDispatch();

  // Get IdUser từ redux khi user đã đăng nhập
  const userId = useSelector((state) => state.Session.userId);
  // const fullname = useSelector((state) => state.Session.fullname);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await UserAPI.getAllData();
        // console.log("autologin:----", response);
        const addUserSection = addSession({
          userId: response.user.userId,
          email: response.user.email,
          fullname: response.user.fullname,
          roomId: response.user.roomId,
        });

        const addUserCart = addUser({
          userId: response.user.userId,
          listCart: response.user.cart,
        });

        dispatch(addUserSection);
        dispatch(addUserCart);
      } catch (error) {
        // console.log(error.response);
        dispatch(
          deleteSession({
            type: "DELETE_SESSION",
          })
        );
      }
    };

    if (!userId && localStorage.getItem("token")) {
      // console.log("token saved:---", localStorage.getItem("token"));
      autoLogin();
    }
  }, [userId]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />{" "}
          <Route exact path="/detail/:id" component={Detail} />{" "}
          <Route exact path="/cart" component={Cart} />{" "}
          <Route exact path="/signin" component={SignIn} />{" "}
          <Route exact path="/signup" component={SignUp} />{" "}
          <Route exact path="/checkout" component={Checkout} />{" "}
          <Route exact path="/history" component={History} />{" "}
          <Route exact path="/history/:id" component={DetailHistory} />{" "}
          <Route exact path="/shop" component={Shop} />
          <Route exact path="*" component={ErrorPage} />
        </Switch>{" "}
      </BrowserRouter>

      <Chat />

      <Footer />
    </div>
  );
}

export default App;
