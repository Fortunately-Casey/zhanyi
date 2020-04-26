/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import axios from "axios";
import {
    getURL
} from "@/common/tool/tool";

// 注册
export function saveEnterprise(params) {
    let token = window.localStorage.getItem("token");
    const url = getURL("/enterprise/saveEnterprise");
    return axios
        .post(url, params,{
            headers:{
                token:token
            }
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}
// 登录
export function loginEnterprise(params) {
    const url = getURL("/enterprise/loginEnterprise");
    return axios
        .get(url, {
            params: params,
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}

// 打卡查询
export function getEnterprisePeriodPlaceList(params) {
    let token = window.localStorage.getItem("token");
    const url = getURL("/enterprise/getEnterprisePeriodPlaceList");
    return axios
        .get(url, {
            params:params,
            headers:{
                token:token
            }
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}


//审核
export function approvalPeriodPlace(params) {
    let token = window.localStorage.getItem("token");
    const url = getURL("/enterprise/approvalPeriodPlace");
    return axios
        .get(url, {
            params:params,
            headers:{
                token:token
            }
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}

// 单位查询
export function selectEnterpriseNameLib(params) {
    let token = window.localStorage.getItem("token");
    const url = getURL("/enterprise/selectEnterpriseNameLib");
    return axios
        .get(url, {
            params:params,
            headers:{
                token:token
            }
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}


// 删除打卡记录
export function deleteEnterprisePeriodPlace(params) {
    let token = window.localStorage.getItem("token");
    const url = getURL("/enterprise/deleteEnterprisePeriodPlace");
    return axios
        .get(url, {
            params:params,
            headers:{
                token:token
            }
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}

//打卡记录下载
export function exportEnterprisePeriodPlaceList(params) {
    let token = window.localStorage.getItem("token");
    const url = getURL("/enterprise/exportEnterprisePeriodPlaceList");
    return axios
        .get(url, {
            params:params,
            headers:{
                token:token
            }
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}