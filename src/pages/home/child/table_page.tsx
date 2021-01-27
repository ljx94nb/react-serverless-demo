import React, { Component } from 'react';
import { Table, message, Input, Select, Button, Space } from 'antd';
import { IBikeData } from '@/interface';
import { observer, inject } from 'mobx-react';
import { addInDB, readInDB } from '@/indexedDB';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Map from './map_page';

interface Props {
  homeStore: any;
}

interface State {
  loading: boolean;
  currPage: number;
  pageSize: number;
  searchText: string;
  searchedColumn: string;
  path: [][];
  zoom: number;
  rowId: string;
}

const { Option } = Select;
const pageCut: string[] = [];
for (let i = 0; i <= 100000; i = i + 100) {
  pageCut.push(`${i + 1}—${i + 100}`);
}

@inject('homeStore')
@observer
class TablePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      currPage: 0,
      pageSize: 100,
      searchText: '',
      searchedColumn: '',
      path: [],
      zoom: 12,
      rowId: ''
    };
  }
  private searchInput: any;

  componentDidMount() {
    this.handleMounted();
  }

  async handleMounted() {
    const { currPage, pageSize } = this.state;
    try {
      try {
        const buffer = await readInDB(currPage);
        this.props.homeStore.setBikeData(buffer);
      } catch (err) {
        await this.props.homeStore.getBikeData(currPage, pageSize);
        addInDB({ currPage, data: this.props.homeStore.bike_data });
      }
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  // 选择框选中选项的时候调用此函数
  handleSelect = (e: any) => {
    this.setState({
      loading: true
    });
    const arr = e.split('—');
    this.setState(
      {
        currPage: Number(arr[1]) / 100 - 1
      },
      () => {
        this.handleMounted();
      }
    );
  };

  // 筛选功能
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });

  // 点击搜索
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  // 点击重置
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // 查看路线
  lookPath = (record) => {
    // console.log(record);
    this.setState({
      path: record.track,
      rowId: record._id
    });
  };

  // 设置选中行高亮的类名
  setRowClassName = (record) => {
    return record._id === this.state.rowId ? 'table-row-selected' : '';
  };

  render = () => {
    const { loading, path, zoom } = this.state;
    const { homeStore } = this.props;
    const columns: any = [
      {
        title: '订单号',
        dataIndex: 'orderid',
        key: 'orderid',
        ...this.getColumnSearchProps('orderid'),
        sorter: (a: IBikeData, b: IBikeData) => Number(a.orderid) - Number(b.orderid)
      },
      {
        title: '单车号',
        dataIndex: 'bikeid',
        key: 'bikeid',
        ...this.getColumnSearchProps('bikeid'),
        sorter: (a: IBikeData, b: IBikeData) => Number(a.bikeid) - Number(b.bikeid)
      },
      {
        title: '用户id',
        dataIndex: 'userid',
        key: 'userid',
        ...this.getColumnSearchProps('userid'),
        sorter: (a: IBikeData, b: IBikeData) => Number(a.userid) - Number(b.userid)
      },
      {
        title: '出发时间',
        dataIndex: 'start_time',
        key: 'start_time',
        ...this.getColumnSearchProps('start_time'),
        sorter: (a: IBikeData, b: IBikeData) => a.start_time_num - b.start_time_num
      },
      {
        title: '出发地点',
        dataIndex: 'start_location',
        key: 'start_location',
        ...this.getColumnSearchProps('start_location')
      },
      {
        title: '到达时间',
        dataIndex: 'end_time',
        key: 'end_time',
        ...this.getColumnSearchProps('end_time'),
        sorter: (a: IBikeData, b: IBikeData) => a.end_time_num - b.end_time_num
      },
      {
        title: '到达地点',
        dataIndex: 'end_location',
        key: 'end_location',
        ...this.getColumnSearchProps('end_location')
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <a href="javascript:void(0)" onClick={() => this.lookPath(record)}>
            查看路线
          </a>
        )
      }
    ];

    return (
      <div className="table-page">
        <div className="table-page-header">
          <span>请选择所要展示的区间：</span>
          {loading ? null : (
          <Select defaultValue="1—100" onChange={this.handleSelect} style={{ width: '30%' }}>
            {pageCut.map((item: string, index) => (
              <Option value={item} key={index}>
                {item}
              </Option>
            ))}
          </Select>
          )}
        </div>
        <div className="table-page_body">
          <Table
            loading={loading}
            columns={columns}
            dataSource={homeStore.bike_data}
            scroll={{ x: 1000, y: 386 }}
            rowClassName={this.setRowClassName}
          />
        </div>
        {loading ? null : (
          <div className="table-page-map">
            <Map path={path} zoom={zoom} />
          </div>
        )}
      </div>
    );
  };
}

export default TablePage;
