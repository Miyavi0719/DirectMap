<template>
  <div class="listmap" v-if="Lists">
    <div class="title">{{ Lists.title }}</div>
    <div class="li">
      <img :src="img.IconAddressPin" alt="img" />
      <div class="add">{{ Lists.address }}</div>
    </div>
    <!-- <div class="li" v-show="Lists.phone !== ''">
      <img :src="img.IconPhone" alt="img" />
      <div class="phone">{{ Lists.phone }}</div>
    </div> -->
    <div class="btn" @click="directions(Lists.longitude,Lists.latitude)">
      Directions
    </div>
  </div>
</template>
<script>
import IconAddressPin from "../assets/IconAddressPin.png";
import IconPhone from "../assets/IconPhone.png";
export default {
  props: ["directList"],
  data() {
    return {
      img: {
        IconAddressPin: IconAddressPin,
        IconPhone: IconPhone
      }
    };
  },
  computed: {
    Lists () {
      return this.directList
    }
  },
  methods:{
    directions(lon,lat){
      this.$emit('directions',lon,lat)
    }
  }
};
</script>
<style lang="less" scoped>
.listmap {
  width: 100%;
  background: #ffffff;
  border-radius: 0.06rem;
  box-shadow: 0 0.06rem 0,10rem rgba(0, 0, 0, 0.3);
  font-size: 14px;
  box-sizing: border-box;
  padding: 0.24rem;
  .title{
    color: #1E1E20;
    margin-bottom: 0.16rem;
    font-weight: bold;
  }
  .li {
    display: flex;
    justify-self: start;
    color: #666666;
    margin-bottom: 0.16rem;
    align-items: center;
    .phone{
      color: #00B398;
      font-weight: bold;
    }
  }
  img {
    width: 0.48rem;
    height: 0.48rem;
    margin-right: 0.08rem;
  }
  .btn{
    margin-top: 0.16rem;
    background: #00B398;
    border-radius: 0.06rem;
    color: #ffffff;
    padding: 0.12rem;
    text-align: center;
  }
}
</style>
