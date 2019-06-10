import Taro from '@tarojs/taro'
import './index.scss';
import { View, Text, Image } from '@tarojs/components';


type Props = {
	onImageClick?: Function;
	image: {
		id: number;
		desc: string;
		url: string;
		width: number;
		height: number;
	};
}

interface ContentBlock {
	props: Props
}

class ContentBlock extends Taro.Component {
	onImageClick(url){
		const {onImageClick} = this.props;
		onImageClick && onImageClick(url);
	}
	render() {
		const {image} = this.props;

		if(!image) return null;

		return (
			<View className="content-block-wrapper">
				<Image mode="widthFix" src={image.url} onClick={this.onImageClick.bind(this, image.url)}></Image>
				<Text>{image.desc}</Text>
			</View>

        )
	}
}

export default ContentBlock;