export class Utils {
    static formToJson(formData: FormData){
        let output: any = {};
        for(const key in formData){
            output[key] = formData.get(key);
        }
        return output;
    }
}