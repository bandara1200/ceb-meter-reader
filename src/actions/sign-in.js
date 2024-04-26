import axios from "axios";
import {decodeIdToken, initAuthenticatedSession, initpckeChallangeSession, getVerifier} from "./session";
import {CONFIG} from "../config";
import pkceChallenge from 'pkce-challenge';
import {decode as base64_decode, encode as base64_encode} from 'base-64';

/**
 * Sends an authorization request.
 */
export const sendAuthorizationRequest = () => {
    let pkeChallangeData = pkceChallenge();
    localStorage.setItem("code_verifier", pkceChallenge().code_verifier);
    //let authorizeRequest = `${ CONFIG.AUTHORIZE_ENDPOINT }?response_type=${ CONFIG.RESPONSE_TYPE }&scope=${ CONFIG.SCOPE }&redirect_uri=${ CONFIG.REDIRECT_URI }&client_id=${ CONFIG.CLIENT_ID }&code_challenge_method=S256&code_challenge=${ pkeChallangeData.code_challenge }`;
    let authorizeRequest = `${ CONFIG.AUTHORIZE_ENDPOINT }?response_type=${ CONFIG.RESPONSE_TYPE }&scope=${ CONFIG.SCOPE }&redirect_uri=${ CONFIG.REDIRECT_URI }&client_id=${ CONFIG.CLIENT_ID }`;
    window.location.href = authorizeRequest;
};


export const sendAuthorizationRequestWithOTP = () => {
    let pkeChallangeData = pkceChallenge();
    initpckeChallangeSession(pkeChallangeData);
    const username = localStorage.getItem("username");
    let authorizeRequest = `${ CONFIG.AUTHORIZE_ENDPOINT }?response_type=${ CONFIG.RESPONSE_TYPE }&scope=${ CONFIG.SCOPE }&redirect_uri=${ CONFIG.REDIRECT_URI }&client_id=${ CONFIG.CLIENT_ID }&code_challenge_method=S256&code_challenge=${ pkeChallangeData.code_challenge }&username=${ username }`;
    window.location.href = authorizeRequest;
};

/**
 * Sends a token request.
 *
 * @param code Authorization code
 * @return {Promise<AxiosResponse<T> | never>}
 */
export const sendTokenRequest = (code) => {
    const verifyCode = localStorage.getItem("code_verifier");
    const body = [];
    body.push(`client_id=${ CONFIG.CLIENT_ID }`);
    body.push(`client_secret=${ CONFIG.CLIENT_SECRET }`);
    body.push(`code=${ code }`);
    body.push(`grant_type=${ CONFIG.GRANT_TYPE }`);
    body.push(`redirect_uri=${ CONFIG.REDIRECT_URI }`);
    //body.push(`code_verifier=${ verifyCode }`);
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    return axios.post(`${ CONFIG.TOKEN_ENDPOINT }`, body.join("&"), getTokenRequestHeaders())
        .then(response => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Invalid status code received in the token response: "
                    + response.status));
            }

            // Store the response in the session storage
            initAuthenticatedSession(response.data);

            return [response.data, decodeIdToken(response.data.id_token)];

        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Helper to set request headers.
 *
 * @return {{headers: {Accept: string, "Access-Control-Allow-Origin": string, "Content-Type": string}}}
 */
const getTokenRequestHeaders = () => {
    return {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": `${ CONFIG.CLIENT_URL }`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
};