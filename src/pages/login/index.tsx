import React, { useState } from 'react';
// import { observer, inject } from 'mobx-react'
import { Form, Input, Button, message } from 'antd';
import { loginForm } from '@/interface/login_interface';
import { MESSAGE_CONFIG } from '@/config/message_config';
import { storage, getApp } from '@/utils';
import jwt_decode from 'jwt-decode';

interface Iprops {
  history: any;
}

// @inject('homeStore')
// @observer
export const Login = (props: Iprops) => {
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState('登录');

  const token = storage.get('token');
  if (token) {
    const decode = jwt_decode(token);
    // console.log(decode)
    props.history.push({ pathname: '/home', state: decode });
    return null;
  }

  /**
   * @name 登录表单成功
   * @params { object } form 登录表单
   * @author liuguisheng
   * @version 2020-09-15 17:54:29 星期二
   */
  const onFinish = async (form: loginForm, btnText: string) => {
    let { username, password } = form;
    const app = getApp();
    setLoading(true);
    if (btnText === '登录') {
      const res = await app.callFunction({
        name: 'login',
        data: {
          username,
          password
        }
      });
      // console.log(res)
      if (res.result.length) {
        const user = res.result[0];
        // 将用户姓名存入localStorage并提示登录成功
        storage.set('token', user.token);
        storage.set('username', user.username);
        message.success(MESSAGE_CONFIG.logoSuccess);
        // 跳转到home页
        const decode = jwt_decode(user.token);
        props.history.push({ pathname: '/home', state: decode });
      } else {
        message.error(res.result.message);
      }
    } else {
      const res = await app.callFunction({
        name: 'find_user',
        data: {
          username
        }
      });
      if (res.result.length) {
        message.error('该账号已存在!');
      } else {
        try {
          await app.callFunction({
            name: 'register',
            data: {
              username,
              password
            }
          });
          message.success('注册成功，请点击登录按钮进行登录~');
          setBtnText('登录');
        } catch (err) {
          message.error('注册失败!');
        }
      }
    }
    setLoading(false);
  };

  // 管理员注册
  const registerUser = () => {
    setBtnText('注册');
  };

  const backToLogin = () => {
    setBtnText('登录');
  };

  return (
    <div id="login">
      <h1>基于gis空间分析共享单车区域管理系统</h1>
      <Form
        name="basic"
        className="form"
        size="large"
        onFinish={(form) => onFinish(form, btnText)}
        style={{ fontSize: '20px' }}
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: MESSAGE_CONFIG.usernameEmpty }]}
        >
          <Input placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: MESSAGE_CONFIG.passwordEmpty }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        {btnText === '注册' ? (
          <Form.Item
            label="确认"
            name="password_comfirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: MESSAGE_CONFIG.passwordEmpty },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致!'));
                }
              })
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        ) : null}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {btnText}
          </Button>
        </Form.Item>
      </Form>
      {btnText === '登录' ? (
        <a href="javascript:void(0);" className="register-btn" onClick={registerUser}>
          *点我注册哦~
        </a>
      ) : (
        <a href="javascript:void(0);" className="back-btn" onClick={backToLogin}>
          {'<'} 返回
        </a>
      )}
    </div>
  );
};
