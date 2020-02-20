<template>
  <div id="postSearch">
    <HeadTop isAction="postSearch" />
    <div class="body">
      <div class="left">
        <div class="lists">
          <div class="list" v-for="(item,index) in postData" :key="index">
            <div class="left">
              <div class="headImg">
                <router-link :to="{name:'goodsUser', params:{id:item.user._id}}">
                  <img :src="item.user.avatar" />
                </router-link>
              </div>
              <div class="title">
                <div>
                  <router-link :to="{name:'postDetail', params:{id:item._id}}">{{item.title}}</router-link>
                  <span>{{item.user.mail}}</span>
                  <span>|</span>
                  <span>发表时间：</span>
                  <Time :time="item.date" />
                </div>
              </div>
            </div>
            <div class="right">
              <Icon size="15" type="ios-eye-outline" />
              <span>{{item.count}}</span>
            </div>
          </div>
        </div>
        <div class="page">
          <Page :total="postData.length" :page-size="20" @on-change="getPostBySearch" />
        </div>
      </div>
      <div class="right">
        <PopularPost />
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "../../index/headTop";
import PopularPost from "../popularPost";
export default {
  name: "postSearch",
  data() {
    return {
      postData: []
    };
  },
  components: {
    HeadTop,
    PopularPost
  },
  created() {
    this.getPostBySearch(1);
  },
  methods: {
    async getPostBySearch(page) {
      try {
        let data = await this.$http.get("/api/post/getPostBySearch", {
          params: {
            postSearch: this.$route.query.id,
            page: (page - 1) * 20
          }
        });
        this.postData = data.data;
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#postSearch {
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
      .lists {
        width: 100%;
        .list {
          width: 100%;
          display: flex;
          justify-content: space-between;
          border: 1px solid #f8f8fc;
          &:hover {
            background-color: rgba(0, 0, 0, 0.01);
          }
          .left {
            height: 100px;
            display: flex;
            justify-content: flex-start;
            .headImg {
              height: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding-left: 30px;
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 1px solid #1985ff;
              }
            }
            .title {
              line-height: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding-left: 20px;
              a {
                color: #18191a;
                font-weight: 400;
                font-size: 16px;
                display: block;
                margin-bottom: 10px;
                &:hover {
                  color: #1985ff;
                }
              }
              span {
                font-size: 12px;
                color: #aaaeb3;
              }
              span:nth-child(3) {
                padding-left: 10px;
                padding-right: 10px;
              }
            }
          }
          .right {
            width: 10%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span {
              padding-left: 5px;
            }
          }
        }
      }
      .page {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 30px;
        margin-bottom: 20px;
      }
    }
    .right {
      width: 28%;
    }
  }
}
</style>