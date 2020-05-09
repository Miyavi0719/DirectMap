import axios from "axios";

const request = axios.create({
	baseURL: ""
});

request.interceptors.request.use((config) => {
    // 设置请求头的Authorization
    const { BearerToken } = window.localStorage.getItem('user');
    // 如果用户登录，就有user
    if (BearerToken) {
      config.headers.Authorization = `Bearer ${BearerToken}`
    }
    return config;
}, (err) => {
    return Promise.reject(err);
});
export default request;
