import NewPost from './NewPost'
import SysInfo from './SysInfo';
import LoginUserInfo from './LoginUserInfo';
import Articles from './Articles'
import Users from './Users'

const store = {
    newPost: new NewPost(),
    sysInfo: new SysInfo(),
    loginUserInfo: new LoginUserInfo(),
    articles: new Articles(),
    users: new Users()
}

export default store