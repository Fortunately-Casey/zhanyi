/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import axios from "axios";
import {
    getURL
} from "@/common/tool/tool";

// 注册
export function saveEnterprise(params) {
    const url = getURL("/enterprise/saveEnterprise");
    return axios
        .post(url, params)
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
            params: params
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
    const url = getURL("/enterprise/getEnterprisePeriodPlaceList");
    return axios
        .get(url, {
            params:params
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
    const url = getURL("/enterprise/approvalPeriodPlace");
    return axios
        .get(url, {
            params:params
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
    const url = getURL("/enterprise/selectEnterpriseNameLib");
    return axios
        .get(url, {
            params:params
        })
        .then(resp => {
            return Promise.resolve(resp);
        })
        .catch(err => {
            console.log(err);
        });
}