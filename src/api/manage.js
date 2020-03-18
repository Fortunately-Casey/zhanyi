/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";

// 班主任查看打卡列表
export function getEnterprisePeriodPlaceList(params) {
  const url = getURL("/enterpriseManage/getEnterprisePeriodPlaceList");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 班主任删除打卡记录
export function deleteEnterprisePeriodPlace(params) {
  const url = getURL("/enterpriseManage/deleteEnterprisePeriodPlace");
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

// 修改异常状态
export function updateEnterprisePeriodPlaceDangerousFlag(params) {
  const url = getURL(
    "/enterpriseManage/updateEnterprisePeriodPlaceDangerousFlag"
  );
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

// 班级审核打卡记录
export function approvalPeriodPlace(params) {
  const url = getURL("/enterpriseManage/approvalPeriodPlace");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 学校管理员查看班级列表

export function getEnterpriseBaseList(params) {
  const url = getURL("/enterpriseManage/getEnterpriseBaseList");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 疾控中心查看所有学校打卡记录
export function getEnterpriseGroupList(params) {
  const url = getURL("/enterpriseManage/getEnterpriseGroupList");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 学校查看异常人员
export function getEnterprisePeriodPlaceListV2(params) {
  const url = getURL("/enterpriseManage/getEnterprisePeriodPlaceListV2");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}

// 疾控中心查看异常人员
export function getEnterprisePeriodPlaceListV3(params) {
  const url = getURL("/enterpriseManage/getEnterprisePeriodPlaceListV3");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
