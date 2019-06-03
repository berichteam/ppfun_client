import Taro, { Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import { AtTabBar, AtIcon } from 'taro-ui'
import { View, ScrollView } from '@tarojs/components';
import './index.scss';
import { getWindowHeight } from '../../utils/style';
import Fun from './fun'
import Gift from './gift'
import funImage from '../../assets/tab-bar/fun.png'
import funImage_active from '../../assets/tab-bar/fun-active.png'
import giftImage from '../../assets/tab-bar/gift.png'
import giftImage_active from '../../assets/tab-bar/gift-active.png'
import postFunImage from '../../assets/tab-bar/post-fun.png'

type PageStateProps = {
    newPost: NewPost
}

interface Layout {
    props: PageStateProps;
}


@inject('newPost')
@observer
class Layout extends Taro.Component {
    state: any
    config: Config = {
        navigationBarTitleText: '皮皮乐',
        disableScroll: true
    }

    constructor() {
        super(...arguments)
        this.state = {
            current: 0
        }
        
    }
   
    switchTab(value){
        if(value === 1) return;
        this.setState({
            current: value
        })
        
    }
    createNewPost = () => {
        const {newPost} = this.props;

        Taro.chooseImage({
            count: 9
        }).then(({tempFiles})=>{
            newPost.setImages(tempFiles);
            Taro.navigateTo({
                url: '/pages/post/edit/index'
            })
        })
    }
    render() {
        const height = getWindowHeight()
        const {current} = this.state;
        return (
            <View className='main-wrapper' hoverStopPropagation={true}>
                <ScrollView
                    scrollY
                    className='main'
                    style={{ height }}
                >
                    {current === 0 && <Fun />}
                    {current === 1 && <Gift />}
                </ScrollView>
                <View className="tabbar-newpost-button-wrapper">
                    <View className="tabbar-newpost-button" onClick={this.createNewPost}>
                        <AtIcon value='add' size='20' color='#fff' />
                    </View>
                </View>
                <View className="tabbar-newpost-bg-wrapper">
                    <View className="tabbar-newpost-bg" />
                </View>
                <AtTabBar
                    fixed
                    tabList={[
                        { title: '找乐子', image: funImage, selectedImage: funImage_active},
                        { title: '皮一下', image: postFunImage, selectedImage: ''},
                        { title: '礼物', image: giftImage, selectedImage: giftImage_active }
                    ]}
                    onClick={this.switchTab.bind(this)}
                    current={this.state.current}
                />
                
            </View>
            
        )
    }
}

export default Layout