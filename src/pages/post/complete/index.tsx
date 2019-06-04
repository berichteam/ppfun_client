import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'
import { AtCard } from 'taro-ui';
import { observer, inject } from '@tarojs/mobx'

type Props = {
	loginUserInfo: LoginUserInfo;
}

type State = {
	hash: string;
}

interface Complete {
	props: Props;
	state: State;
}


@inject('loginUserInfo')
@observer
class Complete extends Component {
	config: Config = {
		navigationBarTitleText: '皮皮乐',
	}
	constructor(props){
		super(props);
		const hash = this.$router.params.hash || "";
		this.state = {
			hash
		}
	
	}
	
	componentDidMount(){
	
	}
	
	render() {
		
		const {hash} = this.state;
		const {loginUserInfo: {info: {userInfo}}} = this.props;
		return (
			<View 
				className='page-post-complete'
			>
				<AtCard
					title={userInfo.nickName}
					thumb={userInfo.avatarUrl}
				>
					<Image className="qrcode" mode="aspectFit" src={`http://18.217.193.175/qrcode/artical/${hash}.png`} />
					
				</AtCard>
			</View>


		)
	}
}

export default Complete as ComponentType
