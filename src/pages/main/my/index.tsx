import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

class My extends Component {

	render() {
		return (
			<View>123</View>
		)
	}
}

export default My as ComponentType
