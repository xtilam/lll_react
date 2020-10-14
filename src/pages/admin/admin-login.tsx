import React from "react";
import { Redirect } from "react-router-dom";
import authentication from "../../admin-auth";
import AdminUserAPI from "../../api/admin/admin-api";
import WForm from "../../components/wform";
import WInput from "../../components/winput";
import SYSTEM_CONSTANTS from "../../constants";
import AdminAuthenticationProvider, { AdminAuthentication } from "../../contexts/admin-authencation";
import LoadingSVG from "../../logo-svg/loading";
import './admin-login.scss';
interface LoginPageState {
    statusLogin: string | undefined,
    accountInput: string,
    passwordInput: string,
    userInputType: {
        paramName: 'username' | 'email',
        name: string | undefined
    }
    isWattingRequest: boolean
}

export default class LoginPage extends React.Component<any, LoginPageState> {
    accountType: 'username' | 'email' | undefined = undefined;
    constructor(props: any) {
        super(props);
        this.state = {
            statusLogin: undefined,
            accountInput: '',
            passwordInput: '',
            userInputType: {} as any,
            isWattingRequest: false
        }
    }
    componentDidMount() {
        $('#username-input').focus();
    }
    userTypeOnChange(evt: React.FormEvent<HTMLInputElement>) {
        let inputText = evt.currentTarget.value;
        if (inputText.match(SYSTEM_CONSTANTS.REGEX.email)) {
            this.setState({ accountInput: inputText, userInputType: { paramName: 'email', name: 'Email' } });
        } else if (inputText.match(SYSTEM_CONSTANTS.REGEX.code)) {
            this.setState({ accountInput: inputText, userInputType: { paramName: 'username', name: 'Tên đăng nhập' } });
        } else {
            this.setState({ accountInput: inputText, userInputType: {} as any });
        }
    }
    async onSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        if (this.state.userInputType.paramName) {
            await new Promise(async (resolve) => {
                let statusLoginCompelete: any;
                let isSkipTimeout = false;
                let setCompelete = (statusLogin: string) => {
                    this.setState(() => { return { statusLogin: statusLogin, isWattingRequest: false } });
                }

                setTimeout(() => {
                    if (statusLoginCompelete) setCompelete(statusLoginCompelete);
                    isSkipTimeout = true;
                }, 1000);

                this.setState(() => { return { statusLogin: 'wait-login', isWattingRequest: true } });
                try {
                    let resp = await AdminUserAPI.login({
                        [this.state.userInputType.paramName]: this.state.accountInput,
                        password: this.state.passwordInput
                    });
                    authentication.login(resp.data.token, resp.data.data);
                } catch (error) {
                    if (isSkipTimeout)
                        setCompelete('login-failed');
                    else
                        statusLoginCompelete = 'login-failed';
                }
            });
        }
    }
    render() {
        let { accountInput, passwordInput, isWattingRequest } = this.state;
        return <AdminAuthenticationProvider>
            <AdminAuthentication.Consumer>
                {({ isLogin }) => {
                    return !isLogin
                        ? (<div style={{ padding: '20px' }}>
                            <WForm id='login-form' className='d-flex flex-column' onSubmit={this.onSubmit.bind(this)}>
                                <h2 className='text-center'>Đăng Nhập</h2>
                                <WInput
                                    type="text" required
                                    title_input={this.state.userInputType.name || 'Tên đăng nhập hoặc Email'}
                                    is_invalid={this.state.userInputType.name === undefined}
                                    value={accountInput}
                                    onChange={this.userTypeOnChange.bind(this)} disabled={isWattingRequest}
                                    id="username-input"
                                ></WInput>
                                <WInput title_input='Mật khẩu' type="password" required
                                    value={passwordInput}
                                    onChange={(evt) => {
                                        this.setState({ passwordInput: evt.currentTarget.value });
                                    }}
                                    disabled={isWattingRequest}
                                ></WInput>
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
                                <button className='btn btn-success' disabled={isWattingRequest}>Đăng Nhập</button>
                            </WForm>
                        </div>)
                        : <Redirect to="/admin" />
                }}
            </AdminAuthentication.Consumer>
        </AdminAuthenticationProvider>
    }
}