import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, MovableArea, MovableView, ScrollView, Input, Textarea, Swiper, SwiperItem, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'


type Props = {
	newPost: NewPost;
}

type State = {
	currentImageIndex: number;
}

interface Preview {
	props: Props;
	state: State;
}


@inject('newPost')
@observer
class Preview extends Component {
	config: Config = {
		navigationBarTitleText: '加载中...',
		disableScroll: true
	}
	constructor(props){
		super(props);
		const imageIndex = Number(this.$router.params.imageIndex) || 0;
		this.state = {
			currentImageIndex: imageIndex
		}
		console.log(this.$router)
		if(this.$router.path === "/pages/post/preview/index"){
			this.changeNavTitle(`${imageIndex + 1}/${this.props.newPost.images.length}`)

		}
	}
	
	componentDidUpdate(){
		this.changeNavTitle(`${this.state.currentImageIndex + 1}/${this.props.newPost.images.length}`)

		
	}
	changeNavTitle(title){
		Taro.setNavigationBarTitle({
			title
		})
	}
	changeImagePrev({detail: {current}}){
		this.setState({
			currentImageIndex: current
		})
	}
	handleImageDescChange(path, {detail: {value}}){
		this.props.newPost.setImage({
			path,
			desc: value
		})
	}
	render() {
		const { 
			newPost, 
			newPost: { 
				images, 
			} 
		} = this.props;


		return (
			<View 
				className='page-image-preview'
			>
				<Swiper
					duration={200}
					onChange={this.changeImagePrev.bind(this)}
					current={this.state.currentImageIndex}
					className='image-preview-container'
				>
					{
						images.map(image=>(
							<SwiperItem key={image.id}>
								<View className='image-wrapper'>
									<Image mode={"aspectFit"} src={image.path}/>
									<View className="desc-wrapper">
										<Textarea 
											placeholder='描述一下...'
											value={image.desc || ""}
											onInput={this.handleImageDescChange.bind(this, image.path)}
											autoHeight
										/>
									</View>
								</View>
							</SwiperItem>
						))
					}
				</Swiper>
			</View>


		)
	}
}

export default Preview as ComponentType
