<template>
  <div id="index">
    <div class="indexMenu">
      <div class="indexTop">
        <img src="@/assets/logo.png" alt="logo" />
        <span class="logo">旧肆</span>
      </div>
      <router-link
        :class="[homePage ,{action:$route.name=='homePage'}]"
        :to="{ name: 'homePage'}"
        style="color:black"
      >
        <Icon type="md-home" size="15" color="rgba(255, 255, 255, 0.7)" />
        <span>主页</span>
      </router-link>
      <i-menu :theme="theme2" class="menu" :active-name="$route.name">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-paper" />商品管理
          </template>
          <router-link :to="{ name: 'transactionInquiry'}" style="color:black">
            <MenuItem name="transactionInquiry">交易查询</MenuItem>
          </router-link>
          <router-link :to="{ name: 'reportReview'}" style="color:black">
            <MenuItem name="reportReview">举报审核</MenuItem>
          </router-link>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-stats" />统计分析
          </template>
          <router-link :to="{ name: 'transactionStatistics'}" style="color:black">
            <MenuItem name="transactionStatistics">交易统计</MenuItem>
          </router-link>
        </Submenu>
      </i-menu>
      <router-link
        :class="[homePage ,{action:$route.name=='modifyInformation'}]"
        :to="{ name: 'modifyInformation'}"
        style="color:black"
      >
        <Icon type="md-construct" size="15" color="rgba(255, 255, 255, 0.7)" />
        <span>修改信息</span>
      </router-link>
    </div>
    <div class="indexShow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      theme2: "dark",
      homePage: "homePage",
      action: "action"
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
#index {
  width: 100%;
  .indexMenu {
    width: 16%;
    height: 100%;
    background-color: red;
    position: fixed;
    background-color: #515a6e;
    top: 0px;
    left: 0px;
    .indexTop {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      span {
        font-family: Boyfriend;
        color: rgba(255, 255, 255, 0.7);
        font-size: 20px;
      }
    }
    .homePage {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: flex-start;
      padding-left: 23px;
      align-items: center;
      span {
        color: rgba(255, 255, 255, 0.7);
        padding-left: 8px;
      }
      color: rgba(255, 255, 255, 0.7);
      &:hover {
        span {
          color: #fff;
        }
        cursor: pointer;
        background-color: #464f5f;
      }
    }
    .action {
      background-color: #464f5f;
    }
    .menu {
      width: 100% !important;
    }
  }
  .indexShow {
    margin-left: 16%;
    background-color: #f0f1f3;
  }
}
</style>
