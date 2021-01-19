import React, { Component } from 'react';
import { Table, message } from 'antd';
import { IBikeData } from '@/interface';
import { observer, inject } from 'mobx-react';

interface Props {
  homeStore: any;
}

interface State {
  loading: boolean;
}

const columns: any = [
  {
    title: '订单号',
    dataIndex: 'orderid',
    key: 'orderid'
  },
  {
    title: '单车号',
    dataIndex: 'bikeid',
    key: 'bikeid'
  },
  {
    title: '用户id',
    dataIndex: 'userid',
    key: 'userid'
  },
  {
    title: '出发时间',
    dataIndex: 'start_time',
    key: 'start_time',
    sorter: (a: IBikeData, b: IBikeData) => a.start_time_num - b.start_time_num
  },
  {
    title: '出发地点',
    dataIndex: 'start_location',
    key: 'start_location'
  },
  {
    title: '到达时间',
    dataIndex: 'end_time',
    key: 'end_time',
    sorter: (a: IBikeData, b: IBikeData) => a.end_time_num - b.end_time_num
  },
  {
    title: '到达地点',
    dataIndex: 'end_location',
    key: 'end_location'
  },
  {
    title: 'Action',
    key: 'action',
    render: () => <a href="javascript:void(0)">查看路线</a>
  }
];

@inject('homeStore')
@observer
class TablePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.handleMounted();
  }

  async handleMounted() {
    try {
      await this.props.homeStore.getBikeData(0, 20);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  render = () => {
    const { loading } = this.state;
    const { homeStore } = this.props;

    return (
      <div className="table-page">
        <div className="table-page_body">
          <Table
            loading={loading}
            columns={columns}
            dataSource={homeStore.bike_data}
            scroll={{ x: 1000, y: 600 }}
          />
        </div>
      </div>
    );
  };
}

export default TablePage;
