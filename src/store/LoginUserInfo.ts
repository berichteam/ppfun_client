import { observable, action } from 'mobx'
import Taro from '@tarojs/taro'
class LoginUserInfo {
	id = Math.random()
	constructor(){

	}
	@observable logined = false
	@observable info = {
		userInfo: {
			nickName: "",
			avatarUrl: ""
		}
		
	}
	

	@action set(info) {
		this.info = info;
		this.logined = true
		Taro.setStorage({
			key: "loginUserInfo",
			data: info
		})
	}
	
}

export default LoginUserInfo