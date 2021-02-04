import React, { Component } from 'react';
import { Table, message, Input, Select, Button, Space } from 'antd';
import { IBikeData } from '@/interface';
import { observer, inject } from 'mobx-react';
import { addInDB, readInDB } from '@/indexedDB';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Map from './map_page';
import { getApp } from '@/utils';
import { districtName } from '@/config';
import { requestAdminiDistrict } from '@/api';

const app = getApp();

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
  districtName: string;
  districtPath: number[][];
  center: number[];
}

const { Option } = Select;
const districtionArr: string[] = districtName;

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
      zoom: 11,
      rowId: '',
      districtName: districtionArr[0],
      districtPath: [],
      center: []
    };
  }
  private searchInput: any;

  componentWillMount() {
    this.changeDistrictPath('黄浦区');
  }

  componentDidMount() {
    this.handleMounted();
  }

  async handleMounted(preDistrictName = districtionArr[0]) {
    const { districtName } = this.state;
    try {
      try {
        const buffer = await readInDB(districtName);
        this.props.homeStore.setBikeData(buffer);
      } catch (err) {
        await this.handleDistricNameSelect(districtName);
        addInDB({ districtName, data: this.props.homeStore.bike_data });
      }
    } catch (error) {
      message.error('数据加载失败');
      this.setState({
        districtName: preDistrictName
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  // 选择行政区调用此函数
  handleSelect = async (e: any) => {
    const preDistrictName = this.state.districtName;
    this.setState({
      loading: true
    });
    this.setState(
      {
        districtName: e
      },
      () => {
        this.handleMounted(preDistrictName);
        this.changeDistrictPath(e);
      }
    );
  };

  // 地图展示相应的行政区块polygon
  async changeDistrictPath(districtName) {
    try {
      const res = await requestAdminiDistrict(districtName);
      const center = res.districts[0].center.split(',').map((item) => Number(item));
      const pathArr = res.districts[0].polyline.split(';');
      const path = pathArr.map((item) => item.split(','));
      const districtPath = path.map((item) => [Number(item[0]), Number(item[1])]);
      this.setState({
        districtPath,
        center
      });
    } catch (err) {
      message.error('行政区图层加载失败');
    }
  }

  // 按照行政区规划请求数据
  handleDistricNameSelect = async (districtName) => {
    const res = await app.callFunction({
      name: 'find_bike_by_district',
      data: {
        district: districtName
      }
    });
    // console.log(res);
    res.result.forEach((item) => {
      if (item.track.length > 3)
        item.track =
          item.track.length % 2 !== 0
            ? item.track.filter((item, i) => i % 2 === 0).filter((item, i) => i % 2 === 0)
            : item.track.filter((item, i) => i % 2 !== 0).filter((item, i) => i % 2 !== 0);
    });
    this.props.homeStore.setBikeData(res.result);
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
      record[dataIndex] || record[dataIndex[0]][dataIndex[1]]
        ? (record[dataIndex] || record[dataIndex[0]][dataIndex[1]])
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      String(this.state.searchedColumn) === String(dataIndex) ? (
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
    this.setState(
      {
        path: record.track,
        rowId: record._id
      }
      // () => {
      //   window.emitter.emit('create_path', this.state.path);
      // }
    );
  };

  // 改变selectedRowId
  changeSelectedRowId = (rowId, path) => {
    if (this.state.rowId !== rowId)
      this.setState({
        rowId,
        path
      });
  };

  // 设置选中行高亮的类名
  setRowClassName = (record) => {
    return record._id === this.state.rowId ? 'table-row-selected' : '';
  };

  render = () => {
    const { loading, path, zoom, districtName, districtPath, center, rowId } = this.state;
    const { homeStore } = this.props;
    const columns: any = [
      {
        title: '订单号',
        dataIndex: 'orderid',
        ...this.getColumnSearchProps('orderid'),
        sorter: (a: IBikeData, b: IBikeData) => Number(a.orderid) - Number(b.orderid)
      },
      {
        title: '单车号',
        dataIndex: 'bikeid',
        ...this.getColumnSearchProps('bikeid'),
        sorter: (a: IBikeData, b: IBikeData) => Number(a.bikeid) - Number(b.bikeid)
      },
      {
        title: '用户id',
        dataIndex: 'userid',
        ...this.getColumnSearchProps('userid'),
        sorter: (a: IBikeData, b: IBikeData) => Number(a.userid) - Number(b.userid)
      },
      {
        title: '出发时间',
        dataIndex: 'start_time',
        ...this.getColumnSearchProps('start_time'),
        sorter: (a: IBikeData, b: IBikeData) => a.start_time_num - b.start_time_num
      },
      {
        title: '出发地点',
        dataIndex: ['start_location', 'formatted_address'],
        ...this.getColumnSearchProps(['start_location', 'formatted_address'])
      },
      {
        title: '到达时间',
        dataIndex: 'end_time',
        ...this.getColumnSearchProps('end_time'),
        sorter: (a: IBikeData, b: IBikeData) => a.end_time_num - b.end_time_num
      },
      {
        title: '到达地点',
        dataIndex: ['end_location', 'formatted_address'],
        ...this.getColumnSearchProps(['end_location', 'formatted_address'])
      },
      {
        title: 'Action',
        render: (text, record) => (
          <a href="javascript:void(0);" onClick={() => this.lookPath(record)}>
            查看路线 · {record.distance}
          </a>
        )
      }
    ];

    return (
      <div className="table-page">
        <div className="table-page-header">
          <span>行政区域：</span>
          {loading ? null : (
            <Select
              defaultValue={districtName}
              onChange={this.handleSelect}
              style={{ width: '10%' }}
            >
              {districtionArr.map((item: string, index) => (
                <Option value={item} key={index}>
                  {item}
                </Option>
              ))}
            </Select>
          )}
          <span style={{ marginLeft: '24px' }}>总订单量：</span>
          <span style={{ fontSize: '24px', color: '#434343' }}>{homeStore.bike_data.length}</span>
          <span style={{ marginLeft: '24px' }}>合规订单量：</span>
          <span style={{ fontSize: '24px', color: '#3ba992' }}>{12}</span>
          <span style={{ marginLeft: '24px' }}>违规订单量：</span>
          <span style={{ fontSize: '24px', color: '#dc4140' }}>{12}</span>
          <span style={{ marginLeft: '24px' }}>警告订单量：</span>
          <span style={{ fontSize: '24px', color: '#f6be34' }}>{12}</span>
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
            <Map
              rowId={rowId}
              center={center}
              path={path}
              zoom={zoom}
              districtPath={districtPath}
              changeSelectedRowId={this.changeSelectedRowId}
            />
          </div>
        )}
      </div>
    );
  };
}

export default TablePage;
