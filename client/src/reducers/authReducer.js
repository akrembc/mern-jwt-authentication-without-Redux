import { LOGIN } from "../actions/types";

const INITIAL_STATE = {
  authenticated: null,
  userId: null,
};

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...INITIAL_STATE, authenticated: true, userId: action.payload };
    default:
      return state;
  }
};

export default auth;
