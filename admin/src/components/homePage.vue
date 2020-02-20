<template>
  <div id="homePage">
    <div class="head">
      <span></span>
      <span @click="logout()">注销登录</span>
    </div>
    <div class="body">
      <div class="bodyHead">
        <span>欢迎你，{{$getUser.userId}}</span>
      </div>
      <div class="bodyContent">
        <p>每日诗词</p>
        <p>{{poetryList.content}}</p>
        <Tag v-for="(item,index) in poetryList.matchTags" color="green">{{item}}</Tag>
        <div class="changePoetry">
          <span>换一首</span>
          <Icon @click="getPoetry" size="22" type="ios-refresh" />
        </div>
        <Divider>诗词原文</Divider>
        <div class="original">
          <div class="originalCenter">
            <p class="originalPoetry">{{poetryList.origin.title}}</p>
            <p class="originalPoetry">
              <span>{{poetryList.origin.dynasty}}</span>
              <span style="padding-left:10px;">{{poetryList.origin.author}}</span>
            </p>
            <p
              class="originalPoetry"
              v-for="(item,index) in poetryList.origin.content"
              :key="index"
            >{{item}}</p>
            <div class="translation">
              <Divider>诗词翻译</Divider>
              <p v-if="poetryList.origin.translate==null">诗文好像没有翻译🙄</p>
              <p v-else v-for="(item,index) in poetryList.origin.translate" :key="index">{{item}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const jinrishici = require("jinrishici");
export default {
  name: "homePage",
  data() {
    return {
      poetryList: {}
    };
  },
  created() {
    this.getPoetry();
    console.log(this.$getUser);
  },
  methods: {
    getPoetry() {
      jinrishici.load(result => {
        this.poetryList = result.data;
      });
    },
    logout() {
      //清空localStorage
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="scss" scoped>
#homePage {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .head {
    width: 80%;
    height: 45px;
    border-radius: 5px;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding-left: 30px;
    padding-right: 30px;
    span {
      font-size: 15px;
      cursor: pointer;
      color: rgb(84, 138, 253);
      &:hover {
        color: rgb(255, 111, 111);
      }
    }
  }
  .body {
    width: 80%;
    background-color: white;
    margin-top: 50px;
    margin-bottom: 50px;
    border-radius: 5px;
    .bodyHead {
      width: 100%;
      height: 70px;
      padding-left: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid rgb(243, 237, 237);
      span {
        font-size: 23px;
      }
    }
    .bodyContent {
      width: 100%;
      padding-left: 50px;
      padding-right: 50px;
      padding-top: 20px;
      margin-bottom: 50px;
      p:nth-child(1) {
        font-size: 18px;
      }
      p:nth-child(2) {
        padding-top: 20px;
        font-size: 16px;
        color: rgb(110, 111, 119);
      }
      .changePoetry {
        width: 100%;
        display: flex;
        align-items: center;
        padding-top: 20px;
        span {
          margin-right: 10px;
        }
      }
      .original {
        width: 100%;
        display: flex;
        justify-content: center;
        .originalCenter {
          width: 70%;
          height: 500px;
          background-color: rgb(242, 243, 233);
          border-radius: 5px;
          padding-top: 30px;
          padding-bottom: 30px;
          overflow-x: hidden;
          overflow-y: scroll;
          .originalPoetry {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding-top: 5px;
            padding-left: 10px;
            padding-right: 1opx;
            padding-bottom: 5px;
          }
          .translation {
            width: 100%;
            margin-top: 30px;
            padding-left: 30px;
            padding-right: 30px;
            p {
              padding-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>