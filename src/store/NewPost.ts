import { observable, action } from 'mobx'
import { getDefualtValue, removeNonChaNum } from '../utils';
import Taro from '@tarojs/taro';



class NewPost implements NewPost{
	id = Math.random()
	@observable title: string | undefined = undefined
	@observable images: image[] = []
	@observable viewType = 0
	@observable password: string | undefined = undefined
	@observable fee = 0
	@observable blurImages: string[] = []
	@action setImages(images) {
		this.images = images;
		this.images.forEach(image=>{
			image.id= removeNonChaNum(image.path);
			this.getImageFromAlubm(image.path);
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
					type: res.orientation
				} as any)
			})
	}
	@action setImage({path, width, height, desc, orientation, type}) {
		this.images = this.images.map(image=>{
			if(image.path === path){
				return {
					...image,
					width: getDefualtValue(width, image.width),
					height: getDefualtValue(height, image.height),
					desc: getDefualtValue(desc, image.desc),
					orientation: getDefualtValue(desc, image.desc),
					type: getDefualtValue(desc, image.desc),
				}
			}

			return image
		})
	}
	@action setViewType(type) {
		if([0, 1, 2, 3].indexOf(type) >= 0) {
			this.viewType = type;

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
		this.viewType = 0;
		this.blurImages = [];
		this.fee = 0;
	}
}

export default NewPost