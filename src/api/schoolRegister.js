import axios from "axios";
import { getURL } from "@/common/tool/tool";

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
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getEnterpriseUserBySysUserID");
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

// 获取子女信息
export function getEnterpriseUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getEnterpriseUser");
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

// 修改子女信息
export function updateEnterpriseEMPUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/updateEnterpriseEMPUser");
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

// 删除子女
export function deleteEnterpriseEMPUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/deleteEnterpriseEMPUser");
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

// 新增子女
export function addEnterpriseUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/addEnterpriseUser");
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

// 获取学校班级
export function getEnterpriseListV2(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getEnterpriseListV2");
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

// 教职工打卡登录
export function teacherLogin(params) {
  const url = getURL("/enterpriseManage/sysUserLogin");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 获取教职工学校班级
export function getEnterpriseList(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/getEnterpriseListV2");
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

// 新增教职工个人信息
export function addDirectEnterpriseUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/addDirectEnterpriseUser");
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

// 获取教职工基本信息
export function getTeacherBySysUserID(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/getEnterpriseUserBySysUserID");
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

//修改教师基本信息
export function updateTeacherInfo(params) {
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

//获取教务处信息
export function getSpecialEnterprise(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterpriseManage/getSpecialEnterprise");
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

// 教师删除个人信息
export function deleteTeacher(params) {
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