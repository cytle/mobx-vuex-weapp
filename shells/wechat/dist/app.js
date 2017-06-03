import app from './logics/app';
import userLogin from './utils/userLogin';
import { log } from './utils/util';
import request, { setToken } from './utils/request';

App({
    onLaunch() {
        app.init({ request });

        this.componentHelper = app.componentHelper;
        this.store = app.store;
        this.config = app.config;
        this.login();

        wx.getLocation({
            success: (res) => {
                this.store.commit('location/LOCATION_CHANGE', res);
            },
            complete: (...args) => {
                console.warn(args);
            }
        });
        log('launch');
    },
    login() {
        userLogin();
        // wx.checkSession({
        //     success() {
        //         // TODO 判断是否需要登录
        //         userLogin();
        //         // cb({ isLogin: true, /* userData... */ });
        //     },
        //     fail() {
        //         userLogin();
        //     }
        // });
    },
    logined(error, data) {
        if (error) {
            log('login:fail');
            log(error);
            wx.showModal({
                showCancel: false,
                title: '授权失败',
                content: '未授权情况下，不能使用任何服务，请关闭后重新打开小应用．'
            });
            return;
        }
        setToken(data.token);
        this.store.commit('user/LOGINED', data);
        log('logined');
    },
    onError(msg) {
        log(msg);
    },
    componentHelper: {},
    store: null,
    globalData: {
        userInfo: null,
    },
});
