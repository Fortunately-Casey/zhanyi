/* eslint-disable prettier/prettier */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: '/schoolMain'
  },
  {
    path: "/enterprisePunch",
    name: "enterprisePunch",
    component: resolve => require(["../views/enterprisePunch/EnterprisePunch.vue"], resolve)
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
  },
  {
    path: "/teacherInfo",
    name: "teacherInfo",
    component: resolve => require(["../views/teacher-info/TeacherInfo.vue"], resolve)
  },
  {
    path: "/teacherEdit",
    name: "teacherEdit",
    component: resolve => require(["../views/teacher-edit/TeacherEdit.vue"], resolve)
  },
  {
    path: "/teacherPunchList",
    name: "teacherPunchList",
    component: resolve => require(["../views/teacher-punchList/TeacherPunchList.vue"], resolve)
  },
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