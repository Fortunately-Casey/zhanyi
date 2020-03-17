/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import axios from "axios";

import {
  getURL
} from "@/common/tool/tool";

// 学生打卡
export function saveEnterprisePeriodPlace(params) {
  const url = getURL("/enterprise/saveEnterprisePeriodPlace")
  return axios.post(url, params).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}

// 获取企业信息
export function getEnterprise(params) {
  const url = getURL("/enterprise/getEnterprise")
  return axios.get(url, {
    params:params
  }).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}


// 医院/诊所模糊查询
export function getHospitalList(params) {
  const url = getURL("/enterprise/getHospitalList")
  return axios.get(url, {
    params:params
  }).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}

// 获取区/县
export function getCountyArea(params) {
  const url = getURL("/enterprise/getCountyArea")
  return axios.get(url, {
    params:params
  }).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}
// 获取镇
export function getTownArea(params) {
  const url = getURL("/enterprise/getTownArea")
  return axios.get(url, {
    params:params
  }).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}

// 获取子女基本信息跟子女最新打卡信息
export function getEnterpriseUser(params) {
  const url = getURL("/enterprise/getEnterpriseUser")
  return axios.get(url, {
    params:params
  }).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}


// 教师打卡
export function directEnterprisePeriodPlace(params) {
  const url = getURL("/enterpriseManage/directEnterprisePeriodPlace")
  return axios.post(url, params).then((resp) => {
      return Promise.resolve(resp)
  }).catch((err) => {
      console.log(err)
  })
}