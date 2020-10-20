import axiosClient from "../axiosCient";
import { APIResult, PageDTO } from "../declare";

const PublisherAPI = {
    getAll: (pageInfo: PageDTO): Promise<APIResult<PublisherAPIResult>> => axiosClient.get('/admin/book/publishers', { params: pageInfo }),
    deletePublishers: (ids: number[]) => axiosClient.delete('/admin/book/publisher', { data: { ids: ids } }),
    addPublishers: (publisher: PublisherAPIResult) => axiosClient.post('/admin/book/publisher', publisher),
    getPublisherById: (id: number) => axiosClient.get('/admin/book/publisher', { params: { id: id } })
}
export default PublisherAPI;

export interface PublisherAPIResult {
    "id": number,
    "publisherCode": string,
    "name": string,
    "createDate": string,
    "modifiedDate": string,
    "createBy": string,
    "modifiedBy": string,
    "deleteStatus": number
}