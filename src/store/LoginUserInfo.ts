import { observable, action } from 'mobx'
import Taro from '@tarojs/taro';
import {request} from '../utils';
import apis from '../utils/apis';

const {socialLogin, socialInfo} = apis;

class LoginUserInfo {
	id = Math.random()
	code = ""
	token = ""
	constructor(){
		Taro.login()
			.then(({code})=>{
				this.code = code;
				return Taro.getSetting()
			})
			.then(({authSetting})=>{
				if(authSetting['scope.userInfo']){
					return Taro.getUserInfo()
				}
				return new Promise(resolve=>resolve({errMsg: "getUserInfo:error"}))
			})
			.then((detail)=>{
				if(detail.errMsg !== "getUserInfo:ok"){
					Taro.redirectTo({
						url: '/pages/login/index'
					})
					return;
				} else {
					this.set(detail);
					this.thirdLogin();
				}
			})
			.catch(error=>{
				Taro.redirectTo({
					url: '/pages/login/index'
				})
			})
	}
	@observable logined = false
	@observable info = {
		userInfo: {
			nickName: "",
			avatarUrl: ""
		},
		encryptedData: "",
		iv: ""
		
	}

	@action set(info) {
		this.info = info;
		this.logined = true
	}

	//第三方登录
	@action async thirdLogin() {

		//登录
		const {data} = await request({
			url: socialLogin,
			data: {
				socialType: 'wechat',
				code : this.code
			},
			method: 'POST'

		}) as TResponse<SingleReturn<{authToken: string}>>


		

		if(data && data.code === 10000){
			this.token = data.data.authToken;
			//更新社交账号信息
			request({
				url: `${socialInfo}/wechat`,
				data: {
					encryptedData : this.info.encryptedData,
					iv: this.info.iv
				},
				method: 'PUT'

			})
			return true
		} else {
			throw {error: "loginfaild"}
		}
	}
	
}

export default LoginUserInfo