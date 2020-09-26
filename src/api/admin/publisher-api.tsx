import axiosClient from "../axiosCient";
import { APIResult, PageDTO } from "../declare";

const PublisherAPI = {
    getAll: (pageInfo: PageDTO): Promise<APIResult<PublisherAPIResult>> => {
        return axiosClient.get('/admin/publishers', { params: pageInfo });
    }
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