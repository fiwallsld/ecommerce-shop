import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Detail from "./Detail/Detail";
import Cart from "./Cart/Cart";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import Checkout from "./Checkout/Checkout";
import History from "./History/History";
import DetailHistory from "./History/DetailHistory";
import Shop from "./Shop/Shop";
import Layout from "./Share/Layout/Layout";
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
        localStorage.setItem("token", response.user.token);

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

    if (!userId) {
      // console.log("token saved:---", localStorage.getItem("token"));
      autoLogin();
    }
  }, [userId]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/ecommerce" element={<Home />} />
            <Route exact path="/detail/:id" element={<Detail />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/checkout" element={<Checkout />} />
            <Route exact path="/history" element={<History />} />
            <Route exact path="/history/:id" element={<DetailHistory />} />
            <Route exact path="/shop" element={<Shop />} />
            <Route exact path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
