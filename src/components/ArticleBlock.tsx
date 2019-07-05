import Taro from '@tarojs/taro'
import './index.scss';
import { View, Text, Image } from '@tarojs/components';
import { AtCard, AtAvatar, AtIcon } from 'taro-ui';
import classnames from 'classnames';
import { PIcon } from '.';


type Props = {
	article: FullArticle
	onBodyClick?: Function
}

interface ArticleBlock {
	props: Props
}

class ArticleBlock extends Taro.Component {
	onBodyClick(id){
		const {onBodyClick} = this.props;
		onBodyClick && onBodyClick(id)
	}
	render() {
		const {article} = this.props;
		if(!article) return null;

		const wxInfo = (article.author.social || []).find(info=>info.socialType === 'wechat') || {nickname: "",avatarUrl: ""};
		const images = article.images.slice(0, 4);
		return (
			<View className="article-block-wrapper">
				<View className="article-block-header">
					<AtAvatar circle size="small" image={wxInfo.avatarUrl}/>
					<Text className="text">{wxInfo.nickname}</Text>
				</View>
				<View className="article-block-body" onClick={this.onBodyClick.bind(this, article.id)}>
					<View className={classnames("image-wrapper", `image-count-${images.length}`)}>
						{
							images.map((image, i)=>(
								<Image className="image" mode="aspectFill" key={image.uuid} src={image.smallUrl}/>
							))
						}
					</View>
				</View>
				<View className="article-block-foot">
					<View className="view">
						<PIcon size="18px" type='appreciate' color='#333'></PIcon>
						<Text className="text">{article.giftCount}</Text>
					</View>
					<View className="view">
						<PIcon size="18px" type='like' color='#333'></PIcon>
						<Text className="text">{article.starCount}</Text>
					</View>
					<View className="view">
						<PIcon size="18px" type='attention' color='#333'></PIcon>
						<Text className="text">{article.viewCount}</Text>
					</View>
					
				</View>
			</View>

        )
	}
}

export default ArticleBlock;