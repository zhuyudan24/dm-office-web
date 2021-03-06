import Vuex from 'vuex';
import Vue from 'vue';
import * as types from './types';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {},
    token: null,
    title: '',
    show: false,
    bgHeight: window.screen.availHeight - 440 - 24 + 'px'
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      sessionStorage.token = data;
      state.token = data;
    },
    [types.LOGOUT]: state => {
      sessionStorage.removeItem('token');
      state.token = null;
    },
    [types.TITLE]: (state, data) => {
      state.title = data;
    },
    [types.SHOW]: (state, data) => {
      state.show = data;
    }
  }
});
