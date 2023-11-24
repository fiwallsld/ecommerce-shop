const initialState = {
  userId: null,
  fullname: "",
  email: "",
  token: "",
  roomId: "",
};

const ReducerSession = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SESSION":
      // console.log("User login: ", action.data.fullname);

      const stateLogin = { ...state };
      stateLogin.userId = action.data.userId;
      stateLogin.fullname = action.data.fullname;
      stateLogin.email = action.data.email;
      stateLogin.roomId = action.data.roomId;

      if (action.data.token) stateLogin.token = action.data.token;

      // console.log("stateLogin-----", stateLogin);
      localStorage.removeItem("roomId");
      return stateLogin;

    case "DELETE_SESSION":
      // console.log("User logout----: ", action.data);
      localStorage.removeItem("token");
      state = {
        userId: null,
        fullname: "",
        email: "",
        token: "",
      };

      return state;

    default:
      return state;
  }
};

export default ReducerSession;
