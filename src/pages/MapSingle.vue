<template>
  <div style="height:100vh;width:100%;" class="map">
    <div ref="basicMapbox" style="height:100%;width:100%;"></div>
    <!-- <pre id="info"></pre> -->
    <!-- <pre id='coordinates' class='coordinates'></pre> -->
    <swiper class="list" ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="(item,index) in directList" :key='index'>
        <directList :directList="item"></directList>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import icon from "../assets/pin.png";
import directList from "../components/list";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
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
      directList: [{
        addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
        phone: "+39 800 305 357"
      },{
        addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
        phone: "+39 800 305 357"
      },{
        addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
        phone: "+39 800 305 357"
      },{
        addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
        phone: "+39 800 305 357"
      },{
        addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
        phone: "+39 800 305 357"
      }]
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
  },
  mounted() {
    this.init();
    console.log("Current Swiper instance object", this.swiper);
    this.swiper.slideTo(3, 1000, false);
  },
  methods: {
    // 初始化
    init() {
      let that = this;
      mapboxgl.accessToken =
        "pk.eyJ1IjoibWl5YXZpbGl1IiwiYSI6ImNrN2p3NXM4cjBhdWgzb2sxZTVycDJldTgifQ.o96fERX1NdQp0FWU3_PcSQ";
      var coordinates = document.getElementById("coordinates");
      const map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: "mapbox://styles/mapbox/navigation-guidance-day-v4",
        center: [119.545181, 39.91444], // 设置地图中心
        zoom: 3 // 设置地图比例
      });

      map.on("load", function() {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.loadImage(icon, function(error, image) {
          if (error) throw error;
          map.addImage("cat", image);
          map.addSource("earthquakes", {
            type: "geojson",
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data:
              "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
          });
          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "earthquakes",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#fff",
              "circle-radius": 12,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#00B398",
              "circle-translate": [22, -36]
            }
          });

          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "earthquakes",
            filter: ["has", "point_count"],
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
      map.on("click", function() {
        that.$router.push({path:'/MapLists'})
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
