import { isFunction } from '../logics/utils';
import { log } from './util';

let userCode = null;
let lastLoginTime = 0;

// 设置4分钟的可用时间
const EXPIRATION_TIME = 60 * 1000 * 4;


function setUserCode(code) {
    if (userCode !== code) {
        userCode = code;
        lastLoginTime = Date.now();
    }
}

function getUserCode(cb) {
    if (userCode && Date.now() - lastLoginTime < EXPIRATION_TIME) {
        cb(null, userCode);
        return;
    }

    wx.login({
        success({ code, errMsg }) {
            if (code) {
                setUserCode(code);
                cb(null, code);
                return;
            }
            cb({ errMsg });
        },
        fail() {
            cb({ errMsg: '用户授权失败' });
        }
    });
}


function code2SessionApi({ code }, cb) {
    const app = getApp();
    wx.request({
        url: `${app.config.API_BASE}/mini_program/v1/auth/${code}/`,
        method: 'GET',
        success({ data: { message, code, data: sign } }) {
            if (+code !== 1) {
                cb({ errMsg: message });
                return;
            }
            cb(null, sign);
        },
        fail(res) {
            console.error(res);
        }
    });
}

function postUserInfoApi({ res, sign }, cb) {
    const app = getApp();
    wx.request({
        url: `${app.config.API_BASE}/mini_program/v1/user/get_info`,
        data: {
            sign,
            encrypted_data: res.encryptedData,
            iv: res.iv,
        },
        method: 'POST',
        success({ data: { code, data, message } }) {
            if (+code !== 1) {
                cb({ errMsg: message });
                return;
            }
            cb(null, data);
        },
        fail() {
            cb({ errMsg: '网络请求失败' });
        }
    });
}

function getUserInfo(cb) {
    wx.getUserInfo({
        success: cb,
        fail: cb
    });
}

let isLogining = false;
const loginCbList = [];

function beforeLogin(cb) {
    if (isFunction(cb)) {
        loginCbList.push(cb);
    }
}

function afterLogin(error, result) {
    isLogining = false;
    const app = getApp();
    app.logined(error, result);

    let cb = loginCbList.shift();
    while(cb) {
        try {
            cb(error, result);
        } catch(e) {
            log(e);
        }
        cb = loginCbList.shift();
    }
}

export default function userLogin (cb) {
    beforeLogin(cb);
    if (isLogining) {
        return;
    }
    isLogining = true;
    // 1. 获得 code
    getUserCode((error, code) => {
        if (error) {
            afterLogin(error);
            return;
        }

        // 2. 传给服务端,获得自己的session
        code2SessionApi({ code }, (error, sign) => {
            if (error) {
                afterLogin(error);
                return;
            }

            // 3. 获取 userInfo
            getUserInfo(res => {
                if (!res.userInfo) {
                    afterLogin({ errMsg: '获取微信用户信息失败' });
                    return;
                }

                // 4. 给服务的送去加密信息
                postUserInfoApi({ res, sign }, (error, data) => {
                    if (error) {
                        afterLogin(error, { userInfo: res.userInfo });
                        return;
                    }
                    // token 为默认字符串
                    afterLogin(null, { userInfo: res.userInfo, mobilePhone: data.mobile, token: data.token});
                });
            });
        });
    });
}
