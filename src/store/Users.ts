import { observable, action, computed } from 'mobx'
import apis from '../utils/apis';
import {request} from '../utils';

const {user} = apis;

class Users {
	id = Math.random()
	constructor(){
	
	}
	@observable loading = false;
	@observable users = observable.map()
	getUser(ids){
		return ids.map(id=>({...this.users.get(id), id, social: [], username: "", phone: ""}))
	}
	//获取用户信息
	@action async getUsersInfo(ids = []) {

		ids = Array.from(new Set(ids)).filter(id=>!this.users.get(id));

		if(ids.length === 0 || this.loading) {
			return;
		}

		this.loading = true;

		//查询推荐文章
		const {header, data} = await request({
			url: `${user}/info`,
			data: {
				ids: ids.join(',')
			},
			method: 'GET'

		}) as TResponse<ListReturn<User>>

		this.loading = false;

		if(data.code === 10000) {
			data.data.map(user=>{
				this.users.set(user.id, user)
			})
		} else {
			throw {
				error: "get users failed",
				data
			}
		}


	}
	
}

export default Users