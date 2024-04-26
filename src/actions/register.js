import {CONFIG} from "../config";


export const sendRegistration = () => {
    let registrationRequest = `${ CONFIG.REGISTER_ENDPOINT }?&client_id=${ CONFIG.CLIENT_ID }&callback=${ CONFIG.REDIRECT_URI}&tenantDomain=${ CONFIG.TENET_DOMAIN}`;
    window.location.href = registrationRequest;
}

