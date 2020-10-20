import axiosClient from "../axiosCient";
import { APIResult, BaseDataModelAPIResult, PageDTO } from "../declare";
import { AuthorAPIResult } from "./author-api";
import { CategoryAPIResult } from "./category-book-api";
import { PublisherAPIResult } from "./publisher-api";

const BookAPI = {
    getBooks: (pageInfo: PageDTO)
        : Promise<APIResult<BookAPIResult>> => {
        return axiosClient.get('/admin/books', { params: pageInfo });
    },
    addBook: (data: any) => {
        return axiosClient.post('/admin/book', data);
    }
}

export interface BookAPIResult extends BaseDataModelAPIResult {
    "title"?: string,
    "edition"?: number,
    "price"?: number,
    "pageNumber"?: number,
    "description"?: string,
    "rate"?: number,
    "rateCount"?: number,
    "isbn"?: number,
    "quantity"?: number,
    "publisher"?: PublisherAPIResult,
    "categories"?: CategoryAPIResult[],
    "authors"?: AuthorAPIResult[]
}
export default BookAPI;