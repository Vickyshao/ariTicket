'use strict'
import axios from 'axios'
import qs from 'qs'
import store from '../../store'
import Vue from 'vue'

axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})
axios.interceptors.response.use(response => {
    store.commit('loadingHide');
    return response
}, error => {
    return Promise.resolve(error.response)
})

function checkStatus(response, This) {
    store.commit('loadingHide');
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        //This.$root.loading = false
        return response
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: '网络异常'
    }
}

function checkCode(res, This) {
    store.commit('loadingHide');
    setTimeout(function () {
      store.commit('modalHide');   //信息框消失
    },5000);
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404 || res.status === 500 ||res.status === 400) {
      This.$router.push({path:'/Error'});  //跳转到错误页
        //This.$root.loading = false
        //请求超时
        //This.$router.push({ path: '/err', query: { 'Msg': encodeURIComponent('请求超时') } })
        return
    }

    if (!res.data.success) {
        //跳转登录页
        if(res.data.errorCode === 9999){
            window.location.href = 'https://login.bthhotels.com/login/index?returnUrl=' + encodeURIComponent(window.location.href);
            // window.location.href = 'https://login.bthhotels.com/login/index?returnUrl=http://flights.bthhotels.com/pages/#/Home'
        }

    } else if (res.data && (res.data.Flag === -2)) {
        //This.$router.push({ path: '/err', query: { 'Msg': encodeURIComponent(res.data.Msg) } })
        return
    }

    return res
}

export default {
    post(url, data, This) {
        return axios({
            method: 'post',
            // baseURL: 'http://flights.bthhotels.com/api',
            baseURL: 'http://test.bthhotels.com:9880/api',
            url,
            //data: qs.stringify(data),
            data:data,
            timeout: 30000,
            headers: {
                 'Content-Type': 'application/json;charset=UTF-8'
                //'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response, This)
            }
        ).then(
            (res) => {
                return checkCode(res, This)
            }
        )
    },
    get(url, params,This) {
        return axios({
          method: 'get',
          // baseURL: 'http://flights.bthhotels.com/api',
          baseURL: 'http://test.bthhotels.com:9880/api',
            url,
            params, // get 请求时带的参数
            timeout: 30000,
            headers: {
                //'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response,This)
            }
        ).then(
            (res) => {
                return checkCode(res,This)
            }
        )
    }
}
