import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import queryString from "query-string";
import alertify from "alertifyjs";
import "./Auth.css";

SignUp.propTypes = {};

function SignUp(props) {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [errorRes, setErrorRes] = useState(null);
  const navigate = useNavigate();

  const onChangeName = (e) => {
    setFullName(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handlerSignUp = (e) => {
    e.preventDefault();

    const fetchSignUp = async () => {
      try {
        const params = {
          fullname: fullname,
          email: email,
          password: password,
          phone: phone,
        };
        const query = "?" + queryString.stringify(params);
        await UserAPI.postSignUp(query);
        // console.log(response);
        alertify.set("notifier", "position", "top-center");
        alertify.success("Bạn Đã Đăng Ký Thành Công!");
        navigate("/signin");
      } catch (error) {
        // console.log(error.response?.data);
        setErrorRes(error.response?.data);
      }
    };

    fetchSignUp();
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-16">Sign Up</span>
          <div className="wrap-input100 validate-input">
            <input
              className="input100"
              value={fullname}
              onChange={onChangeName}
              type="text"
              placeholder="Full Name"
            />
          </div>
          {errorRes?.fullname && (
            <span className="text-danger">{errorRes.fullname}</span>
          )}
          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              value={email}
              onChange={onChangeEmail}
              type="text"
              placeholder="Email"
            />
          </div>

          {errorRes?.email && (
            <span className="text-danger">{errorRes.email}</span>
          )}

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              value={password}
              onChange={onChangePassword}
              type="password"
              placeholder="Password"
            />
          </div>

          {errorRes?.password && (
            <span className="text-danger">{errorRes.password}</span>
          )}

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              value={phone}
              onChange={onChangePhone}
              type="text"
              placeholder="Phone"
            />
          </div>
          {errorRes?.phone && (
            <span className="text-danger">{errorRes.phone}</span>
          )}

          <div className="container-login100-form-btn m-t-20">
            <button className="login100-form-btn" onClick={handlerSignUp}>
              Sign Up
            </button>
          </div>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Login?</span>
            &nbsp;
            <Link to="/signin" className="txt2 hov1">
              Click
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
