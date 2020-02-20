<template>
  <div id="goodsUser">
    <HeadTop isAction="goodsUser" />
    <div class="body">
      <div class="user">
        <div class="userLeft">
          <div class="userAvatar">
            <img :src="userList.avatar" />
          </div>
          <div class="userMessage">
            <p v-if="userList.nickname !== ''">{{userList.nickname}}</p>
            <p v-else>{{userList.mail}}</p>
            <div class="userSex">
              <span>性别</span>
              <span>{{userList.sex}}</span>
            </div>
            <div class="userSex">
              <span>简介</span>
              <span v-if="userList.introduction !== ''">{{userList.introduction}}</span>
              <span v-else>这位道友什么都没有留下...</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="goods">
          <div class="listHead">
            <div class="top">商品名</div>
            <div class="last">成色</div>
            <div class="last">邮寄</div>
            <div class="last">价格</div>
          </div>
          <div class="goodsList" v-for="(item,index) in goodsList" :key="index">
            <div class="top">
              <div class="goodsPic">
                <router-link :to="{ name: 'goodsDetails',params: { id: item._id }}">
                  <img :src="item.img[0].url" />
                </router-link>
              </div>
              <div class="titleName">
                <router-link
                  :to="{ name: 'goodsDetails',params: { id: item._id }}"
                >{{item.goodsName}}</router-link>
              </div>
            </div>
            <div class="last">
              <span>{{item.old/10}}成新</span>
            </div>
            <div class="last">
              <span v-if="item.mail">免邮费</span>
              <span v-else>需付邮费</span>
            </div>
            <div class="last">
              <span>￥{{item.price}}</span>
            </div>
          </div>
        </div>
        <div class="achievement">
          <div class="head">
            <span>认证与成就</span>
          </div>
          <div class="content">
            <span>个人成就</span>
            <p>
              加入旧肆已经
              <span style="color: #000;font-weight: 600">{{day}}</span> 天
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "../index/headTop";
export default {
  name: "goodsUser",
  data() {
    return {
      userList: {},
      goodsList: [],
      day: 0
    };
  },
  components: {
    HeadTop: HeadTop
  },
  created() {
    this.getUser();
    this.getMyRelease();
  },
  methods: {
    async getUser() {
      try {
        let data = await this.$http.post("/api/user/getUserById", {
          id: this.$route.params.id
        });
        this.userList = data.data;
        this.day = Math.floor(
          (new Date() - new Date(this.userList.date)) / (1000 * 60 * 60 * 24)
        );
      } catch (error) {
        console.error(error);
      }
    },
    async getMyRelease() {
      try {
        let data = await this.$http.get("/api/getMyRelease", {
          params: {
            userId: this.$route.params.id
          }
        });
        this.goodsList = data.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#goodsUser {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: #f7f9fa;
  .body {
    width: 75%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
    .user {
      width: 100%;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      background-color: white;
      border-radius: 5px;
      .userLeft {
        display: flex;
        .userAvatar {
          width: 120px;
          height: 120px;
          margin-left: 20px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid #1985ff;
          }
        }
        .userMessage {
          padding-left: 30px;
          p {
            font-size: 28px;
            font-weight: 500;
            color: #18191a;
          }
          span {
            font-weight: 500;
            color: #494b4d;
            font-size: 14px;
          }
          span:nth-child(2) {
            color: #797c80;
            width: 350px;
            padding-left: 20px;
          }
          .userSex {
            padding-top: 10px;
          }
        }
      }
    }
    .content {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .goods {
        width: 71%;
        border-radius: 5px;
        background-color: white;
        margin-bottom: 50px;
        .listHead {
          width: 100%;
          height: 50px;
          margin-top: 10px;
          border-bottom: 1px solid rgb(245, 240, 240);
          display: flex;
          justify-content: flex-start;
          .top {
            width: 55%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .last {
            width: 15%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .goodsList {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: flex-start;
          .top {
            width: 55%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 20px;
            .goodsPic {
              a {
                img {
                  width: 78px;
                  height: 78px;
                }
              }
            }
            .titleName {
              padding-left: 20px;
              a {
                color: #686868;
                font-size: 13px;
              }
            }
          }
          .last {
            width: 15%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .achievement {
        width: 28%;
        border-radius: 5px;
        background-color: white;
        .head {
          width: 100%;
          height: 50px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 20px;
          font-size: 16px;
          font-weight: 600;
          color: #18191a;
          box-shadow: 0 0 2px 0 rgba(85, 107, 133, 0.2);
        }
        .content {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          padding-left: 20px;
          padding-top: 10px;
          p {
            display: block;
            width: 100%;
            margin-bottom: 20px;
          }
          span {
            font-size: 15px;
            line-height: 21px;
            color: #18191a;
            font-weight: 500;
            padding-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>