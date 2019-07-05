import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, MovableArea, MovableView, ScrollView, Input, Textarea } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import { AtInput, AtCard, AtDivider, AtList, AtListItem, AtFloatLayout, AtButton, AtInputNumber, AtIcon, AtImagePicker } from 'taro-ui';
import { ContentBlock, AlbumSelector } from '../../../components';
import classnames from 'classnames'
import { ObservableArray } from 'mobx/lib/types/observablearray';

type Props = {
	newPost: NewPost;
}

type State = {
	floatLayoutOpen : boolean,
	blurImageTouched: boolean
}

interface Edit {
	props: Props;
	state: State;
}


@inject('newPost')
@observer
class Edit extends Component {
	state = {
		floatLayoutOpen: false,
		blurImageTouched: false
	}
	config: Config = {
		navigationBarTitleText: '',
	}
	touchTimer = {}
	componentDidMount(){
		
	}
	
	handleTitleChange = ({detail: {value}}) => {
		this.props.newPost.setTitle(value);
	}
	handleFloatLayout(value) {
		this.setState({
			floatLayoutOpen: value
		})
	}
	getAuthorityText(authority){
		let authorityText = '公开'
		switch (authority) {
			case 2:
				authorityText = "VIP可见"
				break;
			case 3:
				authorityText = "付费可见"
				break;
			case 4:
				authorityText = "加密"

				break;
		}

		return authorityText
	}
	changePassword(value){
		this.props.newPost.setPassword(value);
	}
	changeFee(value){
		this.props.newPost.setFee(value);
	}
	onAlbumSelectChange(ids){
		this.props.newPost.setBlurImages(ids);
		this.setState({
			blurImageTouched: true
		})
	}
	changeAuthority(id){
		this.props.newPost.setAuthority(id);
		if(!this.state.blurImageTouched && (id === 1 || id === 3)){
			this.props.newPost.setBlurImages(this.props.newPost.images.map(image=>image.id));
		}

	}
	componentWillUnmount(){
		this.props.newPost.clear()
	}
	onImageChange(images){
		this.props.newPost.setImages(images.map(image=>image.file))
		console.log(images)
	}
	onImageClick(index){
		Taro.navigateTo({
			url: `/pages/post/preview/index?imageIndex=${index}`
		})
	}
	onPostClick(){
		this.props.newPost.post()
			.then(({id})=>{
				Taro.navigateTo({
					url: `/pages/post/complete/index?articleId=${id}`
				})
			})
			
		
	}
	render() {
		const { 
			newPost, 
			newPost: { 
				status,
				authority,
				title, 
				images, 
				fee,
				password,
				blurImages,
				setImage,
				setBlurImages,
				setFee
			} 
		} = this.props;

		const { floatLayoutOpen } = this.state;

		return (
			<View 
				className='page-post-edit'
			>
				<View 
					className="content-wrapper" 
				>
					{
						!floatLayoutOpen
						&&
						<Textarea 
							placeholder='说点什么'
							value={title || ""}
							onInput={this.handleTitleChange}
							style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;' 
							autoHeight
						/>
					}
					
				</View>
				<AtImagePicker
					multiple
					files={images.map(image=>({file: image, url: image.path}))}
					onChange={this.onImageChange.bind(this)}
					onImageClick={this.onImageClick.bind(this)}
				/>
				<AtList hasBorder={false}>
					<AtListItem
						hasBorder={false}
						title='谁可以看'
						arrow='right'
						onClick={this.handleFloatLayout.bind(this, true)}
						extraText={this.getAuthorityText(authority)}
						iconInfo={{
							value: 'lock'
						}}
					/>
				
				</AtList>
				<AtButton type='primary' loading={status === 'posting'} onClick={this.onPostClick.bind(this)}>发布</AtButton>
				<AtFloatLayout 
					className="authority-layout"
					isOpened={floatLayoutOpen}
				>
					<View className="floatLayout-header">
						<View
							style={{fontSize: '16px'}}
							onClick={this.handleFloatLayout.bind(this, false)}
						>
							取消
						</View>
						<View style={{height: '30px'}}>
							<AtButton 
								type='primary' 
								size='small' 
								onClick={this.handleFloatLayout.bind(this, false)}
							>
								完成
							</AtButton>
						</View>
						

					</View>
					<View className="floatLayout-body">
						<View className="floatLayout-list">
							{
								[1,2,3,4].map((id, index)=>{
									return (
										<View 
											key={id} 
											className="floatLayout-list-item"
											onClick={this.changeAuthority.bind(this, id)}
										>
											<View className="floatLayout-list-item-check">
												{
													authority === id
													&&
													<AtIcon value="check" size="20px" color="#f44336"/>

												}
											</View>
											<View className="floatLayout-list-item-content">
												<View className="floatLayout-list-item-title">{this.getAuthorityText(id)}</View>
												{
													id === 1
													?
													<View className="floatLayout-list-item-desc">所有用户可见</View>
													:
													id === 2
													?
													<View>
														<View className="floatLayout-list-item-desc">VIP用户可见</View>
														{
															authority === 2
															&&
															<AlbumSelector images={images} value={blurImages} onChange={this.onAlbumSelectChange.bind(this)}/>
														}
													</View>
													:
													id === 3
													?
													<View>
														<View className="floatLayout-list-item-desc">支付费用后可见</View>
														{
															authority === 3
															&&
															<View>
																<View className="input-wrapper">
																	<Input 
																		focus
																		type='number'
																		placeholder='请输入金额'
																		value={String(fee)}
																		onInput={this.changeFee.bind(this)}
																	/>
																	<View className="afterfix">元</View>
																</View>
																<AlbumSelector images={images} value={blurImages} onChange={this.onAlbumSelectChange.bind(this)}/>
															</View>
														}
														
													</View>
													:
													<View>
														<View className="floatLayout-list-item-desc">输入密码后可见</View>
														{
															authority === 4
															&&
															<Input 
																focus
																type='text'
																password 
																placeholder='请输入密码'
																value={password}
																onInput={this.changePassword.bind(this)}
															/>
															
														}
													</View>
													
												}
											</View>
										</View>
									)
								})
							}
						</View>
					</View>
				</AtFloatLayout>
			</View>


		)
	}
}

export default Edit as ComponentType
