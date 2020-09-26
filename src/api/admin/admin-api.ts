import axiosClient from "../axiosCient";
import { APIResult } from "../declare";
import { GroupPermissionAPIResult } from "./group-api";

const AdminUserAPI = {
    login: (data: { email?: string, username?: string, password: string }) => {
        return axiosClient.post('/admin/login', data);
    },
    logout: () => {
        return axiosClient.get('/admin/logout');
    },
    getAllUser: (pageInfo: { page: number, limit: number, isUnlimited?: boolean }): Promise<APIResult<AdminUserResult, {
        "offset": number,
        "totalPage": number,
        "page": number,
        "totalRecord": number
    }>> => {
        return axiosClient.get('/admin/admin-users', { params: pageInfo });
    },
    addUser: (data: AdminDTO) => {
        return axiosClient.post('/admin/admin-user', data);
    },
    deleteUsers: (ids: (number | string)[]) => {
        return axiosClient.delete('/admin/admin-users', { data: { ids: ids } });
    },
    uploadAvatar: (data: { image: File, id: number }) => {
        let formData = new FormData();
        formData.append('id', data.id as any);
        formData.append('image', data.image as any);
        return axiosClient.put('/admin/admin-user/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    editUser: (data: AdminDTO) => {
        return axiosClient.put('/admin/admin-user', data);
    },
    getUser: (data: { id: any, adminCode: string }): Promise<APIResult<AdminUserResult>> => {
        return axiosClient.get('/admin/admin-user', { params: data });
    },
    updateUser: (data: AdminDTO): Promise<APIResult> => {
        return axiosClient.put('/admin/admin-user', data);
    },
    getAdminPermissions: (userId: number): Promise<APIResult<AdminPermissionsResult[]>> => {
        return axiosClient.get('/admin/admin-user/permissions', { params: { id: userId } });
    },
    updateAdminPermissions: (userId: number, permissionsIds: number[]) => {
        return axiosClient.put('/admin/admin-user/permissions', {
            userId: userId,
            permissionIds: permissionsIds
        })
    },
    resetPasswordUser: (userId: number, password: string) => {
        return axiosClient.put('/admin/admin-user/reset-password', {userId: userId, password: password});
    },
    getAllGroups: (adminCode: string)=>{
        return axiosClient.get('/admin/admin-user/groups', {params: {adminCode: adminCode}});
    },
    updateAdminGroups: (data: {adminId: number, groupIds: number[]})=>{
        return axiosClient.put('/admin/admin-user/groups', data);
    }
}
export default AdminUserAPI;

export interface AdminUserResult {
    "adminCode": string,
    "fullname": string,
    "address": string,
    "gender": number,
    "createDate": string
    "createBy": string,
    "dateOfBirth": string,
    "phone": string,
    "email": string,
    "status": number,
    "identityDocument": string,
    "modifiedDate": string,
    "modifiedBy": string,
    "id": number,
}

export interface AdminDTO {
    id?: string
    adminCode?: string
    fullname?: string
    identityDocument?: string
    email?: string
    gender?: string
    address?: string
    phone?: string
    dateOfBirth?: string
    password?: string
}
export interface AdminPermissionsResult {
    "isAllow": boolean,
    "method": string,
    "code": string,
    "description": string,
    "name": string,
    "api": string,
    "id": number
}
export interface AdminGroupAPIResult extends GroupPermissionAPIResult{
    isAllow?: boolean
}