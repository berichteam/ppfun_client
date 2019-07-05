type image = {
	id: string;
	path: string;
	size: number;
	desc: string | undefined;
	width: number;
	height:	number;
	orientation: string;
	type: string;
	upload: 'uploading' | 'done' | 'failed';
	imageId: number | undefined
}

declare enum authority {open = 1, vip = 2, pay = 3,password = 4 }

interface NewPost {
	status: 'editing' | 'posting' | 'failed' | 'done';
	title: string | undefined;
	images: image[];
	fee: number;
	authority: authority;
	password: string;
	blurImages: string[];
	setImages: Function;
	setTitle: Function;
	setImage: Function;
	setAuthority: Function;
	setPassword: Function;
	setBlurImages: Function;
	setFee: Function;
	clear: Function;
	uploadImages: (images: image[])=>Promise<any>;
	post: Function;
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
	code: string;
	token: string;
	info: {
		userInfo: {
			nickName: string;
			avatarUrl: string
		};
		encryptedData: string;
		iv: string
		
	};
	set: Function;
	thirdLogin: Function;
}

type articleImage = {
	id: number;
	uuid: string;
	originUrl: string;
	smallUrl: string;
	bigUrl: string;
	blur: 0|1;
	desc: string;
	originWidth: number;
	originHeight: number
}

interface Article {
	id: string;
	title: string;
	content: string;
	images: articleImage[];
	authority: 1|2|3|4;
	fee: number;
	viewCount: number;
	giftCount: number;
	starCount: number;
	authorId: number;
	createdAt: Date
}

interface FullArticle extends Article {
	author: User
}

interface Articles {
	articles: {
		[key: string]: Article
	};
	recommend: {
		lists: {
			[key: number]: number[]
		};
		page: number;
		size: number;
		total: number
	};
	recommended: Article[];
	getRecommend: Function;
	allRecommended: FullArticle[];
	refreshRecommend: Function;
	nextRecommend: Function;
	viewArticle: Function;
	getArticleById: (id: number)=>Promise<any>;
	get: (id: number)=>FullArticle;

}

type socialInfo = {
	socialType: 'wechat' | 'weibo' | 'alipay' | 'tictok';
	nickname: string;
	avatarUrl: string
}
interface User {
	id: number;
	username: string;
	phone: string | number;
	social: socialInfo[]
}

interface Users {
	users: {
		[key: number]: User
	};
	getUser: Function;
	getUsersInfo: Function
}

interface TResponse<T> {
	statusCode: number;
	header: any;
	data: T
}

interface BaseReturn {
	code: number;
	message: string;
}
interface ListReturn<T> extends BaseReturn {
	data: T[]
}

interface SingleReturn<T> extends BaseReturn {
	data: T
}