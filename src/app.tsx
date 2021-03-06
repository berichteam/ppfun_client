import Taro, { Component, Config } from '@tarojs/taro'
import { Provider, observer, inject } from '@tarojs/mobx';
import '@tarojs/async-await'
import store from './store/store'
import './mock'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }



class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  config: Config = {
    pages: [
      'pages/main/index',
      'pages/login/index',
      'pages/post/edit/index',
      'pages/post/preview/index',
      'pages/post/complete/index',
      'pages/article/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '皮皮乐',
      navigationBarTextStyle: 'black',
      backgroundColor: '#eee'
    }
  }
  

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store} />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
