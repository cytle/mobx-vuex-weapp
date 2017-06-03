import { delayShowLoading, cancleDelayShowLoading } from '../../utils/util';
import xuxPage, {mapActions, mapGetters} from '../../utils/xuxPage';

// 分别对应：排队中；用餐中；已过号；客户已取消；商家已取消
const queueStatusNames = {
    '1': 'queuing',
    '2': 'dining',
    '3': 'queued',
    '4': 'cancel',
    '5': 'cancel',
    '6': 'complete'
};

xuxPage({
    data: {
        modalHidden: true,
        statusImg: '',
        queueId: '',
        queueDetail: {}
    },
    onStateChange () {
        const queueDetail = this.getTicketsByQueueId(this.data.queueId);
        if (!queueDetail) {
            return;
        }
        const statusName = queueStatusNames[queueDetail.queueStatus];
        this.setData({
            statusImg: `../../img/queue/${statusName}.png`,
            queueDetail
        });
    },
    onLoad (query) {
        this.setData({ queueId: query.queueId });
        this.fetchTickets();
    },
    showModal () {
        this.setData({modalHidden: false});
    },
    modalBindaconfirm () {
        delayShowLoading({
            title: '取消中...'
        }, 500);
        this.cancelQueue({queueId: this.data.queueId, entityId: this.data.queueDetail.entityId}).then(() => {
            cancleDelayShowLoading();
            this.setData({modalHidden: true});
            this.fetchTickets();
        }).catch(() => {
            cancleDelayShowLoading();
            this.setData({modalHidden: true});
            this.fetchTickets();
        });
    },
    modalBindcancel () {
        this.setData({modalHidden: true});
    }
}, mapActions('tickets', [
    'cancelQueue',
    'fetchTickets'
])
, mapGetters('tickets', [
    'getTicketsByQueueId'
])
);

