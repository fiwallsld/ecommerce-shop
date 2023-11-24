import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { deleteSession } from "../Redux/Action/ActionSession";
import { resetCart } from "../Redux/Action/ActionCart";

function LoginLink(props) {
  const dispatch = useDispatch();

  const onRedirect = () => {
    const action = deleteSession("");
    const reset = resetCart(null);
    dispatch(action);
    dispatch(reset);
    localStorage.clear();
  };

  return (
    <li className="nav-item" onClick={onRedirect}>
      <Link className="nav-link" to="/signin">
        ( Logout )
      </Link>
    </li>
  );
}

export default LoginLink;
