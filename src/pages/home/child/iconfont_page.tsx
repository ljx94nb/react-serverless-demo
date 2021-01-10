import React, { Component } from 'react';
import { Card, message } from 'antd';
import font1 from "../../../assets/fonts/font1/iconfont.json";
import font2 from "../../../assets/fonts/font2/iconfont.json";
import font3 from "../../../assets/fonts/font3/iconfont.json";
import { IconItem } from "../../../interface/home_interface";
import copy from 'copy-to-clipboard';



interface Props {

}

interface State {

}

export default class IconfontPage extends Component<Props, State> {
    render = () => {
        let { createCardList } = this;
        return (
            <div className="iconfont-page">
                {createCardList(font1.glyphs)}
                {createCardList(font2.glyphs)}
                {createCardList(font3.glyphs)}
            </div>
        )
    }

    /**
    * @name 创建图标字体展示列表
    * @params { Array } 字体配置列表
    * @return { void }
    * @author liuguisheng
    * @version 2020-09-28 10:50:11 星期一
    */
    createCardList = ( list: IconItem[] ) => {
        let { copyIconfont } = this;
        return list.map( (el: IconItem) => {
            let className: string = `iconfont icon-${el.font_class}`
            return (
                <Card hoverable key={el.icon_id}>
                   <div className="icon-box"
                        onClick={() => copyIconfont(className)}>
                    <i className={className}
                        style={{fontSize: '36px'}}></i>
                        <p>{el.name}</p>
                    </div> 
                </Card>
            )
        })
    }

    /**
    * @name 复制图标className
    * @params { string } className
    * @author liuguisheng
    * @version 2020-09-28 16:50:55 星期一
    */
    copyIconfont = ( className: string) => {
        if ( copy(className) ) {
            message.success('已复制到剪贴板。');
        }else {
            message.error('复制失败!');
        }
    }
}