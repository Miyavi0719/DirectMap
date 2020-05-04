import Vue from 'vue'
import Router from 'vue-router'
import MapSingle from '@/pages/MapSingle'
import MapLists from '@/pages/MapLists'
import MapDetails from '@/pages/MapDetails'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/MapSingle',
      name: 'MapSingle',
      component: MapSingle
    },{
      path: '/MapLists',
      name: 'MapLists',
      component: MapLists
    },{
      path: '/MapDetails',
      name: 'MapDetails',
      component: MapDetails
    }
  ]
})
