import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, MovableArea, MovableView, ScrollView, Input, Textarea, Swiper, Text, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import logo from '../../assets/logo.png'
import { AtButton } from 'taro-ui';

type Props = {
	loginUserInfo: LoginUserInfo;
}

type State = {
	hasUserInfo: boolean | undefined
}

interface Login {
	state: State;
	props: Props;
}


@inject('loginUserInfo')
@observer
class Login extends Component {
	config: Config = {
		navigationBarTitleText: '',
		disableScroll: true
	}
	async componentDidMount(){
		try{
			let hasUserInfo;
			const {data} = await Taro.getStorage({key: 'loginUserInfo'});
			if(data){
				hasUserInfo = true;
				this.getUserInfo({detail: data})
			} else {
				hasUserInfo = false
			}

			this.setState({
				hasUserInfo
			})
		} catch(e) {
			this.setState({
				hasUserInfo: false
			})
		}
		
		
	}
	getUserInfo({detail}){
		console.log(detail)
		this.props.loginUserInfo.set(detail);
		Taro.redirectTo({
			url: '/pages/main/index'
		})
	}
	render() {
		const {hasUserInfo} = this.state;
		return (
			<View 
				className='page-login'
			>
				<Image className="logo" src={logo}/>
				<Text className="slogan">Gif， 美图，开启欢乐生活</Text>
				{
					hasUserInfo === false
					&&
					<AtButton
						className="login-btn-wx" 
						type='primary' 
						size='normal' 
						openType="getUserInfo"
						onGetUserInfo={this.getUserInfo.bind(this)}
					>微信登录</AtButton>
				}
				
			</View>


		)
	}
}

export default Login as ComponentType
