import xuxPage, { mapActions } from '../../utils/xuxPage';
import { redirectTo, delayShowLoading, cancleDelayShowLoading } from '../../utils/util';

xuxPage({
    data: {
        customerNum: 2,
        customerAllNumbers: Array.from(Array(50), (v, k) => k + 1)
    },
    onLoad(query) {
        const entityId = query.entityId;
        this.setData({ entityId });
    },

    handleChange(e) {
        this.setData({customerNum: parseInt(e.detail.value) + 1});
    },

    takeNo() {
        const entityId = this.data.entityId;
        const customerNum = this.data.customerNum;

        if (!customerNum) {
            return this.openAlert("就餐人数不能为空");
        }

        delayShowLoading({ title: '取号中...' });
        this.takeTicket({ entityId, customerNum })
            .then(({ code, data }) => {
                cancleDelayShowLoading();
                if (code === 1) {
                    redirectTo('../detail/detail', { queueId: data.queueId });
                }
            })
            .catch(({ errorCode, message }) => {
                cancleDelayShowLoading();
                if (+errorCode === 1004) {
                    this.openAlert("您已经取过号了, 去看看吧", () => {
                        redirectTo('../shop/shop', { entityId: this.data.entityId });
                    });
                } else if (message) {
                    this.openAlert(message);
                }
            });
    },
    openAlert (content, callback) {
        wx.showModal({
            content: content,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    if (callback) {
                        callback();
                    }
                }
            }
        });
    }
}, mapActions('tickets', [
    'takeTicket',
]));
