import userLogin from './userLogin';
import { isFunction, objectAssign, createUrlWithQuery } from '../logics/utils';

let token = wx.getStorageSync('token');

export function setToken(t) {
    token = t;
    wx.setStorageSync('token', token);
}

export function getToken() {
    return token;
}

export default function request(options = {}) {
    const realOptions = objectAssign({}, options, {
        url: createUrlWithQuery(options.url, { xtoken: token }),
        header: {
            // 'content-type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'
        },
        success({ data: result }) {
            if (+result.code === -1) {
                userLogin(error => {
                    // 如果登录失败则不再请求
                    if (error) {
                        console.error(error);
                        if (isFunction(options.fail)) {
                            options.fail.call(this, result);
                        }
                        return;
                    }
                    // TODO 防止同时过多request
                    // 重新请求
                    request(options);
                });
                return;
            }
            if (isFunction(options.success)) {
                options.success.call(this, result);
            }
        }
    });
    wx.request(realOptions);
}
