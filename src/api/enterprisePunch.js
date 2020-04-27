/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import axios from "axios";

import {
  getURL
} from "@/common/tool/tool";

// 企业打卡
export function saveEnterprisePeriodPlace(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/saveEnterprisePeriodPlace")
  return axios.post(url, params, {
    headers: {
      token: token
    }
  }).then((resp) => {
    return Promise.resolve(resp)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取企业信息
export function getEnterprise(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getEnterprise")
  return axios.get(url, {
    params: params,
    headers: {
      token: token
    }
  }).then((resp) => {
    return Promise.resolve(resp)
  }).catch((err) => {
    console.log(err)
  })
}


// 获取企业信息
export function getEnterpriseUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getEnterpriseUser")
  return axios.get(url, {
    params: params,
    headers: {
      token: token
    }
  }).then((resp) => {
    return Promise.resolve(resp)
  }).catch((err) => {
    console.log(err)
  })
}

// 医院/诊所模糊查询
export function getHospitalList(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getHospitalList")
  return axios.get(url, {
    params: params,
    headers: {
      token: token
    }
  }).then((resp) => {
    return Promise.resolve(resp)
  }).catch((err) => {
    console.log(err)
  })
}

// 获取区/县
export function getCountyArea(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getCountyArea")
  return axios.get(url, {
    params: params,
    headers: {
      token: token
    }
  }).then((resp) => {
    return Promise.resolve(resp)
  }).catch((err) => {
    console.log(err)
  })
}
// 获取镇
export function getTownArea(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getTownArea")
  return axios.get(url, {
    params: params,
    headers: {
      token: token
    }
  }).then((resp) => {
    return Promise.resolve(resp)
  }).catch((err) => {
    console.log(err)
  })
}