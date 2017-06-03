import { objectAssign, mobx } from '../logics/utils';
const { store, componentHelper } = getApp();

export const mapMutations = componentHelper.mapMutations;
export const mapActions = componentHelper.mapActions;
export const mapState = componentHelper.mapState;
export const mapFilters = componentHelper.mapFilters;

export default function xuxPage(page, ...mixins) {
    const pageOnHide = page.onHide;
    const pageOnShow = page.onShow;

    Page(objectAssign({}, page, {
        $store: store,
    // onStateChange () {},
        onShow(...args) {
            console.log(store.main.items);
            mobx.autorun(() => {
                console.log(store.main.items);
            });
            if (this.onStateChange) {
                this.onStateChange = this.onStateChange.bind(this);
                store.subscribe(this.onStateChange);
                this.onStateChange({ type: 'PAGE_INIT', name: '', payload: null });
            }
            if (pageOnShow) {
                pageOnShow.apply(this, args);
            }
        },
        onHide(...args) {
            if (this.onStateChange) {
                store.unsubscribe(this.onStateChange);
            }
            if (pageOnHide) {
                pageOnHide.apply(this, args);
            }
        },
    }, ...mixins));
}
