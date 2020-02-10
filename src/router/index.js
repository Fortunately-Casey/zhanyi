import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/register/Register.vue";

Vue.use(VueRouter);

const routes = [{
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/index",
    redirect: {
      name: 'punch'
    },
  },
  {
    path: "/homeMap",
    name:"homeMap",
    component: resolve => require(["../views/home/HomeMap.vue"], resolve),
  },
  {
    path: "/index",
    name: "index",
    component: resolve => require(["../views/Content.vue"], resolve),
    children: [{
        path: "/index/punch",
        name: "punch",
        meta: {
          title: "出行打卡"
        },
        component: resolve => require(["../views/components/punch/Punch.vue"], resolve)
      },
      {
        path: "/index/mine",
        redirect: {
          name: 'mine-tab'
        },
      },
      {
        path: "/index/mine",
        name: "mine",
        meta: {
          title: "我的"
        },
        component: resolve => require(["../views/components/Mine.vue"], resolve),
        children: [{
            path: "/index/mine/minetab",
            name: "mine-tab",
            component: resolve => require(["../views/components/my/My.vue"], resolve)
          }, {
            path: "/index/mine/basic",
            name: "mine-basic",
            component: resolve => require(["../views/components/my/Basic.vue"], resolve)
          }, {
            path: "/index/mine/record",
            name: "mine-record",
            component: resolve => require(["../views/components/my/Record.vue"], resolve)
          },
          {
            path: "/index/mine/health",
            name: "mine-health",
            component: resolve => require(["../views/components/my/Health.vue"], resolve)
          }
        ]
      },
      {
        path: "/index/administration",
        name: "administration",
        meta: {
          title: "管理"
        },
        component: resolve => require(["../views/components/administration/Administration.vue"], resolve)
      }
    ]
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