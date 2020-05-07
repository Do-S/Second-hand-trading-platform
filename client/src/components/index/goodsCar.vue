<template>
  <div id="goodsCar">
    <HeadTop isAction="goodsCar" />
    <div class="body">
      <div class="top">
        <div class="goodsTitle goodsCard">
          <span>商品名</span>
        </div>
        <div class="goodsOld goodsCard">
          <span>成色</span>
        </div>
        <div class="goodsMail goodsCard">
          <span>邮寄</span>
        </div>
        <div class="goodsPrice goodsCard">
          <span>价格</span>
        </div>
        <div class="goodsOp goodsCard">
          <span>操作</span>
        </div>
      </div>
      <CheckboxGroup class="list" v-model="carIdList" @on-change="checkAllGroupChange">
        <div class="carList" v-for="(item,index) in carList" :key="index">
          <div class="goodsTitle">
            <div class="check">
              <Checkbox :label="item.goods._id"></Checkbox>
            </div>
            <div class="goodsPic">
              <a @click="hrefDetail(item.goods._id)">
                <img :src="item.img[0].url" :alt="index" />
                <div class="offGoods" v-if="item.goods.status == 0">
                  <Icon type="ios-alert-outline" color="red" size="30" />
                  <p>商品已下架</p>
                </div>
              </a>
            </div>
            <div class="titleName">
              <a @click="hrefDetail(item.goods._id)">{{item.goods.goodsName}}</a>
            </div>
          </div>
          <div class="goodsOld goodsCard">
            <span>{{item.goods.old/10}}成新</span>
          </div>
          <div class="goodsMail goodsCard">
            <span v-if="item.goods.mail">免邮费</span>
            <span v-else>需付邮费</span>
          </div>
          <div class="goodsPrice goodsCard">
            <span>￥{{item.goods.price}}</span>
          </div>
          <div class="goodsOp goodsCard">
            <Button
              type="error"
              size="small"
              @click="()=>{modal_one=true;delGoodsId=item.goods._id}"
            >删除</Button>
          </div>
          <Modal v-model="modal_one" width="360">
            <p slot="header" style="color:#f60;text-align:center">
              <Icon type="ios-information-circle"></Icon>
              <span>删除确认</span>
            </p>
            <div style="text-align:center">
              <p>你确定把该商品从你的购物车中移除吗?</p>
            </div>
            <div slot="footer">
              <Button type="error" size="large" long @click="delCarById()">删除</Button>
            </div>
          </Modal>
        </div>
      </CheckboxGroup>
      <div class="bottom">
        <div class="select">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >全选</Checkbox>
          <span @click="modal_two=true">删除</span>
          <Modal v-model="modal_two" width="360">
            <p slot="header" style="color:#f60;text-align:center">
              <Icon type="ios-information-circle"></Icon>
              <span>删除确认</span>
            </p>
            <div style="text-align:center">
              <p>你确定把这些商品从你的购物车中移除吗?</p>
            </div>
            <div slot="footer">
              <Button type="error" size="large" long @click="delCarByIdList">删除</Button>
            </div>
          </Modal>
        </div>
        <div class="pay">
          <div class="payDetail">
            <span>已选商品</span>
            <span>{{carIdList.length}}</span>
            <span>件</span>
            <span>合计（不含运费）：</span>
            <span>￥{{allMoney}}</span>
          </div>
          <div v-if="carIdList.length===0" class="payButton payButtonStop">
            <span>结算</span>
          </div>
          <div v-else class="payButton" @click="modal_three=true">
            <span>结算</span>
          </div>
          <Modal v-model="modal_three" width="360">
            <p slot="header" style="color:#f60;text-align:center">
              <Icon type="ios-information-circle"></Icon>
              <span>购买确认</span>
            </p>
            <div style="text-align:center">
              <p>你确定购买该商品吗?</p>
            </div>
            <div slot="footer">
              <Button type="success" size="large" long @click="addGoodsBuyList()">购买</Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "./headTop";
export default {
  name: "goodsCar",
  data() {
    return {
      carList: [],
      carIdList: [],
      indeterminate: false,
      checkAll: false,
      allMoney: 0,
      modal_one: false,
      delGoodsId: "",
      modal_two: false,
      modal_three: false
    };
  },
  created() {
    this.getCarData();
  },
  components: {
    HeadTop: HeadTop
  },
  methods: {
    async getCarData() {
      try {
        let data = await this.$http.get("/api/getGoodsCar", {
          params: { userId: this.$getUser.userId }
        });
        this.carList = data.data;
        this.carIdList = [];
        this.calAllMoney();
        this.indeterminate = false;
        this.checkAll = false;
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

    //根据id删除商品
    async delCarById() {
      try {
        let data = await this.$http.get("/api/delCarById", {
          params: { goodsId: this.delGoodsId, userId: this.$getUser.userId }
        });
        this.modal_one = false;
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
          this.getCarData();
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },

    //批量删除商品
    async delCarByIdList() {
      try {
        this.modal_two = false;
        if (this.carIdList.length > 0) {
          let data = await this.$http.get("/api/delCarByIdList", {
            params: {
              carIdList: this.carIdList,
              userId: this.$getUser.userId
            }
          });
          if (data.data.status == 200) {
            this.$Message.success(data.data.text);
            this.getCarData();
          } else {
            this.$Message.error(data.data.text);
          }
        } else {
          this.$Message.error("没有可删除选项！");
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        let list = [];
        for (let i = 0; i < this.carList.length; i++) {
          list[i] = this.carList[i].goods._id;
        }
        this.carIdList = list;
      } else {
        this.carIdList = [];
      }
      this.calAllMoney();
    },
    checkAllGroupChange(data) {
      this.calAllMoney();
      if (data.length === this.carList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    calAllMoney() {
      if (this.carIdList.length == 0) {
        this.allMoney = 0;
        return;
      }
      let count = 0;
      for (let i = 0; i < this.carIdList.length; i++) {
        for (let j = 0; j < this.carList.length; j++) {
          if (this.carList[j].goods._id == this.carIdList[i]) {
            count += this.carList[j].goods.price;
            if (i == this.carIdList.length - 1) {
              this.allMoney = count;
            }
          }
        }
      }
    },
    async addGoodsBuyList() {
      try {
        let data = await this.$http.get("/api/addGoodsBuyList", {
          params: {
            carIdList: this.carIdList,
            userId: this.$getUser.userId
          }
        });
        this.modal_three = false;
        if (data.data.status == 200) {
          this.getCarData();
          this.$Message.success(data.data.text);
        } else {
          this.getCarData();
          this.$Notice.warning({
            title: "购买警告",
            desc: data.data.text
          });
          // this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#goodsCar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .body {
    width: 75%;
    .top {
      display: flex;
      width: 100%;
      .goodsCard {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        margin-left: 20px;
      }
      .goodsTitle {
        width: 40%;
        margin-left: 0;
      }
      .goodsOld {
        width: 12%;
      }
      .goodsMail {
        width: 12%;
      }
      .goodsPrice {
        width: 12%;
      }
      .goodsOp {
        width: 12%;
      }
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .carList {
        width: 100%;
        height: 130px;
        display: flex;
        border: 1px solid rgb(187, 187, 187);
        margin-bottom: 20px;
        background-color: #fcfcfc;
        border-radius: 3px;
        .goodsCard {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          margin-left: 20px;
        }
        .goodsTitle {
          display: flex;
          align-items: center;
          height: 100%;
          width: 40%;
          padding-left: 20px;
          overflow: hidden;
          font-size: 13px;
          .check {
            width: 30px;
            height: 20px;
            overflow: hidden;
          }
          .goodsPic {
            position: relative;
            width: 100px;
            height: 100px;
            display: block;
            margin-left: 20px;
            margin-right: 20px;
            .offGoods {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.6);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: red;
              font-size: 15px;
            }
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
            }
          }
          .titleName {
            width: 250px;
            a {
              color: rgb(104, 104, 104);
              &:hover {
                color: red;
              }
            }
          }
        }
        .goodsOld {
          width: 12%;
        }
        .goodsMail {
          width: 12%;
        }
        .goodsPrice {
          width: 12%;
          color: red;
          font-size: 18px;
        }
        .goodsOp {
          width: 12%;
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 50px;
      background-color: #e5e5e5;
      margin-bottom: 30px;
      .select {
        display: flex;
        align-items: center;
        padding-left: 24px;
        span {
          margin-left: 20px;
          cursor: pointer;
          color: red;
        }
      }
      .pay {
        display: flex;
        .payDetail {
          display: flex;
          justify-content: center;
          align-items: center;
          span:nth-child(2) {
            padding-left: 10px;
            padding-right: 10px;
            color: red;
            font-size: 18px;
          }
          span:nth-child(4) {
            padding-left: 70px;
          }
          span:nth-child(5) {
            padding-right: 40px;
            color: red;
            font-size: 18px;
          }
        }
        .payButton {
          width: 140px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f40;
          cursor: pointer;
        }
        .payButtonStop {
          cursor: no-drop;
          background-color: rgb(145, 145, 145);
        }
      }
    }
  }
}
</style>