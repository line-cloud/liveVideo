import Vue from 'vue'
import Router from 'vue-router'

import indexVideo from '@/views/indexVideo'

// import  studentSingleWithSingle from '@/components/myStudentInfoList/singleWithSingle'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'indexVideo',
      component: indexVideo,
     },
    //   {
    //   path: '/echarts',
    //   name: 'echarts',
    //   component: echarts,
    //  },
  ]
})
