import React, { FormEvent } from "react";
import { Redirect } from "react-router-dom";
import authentication from "../../admin-auth";
import AdminUserAPI from "../../api/admin/admin-api";
import WInput from "../../components/winput";
import LoadingSVG from "../../logo-svg/loading";
import './admin-login.scss';
interface LoginPageState {
    statusLogin: string | undefined,
    userInputType: {
        paramName: string | undefined,
        name: string | undefined
    } | any
}

export default class LoginPage extends React.Component<any, LoginPageState> {
    static REGEX = {
        username: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/g,
        email: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/g
    }
    usernameInput: React.RefObject<HTMLInputElement>;
    passwordInput: React.RefObject<HTMLInputElement>;
    loginBtn: React.RefObject<HTMLButtonElement>;
    constructor(props: any) {
        super(props);
        this.usernameInput = React.createRef();
        this.passwordInput = React.createRef();
        this.loginBtn = React.createRef();
        this.state = {
            statusLogin: undefined,
            userInputType: {}
        }
    }
    componentDidMount() {

        this.usernameInput.current?.parentElement?.click();
    }
    userTypeOnChange() {
        let inputText = this.usernameInput.current?.value || '';
        if (inputText.match(LoginPage.REGEX.email)) {
            this.setState({ userInputType: { paramName: 'email', name: 'Email' } });
        } else if (inputText.match(LoginPage.REGEX.username)) {
            this.setState({ userInputType: { paramName: 'username', name: 'Tên đăng nhập' } });
        } else {
            this.setState({ userInputType: {} });
        }
    }
    async onSubmit(evt: FormEvent) {
        evt.preventDefault();
        console.log(this.state.userInputType);
        if (this.state.userInputType.paramName) {
            await new Promise(async (resolve) => {
                let statusLoginCompelete: any;
                let isSkipTimeout = false;
                let setCompelete = (statusLogin: string) => {
                    this.setState({ statusLogin: statusLogin });
                    this.usernameInput.current?.removeAttribute('readonly');
                    this.passwordInput.current?.removeAttribute('readonly');
                    (this.loginBtn.current as HTMLButtonElement).disabled = false;
                }

                setTimeout(() => {
                    if (statusLoginCompelete) setCompelete(statusLoginCompelete);
                    isSkipTimeout = true;
                }, 1000);

                this.setState({ statusLogin: 'wait-login' });
                this.usernameInput.current?.setAttribute('readonly', '');
                this.passwordInput.current?.setAttribute('readonly', '');
                (this.loginBtn.current as HTMLButtonElement).disabled = true;
                let dataLogin: any = { password: this.passwordInput.current?.value };
                dataLogin[this.state.userInputType.paramName] = this.usernameInput.current?.value;
                console.log(dataLogin);
                try {
                    let resp = await AdminUserAPI.login(dataLogin as any);
                    authentication.login(resp.data);
                } catch (error) {
                    console.log(error);
                    if (isSkipTimeout)
                        setCompelete('login-failed');
                    else
                        statusLoginCompelete = 'login-failed';
                }
            });
        } else {
            this.usernameInput.current?.focus();
            this.setState({ statusLogin: 'input-wrong' });
        }
    }
    render() {
        if (authentication.isLogin()) {
            return <Redirect to='/admin'></Redirect>;
        } else {
            return (<div style={{ padding: '20px' }}>
                <form id='login-form' className='d-flex flex-column' onSubmit={this.onSubmit.bind(this)}>
                    <h2 className='text-center'>Đăng Nhập</h2>
                    <WInput nameInput={this.state.userInputType.name || 'Tên đăng nhập hoặc Email'}>
                        <input className={this.state.userInputType.name ? '' : 'incorrect-input'} onChange={this.userTypeOnChange.bind(this)} type='text' required ref={this.usernameInput}></input></WInput>
                    <WInput nameInput='Mật khẩu'>
                        <input type='password' required ref={this.passwordInput}></input></WInput>
                    <div className='status-login'>
                        {(() => {
                            let output;
                            switch (this.state.statusLogin) {
                                case 'wait-login':
                                    output = <div className='d-inline-flex align-items-center'><LoadingSVG className='spin' style={{ marginRight: '8px', height: '14px' }} /><span className='loading-text'>Đang đăng nhập</span></div>;
                                    break;
                                case 'login-failed':
                                    output = <span className='text-danger'>Đăng nhập thất bại</span>;
                                    break;
                                case 'input-wrong':
                                    output = <span className='text-danger'>Vui lòng nhập thông tin chính xác</span>
                                    break;
                            }
                            return output;
                        })()}
                    </div>
                    <button className='btn btn-success' ref={this.loginBtn}>Đăng Nhập</button>
                </form>
            </div>)
        }
    }
}