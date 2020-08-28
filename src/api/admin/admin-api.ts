import axiosClient from "../axiosCient";

const AdminUserAPI = {
    login: async (data: { email: string, username: string, password: string }) => {
        return await axiosClient.post('/admin/login', data);
    },
    logout: async () => {
        return await axiosClient.get('/admin/logout')
    }
}
export default AdminUserAPI;