/* eslint-disable prettier/prettier */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/homeMap",
    name: "homeMap",
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
    path: "/login",
    name: "login",
    component: resolve => require(["../views/login/Login.vue"], resolve)
  },
  {
    path: "/manage",
    name: "manage",
    component: resolve => require(["../views/manage/Manage.vue"], resolve)
  },
  {
    path: "/errorPage",
    name: "manaerrorPagege",
    component: resolve => require(["../views/errorPage/Error.vue"], resolve)
  },
  {
    path: "/punchLogin",
    name: "punchLogin",
    component: resolve => require(["../views/punchLogin/PunchLogin.vue"], resolve)
  },
  {
    path: "/staffManage",
    name: "staffManage",
    component: resolve => require(["../views/staff-manage/StaffManage.vue"], resolve)
  },
  {
    path: "/studentPunch",
    name: "studentPunch",
    component: resolve => require(["../views/student-punch/StudentPunch.vue"], resolve)
  },
  {
    path: "/schoolMain",
    name: "schoolMain",
    component: resolve => require(["../views/school-main/SchoolMain.vue"], resolve)
  },
  {
    path: "/schoolRegitser",
    name: "schoolRegitser",
    component: resolve => require(["../views/school-register/SchoolRegister.vue"], resolve)
  },
  {
    path: "/childrenInfo",
    name: "childrenInfo",
    component: resolve => require(["../views/children-info/ChildrenInfo.vue"], resolve)
  },
  {
    path: "/childrenEdit",
    name: "childrenEdit",
    component: resolve => require(["../views/children-edit/ChildrenEdit.vue"], resolve)
  },
  {
    path: "/schoolLogin",
    name: "schoolLogin",
    component: resolve => require(["../views/school-login/SchoolLogin.vue"], resolve)
  },
  {
    path: "/schoolManage",
    name: "schoolManage",
    component: resolve => require(["../views/school-manage/SchoolManage.vue"], resolve)
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