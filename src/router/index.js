/* eslint-disable prettier/prettier */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/homeMap",
    name:"homeMap",
    component: resolve => require(["../views/home/HomeMap.vue"], resolve),
  },
  {
    path: "/main",
    name: "main",
    component: resolve => require(["../views/main/Main.vue"], resolve)
  },
  {
    path: "/temp",
    name: "temp",
    component: resolve => require(["../views/temp/Temp.vue"], resolve)
  },
  {
    path: "/tempEnterpriseRegister",
    name: "tempEnterpriseRegister",
    component: resolve => require(["../views/temp/Register.vue"], resolve)
  },
  {
    path: "/tempEnterpriseQuery",
    name: "tempEnterpriseQuery",
    component: resolve => require(["../views/temp/Query.vue"], resolve)
  },
  {
    path: "/enterPrise",
    name: "enterPrise",
    component: resolve => require(["../views/enterprise/Enterprise.vue"], resolve)
  },
  {
    path: "/punch",
    name: "punch",
    component: resolve => require(["../views/punch/Punch.vue"], resolve)
  },
  {
    path: "/enterprisePunch",
    name: "enterprisePunch",
    component: resolve => require(["../views/enterprisePunch/EnterprisePunch.vue"], resolve)
  },
  {
    path: "/register",
    name: "register",
    component: resolve => require(["../views/register/Register.vue"], resolve)
  },
  {
    path:"/login",
    name:"login",
    component: resolve => require(["../views/login/Login.vue"], resolve)
  },
  {
    path:"/manage",
    name:"manage",
    component: resolve => require(["../views/manage/Manage.vue"], resolve)
  },
  {
    path:"/errorPage",
    name:"manaerrorPagege",
    component: resolve => require(["../views/errorPage/Error.vue"], resolve)
  }
 
];
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: "",
  linkExactActiveClass: "",
  routes: routes
});

export default router;