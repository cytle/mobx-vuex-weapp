import xuxPage, {mapState} from '../../utils/xuxPage';
xuxPage({
    data: {
        userInfo: {},
        mobilePhone: '',
        customerServicePhone: '4000-288-255'
    },
    onStateChange() {
        this.setData(mapState('user', ['userInfo', 'mobilePhone']));
    },

    callCustomerService() {
        wx.makePhoneCall({
            phoneNumber: this.data.customerServicePhone
        });
    }
});
