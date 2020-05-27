import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/application',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Application.vue'),
                    meta: { title: '应用信息' }
                },
                {
                    path: '/category',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Category.vue'),
                    meta: { title: '分类信息' }
                },
                {
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Upload.vue'),
                    meta: { title: '上传记录' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/User.vue'),
                    meta: { title: '用户信息' }
                },
                {
                    path: '/review',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Review.vue'),
                    meta: { title: '评论信息' }
                },
                {
                    path: '/manager',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Manager.vue'),
                    meta: { title: '应用负责人' }
                },
                {
                    path: '/doc',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Doc.vue'),
                    meta: { title: '文档信息' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
