import moment from 'moment';
import Taro from '@tarojs/taro';
import store from '../store/store'

export function getDefualtValue(value, defaultValue) {
    if(value !== undefined){
        return value;
    }

    return defaultValue;
}

export function removeNonChaNum(value) {

    return value.replace(/[^a-zA-Z0-9]/g, '');
}

export function readableTime(time) {
    const m = moment(Number(time), 'X');
    if(m.isSameOrAfter(moment().format('YYYY-MM-DD'))){
      return `今天 ${m.format('HH:mm')}`
    } else if(m.isSameOrAfter(moment().subtract(1, 'day').format('YYYY-MM-DD'))){
      return `昨天 ${m.format('HH:mm')}`
    } else if(m.isSameOrAfter(moment().startOf('week').format('YYYY-MM-DD'))){
      return `${moment.weekdays(m.weekday())} ${m.format('HH:mm')}`
    } else if(m.isSameOrAfter(moment().startOf('year').format('YYYY-MM-DD'))) {
      return m.format('MM-DD HH:mm')
    } else {
      return m.format('YYYY-MM-DD HH:mm')
    }

}


export async function request(args) {
    return Taro.request({
        ...args,
        header: {
            "X-Auth-Token": store.loginUserInfo.token,
            ...args.header
        },
    })
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


export const defaultPageSize = 10