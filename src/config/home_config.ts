/**
 * @name home配置文件
 * @author liuguisheng
 * @version 2020-09-14 10:16:06 星期一
 */
import { SettingItem, NavItem } from '../interface/home_interface';

// 设置组件配置
export const SETTING_ITEM_CONFIG: SettingItem[] = [
  // {
  //     title: '全局黑暗模式:',
  //     checkedChildren: '开启',
  //     unCheckedChildren: '关闭',
  //     event: 'changeTheme',
  //     defaultValue: false
  // },
  {
    title: '深色菜单:',
    checkedChildren: '开启',
    unCheckedChildren: '关闭',
    event: 'onlyChangeTheme',
    defaultValue: true
  }
];

// 标签页默认配置
export const INITIAL_PANES: any[] = [{ title: '主页', content: '主页', key: 'index' }];

// 导航配置
export const MENU_LIST: NavItem[] = [
  {
    name: '主页',
    key: 'index'
  },
  {
    name: 'echarts图表',
    key: 'echarts'
  },
  {
    name: '表格',
    key: 'table'
  }
];
