<template>
  <div style="height:100vh;width:100%;" class="map">
    <div ref="basicMapbox" style="height:100%;width:100%;"></div>
    <!-- <pre id="info"></pre> -->
    <!-- <pre id='coordinates' class='coordinates'></pre> -->
    <div class="list">
      <directList :directList="directList"></directList>
    </div>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import icon from "../assets/pin.png";
import directList from "../components/list";

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
      directList: {
        addressPin: "Piazza dei Cinquecento, 00185 Roma RM, Italy",
        phone: "+39 800 305 357"
      }
    };
  },
  computed: {
  },
  mounted() {
    this.init();
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
                      coordinates: [119.545181, 39.91444]
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

