/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";

// 员工注册
export function registerUser(params) {
  let token = window.localStorage.getItem("token");
  const url = getURL("/enterprise/registerUser");
  return axios
    .post(url, params,{
      headers:{
        token:token
      }
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
// 员工登录
export function userLogin(params) {
  const url = getURL("/enterprise/userLogin");
  return axios
    .post(url, params)
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
