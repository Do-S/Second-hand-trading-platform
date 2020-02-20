<template>
  <div id="community">
    <HeadTop isAction="community" />
    <div class="body">
      <div class="left">
        <div class="head">
          <router-link :class="[{action:$route.name=='newPost'}]" :to="{name:'newPost'}">最新发布</router-link>
          <router-link :class="[{action:$route.name=='hotPost'}]" :to="{name:'hotPost'}">热门</router-link>
        </div>
        <div class="show">
          <router-view></router-view>
        </div>
      </div>
      <div class="right">
        <PopularPost />
      </div>
    </div>
  </div>
</template>

<script>
import HeadTop from "./index/headTop";
import PopularPost from "./community/popularPost";
export default {
  name: "comminuty",
  data() {
    return {
      action: "action"
    };
  },
  components: {
    HeadTop: HeadTop,
    PopularPost
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#community {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: #f7f9fa;
  .body {
    width: 75%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 15px;
    margin-bottom: 30px;
    .left {
      width: 71%;
      background-color: white;
      border-radius: 5px;
      .head {
        width: 100%;
        height: 60px;
        padding-left: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #f8f9fa;
        a {
          padding-right: 30px;
          font-size: 14px;
          color: #797c80;
          font-weight: 400;
          cursor: pointer;
        }
        .action {
          color: #1985ff;
          font-weight: 600;
        }
      }
      .show {
        width: 100%;
      }
    }
    .right {
      width: 28%;
    }
  }
}
</style>