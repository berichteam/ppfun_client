import { observable, action, computed } from 'mobx'
import apis from '../utils/apis';
import {request, defaultPageSize} from '../utils';
import store from './store'

const {article} = apis;

class Articles {
	id = Math.random()
	constructor(){
	
	}
	@observable articles = observable.map()
	@observable recommend = {
		loading: false,
		lists: observable.map(),
		page: 1,
		size: defaultPageSize,
		total: 0,
	}
	
	@computed get allRecommended(){
		if(this.recommend.lists.size === 0){
			return []
		}
		return Array.from([...this.recommend.lists.values()].reduce((a,b)=>[...a,...b],[])).map(id=>({
			...this.articles.get(id),
			author: store.users.getUser([this.articles.get(id).authorId])[0]
		}))
	}
	//获取推荐文章
	@action async getRecommend(page = this.recommend.page, size = this.recommend.size) {

		if(this.recommend.loading){
			return;
		}

		this.recommend.loading = true;

		//查询推荐文章
		const {header, data} = await request({
			url: article,
			header: {
				"X-Page-Num": page,
				"X-Page-Size": size
			},
			method: 'GET'

		}) as TResponse<ListReturn<Article>>

		this.recommend.loading = false;

		if(data.code === 10000) {
			this.recommend.total = Number(header["X-Total-Count"]);
			this.recommend.size = size;
			this.recommend.page = page;
			const authorIds = new Set();
			const listSet = this.recommend.lists.get(page) || new Set();
			listSet.clear();
			data.data.forEach(article => {
				this.articles.set(article.id, article);
				listSet.add(article.id);
				authorIds.add(article.authorId);
			});
			this.recommend.lists.set(page, listSet);
			//查作者
			store.users.getUsersInfo(Array.from(authorIds));

			return true
		} else {
			throw {
				error: "get recommend article failed",
				data
			}
		}


	}
	
	//刷新推荐
	@action async refreshRecommend() {
		//清空列表
		const data = await this.getRecommend(1);
		if(data){
			const keys = [...this.recommend.lists.keys()];
			keys.forEach(key=>{
				if(key !== 1){
					this.recommend.lists.delete(key)
				}
			})
		} else {
			throw {
				error: "get next recommend article failed",
				data
			}
		}

	}
	//下一页推荐
	@action nextRecommend() {
		return this.getRecommend(this.recommend.page + 1)

	}
	//浏览文章
	@action viewArticle(id) {
		//查询推荐文章
		return request({
			url: `${article}/${id}/viewed`,
			method: 'GET'
		})

	}

	@action async getArticleById(id){
		const {data} = await request({
			url: `${article}?id=${id}`,
			header: {
				"X-Page-Num": 1,
				"X-Page-Size": 1
			},
			method: 'GET'
		}) as TResponse<ListReturn<Article>>

		if(data.code === 10000) {
			const authorIds = new Set();
			data.data.forEach(article => {
				this.articles.set(article.id, article);
				authorIds.add(article.authorId);
			});
			//查作者
			store.users.getUsersInfo(Array.from(authorIds));

			return true
		} else {
			throw {
				error: "get article by id failed",
				data
			}
		}
	}
	//查单篇文章数据
	get(id){
		const article = this.articles.get(Number(id));
		article.author = store.users.getUser([article.authorId])[0]
		return article
	}
	
}

export default Articles