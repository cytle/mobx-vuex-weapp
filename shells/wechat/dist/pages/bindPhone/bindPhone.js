import xuxPage, {mapActions} from '../../utils/xuxPage';
import {redirectTo} from '../../utils/util';
import {validateMobilePhone} from '../../logics/utils';
xuxPage({
    data: {
        tipText: '',
        mobile: '',
        entityId: '',
        code: '',
        verifyCodeSeconds: -1,
        verifyCodeSecondsIntervalIndex: null
    },
    bindMobileInput(e) {
        this.setData({ mobile: e.detail.value });
    },
    bindCodeInput(e) {
        this.setData({code: e.detail.value});
    },
    onLoad(query) {
        const { entityId } = query;
        this.setData({ entityId });
    },
    sendVerifyCode() {
        const mobile = this.data.mobile;
        if (!validateMobilePhone(mobile)) {
            this.setTipText('手机号码格式不正确');
            return;
        }

        this.checkPhone(mobile)
        .then(() => {
            this.unsetTipText();
            this.getVerifyCode(mobile).then(() => {
                this.sendVerifyCodeSuccess();
            }).catch(data => {
                this.setTipText(+data.code === 0 ? data.message: '手机号码有误');
            });
        })
        .catch(data => {
            this.setTipText(+data.code === 1 ? data.message: '手机号码已被绑定');
        });
    },
    sendVerifyCodeSuccess() {
        clearInterval(this.data.verifyCodeSecondsIntervalIndex);

        const verifyCodeSecondsIntervalIndex = setInterval(() => {
            const verifyCodeSeconds = this.data.verifyCodeSeconds;
            if (verifyCodeSeconds <= 1) {
                clearInterval(this.data.verifyCodeSecondsIntervalIndex);
            }
            this.setData({ verifyCodeSeconds: verifyCodeSeconds - 1});
        }, 1000);

        this.unsetTipText();
        this.setData({ verifyCodeSecondsIntervalIndex, verifyCodeSeconds: 60 });
    },
    setTipText(tipText) {
        clearTimeout(this.data.tipTextTimeoutIndex);
        const tipTextTimeoutIndex = setTimeout(this.unsetTipText.bind(this), 2000);
        this.setData({ tipText, tipTextTimeoutIndex });
    },
    unsetTipText() {
        clearTimeout(this.data.tipTextTimeoutIndex);
        this.setData({ tipText: '' });
    },
    bindPhone() {
        const { entityId, mobile, code } = this.data;

        this.bindPhone({ mobile, code })
        .then(() => {
            this.unsetTipText();
            redirectTo('../takeTicket/takeTicket', { entityId });
        })
        .catch(data => {
            this.setTipText(+data.code === 0 ? data.message: '网络出错');
        });
    }
}, mapActions('user', [
    'checkPhone',
    'getVerifyCode',
    'bindPhone'
]));

