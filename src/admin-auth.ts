import axiosClient from "./api/axiosCient";
import AdminUserAPI from "./api/admin/admin-api";
import Axios from "axios";
import { setLoginContext } from "./contexts/admin-authencation";

const authentication = {
    login: (token: string, admin: any) => {
        localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('token', token);
        setLoginContext(true);
    },
    logout: async () => {
        localStorage.removeItem('admin');
        let token = localStorage.token;
        if (token) {
            try{
                await AdminUserAPI.logout();
            }catch(e){}
        }
        localStorage.removeItem('token');
        if(window.location.pathname !== '/admin/logout'){
            setLoginContext(false);
        };
    },
    isLogin: (): boolean => {
        if (!localStorage.token) {
            localStorage.removeItem('admin');
            return false;
        } else {
            return true;
        }

    }
};

export default authentication;