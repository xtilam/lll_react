import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import AdminUserAPI, { AdminDTO } from "../../../api/admin/admin-api";
import WForm from "../../../components/wform";
import WInput from "../../../components/winput";
import SYSTEM_CONSTANTS from "../../../constants";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface AddAdminUserState {
    input: AdminDTO,
    passwordConfirmInput: string
    isValidInput: {
        passwordConfirm: boolean,
        email: boolean,
        adminCode: boolean,
        phone: boolean,
        identityDocument: boolean
    },
    isDisable: boolean,
}

export default class AddAdminUser extends React.Component<{}, AddAdminUserState> {
    messageRequest: React.RefObject<AdminMessageRequest>;
    avatar: React.RefObject<HTMLImageElement>;
    avatarInput: React.RefObject<HTMLInputElement>;
    constructor(props: any) {
        super(props);
        this.state = {
            input: {
                adminCode: 'nvc2',
                email: 'cuong2@gmail.com',
                password: '123',
                fullname: 'Nguyễn Văn Cường 2',
                phone: '12345',
                identityDocument: '0014523',
                dateOfBirth: '2000-02-02',
                address: '123454',
                gender: '0'
            },
            isValidInput: {
                passwordConfirm: true,
                email: true,
                adminCode: true,
                phone: true,
                identityDocument: true
            },
            passwordConfirmInput: '123',
            isDisable: false
        }
        this.messageRequest = React.createRef();
        this.avatar = React.createRef();
        this.avatarInput = React.createRef();
        console.log('add constructor');
    }
    inputChange(fieldChange: string, evt: React.FormEvent<HTMLInputElement>, otherAction?: (evt: React.FormEvent<HTMLInputElement>) => any) {
        (this.state.input as any)[fieldChange] = evt.currentTarget.value;
        otherAction instanceof Function && otherAction(evt);
        this.setState({});
    }
    radioInputGender(evt: React.ChangeEvent<HTMLInputElement>) {
        this.state.input.gender = evt.currentTarget.value;
    }
    setDisable(isDisable: boolean) {
        this.setState({ isDisable: isDisable });
    }
    async onSubmitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        this.setDisable(true);
        let { current } = this.messageRequest;
        let addUserReq = await this.messageRequest.current?.sendRequest(() => { return AdminUserAPI.addUser(this.state.input) });
        let file: any;
        if (addUserReq !== undefined
            && this.avatarInput.current?.files && (file = this.avatarInput.current?.files[0])) {
            let state: any = { ...current?.state };

            let updateImageReq = await current?.sendRequest(() => {
                return AdminUserAPI.uploadAvatar(
                    {
                        image: file,
                        id: addUserReq?.data
                    })
            }, {
                waitingMessage: 'Đang xử lí ảnh',
                hideWhenDone: true
            });
            if (updateImageReq) {
                current?.setState(state);
            } else {
                state.color = 'warning';
                state.message += ` - ${current?.state.message}`;
                current?.setState(state);
            }
        };
        this.setDisable(false);
    }
    render() {
        return (
            <div className="form-container">
                <AdminMessageRequest ref={this.messageRequest} />
                <WForm id={`form-main`} className={this.state.isDisable ? 'disabled' : ''} onSubmit={this.onSubmitForm.bind(this)}>
                    <div className="d-flex justify-content-between">
                        <h2>Thêm tài khoản</h2>
                        <img className="avatar" title="Ảnh đại diện" src={process.env.REACT_APP_ADMIN_USER_IMAGE_PATH + 'default.jpg'} alt="Avatar" ref={this.avatar}
                            onClick={() => { this.avatarInput.current?.click(); }}
                        ></img>
                    </div>
                    <div className="d-flex space-nm">
                        <WInput title_input="Tên tài khoản" value={this.state.input.adminCode} is_invalid={!this.state.isValidInput.adminCode}
                            onChange={(evt) => {
                                this.inputChange('adminCode', evt,
                                    (evt) => { this.state.isValidInput.adminCode = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.code) != null })
                            }} required />
                        <WInput title_input="Email" value={this.state.input.email}
                            is_invalid={!this.state.isValidInput.email}
                            onChange={(evt) => {
                                this.inputChange('email', evt,
                                    (evt) => { this.state.isValidInput.email = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.email) != null })
                            }} required />
                    </div>
                    <div className="d-flex space-nm">
                        <WInput title_input="Mật khẩu" value={this.state.input.password} type="password"
                            onChange={(evt) => {
                                this.inputChange('password', evt,
                                    (evt) => { this.state.isValidInput.passwordConfirm = this.state.passwordConfirmInput === evt.currentTarget.value }
                                )
                            }} required />
                        <WInput title_input="Xác nhận mật khẩu" value={this.state.passwordConfirmInput} type="password"
                            is_invalid={!this.state.isValidInput.passwordConfirm}
                            onChange={(evt) => {
                                let pwConfirm = evt.currentTarget.value;
                                this.state.isValidInput.passwordConfirm = this.state.input.password === pwConfirm;
                                this.setState({ passwordConfirmInput: pwConfirm });
                            }} required />
                    </div>
                    <div className="d-flex space-nm">
                        <WInput title_input="Tên đầy đủ" value={this.state.input.fullname}
                            onChange={(evt) => { this.inputChange('fullname', evt) }} required />
                        <WInput title_input="Ngày sinh" value={this.state.input.dateOfBirth} no_title_animation={true} type="date"
                            onChange={(evt) => { this.inputChange('dateOfBirth', evt) }} required />
                    </div>
                    <div className="d-flex space-nm">
                        <WInput title_input="Số điện thoại" value={this.state.input.phone} is_invalid={!this.state.isValidInput.phone}
                            onChange={(evt) => {
                                this.inputChange('phone', evt,
                                    (evt) => { this.state.isValidInput.phone = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.numbers) != null }
                                )
                            }} required />
                        <WInput title_input="Số chứng minh thư" value={this.state.input.identityDocument} is_invalid={!this.state.isValidInput.identityDocument}
                            onChange={(evt) => {
                                this.inputChange('identityDocument', evt,
                                    (evt) => { this.state.isValidInput.identityDocument = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.numbers) != null })
                            }} required />
                    </div>
                    <WInput title_input="Địa chỉ" value={this.state.input.address}
                        onChange={(evt) => { this.inputChange('address', evt) }} required />
                    <input type="file" style={{ display: 'none' }} ref={this.avatarInput} accept="image/*" onChange={
                        (evt) => {
                            let { files } = evt.currentTarget;
                            if (files && files[0]) {
                                let image = this.avatar.current;
                                let reader = new FileReader();
                                reader.onload = ({ target }) => {
                                    (image as any).src = target?.result;
                                };
                                reader.readAsDataURL(files[0]);
                            }
                        }
                    } />
                    <div className="winput-group-other">
                        <label>Giới tính</label>
                        <div className="d-flex space-nm">
                            <label><input type="radio" name="gender2" value="0" onChange={this.radioInputGender.bind(this)} defaultChecked />Nam</label>
                            <label><input type="radio" name="gender2" value="1" onChange={this.radioInputGender.bind(this)} />Nữ</label>
                            <label><input type="radio" name="gender2" value="2" onChange={this.radioInputGender.bind(this)} />Khác</label>
                        </div>
                    </div>

                    <div style={{ marginTop: 16 }} className="d-flex space-sm">
                        <Button color="primary" size="sm">Thêm</Button>
                        <Link to="/admin/admin-users"><Button color="danger" type="button" size="sm">Quay về</Button></Link>
                    </div>
                </WForm>
            </div>
        )
    }
}

