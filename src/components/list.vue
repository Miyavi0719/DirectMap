<template>
  <div class="listmap" v-if="directList">
    <div class="title">{{ directList.title }}</div>
    <div class="li">
      <img :src="img.IconAddressPin" alt="img" />
      <div class="add">{{ directLists.address }}</div>
    </div>
    <div class="li">
      <img :src="img.IconPhone" alt="img" />
      <div class="phone">{{ directLists.phone }}</div>
    </div>
    <div class="btn">
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
      },
      directLists: this.directList
    };
  },
  mounted() {
    // this.init();
    console.log('777',this.directList)
  },
  methods: {}
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
