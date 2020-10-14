
const SYSTEM_CONSTANTS = {
    ERROR_REQUEST: {
        PERMISSION_NOT_ALLOW: -2,
        PAGE_OUT_INDEX: 2,
        FAILED: 1
    },
    REGEX: {
        code: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/g,
        email: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/g,
        numbers: /^[0-9]*$/g
    },
    ALERT_STATUS_PROPS: {
        NETWORK_ERROR: {children: 'Kết nối hỏng', className: 'alert alert-danger'},
        REQUEST_INVALID: {children: 'Thông tin gửi không hợp lệ', className: 'alert alert-danger'},
        WAIT_REQUEST: {children: 'Đang xử lí', className: 'alert alert-success loading-text'},
        REQUEST_SUCCESS: {children: 'Đã xong!', className: 'alert alert-success'},
    }
}

export default SYSTEM_CONSTANTS;