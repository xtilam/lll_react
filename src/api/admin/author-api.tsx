import axiosClient from "../axiosCient"
import { BaseDataModelAPIResult, PageDTO } from "../declare"

const AuthorAPI = {
    getAll: (pageInfo: PageDTO) => {
        return axiosClient.get('/admin/authors', { params: pageInfo });
    }
}

export default AuthorAPI

export interface AuthorAPIResult extends BaseDataModelAPIResult {
    "name": string,
    "authorCode": string,
    "description": string,
}