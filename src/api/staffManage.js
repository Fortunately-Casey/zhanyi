/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";

// 获取员工信息列表
export function getEnterpriseUserFullInfo(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/getEnterpriseUserFullInfo");
  return axios
    .post(url, params, {
      headers: {
        token: token
      }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 获取员工信息列表
export function updateEnterpriseEMPUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/updateEnterpriseEMPUser");
  return axios
    .post(url, params, {
      headers: {
        token: token
      }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 删除员工信息
export function deleteEnterpriseEMPUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/deleteEnterpriseEMPUser");
  return axios
    .post(url, params, {
      headers: {
        token: token
      }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
