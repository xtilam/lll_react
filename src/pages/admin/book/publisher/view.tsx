import { PublisherAPIResult } from "../../../../api/admin/publisher-api";
import { APIResult } from "../../../../api/declare";
import BaseCrudView, { BaseViewConfig } from "../../base/base-view";

export default class PublisherView extends BaseCrudView<PublisherAPIResult>{
    getId(data: PublisherAPIResult) {
        return data.id
    }
    fillData(data: PublisherAPIResult, unselectClass: string): JSX.Element {
        throw new Error("Method not implemented.");
    }
    getPageAPIMethod(page: number, limit: number): Promise<APIResult<any, any>> {
        throw new Error("Method not implemented.");
    }
    subRender(): JSX.Element | null {
        throw new Error("Method not implemented.");
    }
    configure(): BaseViewConfig<PublisherAPIResult> {
        throw new Error("Method not implemented.");
    }

}