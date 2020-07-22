<template>
  <div style="height:100vh;width:100%;" class="map">
    <div ref="basicMapbox" style="height:100%;width:100%;"></div>
    <!-- <pre id="info"></pre> -->
    <!-- <pre id='coordinates' class='coordinates'></pre> -->
    <swiper class="list" ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="(item,index) in allPlace" :key='index'>
        <directList :directList="item"></directList>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
  import {
    getPlace,
    get
  } from '../../test/request/api.js'
  import mapboxgl from "mapbox-gl";
  import icon from "../assets/pin.png";
  import directList from "../components/list";
  import {
    Swiper,
    SwiperSlide,
    directive
  } from "vue-awesome-swiper";
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
        index: 0,
        icon: icon,
        directList: [],
        allPlace: [],
        list: []
      };
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper;
      }
    },
    mounted() {

      console.log("Current Swiper instance object", this.swiper);
      this.swiper.slideTo(3, 1000, false);
      // 获取并保存token
      this.getToken()
      // 请求所有站点
      this.getPlace()
    },
    methods: {
      // 获取并保存token
      getToken() {
        let url = decodeURI(window.location.href)
        console.log(url)
        let index = url.indexOf('?')
        let value = url.slice(index + 1)
        let valueAry = value.split('=')
        console.log(valueAry)
        if (valueAry[0] !== 'token') {
          return
        }
        window.localStorage.setItem('user', {
          BearerToken: valueAry[1]
        })
        this.index = valueAry[2]
      },
      // 请求所有站点
      async getPlace() {
        let res = await getPlace({
          'access_token': 'OLsleutsb2eiV4BCNAuk5IuuXZWA_R6Wdmtua6prg1c',
          'sys.contentType.sys.id': 'location',
          'include': '5'
        })

        let serviceItems = []
        const UTUDirectLocations = (data = [], category = 'customs-counters') => data.items.filter((item) => {
          const entry = data.includes.Entry.filter((value) => value.sys.id === item.fields.reference[0].sys.id);
          const image = data.includes.Asset.filter((value) => value.sys.id === item.fields.image.sys.id);
          item.images = image
          if (entry[0].fields.slug === category) {
            return item;
          }
        })
        // serviceItems = UTUDirectLocations(res.data, 'customs-office');

        if (this.index == 0) {
          serviceItems = UTUDirectLocations(res.data, 'customs-office');

        } else {
          serviceItems = UTUDirectLocations(res.data, 'service-counter');
        }
        console.log(this.index,serviceItems)
        this.init([serviceItems[0].fields.location.lon,serviceItems[0].fields.location.lat]);
        for(var i = 0;i<serviceItems.length;i++){
          this.allPlace.push({
            // icon: this.$images.iconAddress,
            title: serviceItems[i].fields.title,
            address: serviceItems[i].fields.address,
            longitude: serviceItems[i].fields.location.lon,
            latitude: serviceItems[i].fields.location.lat,
            // location: item.fields.location,
            // image:item.images
          })
          this.list.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'title': 0,
              'coordinates': [serviceItems[i].fields.location.lon, serviceItems[i].fields.location.lat]
            }
          })
        }

        //   let i = 0,
        //     length = items.length
        //   for (i; i < length; i++) {
        //     this.allPlace.push({
        //       title: items[i].fields.title,
        //       address: items[i].fields.address,
        //       longitude: items[i].fields.location.lon,
        //       latitude: items[i].fields.location.lat,
        //       phone: "+39 800 305 357"
        //     })
        //     this.list.push({
        //       'type': 'Feature',
        //       'geometry': {
        //         'type': 'Point',
        //         'title': i,
        //         'coordinates': [items[i].fields.location.lon, items[i].fields.location.lat]
        //       }
        //     })
        // },
        // 初始化
      },
      init(center) {
        let that = this;
        mapboxgl.accessToken =
          "pk.eyJ1IjoibWl5YXZpbGl1IiwiYSI6ImNrN2p3NXM4cjBhdWgzb2sxZTVycDJldTgifQ.o96fERX1NdQp0FWU3_PcSQ";
        var coordinates = document.getElementById("coordinates");
        const map = new mapboxgl.Map({
          container: this.$refs.basicMapbox,
          style: "mapbox://styles/mapbox/navigation-guidance-day-v4",
          center: center, // 设置地图中心
          zoom: 3 // 设置地图比例
        });

        map.on("load", function() {
          // Add a new source from our GeoJSON data and
          // set the 'cluster' option to true. GL-JS will
          // add the point_count property to your source data.
          map.loadImage(icon, function(error, image) {
            if (error) throw error;
            map.addImage("cat", image);
            map.addSource('earthquakes', {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': that.list
              },
              cluster: true,
              clusterMaxZoom: 14, // Max zoom to cluster points on
              clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });
            // data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
            // map.addLayer({
            //   id: "clusters",
            //   type: "circle",
            //   source: "earthquakes",
            //   filter: ["has", "point_count"],
            //   paint: {
            //     "circle-color": "#FFFFFF",
            //     "circle-radius": 12,
            //     "circle-stroke-width": 2,
            //     "circle-stroke-color": "#00B398",
            //     "circle-translate": [22, -36]
            //   }
            // });

            map.addLayer({
              id: "cluster-count",
              type: "symbol",
              source: "earthquakes",
              // filter: ["has", "point_count"],
              layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 14,
                "text-offset": [1.5, -2.5],
                "text-optional": true,
                "icon-image": "cat",
                "icon-size": 0.5,
                "icon-anchor": "bottom",
              }
            });
          });
        });
      }
    },
    components: {
      directList: directList,
      Swiper,
      SwiperSlide
    }
  };
</script>
<style scoped lang='less'>
  @import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css");

  .map {

    .list {
      width: 100%;
      height: 3.26rem;
      position: absolute;
      bottom: 10px;
      z-index: 100000;

      .swiper-slide {
        width: 5.32rem;
        height: 3.26rem;
        margin-left: 0.24rem;
      }
    }
  }
</style>
