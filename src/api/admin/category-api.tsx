import axiosClient from "../axiosCient";
import { APIResult, PageDTO } from "../declare";

const CategoryAPI = {
    getAllCategory: (pageInfo: PageDTO): Promise<APIResult<CategoryAPIResult[]>> => {
        return axiosClient.get('/admin/categories', { params: pageInfo });
    }
}
export default CategoryAPI;
export interface CategoryAPIResult {
    "id": number
    "categoryCode": string,
    "category": string,
    "createDate": string,
    "modifiedDate": string,
    "createBy": string,
    "modifiedBy": string,
}