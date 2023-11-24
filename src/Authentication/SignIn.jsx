import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { addSession } from "../Redux/Action/ActionSession";
import { addUser } from "../Redux/Action/ActionCart";
import "./Auth.css";
import queryString from "query-string";
import CartAPI from "../API/CartAPI";
import alertify from "alertifyjs";

function SignIn(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorRes, setErrorRes] = useState(null);

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = () => {
    const fetchSignIn = async () => {
      try {
        const params = {
          email: email,
          password: password,
        };
        const query = "?" + queryString.stringify(params);
        const response = await UserAPI.postLogin(query);

        // console.log("Login by username, password:--", response);
        setErrorRes(null);
        localStorage.setItem("token", response.user.token);

        const addUserSection = addSession({
          userId: response.user.userId,
          email: response.user.email,
          fullname: response.user.fullname,
          token: response.user.token,
          roomId: response.user.roomId,
        });

        const addUserCart = addUser({
          userId: response.user.userId,
          listCart: response.user.cart,
        });

        dispatch(addUserSection);
        dispatch(addUserCart);

        alertify.set("notifier", "position", "top-center");
        alertify.success(response.message);
        setRedirect(true);
      } catch (error) {
        // console.log(error.response?.data);
        setErrorRes(error.response?.data);
      }
    };

    fetchSignIn();
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign In</span>

          <div className="wrap-input100 validate-input">
            <input
              className="input100"
              type="text"
              placeholder="Email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          {errorRes?.email && (
            <span className="text-danger">{errorRes.email}</span>
          )}

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          {errorRes?.password && (
            <span className="text-danger">{errorRes.password}</span>
          )}

          <div className="container-login100-form-btn m-t-20">
            {redirect && <Redirect to={`/`} />}
            <button className="login100-form-btn" onClick={onSubmit}>
              Sign in
            </button>
          </div>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Create an account?</span>
            &nbsp;
            <Link to="/signup" className="txt2 hov1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
