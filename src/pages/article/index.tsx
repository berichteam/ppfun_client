import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,  Text, Image, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui';
import {ContentBlock, PIcon} from '../../components'
import {readableTime} from '../../utils'
import classnames from 'classnames';

type State = {
	showExtra: 0|1
}
type Props = {
	loginUserInfo: LoginUserInfo;
	articles: Articles
}


interface Article {
	props: Props;
	state:State
}


@inject('loginUserInfo', 'articles')
@observer
class Article extends Component {
	config: Config = {
		navigationBarTitleText: '',
		disableScroll: true,
	}
	state = {
		showExtra: 0
	}
	componentWillMount(){
		this.props.articles.getArticleById(this.$router.params.id);
	}
	previewImage(current){
		const article = this.props.articles.get(this.$router.params.id);

		Taro.previewImage({
			current,
			urls: article.images.map(image=>image.originUrl)
		})
	}
	onShareAppMessage = (res) => {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: "转发",
			imageUrl: `https://ppfun.fun/qrcode/A/${this.$router.params.id}.png`,

		}
	}
	scrollToUpper({detail: {scrollTop}}){
		if(scrollTop <= -150 && this.state.showExtra === 0){
			this.setState({
				showExtra: 1
			})
		} else if(scrollTop >= 150 && this.state.showExtra !== 0){
			this.setState({
				showExtra: 0
			})
		}
		
	}
	previewQrCode(){
		Taro.previewImage({
			urls: [`https://ppfun.fun/qrcode/A/${this.$router.params.article}.png`]
		})
	}
	render() {
		const {showExtra} = this.state;
		if(this.$router.params.id === undefined){
			return null
		}

		const article = this.props.articles.get(this.$router.params.id)
		const wechat = article.author.social.find(social=>social.socialType === 'wechat') || {avatarUrl: "", nickname: ""};
		return (
			<ScrollView 
				scrollY
				onScroll={this.scrollToUpper.bind(this)}
				// onScrollToUpper={this.scrollToUpper.bind(this)}
				className={classnames('page-article', {'showTopExtro': showExtra === 1})}
			>
				<View className="page-wrapper">
					<View 
						className={classnames("top-extro-wrapper")}
					>
						<Image onClick={this.previewQrCode.bind(this)} src={`https://ppfun.fun/qrcode/A/${this.$router.params.id}.png`}/>
						<AtButton className="share-btn" circle type='primary' size='small' openType="share">分享</AtButton>

					</View>
					<View className="main-wrapper">
						<View className="author-wrapper">
							<AtAvatar image={wechat.avatarUrl}></AtAvatar>
							<View>
								<Text>{wechat.nickname}</Text>
							</View>
							
						</View>
						<View className="border"></View>

						<View className="article-wrapper">
							<Text>{article.title}</Text>

							{
								article.images.map(image=>(
									<ContentBlock key={image.id} image={image} onImageClick={this.previewImage.bind(this)}/>
								))
							}
						</View>
						<View className="border"></View>
						<View className="article-gift">
							<Text>作者很辛苦，点个赞支持下吧</Text>
							<View>
								<PIcon size="42rpx" type='like' color='#fff'></PIcon>
							</View>
							<Text>{article.giftCount} 个赞</Text>
						</View>
						<View className="article-info">
							<View>
								<AtIcon value='heart' size='18' color='#999'></AtIcon>
								<Text>{article.starCount}</Text>
							</View>
							<View>
								<AtIcon value='eye' size='18' color='#999'></AtIcon>
								<Text>{article.viewCount}</Text>
							</View>
							<View>
								<AtIcon value='clock' size='18' color='#999'></AtIcon>
								<Text>{readableTime(article.createdAt)}</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>


		)
	}
}

export default Article as ComponentType
