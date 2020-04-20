<template>
  <div id="popularPost">
    <div class="head">
      <Icon type="md-bonfire" size="25" color="rgb(226,17,12)" />
      <span>社区热门贴</span>
    </div>
    <div class="body">
      <div class="lists">
        <div class="list" v-for="(item,index) in postList" :key="index">
          <div class="title">
            <span>{{index+1}}</span>
            <router-link :to="{name:'postDetail', params:{id:item._id}}">{{item.title}}</router-link>
          </div>
          <div class="content">
            <Icon v-if="index==0" type="ios-ribbon" size="25" color="crimson" />
            <Icon v-else-if="index==1" type="ios-ribbon" size="25" color="darkorange" />
            <Icon v-else-if="index==2" type="ios-ribbon" size="25" color="limegreen" />
            <Icon v-else type="ios-ribbon" size="25" color="#DCDCDC" />
            <div class="date">
              <router-link
                :to="{ name: 'goodsUser',params: { id: item.user._id }}"
              >{{item.user.mail}}</router-link>
              <span>{{item.date|dateformat()}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "popularPost",
  data() {
    return {
      postList: []
    };
  },
  created() {
    this.getPopularPost();
  },
  methods: {
    async getPopularPost() {
      try {
        let data = await this.$http.get("/api/post/getPopularPost");
        this.postList = data.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#popularPost {
  width: 100%;
  background-color: white;
  border-radius: 5px;
  .head {
    width: 100%;
    height: 50px;
    padding-left: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid rgb(248, 244, 244);
    margin-bottom: 20px;
    span {
      font-size: 16px;
      margin-left: 10px;
      font-weight: 600;
      color: #18191a;
    }
  }
  .body {
    .lists {
      .list {
        padding-bottom: 20px;
        padding-right: 10px;
        .title {
          font-size: 14px;
          font-weight: 500;
          color: #494b4d;
          overflow: hidden;
          padding-bottom: 15px;
          padding-left: 10px;

          span:nth-child(1) {
            font-weight: 600;
            font-size: 20px;
            // color: #18191a;
            color: #1985ff;
            padding-right: 10px;
          }

          a:nth-child(2) {
            font-size: 14px;
            font-weight: 500;
            color: #494b4d;
            cursor: pointer;
            &:hover {
              color: #1985ff;
            }
          }
        }
        .content {
          display: flex;
          width: 100%;
          padding-left: 5px;
          .date {
            width: 100%;
            color: #797c80;
            font-size: 12px;
            font-weight: 400;
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            padding-right: 10px;
            padding-left: 5px;
            a {
              color: #797c80;
              font-size: 12px;
              font-weight: 400;
              &:hover {
                color: #1985ff;
              }
            }
          }
        }
      }
    }
  }
}
</style>