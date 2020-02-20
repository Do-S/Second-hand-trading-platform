<template>
  <div id="setting">
    <HeadTop isAction="setting" />
    <div class="body">
      <div class="bodyLeft">
        <div class="leftOne">
          <Icon size="40" color="#1985ff" type="md-settings" />
        </div>
        <router-link
          :to="{ name: 'personalInformation'}"
          :class="[leftTwo,{action:$route.name=='personalInformation'}]"
        >
          <span>个人资料</span>
        </router-link>
        <router-link
          :to="{ name: 'accountSecurity'}"
          :class="[leftTwo,{action:$route.name=='accountSecurity'}]"
        >
          <span>账号安全</span>
        </router-link>
      </div>
      <div class="bodyRight">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "../index/headTop";
export default {
  name: "editUser",
  data() {
    return {
      leftTwo: "leftTwo",
      action: "action"
    };
  },
  created() {},
  components: {
    HeadTop: HeadTop
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
#setting {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: #f7f9fa;
  .body {
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
    .bodyLeft {
      width: 18%;
      background-color: white;
      margin-right: 10px;
      border-radius: 5px;
      border: 1px solid rgb(245, 241, 241);
      .leftOne {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid rgb(248, 244, 244);
      }
      .leftTwo {
        width: 100%;
        height: 60px;
        font-size: 16px;
        color: rgb(116, 116, 116);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          background-color: #f7f9fa;
        }
      }
      .leftTwo:nth-child(2) {
        margin-top: 20px;
      }
      .leftTwo:nth-child(3) {
        margin-bottom: 20px;
      }
      .action {
        font-weight: 600;
        color: #1985ff;
      }
    }
    .bodyRight {
      width: 100%;
      background-color: white;
      border-radius: 5px;
    }
  }
}
</style>