<template>
  <div id="newPost">
    <div class="body">
      <div class="list" v-for="(item,index) in postList" :key="index">
        <div class="left">
          <div class="headImg">
            <router-link :to="{name:'goodsUser', params:{id:item.user._id}}">
              <img :src="item.user.avatar" />
            </router-link>
          </div>
          <div class="title">
            <div>
              <a @click="hrefDetail(item._id)">{{item.title}}</a>
              <!-- <router-link :to="{name:'postDetail', params:{id:item._id}}">{{item.title}}</router-link> -->
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
      <Page :total="count" :page-size="pageSize" @on-change="getPost" />
    </div>
  </div>
</template>
<script>
export default {
  name: "newPost",
  data() {
    return {
      postList: [],
      pageSize: 15,
      count: 0
    };
  },
  created() {
    this.getPost(1);
  },
  methods: {
    async getPost(page) {
      try {
        let data = await this.$http.get("/api/post/getPost", {
          params: {
            count: (page - 1) * this.pageSize,
            pageSize: this.pageSize
          }
        });
        this.postList = data.data.result;
        this.count = data.data.count;
      } catch (error) {
        console.error(error);
      }
    },
    hrefDetail(id) {
      let newpage = this.$router.resolve({
        name: "postDetail",
        params: {
          id: id
        }
      });
      window.open(newpage.href, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
#newPost {
  width: 100%;
  .body {
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
</style>