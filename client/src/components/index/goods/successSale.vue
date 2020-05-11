<template>
  <div id="successSale">
    <div class="goodsLists">
      <div class="listHead">
        <div class="headLeft headSame">
          <span>商品名</span>
        </div>
        <div class="headCenter headSame">
          <span>邮寄</span>
        </div>
        <div class="headCenter headSame">
          <span>价格</span>
        </div>
        <div class="headRight headSame">
          <span>买家</span>
        </div>
        <div class="headRight headSame">
          <span>购买时间</span>
        </div>
      </div>
      <div class="listBody" v-for="(item,index) in goodsData" :key="index">
        <div class="bodyLeft">
          <div class="goodsPic">
            <a @click="hrefDetail(item.goods._id)">
              <img :src="item.img[0].url" :alt="index" />
            </a>
            <!-- <router-link :to="{ name: 'goodsDetails',params: { id: item.goods._id }}">
              <img :src="item.img[0].url" :alt="index" />
            </router-link>-->
          </div>
          <div class="titleName">
            <a @click="hrefDetail(item.goods._id)">{{item.goods.goodsName}}</a>
            <!-- <router-link
              :to="{ name: 'goodsDetails',params: { id: item.goods._id }}"
            >{{item.goods.goodsName}}</router-link>-->
          </div>
        </div>
        <div class="bodyCenter bodySame">
          <span v-if="item.goods.mail">免邮费</span>
          <span v-else>需付邮费</span>
        </div>
        <div class="bodyCenter bodySame">
          <span style="color:red;">￥{{item.goods.price}}</span>
        </div>
        <div class="bodyRight bodySame">
          <span>{{item.user.mail}}</span>
        </div>
        <div class="bodyRight bodySame">
          <span>{{item.date | dateformat()}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "successSale",
  data() {
    return {
      goodsData: []
    };
  },
  created() {
    this.getMyRelease();
  },
  methods: {
    async getMyRelease() {
      try {
        let data = await this.$http.get("/api/getSuccessSale", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.goodsData = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getTrue(goodsId, status) {
      try {
        let data = await this.$http.get("/api/updateStatus", {
          params: {
            goodsId: goodsId,
            status: status
          }
        });
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
          this.getMyRelease();
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    hrefDetail(id) {
      let newpage = this.$router.resolve({
        name: "goodsDetails",
        params: {
          id: id
        }
      });
      window.open(newpage.href, "_blank");
    },
    async delGoods(goodsId) {
      try {
        let data = await this.$http.get("/api/delGoodsById", {
          params: {
            goodsId: goodsId
          }
        });
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
          this.getMyRelease();
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
#successSale {
  width: 100%;
  .goodsLists {
    width: 100%;
    .listHead {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px 0 rgba(114, 144, 179, 0.06);
      .headSame {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .headLeft {
        width: 30%;
      }
      .headCenter {
        width: 10%;
      }
      .headRight {
        width: 25%;
      }
    }
    .listBody {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .bodySame {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
      }
      .bodyLeft {
        width: 30%;
        padding: 10px;
        display: flex;
        align-items: center;
        .goodsPic {
          a {
            min-width: 80px;
            max-width: 80px;
            min-height: 80px;
            max-height: 80px;
            display: inline-block;
            border: 1px dashed rgba(161, 79, 255, 0.5);
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .titleName {
          width: 150px;
          margin-left: 10px;
          a {
            color: rgb(104, 104, 104);
            font-size: 12px;
            &:hover {
              color: red;
            }
          }
        }
      }
      .bodyCenter {
        width: 10%;
      }
      .bodyRight {
        width: 25%;
        a {
          padding-right: 25px;
        }
      }
    }
  }
}
</style>