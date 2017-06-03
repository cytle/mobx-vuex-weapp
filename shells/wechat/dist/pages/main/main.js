import xuxPage, {mapActions, mapState, mapFilters} from '../../utils/xuxPage';
import {navigateTo, log, delayShowLoading, cancleDelayShowLoading} from '../../utils/util';
import getEntityIdFromQrCode from '../../utils/getEntityIdFromQrCode';

//
let fetchTicketsTimeoutIndex = null;


xuxPage({
    data: {
        shops: [],
        noMore: false,
        loading: false,
        tickets: []
    },

    onLoad () {
        this.refresh(this.getLocation())
            .then(this.fetchEntityQueueStates);
    },
    onShow () {
        this.refresOnlyhWhenLoactionChange(this.getLocation())
            .then(this.fetchEntityQueueStates);
        this.fetchTickets();
        this.autoFetchTickets();
    },
    onHide() {
        this.cancleAutoFetchTickets();
    },
    cancleAutoFetchTickets() {
        clearTimeout(fetchTicketsTimeoutIndex);
    },

    autoFetchTickets() {
        this.cancleAutoFetchTickets();
        fetchTicketsTimeoutIndex = setTimeout(() => {
            this.fetchTickets().then(() => {
                this.autoFetchTickets();
            }, () => {
                this.autoFetchTickets();
            });
        }, 10000);
    },

    onStateChange(mutation) {
        this.setData(mapState('tickets', {
            tickets: ({ tickets }) => tickets.filter(vo => vo.queueStatus !== 4)
        }));
        this.setData(mapState('main', {
            shops: ({ items }) => items.map(item => ({ entity: item, isRunning: this.isEntityRunning(item.entityId) })),
            noMore: 'noMore'
        }));

        if (mutation.type === 'location/LOCATION_CHANGE') {
            this.refresOnlyhWhenLoactionChange(this.getLocation())
                .then(this.fetchEntityQueueStates);
        }
    },

    onPullDownRefresh() {
        this.refresh(this.getLocation())
            .then(shops => {
                wx.stopPullDownRefresh();
                this.fetchEntityQueueStates(shops);
            });
    },
    onReachBottom() {
        this.loadMore().then(this.fetchEntityQueueStates);
    },

    goShop(e) {
        const entityId = e.currentTarget.dataset.id;
        navigateTo('../shop/shop', {entityId});
    },
    goCheckQueue(e) {
        const queueId = e.currentTarget.dataset.id;
        navigateTo('../detail/detail', {
            queueId: queueId
        });
    },
    scanCode() {
        delayShowLoading({
            title: '正在查找餐厅'
        }, 500);
        getEntityIdFromQrCode((error, entityId) => {
            cancleDelayShowLoading();
            if (error) {
                if (error.errMsg === 'scanCode:fail cancel') {
                    return;
                }
                log(error);
                wx.showModal({
                    content: '没有找到餐厅',
                    showCancel: false
                });
                return;
            }
            navigateTo('../shop/shop', {entityId});
        });
    },
    goSearch() {
        navigateTo('../search/search');
    }
}, mapActions('main', [
    'loadMore',
    'refresh',
    'refresOnlyhWhenLoactionChange'
]), mapActions('tickets', [
    'fetchTickets'
]), mapFilters('location', [
    'getLocation'
]), mapActions('entityQueueStates', [
    'fetchEntityQueueStates'
]), mapFilters('entityQueueStates', [
    'isEntityRunning'
]));
