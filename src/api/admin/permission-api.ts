import axiosClient from "../axiosCient";
import { APIResult } from "../declare";

const PermissionAPI = {
    getAllPermission: (data: { page?: number, limit?: number, isUnlimited?: boolean }): Promise<APIResult<PermissionAPIResult>> => {
        return axiosClient.get('/admin/permissions', { params: data });
    },
    addPermission: (data: PermissionDTO): Promise<APIResult> => {
        return axiosClient.post('/admin/permission', data);
    },
    deletePermissions: (ids: (string | number)[]): Promise<APIResult> => {
        console.log(ids)
        return axiosClient.delete('/admin/permissions', { data: { ids: ids } });
    },
    getPermission: (id: number | string): Promise<APIResult<PermissionAPIResult>> => {
        return axiosClient.get('/admin/permission', { params: { id: id } });
    },
    updatePermission: (data: PermissionDTO)=>{
        return axiosClient.put('/admin/permission', data);
    }
}

export default PermissionAPI;

export interface PermissionAPIResult {
    createBy: string | undefined,
    code: string | undefined,
    method: string | undefined,
    name: string | undefined,
    modifiedDate: string | undefined,
    description: string | undefined,
    modifiedBy: string | undefined,
    api: string | undefined,
    id: string & number & undefined,
    createDate: string | undefined,
}

export interface PermissionDTO {
    id?: string | undefined,
    permissionCode?: string | undefined,
    description?: string | undefined,
    api?: string | undefined,
    name?: string | undefined,
    method?: string | undefined
}