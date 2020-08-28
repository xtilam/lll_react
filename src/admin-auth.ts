const authentication = {
    login: (admin: any) => { localStorage.setItem('admin', JSON.stringify(admin)); window.location.href = '/admin'; },
    logout: () => { localStorage.removeItem('admin'); window.location.href = '/admin/login' },
    isLogin: (): boolean => { return !(localStorage.admin === undefined); }
};

export default authentication;