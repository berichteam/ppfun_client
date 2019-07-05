import Taro from '@tarojs/taro'
import './index.scss';
import { View, Text, Image } from '@tarojs/components';


type Props = {
	onImageClick?: Function;
	image: articleImage;
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
				<Image mode="widthFix" src={image.originUrl} onClick={this.onImageClick.bind(this, image.originUrl)}></Image>
				<Text>{image.desc}</Text>
			</View>

        )
	}
}

export default ContentBlock;