<template>
  <div style="height:100vh;width:100%;" class="map">
    <div ref="basicMapbox" style="height:100%;width:100%;"></div>
    <!-- <pre id="info"></pre> -->
    <!-- <pre id='coordinates' class='coordinates'></pre> -->
    <div class="list" v-if="show === 'true'">
      <directList :directList="itemPlace"></directList>
    </div>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import icon from "../assets/pin.png";
import directList from "../components/list";
import { getPlace, get } from '../../test/request/api.js'
export default {
  data() {
    return {
      swiperOptions: {
        slidesPerView: "auto",
        // centeredSlides: true,
        spaceBetween: 0,
        // grabCursor: true,
        autoplay: false
        // Some Swiper option/callback...
      },
      icon: icon,
      // directList: {
      //   addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
      //   phone: "+39 800 305 357"
      // },
      itemPlace: {},
      location: {},
      show:'true'

    };
  },
  mounted() {
    this.getToken()
    this.getPlace()
    this.init();
  },
  methods: {
    // 获取并保存token
    getToken () {
      // 获取网址
      let url = decodeURI(window.location.href)
      // 找到问号索引
      let index = url.indexOf('?')
      // 截取所有参数
      let value = url.slice(index + 1)
      // 分割不同参数
      let ary = value.split('&')
      // 得到token
      let tokenAry = ary[0].split('=')
      if (tokenAry[0] !== 'token') { return }
      // 存储token
      window.localStorage.setItem('user', {
        BearerToken: tokenAry[1]
      })
      // 得到经纬度
      let longitude = ary[1].split('=')[1]
      let latitude = ary[2].split('=')[1]
      this.location = {
        longitude,
        latitude
      }
      this.show = ary[3].split('=')[1]
      //是否现实list
      console.log('456',this.location)
    },
    // 请求所有站点
    async getPlace () {
      let { data: { items } } = await getPlace({
        'access_token': 'OLsleutsb2eiV4BCNAuk5IuuXZWA_R6Wdmtua6prg1c',
        'sys.contentType.sys.id': 'location',
        'include': '5'
      })
      let i = 0,
        list = [],
        j = 0,
        length = items.length
      for (i; i < length; i++) {
        list.push({
          title: items[i].fields.title,
          address: items[i].fields.address,
          longitude: items[i].fields.location.lon,
          latitude: items[i].fields.location.lat,
          phone: "+39 800 305 357"
        })
      }
      let len = list.length
      for (j; j < len; j++) {
        if (list[j].longitude == this.location.longitude && list[j].latitude == this.location.latitude) {
          this.itemPlace = list[j]
        }
      }
      console.log('222',this.itemPlace)
    },
    // 初始化
    init() {
      let that = this;
      mapboxgl.accessToken =
        "pk.eyJ1IjoibWl5YXZpbGl1IiwiYSI6ImNrN2p3NXM4cjBhdWgzb2sxZTVycDJldTgifQ.o96fERX1NdQp0FWU3_PcSQ";
      var coordinates = document.getElementById("coordinates");
      const map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: "mapbox://styles/mapbox/navigation-guidance-day-v4",
        center: [that.location.longitude, that.location.latitude], // 设置地图中心
        zoom: 12 // 设置地图比例
      });

      map.on("load", function() {
        map.loadImage(
          that.icon,
          function(error, image) {
            if (error) throw error;
            map.addImage("cat", image);
            map.addSource("point", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [that.location.longitude, that.location.latitude]
                    }
                  }
                ]
              }
            });
            map.addLayer({
              id: "points",
              type: "symbol",
              source: "point",
              layout: {
                "icon-image": "cat",
                "icon-size": 0.5
              }
            });
          }
        );
      });
    }
  },
  components: {
    directList: directList,
  }
};
</script>
<style scoped lang='less'>
@import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css");
.map {
  .list {
    width: 100%;
    padding:0 0.32rem;
    box-sizing: border-box;
    min-height: 3.26rem;
    position: absolute;
    bottom: 10px;
    z-index: 100000;

  }
}
</style>
