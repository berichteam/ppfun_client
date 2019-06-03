import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, MovableArea, MovableView, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import { AtInput, AtCard } from 'taro-ui';
import { ContentBlock, Loading } from '../../../components';
import classnames from 'classnames'

type Props = {
	newPost: NewPost;
	sysInfo: SysInfo;
}

type movableArea = {
	width: number;
	height: number;
	backgroundColor: string;
}

type movableView = {
	width: number;
	height: number;
	y: number;
	movable: boolean;
	backgroundColor: string;
}

interface movableViews {
	[key: string?]: movableView
}
type State = {
	loading: boolean;
	movableArea: movableArea;
	movableViews: movableViews;
	scrollTop: number;
}
interface Edit {
	props: Props;
	state: State;
}


@inject('newPost', 'sysInfo')
@observer
class Edit extends Component {
	state = {
		loading: true,
		movableArea: {
			width: 0,
			height: 0,
			backgroundColor: '#fff'
		},
		movableViews: {},
		scrollTop: 0
	}

	config: Config = {
		navigationBarTitleText: '编辑',
	}
	touchTimer = {}
	componentDidMount(){
		const {newPost: {images}, sysInfo: {info: {windowWidth}}} = this.props;
		let movableViews = {
			...this.state.movableViews
		};

		images.forEach(image=>{
			//32是图片padding，92是内容下padding+文本框高度
			const height = (image.height / (image.width / (windowWidth - 32))) + 82;
			movableViews[image.id] = {
				...movableViews[image.id],
				width: windowWidth,
				height,
				movable: false,
				y: Object.values(movableViews).reduce((sum, item)=>sum+item.height, 0)
			}
		})

		this.setState({
			loading: false,
			movableViews
		})
	}
	componentDidUpdate(prevProps, prevState){
		const {movableViews, movableArea} = this.state;
		const width = this.props.sysInfo.info.windowWidth;
		const height = Object.values(movableViews).reduce((sum, item)=>sum+item.height, 0);

		if(
			!this.state.loading
			&&
			(
				prevState.movableArea.width !== width
				||
				prevState.movableArea.height !== height
			)

		) {

			this.setState({
				movableArea: {
					...movableArea,
					width,
					height
				}
			})
			
		}

		console.log(this.state.scrollTop)

	}
	
	
	handleTitleChange = (value) => {
		this.props.newPost.setTitle(value);
		return value;
	}

	setViewMovable = (id, movable) => {
		console.log('changestate-' + movable)
		if(!movable){
			let query = Taro.createSelectorQuery().in(this);
			console.log(query.select(`#${id}`))
		}
		this.setState({
			movableViews: {
				...this.state.movableViews,
				[id]: {
					...this.state.movableViews[id],
					movable
				}
			}
		})

	}
	setViewTop = (id, y) => {
		// console.log('changestate-' + y)

		this.setState({
			movableViews: {
				...this.state.movableViews,
				[id]: {
					...this.state.movableViews[id],
					y
				}
			}
		})

	}
	endTouch(e){
		const {currentTarget} = e;
		console.log(e)
	}
	moveTouch(e){
		const {currentTarget, detail: {deltaY}} = e;
		console.log("deltaY-" + deltaY)

		let {scrollTop} = this.state;

		scrollTop = scrollTop + deltaY * 0.2



		this.setState({
			scrollTop,
			movableViews: {
				...this.state.movableViews,
				[currentTarget.id]: {
					...this.state.movableViews[currentTarget.id],
					y: currentTarget.offsetTop
				}
			}
		})
	}
	onScroll(e){
		console.log(e)
		const {detail: {deltaY}} = e;
		const {scrollTop} = this.state;
		if(deltaY < 0){
			this.setState({
				scrollTop: scrollTop - deltaY
			})
		} else {
			this.setState({
				scrollTop: scrollTop + deltaY
			})
		}
	}
	render() {
		const { newPost, newPost: { title, images, setImage }, sysInfo: {info: {windowHeight}} } = this.props;
		const {loading, movableArea, movableViews, scrollTop} = this.state;

		if(loading) return <Loading />

		return (
			<ScrollView 
				className='page-gift'
				style={{height: windowHeight + 'px'}}
				scrollY
				scrollTop={scrollTop}
				// onScroll={this.onScroll.bind(this)}
			>
				<AtInput
					name='title'
					type='text'
					placeholder='默认标题'
					value={title}
					onChange={this.handleTitleChange}
				/>
				<View 
					className="movable-area" 
					style={`height: ${movableArea.height}px; width: ${movableArea.width}px; background: red;`}
					dataPosition={movableArea}
				>
					<wxs module="move" src="./movable.wxs"></wxs>
					{
						images.map((image, i) => {
							return (
								<View
									id={image.id}
									className={classnames('movable-view', {'movable': movableViews[image.id].movable})}
									dataPosition={movableViews[image.id]}
									onLongPress='{{move.onlongpress}}'
									onTouchMove='{{move.touchmove}}'
									onTouchEnd='{{move.touchend}}'
									onTouchCancel='{{move.touchend}}'
									onEndTouch={this.endTouch}
									onMoveTouch={this.moveTouch.bind(this)}
									onTouchScroll={this.onScroll.bind(this)}
									style={`height: ${movableViews[image.id].height}px; width: ${movableViews[image.id].width}px; background: blue; top: ${movableViews[image.id].y}px;left: 0`} 
									key={image.id}
								>
									<ContentBlock size={movableViews[image.id]} image={image} setImage={setImage.bind(newPost)} />

								</View>
							)
						})
					}
				</View>
				

			</ScrollView>


		)
	}
}

export default Edit as ComponentType
