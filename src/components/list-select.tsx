
import React from "react";
import { Button } from "reactstrap";
import Utils from "../common/Utils";
import ReloadSVG from "../logo-svg/reload";
import AdminMessageRequest from "../page-component/admin/admin-message-request";
import WCheckBox from "./wcheckbox";
import WInput, { WInputOther } from "./winput";

interface ListSelectProps {
    getData: () => any,
    viewData: (data: any) => JSX.Element[],
    header: JSX.Element[],
    filter?: any,
    typeSearch: { propertySearch: string, viewSearch: string }[],
    getKey: (data: any) => any,
    getAllow?: (data: any) => boolean,
    onComplete: (data: any) => any
    valueSelected?: any
}
interface ListSelectState {
    justShowSelected: boolean,
    isWaiting: boolean,
    data: any[],
    filter: any,
}
export default class ListSelect extends React.Component<ListSelectProps, ListSelectState>{
    refComponent = {
        typeSearch: React.createRef<HTMLSelectElement>(),
        searchValue: React.createRef<HTMLInputElement>(),
    }
    searchValue: string = '';
    valueSelected: any = {};
    adminMessageRequest = React.createRef<AdminMessageRequest>();
    isFirstRender = false;

    private isSelectAll = false;
    private tableRef = React.createRef<HTMLTableSectionElement>();

    constructor(props: ListSelectProps) {
        super(props);
        this.state = {
            justShowSelected: false,
            isWaiting: false,
            data: undefined as any,
            filter: undefined
        }
        if (typeof this.props.valueSelected === 'object') {
            if (this.props.valueSelected instanceof Array) {
                this.valueSelected = {};
            } else {
                this.valueSelected = this.props.valueSelected;
            }
        }

    }
    componentDidMount() {
        this.getData();
    }
    changeFilter() {
        this.searchValue = (this.refComponent.searchValue.current as any).input.current.value.trim();
        let typeSearch = this.refComponent.typeSearch.current?.value;
        if (this.searchValue) {
            let filter;
            if (this.props.filter && (filter = this.props.filter[typeSearch as any])) {
                this.props.filter.data = this.searchValue;
            } else {
                filter = Utils.filterString(this.searchValue, (data) => { return data[typeSearch as string] || '' });
            }
            this.setState({ filter: filter })
        } else {
            this.setState({ filter: undefined });
        }
    }
    async getData() {
        await this.setState({ isWaiting: true });
        let result = await this.props.getData();
        if (result !== undefined) {
            this.isFirstRender = true;
            await this.setState({ data: result as any, isWaiting: false });
        } else {
            await this.setState({ isWaiting: false })
        }
    }
    async updatePermissions() {
        this.props.onComplete && this.props.onComplete(this.valueSelected);
    }
    toggleSelectAll() {
        $<HTMLInputElement>('> tr > td:nth-child(2) > .select > input[type=checkbox]', this.tableRef.current as any).each((index, e) => {
            if (e.checked === this.isSelectAll) e.click();
        });
        this.isSelectAll = !this.isSelectAll;
        this.setState({});
    }
    render() {
        let { isWaiting, filter } = this.state;
        let valueSelect: any = {}; // lọc ra các phần tử không tồn tại
        return <div>
            <style children={
                [
                    '.table th:nth-child(1), .table td:nth-child(1){text-align: center}',
                    '.table td:nth-child(2) > label, .table th:nth-child(2) > label{ margin: auto}'
                ]} />
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex space-sm">
                    <Button color="primary" onClick={this.getData.bind(this)} title="reload" size="sm">
                        <ReloadSVG color="white" className={'icon ' + (isWaiting ? 'spin' : '')} />
                    </Button>
                    <Button onClick={this.updatePermissions.bind(this)} color="primary" size="sm" children="OK" />
                    <Button onClick={this.toggleSelectAll.bind(this)} color={this.isSelectAll ? 'danger' : 'primary'} size="sm" children={this.isSelectAll ? 'Hủy chọn tất cả' : 'Chọn tất cả'} />
                </div>
                <div className="d-flex space-sm">
                    <WInput title_input="Tìm kiếm" onChange={this.changeFilter.bind(this)} ref={this.refComponent.searchValue as any} />
                    <WInputOther title_input="Loại">
                        <select ref={this.refComponent.typeSearch} onChange={this.changeFilter.bind(this)}>
                            {this.props.typeSearch.map((type, index) => {
                                return <option key={index} value={type.propertySearch}>{type.viewSearch}</option>
                            })}
                        </select>
                    </WInputOther>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>
                            <WCheckBox checked={this.state.justShowSelected} onChange={(evt) => { this.setState({ justShowSelected: evt.currentTarget.checked }) }} />
                        </th>
                        {this.props.header}
                    </tr>
                </thead>
                <tbody ref={this.tableRef}>
                    {
                        this.state.data !== undefined && this.state.data.map((data, index) => {
                            let dataExits: boolean = false;
                            let key = this.props.getKey(data);
                            if ((this.isFirstRender && this.props.getAllow && this.props.getAllow(data)) || this.valueSelected.hasOwnProperty(key)) {
                                valueSelect[key] = data;
                                dataExits = true;
                            }
                            if (
                                (!this.state.justShowSelected || dataExits)
                                && (filter ? filter.filter(data) : true)
                            ) {
                                return <tr key={key}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <WCheckBox className="select" onChange={(evt) => {
                                            let checked = evt.currentTarget.checked;
                                            if (checked) {
                                                this.valueSelected[key] = data;
                                            } else {
                                                delete this.valueSelected[key];
                                            }
                                        }} checked={dataExits} />
                                    </td>
                                    {this.props.viewData(data)}
                                </tr>
                            }
                        })
                    }
                </tbody>
            </table>
            {(() => {
                this.isFirstRender = false;
                if (this.state.data !== undefined) this.valueSelected = valueSelect;
            })()}
        </div>
    }
} 