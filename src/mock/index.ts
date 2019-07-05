import Mock from './WxMock';
import apis from '../utils/apis'

const { socialLogin, socialInfo, article, user } = apis;

const images = [1,2,3,4,5,6,7,8,9,10,11,12].map(id=>`https://img.swegood.com/qrcode_src/pic_cnt_${id}.jpg`);



//查用户
Mock.mock(`${user}/info`, function () {
	return Mock.mock({
		statusCode: 200,
		data: {
			code: 10000,
			message: "success",
			"data|20": [{
				"id": "@increment",
				"username": "@first",
				"phone|1": ['13531544954', '13632250649', '15820292420', '15999905612'],
				"social": [{
					"socialType": 'wechat',
					"nickname": "@name",
					"avatarUrl": "@image(200x200)"
				}]
			}]
		}
	});
});