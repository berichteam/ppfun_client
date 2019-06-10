import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View,  Text, Image, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui';
import {ContentBlock, PIcon} from '../../components'
import {readableTime} from '../../utils'
import classnames from 'classnames';


type Props = {
	loginUserInfo: LoginUserInfo;
}

type image = {
	id: number;
	url: string;
	width: number;
	height: number;
	desc: string;
}
type article = {
	viewType: viewType;
	title: string;
	images: image[];
	createdAt: Date;
	giftCount: number;
	viewCount: number;
	starCount: number;
}

type author = {
	nickName: string;
	avatarUrl: string;
	id: string
}

declare enum showExtra {
	none,
	header,
	footer
}

type State = {
	article: article;
	author: author;
	showExtra: showExtra;
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
	}
	state = {
		showExtra: 0,
		author: {
			nickName: "Goodwin",
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/ZxBlJ7BELiap56IOFbqZVibkLIBZ75pq3BiaWbaHmEXuHGvhEcGNRiadwyScibJAzvwxa9jDnxiasF1x8j4Vgltle6ng/132"
		},
		article: {
			viewType: 0,
			title: "",
			images: [{
				id: 1,
				url: "https://pic3.zhimg.com/80/v2-5faa2ffcac1992a2663c8746abbde9ae_hd.jpg",
				width: 2304,
				height: 1440,
				desc: "3214er321r32fewfewfewtfre4cfwrv4r43vr342cfr43cvr43vcr43vr43rv43cfr43cvr23r32"
			},{
				id: 2,
				url: "https://pic3.zhimg.com/80/v2-5faa2ffcac1992a2663c8746abbde9ae_hd.jpg",
				width: 2304,
				height: 1440,
				desc: "rfd32r2r32r2"
			},{
				id: 3,
				url: "https://pic3.zhimg.com/80/v2-5faa2ffcac1992a2663c8746abbde9ae_hd.jpg",
				width: 2304,
				height: 1440,
				desc: "f32f43"
			}],
			createdAt: 1559718303,
			giftCount: 3,
			viewCount: 102,
			starCount: 11
		}
	}
	previewImage(current){
		Taro.previewImage({
			current,
			urls: this.state.article.images.map(image=>image.url)
		})
	}
	onShareAppMessage = (res) => {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: "转发",
			imageUrl: `http://ppfun.fun/qrcode/A/${this.$router.params.article}.png`,

		}
	}
	scrollToUpper({detail: {scrollTop}}){
		if(scrollTop <= -150 && this.state.showExtra === 0){
			this.setState({
				showExtra: 1
			})
		} else if(scrollTop >= 250 && this.state.showExtra !== 0){
			this.setState({
				showExtra: 0
			})
		}
		
	}
	previewQrCode(){
		Taro.previewImage({
			urls: [`http://ppfun.fun/qrcode/A/${this.$router.params.article}.png`]
		})
	}
	render() {
		const {article, author, showExtra} = this.state;
		return (
			<View 
				className='page-article'

			>
				<ScrollView 
					scrollY
					onScroll={this.scrollToUpper.bind(this)}
					// onScrollToUpper={this.scrollToUpper.bind(this)}
					className={classnames('page-post-scroll', {'showTopExtro': showExtra === 1})}
				>
					<View 
						className={classnames("top-extro-wrapper")}
					>
						<Image onClick={this.previewQrCode.bind(this)} src={`http://ppfun.fun/qrcode/A/${this.$router.params.article}.png`}/>
						<AtButton className="share-btn" circle type='primary' size='small' openType="share">分享</AtButton>

					</View>
					<View className="main-wrapper">
						<View className="author-wrapper">
							<AtAvatar image={author.avatarUrl}></AtAvatar>
							<View>
								<Text>{author.nickName}</Text>
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
				</ScrollView>
				
				
			</View>


		)
	}
}

export default Login as ComponentType
