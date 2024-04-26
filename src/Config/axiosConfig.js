import axios from 'axios';
import { getAllSessionParameters } from "../actions/session";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

instance.interceptors.request.use(function (config) {
    const session = getAllSessionParameters();
    const token = session.ACCESS_TOKEN;
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});

export default instance;
