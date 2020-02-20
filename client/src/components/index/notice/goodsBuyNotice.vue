<template>
  <div id="goodsBuyNotice">
    <div class="headTop">
      <span @click="markAllBuy()">一键已读</span>
    </div>
    <div :class="[lists,{action:item.status==1}]" v-for="(item,index) in goodsList" :key="index">
      <div class="listTitle">
        <span>售卖成功</span>
      </div>
      <div class="listContent">
        <div class="contentLeft">
          <span>{{item.user.mail}}</span>
          <span>购买了</span>
          <span>{{item.goods.goodsName}}</span>
        </div>
        <div class="contentRight">
          <span v-if="item.status==1" @click="markBuyById(item._id)">标记已读</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "goodsBuyNotice",
  data() {
    return {
      goodsList: [],
      lists: "lists",
      action: "action"
    };
  },
  created() {
    this.getGoodsNewBuy();
  },
  methods: {
    async getGoodsNewBuy() {
      try {
        let data = await this.$http.get("/api/getSuccessSale", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.goodsList = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async markAllBuy() {
      try {
        let data = await this.$http.get("/api/markAllBuy", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.getGoodsNewBuy();
      } catch (error) {
        console.error(error);
      }
    },
    async markBuyById(id) {
      try {
        let data = await this.$http.get("/api/markBuyById", {
          params: {
            id: id
          }
        });
        this.getGoodsNewBuy();
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#goodsBuyNotice {
  width: 100%;
  .headTop {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding-right: 30px;
    border-bottom: 1px solid rgb(243, 237, 237);
    span {
      cursor: pointer;
      &:hover {
        color: #1985ff;
      }
    }
  }
  .lists {
    margin-top: 30px;
    margin-left: 50px;
    margin-right: 50px;
    margin-bottom: 50px;
    border: 1px solid rgb(243, 238, 238);
    border-radius: 5px;
    .listTitle {
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgb(241, 236, 236);
      padding-left: 30px;
    }
    .listContent {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 30px;
      padding-right: 30px;
      .contentLeft {
        width: 80%;
        overflow: hidden;
        span:nth-child(2) {
          padding-left: 10px;
          padding-right: 10px;
          font-size: 13px;
          color: rgb(155, 151, 151);
        }
      }
      .contentRight {
        span {
          cursor: pointer;
          &:hover {
            color: #1985ff;
          }
        }
      }
    }
  }
  .action {
    background-color: rgb(232, 240, 255);
  }
}
</style>