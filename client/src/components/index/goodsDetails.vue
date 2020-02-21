<template>
  <div id="goodsDetails">
    <HeadTop isAction="goodsDetails" />
    <div class="router">
      <span @click="$router.go(-1)">上一层</span>
      <span>></span>
      <span>正文</span>
    </div>
    <div class="body">
      <div class="user">
        <div class="left">
          <div class="userName">
            <img src="@/assets/img/logo.png" alt="avatar" />
            <Tooltip content="查看卖家详情" theme="light">
              <router-link
                :to="{ name: 'goodsUser',params: { id: goodsData.user._id }}"
              >{{goodsData.user.mail}}</router-link>
            </Tooltip>
          </div>
          <div class="count">
            <p>宝贝浏览次数</p>
            <span>{{goodsData.count}}</span>
          </div>
          <div class="count">
            <p>最近编辑</p>
            <span>{{goodsData.date | dateformat()}}</span>
          </div>
        </div>
        <div class="right">
          <router-link :to="{ name: 'report',params: { id: goodsData._id }}">举报该宝贝</router-link>
        </div>
      </div>
      <div class="goods">
        <div class="goodsThing">
          <div class="goodsImg">
            <div class="goodsImgShow">
              <div
                class="ImgShowId"
                v-for="(item,index) in goodsData.img"
                v-show="ImgShowId == index"
              >
                <img :src="item.url" :alt="index" />
              </div>
            </div>
            <div class="goodsImgSelect">
              <div
                :class="[{actionSelectId:ImgShowId==index},imgSelectId]"
                v-for="(item,index) in goodsData.img"
                @click="ImgShowId=index"
              >
                <img :src="item.url" :alt="index" />
              </div>
            </div>
          </div>
          <div class="goodsContent">
            <span>宝贝介绍</span>
            <p>{{goodsData.introduction}}</p>
          </div>
        </div>
        <div class="goodsDeal">
          <div class="goodsOperate">
            <div class="operateTop">
              <p>{{goodsData.goodsName}}</p>
              <span>转卖价：</span>
              <span>￥{{goodsData.price}}</span>
            </div>
            <div class="operateBottom">
              <div class="goodsOld">
                <span>成色：</span>
                <span>{{goodsData.old/10}}成新</span>
              </div>
              <div class="goodsMail">
                <span>邮寄：</span>
                <span v-if="goodsData.mail">免邮费</span>
                <span v-else>需付邮费</span>
              </div>
              <div class="goodsBuy">
                <button @click="addGoodsCart()">加入购物车</button>
                <button @click="addGoodsBuy()">立即购买</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "./headTop";
export default {
  name: "goodsDetails",
  data() {
    return {
      goodsData: {},
      ImgShowId: 0,
      actionSelectId: "actionSelectId",
      imgSelectId: "imgSelectId"
    };
  },
  components: {
    HeadTop: HeadTop
  },
  created() {
    this.getGoodsById();
  },
  methods: {
    async getGoodsById() {
      try {
        let data = await this.$http.get("/api/getGoodsById", {
          params: { goodsId: this.$route.params.id }
        });
        if (data.data.status == 200) {
          this.goodsData = data.data.list;
          console.log(this.goodsData);
        } else {
          this.$router.push("/");
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addGoodsCart() {
      try {
        let data = await this.$http.get("/api/addGoodsCar", {
          params: {
            goodsId: this.$route.params.id,
            userId: this.$getUser.userId
          }
        });
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addGoodsBuy() {
      try {
        let data = await this.$http.get("/api/addGoodsBuy", {
          params: {
            goodsId: this.$route.params.id,
            userId: this.$getUser.userId
          }
        });
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#goodsDetails {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .router {
    width: 75%;
    padding-left: 10px;
    padding-bottom: 5px;
    padding-top: 5px;
    span {
      padding-right: 20px;
      color: #aaaeb3;
      font-size: 13px;
    }
    span:nth-child(1) {
      cursor: pointer;
      &:hover {
        color: #667280;
      }
    }
  }
  .body {
    width: 75%;
    .user {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      border: 1px solid rgb(230, 230, 230);
      border-top: 2px solid black;
      color: #999;
      font-weight: 400;
      font-size: 13px;
      .left {
        height: 100%;
        display: flex;
        .userName {
          width: 250px;
          padding-left: 10px;
          border-right: 1px solid rgb(231, 231, 231);
          display: flex;
          align-items: center;
          img {
            width: 35px;
            height: 35px;
          }
          a {
            padding-left: 10px;
            font-weight: 700;
            color: black;
          }
        }
        .count {
          width: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-right: 1px solid rgb(231, 231, 231);
        }
      }
      .right {
        display: flex;
        align-items: center;
        padding-right: 20px;
      }
    }
    .goods {
      display: flex;
      width: 100%;
      margin-top: 40px;
      .goodsThing {
        width: 60%;
        .goodsImg {
          width: 100%;
          .goodsImgShow {
            width: 100%;
            height: 500px;
            margin-bottom: 30px;
            .ImgShowId {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              overflow: hidden;
              img {
                height: 100%;
              }
            }
          }
          .goodsImgSelect {
            width: 100%;
            display: flex;
            justify-content: center;
            .imgSelectId {
              width: 78px;
              height: 60px;
              border: 1px solid rgb(235, 235, 235);
              display: flex;
              justify-content: center;
              margin-left: 20px;
              overflow: hidden;
              img {
                height: 100%;
              }
            }
            .actionSelectId {
              border: 1px solid rgb(255, 187, 109);
            }
          }
        }
        .goodsContent {
          margin-top: 50px;
          margin-bottom: 50px;
          span {
            font-weight: 600;
            font-size: 16px;
          }
          p {
            margin-top: 30px;
          }
        }
      }
      .goodsDeal {
        width: 40%;
        margin-left: 20px;
        .goodsOperate {
          width: 100%;
          .operateTop {
            border-bottom: 1px solid rgb(219, 219, 219);
            padding-bottom: 10px;
            p {
              font-weight: 600;
              font-size: 25px;
              color: black;
              padding-bottom: 10px;
            }
            span:nth-child(3) {
              color: red;
              font-size: 25px;
              font-weight: 600;
            }
          }
          .operateBottom {
            padding-top: 20px;
            .goodsOld {
              span:nth-child(2) {
                font-size: 17px;
                font-weight: 600;
              }
            }
            .goodsMail {
              margin-top: 20px;
              span:nth-child(2) {
                font-size: 17px;
                font-weight: 600;
              }
            }
            .goodsBuy {
              padding-top: 70px;
              display: flex;
              justify-content: space-around;
              button {
                border: 1px solid rgb(219, 77, 255);
                width: 150px;
                line-height: 40px;
                text-align: center;
                background-color: rgb(255, 115, 34);
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>