import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteSession } from "../Redux/Action/ActionSession";
import { resetCart } from "../Redux/Action/ActionCart";
import UserAPI from "../API/UserAPI";

function LoginLink(props) {
  const dispatch = useDispatch();

  const onRedirect = async () => {
    await UserAPI.getLogout();

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
