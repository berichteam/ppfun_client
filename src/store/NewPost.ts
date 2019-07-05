import { observable, action } from 'mobx'
import { getDefualtValue, removeNonChaNum, request, delay } from '../utils';
import Taro from '@tarojs/taro';
import apis from '../utils/apis'
import store from './store'


class NewPost implements NewPost{
	id = Math.random()
	@observable status: 'editing' | 'posting' | 'failed' | 'done' = 'editing'
	@observable title: string | undefined = undefined
	@observable images: image[] = []
	@observable authority = 1
	@observable password: string | undefined = undefined
	@observable fee = 0
	@observable blurImages: string[] = []
	@action async setImages(images) {

		for(const i in images) {
			const image = images[i];
			image.md5 = await new Promise((resolve, reject)=>{
				Taro.getFileInfo({
					filePath: image.path
				})
				.then(res=>{
					resolve(res.digest)
				})
				.catch(e=>{
					reject(e)
				})
			})

		}
		
		this.images = images.filter((image, i)=>images.findIndex(img=>img.md5 === image.md5) === i).map(image=>{
			this.getImageFromAlubm(image.path)

			return {
				...image,
				id: removeNonChaNum(image.path),
			};
		})

	}
	@action setTitle(title) {
		this.title = title
	}
	@action getImageFromAlubm(path){
		Taro.getImageInfo({
			src: path
		})
			.then(res => {
				this.setImage({
					path,
					width: res.width,
					height: res.height,
					orientation: res.orientation,
					type: res.type
				} as any)
			})
	}
	@action setImage({path, width, height, desc, orientation, type, imageId, upload} : {path:string, width?:number, height?:number, desc?: string, orientation?: string, type?:string, imageId?:number, upload?:'uploading'|'done'|'failed'}) {
		this.images = this.images.map(image=>{
			if(image.path === path){
				return {
					...image,
					width: getDefualtValue(width, image.width),
					height: getDefualtValue(height, image.height),
					desc: getDefualtValue(desc, image.desc),
					orientation: getDefualtValue(desc, image.desc),
					type: getDefualtValue(desc, image.desc),
					imageId: getDefualtValue(imageId, image.imageId),
					upload: getDefualtValue(upload, image.upload),
				}
			}

			return image
		})
	}
	@action setAuthority(type) {
		if([1, 2, 3, 4].indexOf(type) >= 0) {
			this.authority = type;

		}
	}
	@action setPassword(password) {
		if(typeof password === 'string'){
			this.password = password
		}
	}
	@action setBlurImages(images) {
		if(Array.isArray(images) && images.filter(image=>typeof image !== 'string').length === 0){
			this.blurImages = images
		}
	}
	@action setFee(fee) {
		if(typeof fee === 'number'){
			this.fee = fee
		}
	}
	@action clear(){
		this.title = undefined;
		this.images = [];
		this.password = undefined;
		this.authority = 1;
		this.blurImages = [];
		this.fee = 0;
	}
	//上传图片
	@action uploadImages(images: image[]){
		this.setImages(images.map(image=>({...image, upload: 'uploading'})));
		images.forEach(image=>{
			Taro.uploadFile({
				url: `${apis.upload}/image`,
				filePath: image.path,
				name: 'file',
				header: {
					"X-Auth-Token": store.loginUserInfo.token,
				}
			})
			.then(({data, statusCode})=>{
				if(statusCode === 200){
					const res = JSON.parse(data);
					if(res.code === 10000){
						return this.setImage({
							path: image.path,
							upload: 'done',
							imageId: res.data.id
						})
					} 
				}
				throw(data)
			})
			.catch(e=>{
				this.setImage({
					path: image.path,
					upload: 'failed',
				})
			})
		})

	}
	//发布
	@action async post(){
		this.status = 'posting';

		while (this.images.filter(image=>image.upload === 'uploading').length > 0) {
			await delay(10);
		}

		if(this.images.filter(image=>image.upload === 'done').length !== this.images.length){
			//有没完成的
			return this.status = 'failed'
		}

		try {
			const {data} = await request({
				url: `${apis.article}`,
				data: {
					"title": this.title,
					"content": "",
					"images": this.images.map(image=>({
						id: image.imageId,
						blur: this.blurImages.indexOf(image.id) >= 0?1:0,
						desc: image.desc
					})),
					"authority": this.authority,
					"password": this.password,
					"fee": this.fee
				},
				method: 'POST'
			}) as TResponse<SingleReturn<{id: number}>>
	
			if(data.code === 10000) {
				this.status = 'done';
				return {
					id: data.data.id
				}
			} 
			
			throw {
				error: "post article failed",
				data
			}

		} catch(e) {
			this.status = 'failed'
		}
		

	}
}

export default NewPost