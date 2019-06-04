import Taro from '@tarojs/taro'
import PImage from './Image';
import { AtInput, AtIcon } from 'taro-ui';
import './index.scss';
import { View, Image } from '@tarojs/components';
import classnames from 'classnames';
import {PIcon} from './index';
import select from '../assets/icon/select.png'
import selectNone from '../assets/icon/select-none.png'

type Props = {
	images: image[];
	value: string[];
	onChange: Function;
}

type State = {
	viewWidth: number;
	value: string[];
}

interface AlbumSelector {
	props: Props;
	state: State;
}

class AlbumSelector extends Taro.Component {
	constructor() {
		super(...arguments);
		this.state = {
			viewWidth: 0,
			value: this.props.value
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			value: nextProps.value
		})
	}
	ref = (e) => {
		if(!e) return;
		e.boundingClientRect().exec(([rect])=>{
			this.setState({
				viewWidth: rect.width
			})
		})
	}
	onChange(id){
		id = String(id);
		let value = this.state.value.concat();

		const index = value.indexOf(id);

		if(index >= 0){
			value.splice(index, 1)
		} else {
			value.push(id)
		}

		this.triggerChange(value)
	}
	triggerChange = (value) => {
		this.props.onChange && this.props.onChange(value)
	}
	render() {
		const {images = [], value = []} = this.props;
		const {viewWidth} = this.state;

		const gap = 5;
		const itemWidth = (viewWidth - 3*gap) / 4;

		return (
			<View className="album-selector" ref={this.ref}>
				{
					viewWidth
					&&
					images.map((image, i)=>(
						<View 
							key={image.id} 
							onClick={this.onChange.bind(this, image.id)}
							className="album-block" 
							style={{
								width: itemWidth + 'px',
								height: itemWidth + 'px',
								marginRight: ((i + 1) % 4 === 0?0:gap) + 'px'
							}}
						>
							<View className="album-icon" >
							
								<PIcon 
									image
									type={value.indexOf(image.id) >= 0?select:selectNone} 
								/>
							</View>
							<Image className="album-image" mode="aspectFill" src={image.path}/>
						</View>
					))
				}
			</View>

        )
	}
}

export default AlbumSelector;