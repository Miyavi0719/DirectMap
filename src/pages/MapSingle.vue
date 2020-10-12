<template>
  <div style="height:100vh;width:100%;" class="map">
    <div ref="basicMapbox" style="height:100%;width:100%;"></div>
    <swiper class="list" ref="mySwiper" :options="swiperOptions" v-show='allPlace.length > 0' @click-slide='directions1'>
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
          loop: true,
          // grabCursor: true,
          autoplay: false,
          observer: true,
          observeParents: true,
          on: {
            //监听滑动切换事件，返回swiper对象
            slideChange: () => {
              let swiper = this.$refs.mySwiper.swiperInstance.realIndex;

              // console.log(this.$refs.mySwiper.swiperInstance,this.list,swiper,swiper >= 0)
              if (swiper >= 0) {
                let center = this.list[swiper].geometry.coordinates
                console.log(swiper, center); //滑动打印当前索引
                this.map.flyTo({
                  center: center
                });
              }

            },
          }
          // Some Swiper option/callback...
        },
        index: 0,
        icon: icon,
        directList: [],
        allPlace: [],
        list: [],
        map: null,
        title: ''
      };
    },
    created() {
      this.$nextTick(() => {
        this.getToken()
      })
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      }
    },
    methods: {
      // 获取并保存token
      getToken() {
        let url = decodeURI(window.location.href)
        // let url = window.location.href
        console.log(url)
        let index = url.indexOf('?')
        let value = url.slice(index + 1)
        let valueAry = value.split('=')
        console.log(valueAry)
        if (valueAry[0] == 'token') {
          window.localStorage.setItem('user', {
            BearerToken: valueAry[1]
          })
          this.index = valueAry[2]
          this.getPlace()

        } else if (valueAry[0] == 'store') {

          let stroeArr = valueAry[1].split('|')
          let stroe = []
          this.allPlace = []
          stroeArr.map(item => {
            stroe.push(JSON.parse(item.replace(/%3A/g, ":")))
            this.allPlace.push(JSON.parse(item.replace(/%3A/g, ":")))
          })
          // const mySwiper = new Swiper('.list', {
          //   slidesPerView: "auto",
          //   spaceBetween: 0,
          //   autoplay: false,
          //   observer: true,
          //   observeParents: true,
          // })
          for (var i = 0; i < stroe.length; i++) {
            this.list.push({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'title': 0,
                'coordinates': [stroe[i].longitude, stroe[i].latitude]
              }
            })
          }
          if (this.list.length <= 1) {
            this.swiperOptions.loop = false
          } else {
            this.swiperOptions.loop = true
          }
          this.init([stroe[0].longitude, stroe[0].latitude]);

        }

      },
      directions1(index) {
        console.log(index)
        // this.map.flyTo({
        //   center: [lon, lat]
        // });
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

        if (this.index == 0) {
          serviceItems = UTUDirectLocations(res.data, 'envelope-and-sticker-collection');

        } else {
          serviceItems = UTUDirectLocations(res.data, 'service-counter');
        }

        this.allPlace = []
        this.init([serviceItems[0].fields.location.lon, serviceItems[0].fields.location.lat]);
        for (var i = 0; i < serviceItems.length; i++) {
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
          console.log('list', this.list)
        }
        if (this.list.length <= 1) {
          console.log('loop', this.list.length)
          this.swiperOptions.loop = false
        } else {
          this.swiperOptions.loop = true
        }
        // const mySwiper = new Swiper('.list', {
        //   slidesPerView: "auto",
        //   spaceBetween: 0,
        //   autoplay: false,
        //   observer: true,
        //   observeParents: true,
        // })

      },
      init(center) {
        let that = this;
        mapboxgl.accessToken =
          "pk.eyJ1IjoibWl5YXZpbGl1IiwiYSI6ImNrN2p3NXM4cjBhdWgzb2sxZTVycDJldTgifQ.o96fERX1NdQp0FWU3_PcSQ";
        var coordinates = document.getElementById("coordinates");
        console.log(that.$refs)
        console.log(that.$refs.basicMapbox)
        const map = new mapboxgl.Map({
          container: that.$refs.basicMapbox,
          style: "mapbox://styles/mapbox/streets-v11",
          center: center, // 设置地图中心
          zoom: 15 // 设置地图比例
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
                  features: that.list
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
        this.map = map
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
