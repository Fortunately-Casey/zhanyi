const state = {
  commitPersonCount: {
    provisionsNum: "",
    actualNum: ""
  }
};
import * as types from "./mutation-type";
const mutations = {
  [types.SET_PROVISIONSNUM](state, count) {
    state.commitPersonCount.provisionsNum = count;
  },
  [types.SET_ACTUALNUM](state, count) {
    state.commitPersonCount.actualNum = count;
  }
};

const actions = {
  setCommitProvisionsNum: ({ commit }, count) => {
    commit("SET_PROVISIONSNUM", count);
  },
  setCommitActualNum: ({ commit }, count) => {
    commit("SET_ACTUALNUM", count);
  }
};

const getters = {
  commitPersonCount: state => {
    return state.commitPersonCount;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
