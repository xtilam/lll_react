import React from "react";
import Utils from "../../common/Utils";
import WCheckBox from "../../components/wcheckbox";
import WTable, { WTablePageInfo } from "../../components/wtable";

interface TableListAdminProps<V> {
    headers: (JSX.Element | string)[],
    onPageChange?: ((event: {
        pageChange: number;
        limitChange: number;
    }) => any)
    pageInfo: { page: number, limit: number },
    fillData: (data: V, classNameNotCheckWhenClick: string) => JSX.Element,
    getPage: (page: number, limit: number) => (WTablePageInfo | undefined | Promise<WTablePageInfo | undefined>),
    getId: (data: V) => any
}
interface TableListAdminState {
    isSelectAll: boolean,
}

export default class TableListAdmin<K> extends React.Component<TableListAdminProps<K>, TableListAdminState>{
    tableRef = React.createRef<WTable>();
    idsSelect: any[] = [];
    constructor(props: TableListAdminProps<K>) {
        super(props);
        this.state = {
            isSelectAll: false
        }
    }
    reloadPage() {
        return this.tableRef.current?.reloadPage();
    }
    getStartIndex() {
        const wtable = this.tableRef.current;
        if (!wtable) return 1
        return wtable.state.pageData.offset + 1;
    }
    render() {
        const { headers, pageInfo, getPage, onPageChange, getId, fillData } = this.props;
        const { isSelectAll } = this.state
        const classNameNotCheckWhenClick = Utils.randomString(10);
        const idTable = Utils.randomString(10)

        const checkBoxSelectAll = <WCheckBox
            onChange={(evt) => {
                const isSelectAll = evt.currentTarget.checked
                if (!isSelectAll) this.idsSelect = []
                this.setState({ isSelectAll: isSelectAll })
            }}
            checked={isSelectAll}
        />

        return <WTable id={idTable}
            ref={this.tableRef}
            getPage={(page, limit) => {
                this.idsSelect = [];
                return getPage(page, limit);
            }}
            fillData={(data: K, index) => {
                const cols = fillData(data, classNameNotCheckWhenClick);
                const id = getId(data);
                const startIndex = this.getStartIndex()
                if (isSelectAll) this.idsSelect.push(id)

                return <tr key={id} onClick={(evt) => {
                    const textSelect: string = (window.getSelection() as any).toString()
                    if (textSelect.length !== 0) return
                    const shouldToggle = $(evt.target).closest(`.${classNameNotCheckWhenClick}`).length === 0
                    if (!shouldToggle) return

                    const checkbox = $(evt.target).closest(`tr`).find('> td:nth-child(2) input[type="checkbox"]')[0]

                    checkbox.click();
                }}>
                    <td>{index + startIndex}</td>
                    <td>
                        <WCheckBox className={classNameNotCheckWhenClick} onChange={(evt) => {
                            const isSelect = evt.currentTarget.checked;
                            const { idsSelect: ids } = this;
                            if (isSelect) {
                                this.idsSelect.push(id)
                            } else {
                                const index = ids.findIndex(item => item === id);
                                if (index === -1) return
                                ids.splice(index, 1)
                            }
                        }} checked={isSelectAll} />
                    </td>
                    {cols}
                </tr>
            }}
            headers={['#', checkBoxSelectAll, ...headers]}
            limit={pageInfo.limit}
            page={pageInfo.page}
            onPageChangeEvent={onPageChange} />
    }
}