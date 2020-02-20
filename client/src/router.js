import Vue from 'vue'
import VueRouter from 'vue-router'

import index from './components/index.vue';
import community from './components/community.vue';
import login from './components/user/login.vue';
import setting from './components/user/setting.vue';
import personalInformation from './components/user/personalInformation.vue';
import accountSecurity from './components/user/accountSecurity.vue';
import findPassword from './components/user/findPassword.vue';
import release from './components/index/release.vue';
import editGoods from './components/index/editGoods.vue';
import goodsDetails from './components/index/goodsDetails.vue'
import report from './components/index/report.vue'
import goodsCar from './components/index/goodsCar.vue'
import userCenter from './components/user/userCenter.vue'
import goodsUser from './components/user/goodsUser.vue'
import myRelease from './components/index/goods/myRelease.vue'
import successSale from './components/index/goods/successSale.vue'
import purchaseHistory from './components/index/goods/purchaseHistory.vue'
import goodsSearch from './components/index/goods/goodsSearch.vue'
import myPost from './components/community/post/myPost.vue'
import myCollect from './components/community/post/myCollect.vue'
import postSearch from './components/community/post/postSearch.vue'
import notices from './components/index/notice/notices.vue'
import goodsBuyNotice from './components/index/notice/goodsBuyNotice.vue'
import nextNotice from './components/index/notice/nextNotice.vue'
import addPost from './components/community/addPost.vue'
import editPost from './components/community/editPost.vue'
import newPost from './components/community/newPost.vue'
import hotPost from './components/community/hotPost.vue'
import postDetail from './components/community/postDetail.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: "/",
            redirect: '/index',
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/release',
            name: 'release',
            component: release
        },
        {
            path: '/editGoods/:id',
            name: 'editGoods',
            component: editGoods
        },
        {
            path: '/goodsCar',
            name: 'goodsCar',
            component: goodsCar
        },
        {
            path: '/notices',
            name: 'notices',
            component: notices,
            children: [
                {
                    path: '/notices/goodsBuyNotice',
                    name: 'goodsBuyNotice',
                    component: goodsBuyNotice
                },
                {
                    path: '/notices/nextNotice',
                    name: 'nextNotice',
                    component: nextNotice
                },
            ]
        },
        {
            path: '/userCenter',
            name: 'userCenter',
            component: userCenter,
            redirect: '/userCenter/myRelease',
            children: [
                {
                    path: '/userCenter/myRelease',
                    name: 'myRelease',
                    component: myRelease
                },
                {
                    path: '/userCenter/successSale',
                    name: 'successSale',
                    component: successSale
                },
                {
                    path: '/userCenter/purchaseHistory',
                    name: 'purchaseHistory',
                    component: purchaseHistory
                },
                {
                    path: '/userCenter/myPost',
                    name: 'myPost',
                    component: myPost
                },
                {
                    path: '/userCenter/myCollect',
                    name: 'myCollect',
                    component: myCollect
                }
            ]
        },
        {
            path: '/goodsUser/:id',
            name: 'goodsUser',
            component: goodsUser
        },
        {
            path: '/goodsDetails/:id',
            name: 'goodsDetails',
            component: goodsDetails
        },
        {
            path: '/report/:id',
            name: 'report',
            component: report
        },
        {
            path: '/goodsSearch',
            name: 'goodsSearch',
            component: goodsSearch
        },
        {
            path: '/community',
            name: 'community',
            component: community,
            redirect: '/community/newPost',
            children: [
                {
                    path: '/community/newPost',
                    name: 'newPost',
                    component: newPost
                },
                {
                    path: '/community/hotPost',
                    name: 'hotPost',
                    component: hotPost
                },
            ]
        },
        {
            path: '/postDetail/:id',
            name: 'postDetail',
            component: postDetail
        },
        {
            path: '/addPost',
            name: 'addPost',
            component: addPost
        },
        {
            path: '/editPost/:id',
            name: 'editPost',
            component: editPost
        },
        {
            path: '/postSearch',
            name: 'postSearch',
            component: postSearch
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/setting',
            name: 'setting',
            component: setting,
            redirect: '/setting/personalInformation',
            children: [
                {
                    path: '/setting/personalInformation',
                    name: 'personalInformation',
                    component: personalInformation
                },
                {
                    path: '/setting/accountSecurity',
                    name: 'accountSecurity',
                    component: accountSecurity
                }
            ]
        },
        {
            path: '/findPassword',
            name: 'findPassword',
            component: findPassword
        },
    ]
});

//路由跳转之前
router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !localStorage.getItem(window.$project)) {
        return next('/login')
    }
    next()
})

export default router;