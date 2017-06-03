import request from './request';

function getEntityIdFromUrl(url, cb) {
    const app = getApp();
    request({
        url: `${app.config.API_BASE}/mini_program/v1/qrcode`,
        data: {
            qr_url: url
        },
        method: 'GET',
        success({code, data, message}) {
            if (+code !== 1) {
                cb({errMsg: message}, data);
                return;
            }
            cb(null, data);
        },
        fail() {
            cb({errMsg: '接口请求失败'});
        }
    });
}

export default function getEntityIdFromQrCode(cb) {
    wx.scanCode({
        success({result: url}) {
            getEntityIdFromUrl(url, cb);
        },
        fail({errMsg}) {
            cb({errMsg});
        }
    });
}
