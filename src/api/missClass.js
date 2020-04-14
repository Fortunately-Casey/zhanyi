/* eslint-disable no-console */
import axios from "axios";
import {
  getURL
} from "@/common/tool/tool";

// 缺课管理登录
export function userLogin(params) {
  const url = getURL("/absent/manager/userLogin");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 根据名称查找班级及学校
export function getEnterpriseUsersByName(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/absent/manager/getEnterpriseUsersByName");
  return axios
    .get(url, {
      params: params,
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

// 新增缺课记录
export function absentAdd(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/absent/manager/absentAdd");
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

// 缺课情况查看
export function absentCondition(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/absent/manager/absentCondition");
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

// 缺课记录删除
export function deleteAbsentByID(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL(`/absent/manager/deleteAbsentByID/${params}`);
  return axios
    .delete(url, {
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

// 教职工/学生缺课提交
export function commitAbsentLog(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/absent/manager/commitAbsentLog");
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

//获取应到和实际人数
export function absentStatistics(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/absent/manager/absentStatistics");
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

// 学校缺课上报情况
export function absenceStatistics(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/absent/manager/absenceStatistics");
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