import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import AuthorAPI, { AuthorAPIResult } from "../../../api/admin/author-api";
import BookAPI, { BookAPIResult } from "../../../api/admin/book-api";
import CategoryAPI, { CategoryAPIResult } from "../../../api/admin/category-book-api";
import PublisherAPI, { PublisherAPIResult } from "../../../api/admin/publisher-api";
import ListSelect from "../../../components/list-select";
import WForm from "../../../components/wform";
import WInput, { WInputOther } from "../../../components/winput";
import { AdminOverrideWindow } from "../../../contexts/admin-overide-window";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface AddBookState {
    isDisable: boolean,
    publishers: PublisherAPIResult[],
    categories: any,
    authors: any,
}

export default class AddBook extends React.Component<{}, AddBookState> {
    form = React.createRef<WForm>();
    bookImageInput = React.createRef<HTMLInputElement>();
    bookImageView = React.createRef<HTMLImageElement>();
    messageRequest = React.createRef<AdminMessageRequest>();
    isShowCategories = false;
    constructor(props: any) {
        super(props);
        this.state = {
            isDisable: false,
            publishers: [],
            categories: {},
            authors: {}
        }
    }
    componentDidMount() {
        PublisherAPI.getAll({ unlimited: true }).then((resp) => {
            this.setState({ publishers: resp.data });
        })
        this.form.current?.setData({
            title: 'Tôi thấy bà hàng xóm',
            isbn: 12,
            pageNumber: 12,
            price: 12,
            description: 'Hello',
            edition: 14
        } as BookAPIResult)
    }
    onSubmit(evt: any) {
        evt.preventDefault();
        let data = { ... this.form.current?.getData(), categories: Object.values(this.state.categories), authors: Object.values(this.state.authors) }
        data.publisher = { id: data.publisher };
        this.setState(() => { return { isDisable: true } });
        this.messageRequest.current?.sendRequest(() => { return BookAPI.addBook(data) });
        this.setState(() => { return { isDisable: false } });
    }
    render() {
        let inputList = {
            categories: (
                <div className="d-flex space-nm align-items-end">
                    <WInput title_input="Thể loại" readOnly required is_invalid={Object.keys(this.state.categories).length === 0}
                        value={Object.entries(this.state.categories)
                            .map(([id, category]) => {
                                console.log(category);
                                return (category as CategoryAPIResult).category;
                            }).join(', ')} />
                    <AdminOverrideWindow.Consumer>
                        {({ addWindow, removeWindow }) => {
                            return <Button color="primary" size="sm" style={{ whiteSpace: 'nowrap' }}
                                onClick={() => {
                                    let categoriesView = addWindow(
                                        <div className="default-view">
                                            <Link to="/admin/category/add" className='btn btn-primary btn-sm' children='Thêm thể loại' />
                                            <ListSelect
                                                getData={async () => { return (await CategoryAPI.getAllCategory({ unlimited: true })).data }}
                                                viewData={(data: CategoryAPIResult) => {
                                                    return [
                                                        <td key="categoryCode">{data.categoryCode}</td>,
                                                        <td key="category">{data.category}</td>
                                                    ]
                                                }}
                                                typeSearch={[
                                                    { propertySearch: 'categoryCode', viewSearch: 'Mã thể loại' },
                                                    { propertySearch: 'category', viewSearch: 'Thể loại' }
                                                ]}
                                                header={[<th key="categoryCode">Mã thể loại</th>, <th key="category">Thể loại</th>]}
                                                getKey={(data: CategoryAPIResult) => { return data.id }}
                                                onComplete={(categories) => {
                                                    removeWindow(categoriesView as any);
                                                    this.setState({ categories: categories });
                                                }}
                                                valueSelected={this.state.categories}
                                            />
                                        </div>)
                                }} >Thể loại</Button>
                        }}
                    </AdminOverrideWindow.Consumer>
                </div>
            ),
            authors: (
                <div className="d-flex space-nm align-items-end">
                    <WInput title_input="Tác giả" readOnly required is_invalid={Object.keys(this.state.authors).length === 0}
                        value={Object.entries(this.state.authors)
                            .map(([id, author]) => {
                                return (author as AuthorAPIResult).name;
                            }).join(', ')} />
                    <AdminOverrideWindow.Consumer>
                        {({ addWindow, removeWindow }) => {
                            return <Button color="primary" size="sm" style={{ whiteSpace: 'nowrap' }}
                                onClick={() => {
                                    let authorView = addWindow(
                                        <div className="default-view">
                                            <Link to="/admin/author/add" className='btn btn-primary btn-sm' children='Thêm tác giả' />
                                            <ListSelect
                                                getData={async () => { return (await AuthorAPI.getAll({ unlimited: true })).data }}
                                                viewData={(data: AuthorAPIResult) => {
                                                    return [
                                                        <td>{data.authorCode}</td>,
                                                        <td>{data.name}</td>
                                                    ]
                                                }}
                                                typeSearch={[
                                                    { propertySearch: 'authorCode', viewSearch: 'Mã Tác giả' },
                                                    { propertySearch: 'name', viewSearch: 'Tên Tác giả' }
                                                ]}
                                                header={[<th>Mã tác giả</th>, <th>Tên tác giả</th>]}
                                                getKey={(data: any) => { return data.id }}
                                                onComplete={(authors) => {
                                                    removeWindow(authorView as any);
                                                    this.setState({ authors: authors });
                                                }}
                                                valueSelected={this.state.authors}
                                            />
                                        </div>)
                                }} >Tác giả</Button>
                        }}
                    </AdminOverrideWindow.Consumer>
                </div>
            )
        }
        return <div className={`form-container ${this.state.isDisable && 'disabled'}`}>
            <AdminMessageRequest ref={this.messageRequest} />
            <WForm className={this.state.isDisable ? 'disabled' : ''} onSubmit={this.onSubmit.bind(this)} ref={this.form as any}>
                <Container fluid={true} className="p-0">
                    <Row>
                        <Col xs={12}>
                            <div className="d-flex justify-content-between">
                                <h2>Thêm Sách</h2>
                                <img className="avatar" title="Ảnh bìa sách"
                                    style={{ borderRadius: 0 }}
                                    src={process.env.REACT_APP_BOOK_IMAGE_PATH + 'default.jpg'}
                                    alt="default" ref={this.bookImageView}
                                    onClick={() => { this.bookImageInput.current?.click(); }}
                                ></img>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <WInput name="title" title_input="Tên sách" required />
                        </Col>
                        <Col md={6} sm={12}>
                            <WInput title_input="isbn" name="isbn" required />
                        </Col>
                        <Col md={6} sm={12}>
                            <WInput name="pageNumber" title_input="Số trang" type="number" required />
                        </Col>
                        <Col md={6} sm={12}>
                            <WInput name="edition" title_input="Tái bản" type="number" required />
                        </Col>
                        <Col md={6} sm={12}>
                            <WInput name="price" title_input="Giá" type="number" required />
                        </Col>
                        <Col xs={12}>
                            <WInputOther title_input="Nhà xuất bản">
                                <select name="publisher">
                                    {this.state.publishers.map((publisher, index) => {
                                        return <option key={index} value={publisher.id}>{publisher.name}</option>
                                    })}
                                </select>
                            </WInputOther>
                        </Col>
                        <Col xs={12}>
                            {inputList.authors}
                        </Col>
                        <Col xs={12}>
                            {inputList.categories}
                        </Col>
                        <Col xs={12}>
                            <WInputOther title_input="Mô tả">
                                <textarea name="description" rows={4} required></textarea>
                            </WInputOther>
                        </Col>
                        <Col>
                            <div className="d-flex space-sm">
                                <Button color="primary" size="sm">Thêm Sách</Button>
                                <Link to="/admin/books" className="btn btn-danger btn-sm">Quay về</Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </WForm>
        </div >
    }
}
