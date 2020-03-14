import axios from "axios";
import {
  getURL
} from "@/common/tool/tool";

// 家长注册
export function registerSysUser(params) {
  const url = getURL("/enterprise/registerSysUser");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 家长登录
export function sysUserLogin(params) {
  const url = getURL("/enterprise/sysUserLogin");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 子女列表
export function getEnterpriseUserBySysUserID(params) {
  const url = getURL("/enterprise/getEnterpriseUserBySysUserID");
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

// 获取子女信息
export function getEnterpriseUser(params) {
  const url = getURL("/enterprise/getEnterpriseUser");
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

// 修改子女信息
export function updateEnterpriseEMPUser(params) {
  const url = getURL("/enterprise/updateEnterpriseEMPUser");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 删除子女
export function deleteEnterpriseEMPUser(params) {
  const url = getURL("/enterprise/deleteEnterpriseEMPUser");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 新增子女
export function addEnterpriseUser(params) {
  const url = getURL("/enterprise/addEnterpriseUser");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 获取学校班级
export function getEnterpriseListV2(params) {
  const url = getURL("/enterprise/getEnterpriseListV2");
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

// 班主任登录
export function loginEnterprise(params) {
  const url = getURL("/enterpriseManage/loginEnterprise");
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

// 管理员登录
export function loginManageEnterprise(params) {
  const url = getURL("/enterpriseManage/loginManageEnterprise");
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