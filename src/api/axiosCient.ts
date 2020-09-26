import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: (params) => { return queryString.stringify(params) }
});

axiosClient.interceptors.request.use((config) => {
    config.headers['Authorization'] = localStorage.token;
    console.log(config);
    return config;
});

axiosClient.interceptors.response.use((resp) => {
    console.log('result', resp);
    try {
        switch (resp.data.message.code) {
            case 0:
                return resp.data;
            default:
                throw resp.data;
        }
    } catch (error) {
        throw resp.data;
    }

}, (error) => {
    console.log('error', error);
    throw error;
});

export default axiosClient;