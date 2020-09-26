import React from "react";
import AdminUserAPI, { AdminUserResult, AdminDTO } from "../../../api/admin/admin-api";
import moment from "moment";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";
import WForm from "../../../components/wform";
import SYSTEM_CONSTANTS from "../../../constants";
import WInput from "../../../components/winput";
import { Button } from "reactstrap";

interface EditAdminUserProps {
    adminInfo: AdminUserResult,
    adminMessageRequest: AdminMessageRequest,
    onUpdate?: () => any
}
interface EditAdminUserState {
    input: AdminDTO,
    isValidInput: {
        email: boolean,
        phone: boolean,
        identityDocument: boolean
    }
}
export default class EditAdminUser extends React.Component<EditAdminUserProps, EditAdminUserState>{
    avatar: React.RefObject<HTMLImageElement> = React.createRef();
    avatarInput: React.RefObject<HTMLInputElement> = React.createRef();
    wform: React.RefObject<WForm> = React.createRef();
    constructor(props: EditAdminUserProps) {
        super(props);
        this.state = {
            input: {},
            isValidInput: { email: true, phone: true, identityDocument: true },
        }
    }
    componentDidMount() {
        this.setInput();
    }
    setInput() {
        let { adminInfo } = this.props;
        let input: AdminDTO = {
            id: adminInfo.id as any,
            address: adminInfo.address,
            adminCode: adminInfo.adminCode,
            dateOfBirth: moment(adminInfo.dateOfBirth).format('YYYY-MM-DD'),
            email: adminInfo.email,
            fullname: adminInfo.fullname,
            gender: adminInfo.gender as any,
            identityDocument: adminInfo.identityDocument,
            phone: adminInfo.phone
        };
        (this.avatar.current as any).src = `${process.env.REACT_APP_ADMIN_USER_IMAGE_PATH}${adminInfo.id}.jpg`;
        (this.avatarInput as any).current.files = undefined;
        this.setState(() => { return { input: input, isValidInput: { email: true, phone: true, identityDocument: true } } });
    }
    inputChange(fieldChange: string, evt: React.FormEvent<HTMLInputElement>, otherAction?: (evt: React.FormEvent<HTMLInputElement>) => any) {
        (this.state.input as any)[fieldChange] = evt.currentTarget.value;
        otherAction instanceof Function && otherAction(evt);
        this.setState({});
    }
    radioInputGender(evt: React.ChangeEvent<HTMLInputElement>) {
        this.state.input.gender = evt.currentTarget.value;
    }
    async updateAdminUser(evt: any) {
        evt.preventDefault();
        if (this.wform.current?.isValidInputs()) {
            let update = await this.props.adminMessageRequest.sendRequest(() => {
                return AdminUserAPI.updateUser(this.state.input);
            })
            if (update) {
                let file: any = (this.avatarInput.current as any).files[0];
                if (file) {
                    let messageErrorUploadImage = update.message.content;
                    let uploadImage: any = await this.props.adminMessageRequest.sendRequest(() => {
                        return AdminUserAPI.uploadAvatar({ image: file, id: this.props.adminInfo.id });
                    }, { getFailed: true });
                    if (uploadImage.message.code !== 0) {
                        messageErrorUploadImage += ` - ${this.props.adminMessageRequest.state.message}`;
                        this.props.adminMessageRequest.setState({ color: 'warning', message: messageErrorUploadImage, isHide: false });
                    }
                }
                this.props.onUpdate && await this.props.onUpdate();
            }
        }
    }
    render() {
        let { input, isValidInput } = this.state;
        return (
            <WForm id={`form-main`} onSubmit={this.updateAdminUser.bind(this)} ref={this.wform as any} >
                <div className="d-flex justify-content-between">
                    <h2>Cập nhật tài khoản {this.props.adminInfo.fullname}</h2>
                    <img className="avatar" title="Ảnh đại diện" src={process.env.REACT_APP_ADMIN_USER_IMAGE_PATH + 'default.jpg'} alt="Avatar"
                        onError={(evt) => {
                            evt.currentTarget.src = process.env.REACT_APP_ADMIN_USER_IMAGE_PATH + 'default.jpg';
                        }}
                        ref={this.avatar}
                        onClick={() => { (this.avatarInput.current as any).click() }}
                    ></img>
                </div>
                <div className="d-flex space-nm">
                    <WInput title_input="Email" value={this.state.input.email}
                        is_invalid={!isValidInput.email}
                        onChange={(evt) => {
                            this.inputChange('email', evt,
                                (evt) => { this.state.isValidInput.email = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.email) !== null })
                        }} required />
                </div>
                <div className="d-flex space-nm">
                    <WInput title_input="Tên đầy đủ" value={input.fullname}
                        onChange={(evt) => { this.inputChange('fullname', evt) }} required />
                    <WInput title_input="Ngày sinh" value={input.dateOfBirth} no_title_animation={true} type="date"
                        onChange={(evt) => { this.inputChange('dateOfBirth', evt) }} required />
                </div>
                <div className="d-flex space-nm">
                    <WInput title_input="Số điện thoại" value={input.phone} is_invalid={!this.state.isValidInput.phone}
                        onChange={(evt) => {
                            this.inputChange('phone', evt,
                                (evt) => { this.state.isValidInput.phone = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.numbers) != null }
                            )
                        }} required />
                    <WInput title_input="Số chứng minh thư" value={input.identityDocument} is_invalid={!isValidInput.identityDocument}
                        onChange={(evt) => {
                            this.inputChange('identityDocument', evt,
                                (evt) => { this.state.isValidInput.identityDocument = evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.numbers) != null })
                        }} required />
                </div>
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
                <WInput title_input="Địa chỉ" value={input.address}
                    onChange={(evt) => { this.inputChange('address', evt) }} required />
                <div className="winput-group-other">
                    <label>Giới tính</label>
                    <div className="d-flex space-nm">
                        <label><input type="radio" name="gender" value="0" onChange={this.radioInputGender.bind(this)} defaultChecked />Nam</label>
                        <label><input type="radio" name="gender" value="1" onChange={this.radioInputGender.bind(this)} />Nữ</label>
                        <label><input type="radio" name="gender" value="2" onChange={this.radioInputGender.bind(this)} />Khác</label>
                    </div>
                </div>
                <br></br>
                <div className="d-flex space-sm">
                    <Button color="primary" size="sm">Cập nhật</Button>
                    <Button color="danger" size="sm" onClick={this.setInput.bind(this)}>Xóa</Button>
                </div>
            </WForm>
        );
    }
}