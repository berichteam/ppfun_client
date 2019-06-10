import Taro from '@tarojs/taro'
import { Text, Image} from '@tarojs/components';
import classnames from 'classnames';
import '../index.scss';
import './icon/iconfont.scss';
import './icon/iconfont.eot';
import './icon/iconfont.svg';
import './icon/iconfont.ttf';
import './icon/iconfont.woff';
import './icon/iconfont.woff2';

type Props = {
	type: string;
	color?: string;
	className?: string;
	image?: boolean;
	size?: string
}


interface Icon {
	props: Props;
}


class Icon extends Taro.Component {

	render() {
		const {type, className, color, image, size} = this.props;
		if(image){
			return (
				<Image className={classnames(className, 'image-icon')} src={type}/>
			)
		}
		return (
			<Text className={classnames(className, 'iconfont', `icon${type}`)} style={{color, fontSize: size}}/>

        )
	}
}

export default Icon;