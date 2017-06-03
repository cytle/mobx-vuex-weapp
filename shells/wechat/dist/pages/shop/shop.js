import xuxPage, { mapActions, mapGetters, mapState } from '../../utils/xuxPage';
import { navigateTo } from '../../utils/util';

xuxPage({
    data: {
        queueId: '',
        entityId: '',
        mobilePhone: '',
        // 是否已经绑定手机
        bindStatus: false,
        isEntityRunning: false,
        shop: {}
    },
    onLoad(query) {
        const entityId = query.entityId;
        this.setData({ entityId });

        this.findShop(entityId);
    },
    onStateChange() {
        const entityId = this.data.entityId;
        const ticket = this.findQueuingTicketByEntityId(entityId);

        this.setData({
            shop: this.getShopByEntityId(entityId),
            isEntityRunning: this.isEntityRunning(entityId),
            queueId: ticket ? ticket.queueId : '',
            mobilePhone: mapState('user', ['mobilePhone']).mobilePhone,
            bindStatus: mapState('shop', ['bindStatus']).bindStatus
        });
        // console.warn(this.data.shop);
    },
    onShow() {
        const entityId = this.data.entityId;
        this.findShopSeatTypes(entityId);
        this.fetchEntityQueueStateByEntityId(entityId);
    },
    toTakeNo() {
        if (this.data.mobilePhone) {
            navigateTo('../takeTicket/takeTicket', {
                entityId: this.data.entityId
            });
        } else {
            // 跳到绑定手机页面
            navigateTo('../bindPhone/bindPhone', {
                entityId: this.data.entityId
            });
        }
    },
    goCheckQueue() {
        navigateTo('../detail/detail', {
            queueId: this.data.queueId,
            entityId: this.data.entityId
        });
    },
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.shop.entity.phone
        });
    }
}, mapActions('shops', [
    'findShopSeatTypes',
    'findShop'
]), mapGetters('shops', [
    'getShopByEntityId',
]), mapGetters('tickets', [
    'findQueuingTicketByEntityId',
]), mapActions('entityQueueStates', [
    'fetchEntityQueueStateByEntityId'
]), mapGetters('entityQueueStates', [
    'isEntityRunning'
]));
