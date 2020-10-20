import WTable from "../components/wtable";

const Utils = {
    formToJson: (formData: FormData) => {
        let result: any = {};
        for (let [name, value] of (formData.entries() as any)) {
            if (result.hasOwnProperty(name)) {
                if (result[name] instanceof Array) {
                    result[name].push(value);
                } else {
                    result[name] = [result[name], value];
                }
            } else {
                result[name] = value;
            }
        }
        return result;
    },
    lostFocus: () => {
        $('#lost-focus').focus();
    },
    waitPromise: (time: number) => new Promise((resolve) => setTimeout(resolve, time)),
    notSetStateWhenComponentUnmount: (component: any) => {
        const setState = component.setState
        const unmount = component.componentWillUnmount
        component.__isMounted = true
        component.componentWillUnmount = function () {
            this.__isMounted = false
            console.log(this.prototype)
            unmount && unmount()
        }
        component.setState = function (...args: any) {
            if (this.__isMounted) setState.apply(this, args)
        }
    },
    getPageRequest: (pageDefault: { page: number, limit: number } = { page: 1, limit: 10 }) => {
        let search = new window.URLSearchParams(window.location.search as any);
        let page: number = Number.parseInt(search.get('page') as any)
        if (!Number.isInteger(page)) page = pageDefault.page;
        let limit: number = Number.parseInt(search.get('limit') as any)
        if (!Number.isInteger(limit)) limit = pageDefault.limit;
        return { page: page, limit: limit }
    },
    mapValue: (() => {
        let vnMap = { 'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a', 'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a', 'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e', 'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i', 'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o', 'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u', 'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y' };
        let mapLowCase: any = {};
        let specialCharacter = { '_': ' ', '-': ' ' };
        for (let i = 97; i < 123; i++) {
            mapLowCase[String.fromCharCode(i - 32)] = String.fromCharCode(i);
        }
        return { ...vnMap, ...mapLowCase, ...specialCharacter };
    })(),
    filterString: (value: string, getText: (value: any) => string) => {
        // Chuyển dữ liệu để không phải so sánh 2 lần
        let textArray = value.toLowerCase().split('').map((value) => {
            let newVal = Utils.mapValue[value];
            if (newVal) { return newVal; }
            return value;
        });
        let length = value.length;

        return function (data: any) {
            let countIndex = 0;
            let nextChar = textArray[countIndex];
            for (let char of getText(data)) {
                if (countIndex !== length) {
                    if (nextChar === char || Utils.mapValue[char] === nextChar) {
                        nextChar = textArray[++countIndex];
                    }
                } else {
                    break;
                }
            }
            return countIndex === length;
        }
    },
    setToArray: <K>(data: Set<K>): K[] => {
        let result = new Array(data.size);
        let index = 0;
        for (let value of data as any) {
            result[index++] = value;
        }
        return result;
    },
    randomString: (length: number = 10): string => {
        let result = '';
        let characters = 'abcdefghijklmnopqrstuvwxyz';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    nextClick: (callback: () => any) => {
        document.addEventListener('click', getEventClickOneTime())
        function getEventClickOneTime() {
            const evt = () => {
                document.removeEventListener('click', evt)
                callback()
            }
            return evt;
        }
    }
}


export default Utils;