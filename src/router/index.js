import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/index",
  //   redirect: {
  //     name: 'punch'
  //   },
  // },
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
  }
  // {
  //   path: "/index",
  //   name: "index",
  //   component: resolve => require(["../views/Content.vue"], resolve),
  //   children: [{
  //       path: "/index/punch",
  //       name: "punch",
  //       meta: {
  //         title: "出行打卡"
  //       },
  //       component: resolve => require(["../views/components/punch/Punch.vue"], resolve)
  //     },
  //     {
  //       path: "/index/mine",
  //       redirect: {
  //         name: 'mine-tab'
  //       },
  //     },
  //     {
  //       path: "/index/mine",
  //       name: "mine",
  //       meta: {
  //         title: "我的"
  //       },
  //       component: resolve => require(["../views/components/Mine.vue"], resolve),
  //       children: [{
  //           path: "/index/mine/minetab",
  //           name: "mine-tab",
  //           component: resolve => require(["../views/components/my/My.vue"], resolve)
  //         }, {
  //           path: "/index/mine/basic",
  //           name: "mine-basic",
  //           component: resolve => require(["../views/components/my/Basic.vue"], resolve)
  //         }, {
  //           path: "/index/mine/record",
  //           name: "mine-record",
  //           component: resolve => require(["../views/components/my/Record.vue"], resolve)
  //         },
  //         {
  //           path: "/index/mine/health",
  //           name: "mine-health",
  //           component: resolve => require(["../views/components/my/Health.vue"], resolve)
  //         }
  //       ]
  //     },
  //     {
  //       path: "/index/administration",
  //       name: "administration",
  //       meta: {
  //         title: "管理"
  //       },
  //       component: resolve => require(["../views/components/administration/Administration.vue"], resolve)
  //     }
  //   ]
  // }
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