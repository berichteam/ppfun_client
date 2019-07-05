import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'
import {XScrollView, ArticleBlock} from '../../../components'

type Props = {
	articles: Articles;
}

type State = {
	refreshing: boolean
}

interface Fun {
	props: Props;
	state: State;
}



@inject('articles')
@observer
class Fun extends Component {
	state = {
		refreshing: false
	}
	config: Config = {
        usingComponents: {
			'x-scroll-view': '../../../plugins/x-scroll-view/x-scroll-view' // 书写第三方组件的相对路径
		  }
    }
	componentWillMount() {
		this.props.articles.getRecommend()
	}
	onPullDownRefresh(){
		console.log('refreshing');
		this.setState({
			refreshing: true
		})

		this.props.articles.refreshRecommend()
			.then(res=>{
				this.setState({
					refreshing: false
				})
			})
			.catch(e=>{
				console.log(e);
				this.setState({
					refreshing: false
				})
			})

	}
	onLoadMore(){

		this.props.articles.nextRecommend()
	}
	viewArticle(id){
		Taro.navigateTo({
			url: `/pages/article/index?id=${id}`
		})
	}
	render() {

		const {articles: {allRecommended, recommend}} = this.props;
		const {refreshing} = this.state;
		return (
			<View className="page-fun">
				<XScrollView
					refreshing={refreshing}
					noMore={recommend.total !== 0 && recommend.page * recommend.size >= recommend.total}
					onPullDownRefresh={this.onPullDownRefresh.bind(this)}
					onLoadMore={this.onLoadMore.bind(this)}
				>
					{
						allRecommended.map(article=>(
							<ArticleBlock key={article.id} article={article} onBodyClick={this.viewArticle.bind(this)}/>
						))
					}
				</XScrollView>
			</View>

		)
	}
}

export default Fun as ComponentType
