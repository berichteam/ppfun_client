type image = {
	id: string;
	path: string;
	size: number;
	desc: string | undefined;
	width: number;
	height:	number;
	orientation: string;
	type: string;
}

declare enum viewType {open, vip, password, pay}

interface NewPost {
	title: string | undefined;
	images: image[];
	fee: number;
	viewType: viewType;
	password: string;
	blurImages: string[];
	setImages: Function;
	setTitle: Function;
	setImage: Function;
	setViewType: Function;
	setPassword: Function;
	setBlurImages: Function;
	setFee: Function;
	clear: Function;
}

interface SysInfo {
	info: {
		brand: string;
		model: string;
		system:	string;
		pixelRatio:	string;
		screenWidth: number;
		screenHeight: number;
		windowWidth: number;
		windowHeight: number;
		version: string;
		statusBarHeight: number;
		platform: string;
		language: string;
		fontSizeSetting: number;
		SDKVersion:	string
	};
	get: Function
}

interface LoginUserInfo {
	info: {
		userInfo: {
			nickName: string;
			avatarUrl: string
		}
		
	};
	set: Function
}