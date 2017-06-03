import xuxPage, {mapActions, mapState, mapMutations, mapFilters} from '../../utils/xuxPage';
import {navigateTo} from '../../utils/util';
import { objectAssign } from '../../logics/utils';

xuxPage({
    data: {
        shops: [],
        noMore: false,
        loading: false,
        searchTimeoutIndex: null,
        keyword: ''
    },
    onReachBottom() {
        this.loadMore().then(this.fetchEntityQueueStates);
    },
    onStateChange() {
        this.setData(mapState('search', ['noMore']));
        this.setData(mapState('search', {
            shops: ({ items }) => items.map(item => ({ entity: item, isRunning: this.isEntityRunning(item.entityId) })),
        }));
    },
    delaySearch(keyword) {
        clearTimeout(this.data.searchTimeoutIndex);
        if (!keyword) {
            this.setData({ keyword: '' });
            this.search({});
            return;
        }
        const searchTimeoutIndex = setTimeout(() => {
            this.search(objectAssign({}, this.getLocation(), { keyword: this.data.keyword }))
                .then(this.fetchEntityQueueStates);
        }, 500);
        this.setData({
            keyword,
            searchTimeoutIndex
        });
    },
    bindKeyWordInput(e) {
        this.delaySearch(e.detail.value);
    },
    clearKeyWordInput() {
        this.delaySearch('');
    },
    goShop(e) {
        const entityId = e.currentTarget.dataset.id;
        navigateTo('../shop/shop', {entityId});
    },
}, mapActions('search', [
    'loadMore',
    'search'
]), mapMutations('search', {
    initSearch: 'INIT'
}), mapFilters('location', [
    'getLocation'
]), mapFilters('entityQueueStates', [
    'isEntityRunning'
]), mapActions('entityQueueStates', [
    'fetchEntityQueueStates'
]));
