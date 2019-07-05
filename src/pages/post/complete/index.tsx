import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import { AtCard, AtButton } from 'taro-ui';
import { observer, inject } from '@tarojs/mobx'

type Props = {
	loginUserInfo: LoginUserInfo;
}

type State = {
	articleId: string;
}

interface Complete {
	props: Props;
	state: State;
}


@inject('loginUserInfo')
@observer
class Complete extends Component {
	config: Config = {
		navigationBarTitleText: '皮皮乐',
		navigationBarBackgroundColor: '#f7f7f7',

	}
	constructor(props){
		super(props);
		const articleId = this.$router.params.articleId || "";
		this.state = {
			articleId
		}
	
	}
	
	componentDidMount(){
	
	}
	onShareAppMessage = (res) => {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: "转发",
			path: `/pages/article/index?article=${this.state.articleId}`,
			imageUrl: `http://ppfun.fun/qrcode/A/${this.state.articleId}.png`,

		}
	}
	previewImage(){
		Taro.previewImage({
			urls: [`http://ppfun.fun/qrcode/A/${this.state.articleId}.png`]
		})
	}
	article(){
		Taro.navigateTo({
			url: '/pages/article/index?article=r3erfewrewr'
		})
	}
	render() {
		
		const {articleId} = this.state;
		const {loginUserInfo: {info: {userInfo}}} = this.props;
		return (
			<View 
				className='page-post-complete'
			>
				<AtCard
					title={userInfo.nickName}
					thumb={userInfo.avatarUrl}
				>
					<Image onClick={this.previewImage.bind(this)} className="qrcode" mode="aspectFit" src={`http://ppfun.fun/qrcode/A/${articleId}.png`} />
					<Text onClick={this.article.bind(this)} className="share-desc">分享可以让更多的人访问到你的作品哦</Text>
					<AtButton className="share-btn" circle type='primary' size='small' openType="share">分享</AtButton>

				</AtCard>
			</View>


		)
	}
}

export default Complete as ComponentType
