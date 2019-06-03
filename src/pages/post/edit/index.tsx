import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, MovableArea, MovableView, ScrollView, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import { AtInput, AtCard, AtDivider, AtList, AtListItem, AtFloatLayout, AtButton, AtInputNumber, AtIcon } from 'taro-ui';
import { ContentBlock, AlbumSelector } from '../../../components';
import classnames from 'classnames'

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
		navigationBarTitleText: '编辑',
	}
	touchTimer = {}
	componentDidMount(){
		
	}
	
	handleTitleChange = (value) => {
		this.props.newPost.setTitle(value);
		return value;
	}
	handleFloatLayout(value) {
		this.setState({
			floatLayoutOpen: value
		})
	}
	getViewTypeText(viewType){
		let viewTypeText = '公开'
		switch (viewType) {
			case 1:
				viewTypeText = "VIP可见"
				break;
			case 2:
				viewTypeText = "加密"
				break;
			case 3:
				viewTypeText = "付费可见"
				break;
		}

		return viewTypeText
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
	changeViewType(id){
		this.props.newPost.setViewType(id);
		if(!this.state.blurImageTouched && (id === 1 || id === 3)){
			this.props.newPost.setBlurImages(this.props.newPost.images.map(image=>image.id));
		}

	}
	componentWillUnmount(){
		this.props.newPost.clear()
	}

	render() {
		const { 
			newPost, 
			newPost: { 
				viewType,
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
				<AtInput
					name='title'
					type='text'
					placeholder='默认标题'
					value={title}
					onChange={this.handleTitleChange}
				/>
				<View 
					className="content-wrapper" 
				>
					{
						images.map((image, i) => {
							return (
								<View
									id={image.id}
									className={classnames('content-block')}
									key={image.id}
								>
									<ContentBlock image={image} setImage={setImage.bind(newPost)} />

								</View>
							)
						})
					}
				</View>
				<AtList>
					<AtListItem
						title='谁可以看'
						arrow='right'
						onClick={this.handleFloatLayout.bind(this, true)}
						extraText={this.getViewTypeText(viewType)}
						iconInfo={{
							value: 'lock'
						}}
					/>
				
				</AtList>
				<AtFloatLayout 
					className="viewtype-layout"
					isOpened={floatLayoutOpen}
				>
					<View className="floatLayout-header">
						<View
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
								[0,1,2,3].map((id, index)=>{
									return (
										<View 
											key={id} 
											className="floatLayout-list-item"
											onClick={this.changeViewType.bind(this, id)}
										>
											<View className="floatLayout-list-item-check">
												{
													viewType === id
													&&
													<AtIcon value="check" size="20px" color="#f44336"/>

												}
											</View>
											<View className="floatLayout-list-item-content">
												<View className="floatLayout-list-item-title">{this.getViewTypeText(id)}</View>
												{
													id === 0
													?
													<View className="floatLayout-list-item-desc">所有用户可见</View>
													:
													id === 1
													?
													<View>
														<View className="floatLayout-list-item-desc">VIP用户可见</View>
														{
															viewType === 1
															&&
															<AlbumSelector images={images} value={blurImages} onChange={this.onAlbumSelectChange.bind(this)}/>
														}
													</View>
													:
													id === 2
													?
													<View>
														<View className="floatLayout-list-item-desc">输入密码后可见</View>
														{
															viewType === 2
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
													:
													<View>
														<View className="floatLayout-list-item-desc">支付费用后可见</View>
														{
															viewType === 3
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
