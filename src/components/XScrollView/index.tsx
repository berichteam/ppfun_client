import Taro from '@tarojs/taro'
import './index.scss';
import { View, ScrollView, Text } from '@tarojs/components';
import classnames from 'classnames';


interface Properties {
	pullDownHeight?: number;
	pullText?: string;
	releaseText?: string;
	loadingText?: string;
	finishText?: string;
	loadMoreText?: string;
	noMoreText?: string;
	refreshing?: boolean;
	noMore?: boolean;
}

interface Props extends Properties {
	children: any;
	onPullDownRefresh?: Function;
	onLoadMore?: Function;
	onScroll?: Function;

}
interface State extends Properties {
	pullDownStatus: number,
	lastScrollEnd: number,
	pullDownHeight: number;
	pullText: string;
	releaseText: string;
	loadingText: string;
	finishText: string;
	loadMoreText: string;
	noMoreText: string;
	refreshing: boolean;
	noMore: boolean;
}

interface XScrollView {
	state: State;
	props: Props;
}


class XScrollView extends Taro.Component {
	scrollRef
	constructor(props) {
		super(props);
		const {
			pullDownHeight = 60,
			pullText = "下拉可以刷新",
			releaseText = '松开立即刷新',
			loadingText = '正在刷新数据中',
			finishText = '刷新完成',
			loadMoreText = '正在加载更多数据',
			noMoreText = '已经全部加载完毕',
			refreshing = false,
			noMore = false
		} = this.props;

		this.state = {
			pullDownHeight,
			pullText,
			releaseText,
			loadingText,
			finishText,
			loadMoreText,
			noMoreText,
			refreshing,
			noMore,
			pullDownStatus: 0,
			lastScrollEnd: 0,
		}
	}
	
	componentWillReceiveProps(nextProps) {
		const {
			pullDownHeight = this.state.pullDownHeight,
			pullText = this.state.pullText,
			releaseText = this.state.releaseText,
			loadingText = this.state.loadingText,
			finishText = this.state.finishText,
			loadMoreText = this.state.loadMoreText,
			noMoreText = this.state.noMoreText,
			refreshing = this.state.refreshing,
			noMore = this.state.noMore
		} = nextProps;
		this.setState({
			pullDownHeight,
			pullText,
			releaseText,
			loadingText,
			finishText,
			loadMoreText,
			noMoreText,
			refreshing,
			noMore,
		})
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.refreshing !== this.state.refreshing) {
			this._onRefreshFinished(this.state.refreshing, prevState.refreshing)
		}
	}
	_onScroll(e) {
		this.props.onScroll && this.props.onScroll(e.detail);
		const status = this.state.pullDownStatus;
		if (status === 3 || status == 4) return;
		const height = this.state.pullDownHeight;
		const scrollTop = e.detail.scrollTop;
		let targetStatus;
		if (scrollTop < -1 * height) {
			targetStatus = 2;
		} else if (scrollTop < 0) {
			targetStatus = 1;
		} else {
			targetStatus = 0;
		}
		if (status != targetStatus) {
			this.setState({
				pullDownStatus: targetStatus,
			})
		}
	}

	_onTouchEnd(e) {
		const status = this.state.pullDownStatus;
		if (status === 2) {
			this.setState({
				pullDownStatus: 3,
			})
			this.state.refreshing = true;
			setTimeout(() => {
				this.props.onPullDownRefresh && this.props.onPullDownRefresh();
			}, 500);
		}
	}

	_onRefreshFinished(newVal, oldVal) {
		if (oldVal === true && newVal === false) {
			this.state.noMore = false;
			this.setState({
				nomore: false,
			})
			this.setState({
				pullDownStatus: 4,
				lastScrollEnd: 0,
			})
			setTimeout(() => {
				this.setState({
					pullDownStatus: 0,
				})
			}, 500);
		}
	}

	_onLoadmore() {
		if (!this.state.noMore) {
			this.scrollRef.fields({
				size: true,
				scrollOffset: true,
			}, res => {
				if (Math.abs(res.scrollTop - this.state.lastScrollEnd) > res.height) {
					this.setState({
						lastScrollEnd: res.scrollTop,
					})
					this.props.onLoadMore && this.props.onLoadMore();

				}
			}).exec();
		}
	}
	getScrollRef = (e) => {
		if(!e) return;
		this.scrollRef = e;
	}
	render() {
		const { pullDownStatus, noMore, pullText, releaseText, loadingText, loadMoreText, finishText, noMoreText } = this.state;
		return (
			<ScrollView
				ref={this.getScrollRef}
				className={classnames('Scroll-View', { ['refresh']: pullDownStatus === 3, ['finish']: pullDownStatus === 4 })}
				scrollY
				scrollWithAnimation
				enableBackToTop
				onScroll={this._onScroll.bind(this)}
				onTouchEnd={this._onTouchEnd.bind(this)}
				onScrollToLower={this._onLoadmore.bind(this)}
			>
				<View className="pulldown">
					{
						(pullDownStatus === 0 || pullDownStatus === 1)
						&&
						<View>
							<Text className="iconfont icon-pull-down" space="nbsp"></Text><Text> {pullText}</Text>
						</View>
					}
					{
						pullDownStatus === 2
						&&
						<View>
							<Text className="iconfont icon-release-up" space="nbsp"></Text><Text> {releaseText}</Text>

						</View>
					}
					{
						pullDownStatus === 3
						&&
						<View>
							<Text className="iconfont icon-loading loading" space="nbsp"></Text><Text> {loadingText}...</Text>

						</View>
					}
					{
						pullDownStatus === 4
						&&
						<View>
							<Text className="iconfont icon-complete" space="nbsp"></Text><Text> {finishText}</Text>

						</View>
					}

				</View>
				{
					this.props.children
				}
				<View className="loadmore">
					{
						noMore
							?
							<Text>{noMoreText}</Text>
							:
							<View>
								<Text className="iconfont icon-loading loading" space="nbsp"></Text><Text> {loadMoreText}</Text>

							</View>

					}
				</View>
			</ScrollView>
		)

	}
}

export default XScrollView;