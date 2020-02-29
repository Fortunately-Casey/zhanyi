/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import axios from "axios";

import {
  getURL
} from "@/common/tool/tool";

// 企业打卡
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


// 获取企业信息
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