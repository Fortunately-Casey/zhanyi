/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";

// 南通顶部统计
export function getDayStatisticsTotal(params) {
  const url = getURL("/statistics/getDayStatisticsTotal");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
// 区县统计
export function getDayStatisticsDetails(params) {
  const url = getURL("/statistics/getDayStatisticsDetails");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
// 区县查看
export function getRegionData(params) {
  const url = getURL("/ncppoint/getNcpPointList");
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

// 小区病人查看
export function getPatient(params) {
  const url = getURL("/region/getPatient");
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

// 查看轨迹
export function getPatientTrail(params) {
  const url = getURL("/clockin/getPatientTrail");
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
