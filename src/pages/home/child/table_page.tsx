import React, { Component } from 'react';
import { Table, message, Input, Select, Button, Space, Tag, Popover } from 'antd';
import { IBikeData } from '@/interface';
import { observer, inject } from 'mobx-react';
import { addInDB, readInDB } from '@/indexedDB';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Map from './map_page';
import { findOperationAera, getApp, getRandomInt, storage } from '@/utils';
import { districtName } from '@/config';
import { requestAdminiDistrict } from '@/api';
import { Switch } from 'antd';
import axios from 'axios';

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
  operationPath: number[][];
  center: number[];
  isDistrictionOpen: boolean;
  isOperationOpen: boolean;
  isErrorOpen: boolean;
  isWarnOpen: boolean;
  isCorrectOpen: boolean;
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
      zoom: 12,
      rowId: '',
      districtName: districtionArr[0],
      operationPath: [],
      districtPath: [],
      center: [],
      isOperationOpen: true,
      isDistrictionOpen: true,
      isErrorOpen: true,
      isWarnOpen: true,
      isCorrectOpen: true
    };
  }

  private searchInput: any;
  private errors: any;
  private warns: any;
  private corrects: any;

  componentDidMount() {
    this.handleMounted();
  }

  async handleMounted(preDistrictName = districtionArr[0]) {
    const { districtName } = this.state;
    await this.changeDistrictPath(districtName);
    try {
      try {
        const buffer = await readInDB(districtName);
        const operationPath = storage.get(districtName);
        this.props.homeStore.setBikeData(buffer);
        this.setState({
          operationPath: JSON.parse(operationPath)
        });
        if (!this.state.operationPath.length) message.error('运营区加载失败');
      } catch (err) {
        await this.handleDistricNameSelect(districtName);
        addInDB({
          districtName,
          data: this.props.homeStore.bike_data
        });
      }
    } catch (error) {
      console.error(error);
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
    this.setState(
      {
        loading: true,
        districtName: e
      },
      () => {
        this.handleMounted(preDistrictName);
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

    // 生成状态tag
    let allCount = res.result.length;
    let warnCount = getRandomInt(0, allCount);
    let errorCount = getRandomInt(0, allCount - warnCount);
    let trueCount = allCount - errorCount - warnCount;
    trueCount = Math.max(warnCount, errorCount, trueCount);
    errorCount = Math.min(warnCount, errorCount, trueCount);
    warnCount = allCount - trueCount - errorCount;

    const result = [];
    let operationPath = [];
    for (let i = 0; i < res.result.length - 1; i++) {
      if (res.result[i].orderid !== res.result[i + 1].orderid) {
        result.push(res.result[i]);
        if (i === res.result.length - 2) {
          result.push(res.result[i + 1]);
        }
      }
    }

    result.forEach((item, index) => {
      // const midIndex = Math.floor(item.track.length / 2);
      operationPath.push(...item.track);
      if (index >= 0 && index < errorCount) {
        item.tags = ['违规'];
      } else if (index >= errorCount && index < errorCount + warnCount) {
        item.tags = ['警告'];
      } else {
        item.tags = ['合规'];
      }
      if (item.track.length > 5)
        item.track =
          item.track.length % 2 !== 0
            ? item.track.filter((item, i) => i % 2 === 0).filter((item, i) => i % 2 === 0)
            : item.track.filter((item, i) => i % 2 !== 0).filter((item, i) => i % 2 !== 0);
    });

    // 生成运营区的代码
    // const intersection = findOperationAera(operationPath, this.state.districtPath);
    // operationPath = intersection.geometry.coordinates[0];
    try {
      operationPath = (await axios.get(`./mock/${districtName}.json`)).data;
    } catch (err) {
      operationPath = [];
      message.error('运营区加载失败');
    }
    storage.set(districtName, JSON.stringify(operationPath));
    this.props.homeStore.setBikeData(result);
    this.setState({
      operationPath
    });
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
      dataIndex === 'tags' ? (
        <>
          {text.map((tag) => {
            let color = '#3ba992';
            let title = '';
            let content = null;
            if (tag === '违规') {
              color = '#dc4140';
              title = '违规详情';
              content = (
                <div>
                  <p>违规条例1</p>
                  <p>违规条例2</p>
                </div>
              );
            } else if (tag === '警告') {
              color = '#f6be34';
              title = '警告详情';
              content = (
                <div>
                  <p>警告条例1</p>
                  <p>警告条例2</p>
                </div>
              );
            }
            return title === '' ? (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            ) : (
              <Popover content={content} title={title} trigger="click">
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              </Popover>
            );
          })}
        </>
      ) : String(this.state.searchedColumn) === String(dataIndex) ? (
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

  changeOperation = (e) => {
    this.setState({
      isOperationOpen: e
    });
  };

  changeDistriction = (e) => {
    this.setState({
      isDistrictionOpen: e
    });
  };

  changeErrorPointMap = (bool: boolean) => {
    this.setState({
      isErrorOpen: bool
    });
  };

  changeWarnPointMap = (bool: boolean) => {
    this.setState({
      isWarnOpen: bool
    });
  };

  changeCorrectPointMap = (bool: boolean) => {
    this.setState({
      isCorrectOpen: bool
    });
  };

  // 获取海量点可视化的position数据
  getLargeMarkers = (markers) => {
    return markers.map((i) => ({
      position: {
        longitude: i.start_location_x,
        latitude: i.start_location_y
      },
      orderId: i.orderid,
      tag: i.tags[0]
    }));
  };

  render = () => {
    const {
      loading,
      path,
      zoom,
      districtName,
      districtPath,
      operationPath,
      center,
      rowId,
      isOperationOpen,
      isDistrictionOpen,
      isErrorOpen,
      isWarnOpen,
      isCorrectOpen
    } = this.state;
    const { homeStore } = this.props;
    const columns: any = [
      {
        title: '状态',
        dataIndex: 'tags',
        key: 'tags',
        ...this.getColumnSearchProps('tags')
      },
      {
        title: '订单号',
        dataIndex: 'orderid',
        key: 'orderid',
        ...this.getColumnSearchProps('orderid'),
        sortDirections: ['descend', 'ascend'],
        sorter: (a: IBikeData, b: IBikeData) => Number(a.orderid) - Number(b.orderid)
      },
      {
        title: '单车号',
        dataIndex: 'bikeid',
        key: 'bikeid',
        ...this.getColumnSearchProps('bikeid'),
        sortDirections: ['descend', 'ascend'],
        sorter: (a: IBikeData, b: IBikeData) => Number(a.bikeid) - Number(b.bikeid)
      },
      {
        title: '用户id',
        dataIndex: 'userid',
        key: 'userid',
        ...this.getColumnSearchProps('userid'),
        sortDirections: ['descend', 'ascend'],
        sorter: (a: IBikeData, b: IBikeData) => Number(a.userid) - Number(b.userid)
      },
      {
        title: '出发时间',
        dataIndex: 'start_time',
        key: 'start_time',
        ...this.getColumnSearchProps('start_time'),
        sortDirections: ['descend', 'ascend'],
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
        key: 'end_time',
        ...this.getColumnSearchProps('end_time'),
        sortDirections: ['descend', 'ascend'],
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
          <a href="javascript:void(0)" onClick={() => this.lookPath(record)}>
            查看路线 · {record.distance}
          </a>
        )
      }
    ];

    const warns = homeStore.bike_data.filter((i) => i.tags[0] === '警告');
    const errors = homeStore.bike_data.filter((i) => i.tags[0] === '违规');
    const corrects = homeStore.bike_data.filter((i) => i.tags[0] === '合规');
    const warnCount = warns.length;
    const errorCount = errors.length;
    const trueCount = corrects.length;
    const allCount = warnCount + errorCount + trueCount;
    let largeMarkers = [];
    if (isCorrectOpen) largeMarkers.push(...this.getLargeMarkers(corrects));
    if (isErrorOpen) largeMarkers.push(...this.getLargeMarkers(errors));
    if (isWarnOpen) largeMarkers.push(...this.getLargeMarkers(warns));

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
          <span style={{ fontSize: '24px', color: '#434343' }}>{allCount}</span>
          <span style={{ marginLeft: '24px' }}>合规订单量：</span>
          <span style={{ fontSize: '24px', color: '#3ba992' }}>{trueCount}</span>
          <span style={{ marginLeft: '24px' }}>违规订单量：</span>
          <span style={{ fontSize: '24px', color: '#dc4140' }}>{errorCount}</span>
          <span style={{ marginLeft: '24px' }}>警告订单量：</span>
          <span style={{ fontSize: '24px', color: '#f6be34' }}>{warnCount}</span>
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
            <div className="map-btn-box">
              <Tag color="#3ba992">运营区</Tag>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked={isOperationOpen}
                onChange={this.changeOperation}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Tag color="#b4adff">行政区</Tag>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked={isDistrictionOpen}
                onChange={this.changeDistriction}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Tag color="#dc4140">违规❌</Tag>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked={isErrorOpen}
                onChange={this.changeErrorPointMap}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Tag color="#f6be34">警告⚠️</Tag>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked={isWarnOpen}
                onChange={this.changeWarnPointMap}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Tag color="#1fb19e">合规🙆‍♂️</Tag>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked={isCorrectOpen}
                onChange={this.changeCorrectPointMap}
              />
            </div>
            <Map
              rowId={rowId}
              center={center}
              path={path}
              zoom={zoom}
              districtPath={districtPath}
              operationPath={operationPath}
              changeSelectedRowId={this.changeSelectedRowId}
              isOperationOpen={isOperationOpen}
              isDistrictionOpen={isDistrictionOpen}
              largeMarkers={largeMarkers}
            />
          </div>
        )}
      </div>
    );
  };
}

export default TablePage;
