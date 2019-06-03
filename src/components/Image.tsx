import Taro from '@tarojs/taro'
import { View, Image} from '@tarojs/components';
import './index.scss';
import { AtActivityIndicator } from 'taro-ui';
import {Loading} from './index'

type Props = {
	image: image;
	width?: number;
}

type State = {
	viewWidth: number;
}
interface PImage {
	props: Props;
	state: State;
}


class PImage extends Taro.Component {
	constructor() {
		super(...arguments);
	}
	ref = (e)=>{
		if(!e) return;

		e.boundingClientRect().exec(([rect])=>{
			this.setState({
				viewWidth: rect.width
			})
		})
	}
	render() {
		const {image, width} = this.props;
		const viewWidth = width || this.state.viewWidth;
		return (
			<View className="content-image-wrapper" ref={this.ref}>
				{
					(image && viewWidth) 
					? 
					<Image className="content-image" src={image.path} mode="widthFix" style={{width: `${viewWidth}px`}}></Image>
					:
					<Loading />

				}
			</View>

        )
	}
}

export default PImage;