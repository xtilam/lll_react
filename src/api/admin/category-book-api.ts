import axiosClient from "../axiosCient";
import { APIResult, PageDTO } from "../declare";

const CategoryAPI = {
    getAllCategory: (pageInfo: PageDTO): Promise<APIResult<CategoryAPIResult[]>> => axiosClient.get('/admin/book/categories', { params: pageInfo }),
    deleteCategories: (ids: number[]) => axiosClient.delete('/admin/book/categories', { data: { ids: ids } }),
    addCategories: (category: CategoryDTO) => axiosClient.post('/admin/book/category', category),
    getCategory: (id: number) => axiosClient.get('/admin/book/category', { params: { id: id } })
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
export interface CategoryDTO extends CategoryAPIResult {

}