import axiosClient from "../axiosCient";
import { APIResult } from "../declare";

const GroupPermissionAPI = {
    getAllGroup: (pageInfo: { page: number, limit: number, isUnlimited: boolean }): Promise<APIResult<GroupPermissionAPIResult>> => {
        return axiosClient.get('/admin/groups', { params: pageInfo });
    },
    addGroup: (data: GroupPermissionDTO) => {
        return axiosClient.post('/admin/group', data);
    },
    deleteGroups: (ids: number[]) => {
        return axiosClient.delete('/admin/groups', { data: { ids: ids } });
    },
    getGroup: (id: number): Promise<APIResult<GroupPermissionAPIResult>> => {
        return axiosClient.get('/admin/group', { params: { id: id } });
    },
    updateGroup: (data: GroupPermissionDTO) => {
        console.log(data);
        return axiosClient.put('/admin/group', data);
    },
    updateAdminPermissions: (data: {groupId: number, permissionIds: number[]}) => {
        return axiosClient.put('/admin/group/permissions', data);
    },
    getAllPermissionInGroup(id: number) {
        return axiosClient.get('/admin/group/permissions', { params: { id: id } });
    }
}
export default GroupPermissionAPI;

export interface GroupPermissionAPIResult {
    createBy: string,
    name: string,
    modifiedDate: string,
    description: string,
    modifiedBy: string,
    id: number,
    groupCode: string,
    createDate: string,
}

export interface GroupPermissionDTO {
    id: number,
    groupCode: string,
    description: string,
    name: string,
}