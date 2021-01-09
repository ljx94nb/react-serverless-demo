import React from 'react'
import { storage } from '@/utils'

interface Iprops {
  history: any
}

export const Home = (props: Iprops) => {
  // console.log(props) // 通过props.location.state接收传过来的state对象
  if (!storage.get('token')) {
    props.history.push({ pathname: '/login' })
    return null
  }
  return <div>home</div>
}
