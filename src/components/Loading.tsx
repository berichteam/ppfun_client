import Taro from '@tarojs/taro'
import './index.scss';
import { AtActivityIndicator } from 'taro-ui';


class Loading extends Taro.Component {

	render() {
		return (
            <AtActivityIndicator mode='center' color='#f44336'></AtActivityIndicator>
        )
	}
}

export default Loading;