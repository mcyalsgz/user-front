import Vue from 'vue'
import Router from 'vue-router'
import UserHome from '@/components/UserHome'
import { Message } from 'element-ui';
import store from '@/store'
import { getToken } from '@/request/token'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/write/:id?',
      component: r => require.ensure([], () => r(require('@/components/blog/BlogWrite')), 'blogwrite'),
      meta: {
        requireLogin: true
      },
    },
    {
      path: '/',
      component: UserHome,
      children: [
        {
          path: '/',
          component: r => require.ensure([], () => r(require('@/components/Index')), 'index')
				},
				{
          path: '/history',
          component: r => require.ensure([], () => r(require('@/components/History')), 'history'),
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/myBlog',
          component: r => require.ensure([], () => r(require('@/components/MyBlog')), 'myBlog'),
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/showBlog/:account',
          component: r => require.ensure([], () => r(require('@/components/ShowBlog')), 'showBlog'),
          meta: {
            requireLogin: true
          }
        },
        {
          path: '/searchUserByNickname/:nickName',
          component: r => require.ensure([], () => r(require('@/components/SearchUserResult')), 'searchResult'),
          meta: {
            title: '搜索页面'
          }
        },
        {
          path: '/archives/:year?/:month?',
          component: r => require.ensure([], () => r(require('@/components/blog/BlogArchive')), 'archives')
        },
        {
          path: '/view/:id',
          component: r => require.ensure([], () => r(require('@/components/blog/BlogView')), 'blogview')
        },

        // :type can only be `tag`, not supporting other types currently
        {
          path: '/:type/all',
          component: r => require.ensure([], () => r(require('@/components/blog/BlogAllCategoryTag')), 'blogallcategorytag')
        },
        // :type can only be `tag`, not supporting other types currently
        {
          path: '/:type/:id',
          component: r => require.ensure([], () => r(require('@/components/blog/BlogCategoryTag')), 'blogcategorytag')
        },
      ]
    },
    {
      path: '/login',
      component: r => require.ensure([], () => r(require('@/components/Login')), 'login')
    },
    {
      path: '/findPassword',
      component: r => require.ensure([], () => r(require('@/components/FindPassword')), 'findPassword')
    },
    {
      path: '/register',
      component: r => require.ensure([], () => r(require('@/components/Register')), 'register')
    },
    {
      path: '/registerTest',
      component: r => require.ensure([], () => r(require('@/components/RegisterTest')), 'registerTest')
    },
    {
      path: '/userInfo',
      component: r => require.ensure([], () => r(require('@/components/UserInfo')), 'userInfo'),
      meta: {
        requireLogin: true
      }
    },
    {
      path: '*',
      component: r => require.ensure([], () => r(require('@/components/Page404')), 'page404')
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})


router.beforeResolve((to, from, next) => {
  console.log("From " + JSON.stringify(from.path) + " to" + JSON.stringify(to.path));

  // if already logged in
  if (getToken()) {

    // and want to go to login page
    if (to.path === '/login') {

      // then jump to home page instead
      next({ path: '/' })
    }

    // and want to go to other page rather than /login
    else {
      // if not have state info loaded, load it
      if (store.state.account.length === 0) {
        store.dispatch('getUserInfo').then(data => {
          next()
        }).catch(() => {
          next({ path: '/' })
        })
      }
      // otherwise go directly
      else {
        next()
      }
    }
  }

  // if not logged in
  else {
    // check if destination page need privilege
    if (to.matched.some(r => r.meta.requireLogin)) {
      Message({
        type: 'warning',
        showClose: true,
        message: '请先登录哦'
      })
    }
    else {
      next();
    }
  }
})


export default router
