import React, { useState } from 'react';
import { storage } from '@/utils';
import { Menu, Tabs } from 'antd';
import { LogoBox } from '@/components';
import { INITIAL_PANES, MENU_LIST } from '@/config';
import { NavItem, TabItem } from '@/interface';
import { HomeService } from '../../service/home_service';
import { GlobleSetting } from '../../components';
import GlobalConfigStore from '../../store/global_config';
import { observer, inject } from 'mobx-react';
import { componentFactory } from './component_factory';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LOGO = require('@/assets/images/logo.png');
// 引入子导航
const { SubMenu } = Menu;
// 引入字标签
const { TabPane } = Tabs;

interface Iprops {
  history: any;
  location: any;
}

// state接口
interface State {
  collapsed: boolean;
  background: string;
  theme: string;
  mode: string;
  overflowY: string;
  activeKey: string;
  panes: TabItem[];
  username: string;
}

function HomeFn(props: Iprops) {
  const [collapsed, setCollapsed] = useState(false);
  const [background, setBackground] = useState('#fff');
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('inline');
  const [overflowY, setOverflowY] = useState('scroll');
  const [activeKey, setActiveKey] = useState('0');
  const [panes, setPanes] = useState(INITIAL_PANES);

  // console.log(props) // 通过props.location.state接收传过来的state对象
  if (!storage.get('token')) {
    props.history.push({ pathname: '/login' });
    return null;
  }

  // 样式计算
  let tabs = document.querySelectorAll('.ant-tabs-tab');
  tabs.length &&
    tabs.forEach((el: any) => {
      el.style.background = background;
    });
  let logoColor: string = theme !== 'dark' ? '#001529' : '#fff';
  let color: string = background === '#fff' ? '#001529' : '#fff';
  let size: string = !collapsed ? 'large' : 'small';
  let flex: string = !collapsed ? '0 0 240px' : '0 0 75px';
  let leftBack: string = theme === 'dark' ? '#001529' : '#fff';
  const username = props.location.state.username;

  /**
   * @name 创建导航
   * @return { Array } 菜单列表
   * @author liuguisheng
   * @version 2020-09-14 11:11:17 星期一
   */
  const createMenu = () => {
    // 获取导航树
    let NavList = HomeService.getFirstNameList();
    // 返回组件
    return createNavItem(NavList);
  };

  /**
   * @name 创建导航子集
   * @params { Array } NavList 导航配置
   * @return { Array } 导航列表
   * @author liuguisheng
   * @version 2020-09-14 14:45:55 星期一
   */
  const createNavItem = (NavList: NavItem) => {
    // 递归创建导航
    return NavList.map((el: NavItem) => {
      if (el.children && el.children.length && Object.keys(el.children[0]).length) {
        return (
          <SubMenu key={el.code} title={el.name}>
            {createNavItem(el.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={el.code} onClick={() => clickMenuItem(el)}>
            {el.name}
          </Menu.Item>
        );
      }
    });
  };

  /**
   * @name 点击菜单触发
   * @params { Object } navItem 导航配置
   * @author liuguisheng
   * @version 2020-09-14 14:49:56 星期一
   */
  const clickMenuItem = (navItem: NavItem) => {
    // 找到标题
    let { name, path = '' } = navItem;
    // 生成随机key
    let key: string = Math.random().toString();
    // // 判断是否添加过标签，添加过就不在添加并且激活的key为之前的key
    let hasTitle = INITIAL_PANES.find((el) => el.title === name);
    let activeKey: string = hasTitle === undefined ? key : hasTitle.key;
    hasTitle === undefined && INITIAL_PANES.push({ title: name, content: path, key });
    // // 更新状态
    setPanes(INITIAL_PANES);
    setActiveKey(activeKey);
  };

  /**
   * @name 接收的子组件传递的配置
   * @params { Object } e 全局配置
   * @author liuguisheng
   * @version 2020-09-15 16:09:36 星期二
   */
  const handGlobalSetting = (e: State) => {
    let { collapsed, background, theme, mode, overflowY } = e;
    setCollapsed(collapsed);
    setBackground(background);
    setTheme(theme);
    setMode(mode);
    setOverflowY(overflowY);
  };

  /**
   * @name 标签页change事件
   * @author liuguisheng
   * @version 2020-09-17 08:49:26 星期四
   */
  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  /**
   * @name 标签页编辑状态下删除事件
   * @params { String } targetKey 点击的key
   * @params { String } action 发生的动作
   * @author liuguisheng
   * @version 2020-09-17 09:05:27 星期四
   */
  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove') {
      console.log(targetKey);
      // 找到删除的索引
      let removeIndex: number = INITIAL_PANES.findIndex((el) => el.key === targetKey);
      // 判断并生成激活的key
      let activeKey = '0';
      if (removeIndex === 0 && INITIAL_PANES.length > 1)
        activeKey = INITIAL_PANES[removeIndex + 1].key;
      if (removeIndex > 0) activeKey = INITIAL_PANES[removeIndex - 1].key;
      // 删除tab并更新
      INITIAL_PANES.splice(removeIndex, 1);
      setPanes(INITIAL_PANES);
      setActiveKey(activeKey);
    }
  };

  return (
    <div id="home" style={{ background }}>
      <div className="left" style={{ flex, background: leftBack }}>
        <LogoBox
          url={LOGO}
          title="共享单车管理系统"
          color={logoColor}
          size={size}
          back={leftBack}
        />
        <Menu
          theme={theme as any}
          mode={mode as any}
          inlineCollapsed={collapsed}
          className="meun-box"
          defaultSelectedKeys={['index']}
        >
          {/* 主页导航 */}
          {MENU_LIST.map((el: NavItem) => {
            let { key, name } = el;
            return (
              <Menu.Item key={key} onClick={() => clickMenuItem(el)}>
                {name}
              </Menu.Item>
            );
          })}
          {/* 树状导航 */}
          {createMenu()}
        </Menu>
      </div>
      <div className="right">
        <div className="header-box">
          {/* 顶部标签 */}
          <Tabs
            type="editable-card"
            style={{ color }}
            hideAdd={true}
            onChange={onChange}
            onEdit={onEdit}
            tabBarExtraContent={{
              right: (
                <div className="header-box_right">
                  <div className="user-box">你好！ {username}</div>
                  <GlobleSetting
                    globalConfigStore={new GlobalConfigStore()}
                    handGlobalSetting={handGlobalSetting}
                  />
                </div>
              )
            }}
            activeKey={activeKey}
          >
            {panes.map((pane: TabItem) => (
              <TabPane tab={pane.title} key={pane.key}>
                {/* 动态标签内容 */}
                {componentFactory(pane)}
              </TabPane>
            ))}
          </Tabs>
        </div>
        {/* <div className="line" /> */}
      </div>
    </div>
  );
}

export const Home = inject('globalConfigStore', 'homeStore')(observer(HomeFn));
