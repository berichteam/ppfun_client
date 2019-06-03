import Taro from '@tarojs/taro'
import PImage from './Image';
import { AtInput } from 'taro-ui';
import './index.scss';
import { View } from '@tarojs/components';

type movableView = {
	width: number;
	height: number;
	backgroundColor: string;
}

type Props = {
	image: image;
	size?: movableView
	setImage: Function;
}

interface ContentBlock {
	props: Props
}

class ContentBlock extends Taro.Component {
	constructor() {
		super(...arguments);
	}

	componentWillMount(){
		
	}
	handleDescChange(path, desc){
		this.props.setImage({
			path,
			desc
		})
	}
	render() {
		const {image, size} = this.props;

		if(!image) return null;

		return (
			<View className="content-block-wrapper">
				<PImage width={size?(size.width - 32):undefined} image={image}></PImage>
				<AtInput
					className="image-desc-input"
					name='title'
					type='text'
					placeholder='图片描述'
					value={image.desc}
					border={false}
					onChange={this.handleDescChange.bind(this, image.path)}
				/>
			</View>

        )
	}
}

export default ContentBlock;