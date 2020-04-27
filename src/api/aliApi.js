/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";
// 获取所有省会
export function getProvinceList(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getProvinceArea");
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
// 获取下级城市
export function getCityList(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/getSubArea");
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
