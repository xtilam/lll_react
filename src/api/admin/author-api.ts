import axiosClient from "../axiosCient"
import { APIResult, BaseDataModelAPIResult, PageDTO } from "../declare"

const AuthorAPI = {
    getAll: (pageInfo: PageDTO): Promise<APIResult<AuthorAPIResult[]>> => axiosClient.get('/admin/book/authors', { params: pageInfo }),
    deleteAuthors: (ids: number[]) => axiosClient.delete('/admin/book/author', { data: { ids: ids } }),
    addAuthors: (authors: AuthorAPIResult) => axiosClient.post('/admin/book/author', authors),
    getAuthorById: (id: number): Promise<APIResult<AuthorAPIResult>> => axiosClient.get('/admin/book/author', { params: { id: id } })
}

export default AuthorAPI

export interface AuthorAPIResult extends BaseDataModelAPIResult {
    "id": number,
    "name": string,
    "authorCode": string,
}