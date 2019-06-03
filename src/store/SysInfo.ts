import { observable, action } from 'mobx'
import Taro from '@tarojs/taro';



class SysInfo {
	id = Math.random()
	constructor(){
		this.get();
	}
	
	@observable info = {
		brand: '',
		model: '',
		system:	'',
		pixelRatio:	'',
		screenWidth: 0,
		screenHeight: 0,
		windowWidth: 0,
		windowHeight: 0,
		version: '',
		statusBarHeight: 0,
		platform: '',
		language: '',
		fontSizeSetting: 12,
		SDKVersion:	''
	}
	

	@action get() {
		Taro.getSystemInfo().then(res=>this.info = res)
	}
	
}

export default SysInfo