import {getSessionParameter, resetAuthenticatedSession} from "./session";
import {CONFIG} from "../config";

/**
 * Logs out from the session.
 */
export const dispatchLogout = () => {
    const token = getSessionParameter("ID_TOKEN");
    // Clear the session storage
    resetAuthenticatedSession();
    window.location.href = `${CONFIG.LOGOUT_URL}?id_token_hint=${token}&post_logout_redirect_uri=${CONFIG.REDIRECT_URI}`;
};