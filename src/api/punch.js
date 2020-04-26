/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";

// 根据微信id获取信息
export function getHistoryIDCardMobile(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/clockin/getHistoryIDCardMobile");
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
// 打卡
export function savePeriodPlace(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/clockin/savePeriodPlace");
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
// 健康查询
export function healthAnalysis(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/clockin/healthAnalysis");
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
