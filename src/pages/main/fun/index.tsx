import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import { AtAvatar } from 'taro-ui';


class Fun extends Component {

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

 

  render () {
    return (
      <View className='page-fun'>
        <AtAvatar image='https://jdc.jd.com/img/200'></AtAvatar>
        

      </View>
      
      
    )
  }
}

export default Fun  as ComponentType
