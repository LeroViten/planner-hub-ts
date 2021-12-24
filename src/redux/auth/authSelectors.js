export const getUserName = state => state.auth.user.name;
export const getToken = state => state.auth.token;
export const getLoggedIn = state => state.auth.isLoggedIn;
export const getLoggedOut = state => state.auth.isLoggedOut;
