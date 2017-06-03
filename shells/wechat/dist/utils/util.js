import {queryParamsToString} from '../logics/utils';


export function navigateTo(pageUrl, params = {}) {
    const paramsStr = queryParamsToString(params);
    wx.navigateTo({url: pageUrl + (paramsStr ? ('?' + paramsStr) : '')});
}

export function redirectTo(pageUrl, params = {}) {
    const paramsStr = queryParamsToString(params);
    wx.redirectTo({url: pageUrl + (paramsStr ? ('?' + paramsStr) : '')});
}


export function log(msg = '') {
    // 调用API从本地缓存中获取数据
    if (wx.getStorageSync) {
        const logs = wx.getStorageSync('logs') || [];
        logs.splice(100);
        logs.unshift({
            time: parseInt(Date.now() / 1000, 10),
            msg
        });
        console.warn(msg);
        wx.setStorageSync('logs', logs);
    }
}


// let delayShowLoadingTimeoutIndex;    todo @chaofan es6 这样用有问题 (造成微信闪退 估计是内存溢出造成的)
export function delayShowLoading(options, delayTime = 500) {
    // clearTimeout(delayShowLoadingTimeoutIndex);
    // delayShowLoadingTimeoutIndex = setTimeout(() => {
    if (wx.showLoading) {    // todo @chaofan 兼容处理,低版本微信不支持会报js错误
        wx.showLoading(options);
    }
    // }, delayTime);
}

export function cancleDelayShowLoading() {
    // clearTimeout(delayShowLoadingTimeoutIndex);
    if (wx.hideLoading) {
       wx.hideLoading();
    }
}
