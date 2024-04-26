import {getCookie, removeCookie, setCookie} from "../helpers/cookies";
import RoleConstant from '../Config/RoleConstant';

/**
 * Initialize authenticated user session.\
 */
export const initAuthenticatedSession = (data) => {
    localStorage.setItem("ACCESS_TOKEN", data.access_token);
    localStorage.setItem("REFRESH_TOKEN", data.refresh_token);
    localStorage.setItem("SCOPE", data.scope);
    localStorage.setItem("ID_TOKEN", data.id_token);
    localStorage.setItem("TOKEN_TYPE", data.token_type);
    localStorage.setItem("EXPIRES_IN", data.expires_in);
};

/**
 * Get session parameter from cookie storage.
 *
 * @param key
 * @return {string}
 */
export const getSessionParameter = (key) => {
    //return getCookie(key);
    return localStorage.getItem(key);

};

/**
 * Reset authenticated session.
 */
export const resetAuthenticatedSession = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("SCOPE");
    localStorage.removeItem("ID_TOKEN");
    localStorage.removeItem("TOKEN_TYPE");
    localStorage.removeItem("EXPIRES_IN");
    localStorage.removeItem("id");
    //localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("mobile");
    localStorage.removeItem("userRole");
    localStorage.removeItem("code_verifier");
};

/**
 * Returns whether session is valid.
 *
 * @return {boolean}
 */
export const isValidSession = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    return !!token;
};

/**
 * Get all session parameters.
 *
 * @returns {{}}
 */
export const getAllSessionParameters = () => {
    const session = {};

    session["ACCESS_TOKEN"] = localStorage.getItem("ACCESS_TOKEN");
    session["REFRESH_TOKEN"] = localStorage.getItem("REFRESH_TOKEN");
    session["SCOPE"] = localStorage.getItem("SCOPE");
    session["ID_TOKEN"] = localStorage.getItem("ID_TOKEN");
    session["TOKEN_TYPE"] = localStorage.getItem("TOKEN_TYPE");
    session["EXPIRES_IN"] = localStorage.getItem("EXPIRES_IN");

    return session;
};

/**
 * Base64 decodes the ID token
 *
 * @param token id token
 * @return {any}
 */
export const decodeIdToken = (token) => {
    return JSON.parse(atob(token.split(".")[1]));
};

export const getAllUserData = () => {
    const user = {};
    user["id"] = localStorage.getItem("id");
    user["username"] = localStorage.getItem("username");
    user["firstName"] = localStorage.getItem("firstName");
    user["lastName"] = localStorage.getItem("lastName");
    user["email"] = localStorage.getItem("email");
    user["mobile"] = localStorage.getItem("mobile");
    return user;
}

export const getVerifier = () => {
    return localStorage.getItem("code_verifier");
}


export const initAuthenticatedUserSession = (data) => {
    localStorage.setItem("id", data.id);
    localStorage.setItem("username", data.username);
    localStorage.setItem("firstName", data.firstName);
    localStorage.setItem("lastName", data.lastName);
    localStorage.setItem("email", data.email);
    localStorage.setItem("mobile", data.mobile);
};

export const initAuthenticatedRoles = (data) => {
    for (var i =0; i < data.length; i++){
        if(RoleConstant.consumer == data[i]){
            localStorage.setItem("userRole", data[i]);
        }
        if(RoleConstant.meterReader == data[i]){
            localStorage.setItem("userRole", data[i]);
        }
        if(RoleConstant.finance == data[i]){
            localStorage.setItem("userRole", data[i]);
        }
    }
}

export const getUserRole = () => {
    return localStorage.getItem("userRole");
}

export const initpckeChallangeSession = (data) => {
    localStorage.setItem("code_verifier", data.code_verifier);
}