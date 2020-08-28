import axios, { AxiosResponse, AxiosInterceptorManager } from 'axios';
import querystring from 'query-string'

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => querystring.parse(params) as any
});

axiosClient.interceptors.request.use((config) => { console.log(config); return config; });
axiosClient.interceptors.response.use((resp) => {
    if (resp.data.message.code == 0) {
        return resp.data;
    } else {
        throw resp.data;
    }
}, (error) => {
    throw error;
});

export default axiosClient;