export interface APIResult<K = any, V = any> {
    message: {
        code: number,
        content: string,
        data: V
    },
    data: K[] & K
}

export interface PageDTO {
    page?: number, limit?: number, unlimited?: boolean
}

export interface BaseDataModelAPIResult {
    "id"?: number,
    "createDate"?: string,
    "modifiedDate"?: string,
    "createBy"?: string,
    "modifiedBy"?: string,
    "deleteStatus"?: number
}