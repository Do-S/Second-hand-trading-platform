<template>
  <div id="transactionInquiry">
    <div class="headTop">
      <span>商品查询</span>
    </div>
    <div class="body">
      <Tabs>
        <TabPane label="时间" icon="md-alarm">
          <div class="dateFind">
            <div>
              <span>起始日期</span>
              <DatePicker v-model="fromDate" type="date" placeholder="起始日期" style="width: 200px"></DatePicker>
            </div>
            <div>
              <span>截至日期</span>
              <DatePicker v-model="toDate" type="date" placeholder="截至日期" style="width: 200px"></DatePicker>
            </div>
            <div>
              <Button type="primary" icon="ios-search" @click="getGoodsByDate()">Search</Button>
            </div>
          </div>
          <div class="buyLists" v-if="buyListByDate.length>0">
            <div class="headLists">
              <div class="goodsTop goodsSame">商品名</div>
              <div class="goodsCenter goodsSame">成色</div>
              <div class="goodsCenter goodsSame">邮寄</div>
              <div class="goodsCenter goodsSame">价格</div>
              <div class="goodsBottom goodsSame">卖家</div>
              <div class="goodsBottom goodsSame">买家</div>
              <div class="goodsBottom goodsSame">交易日期</div>
            </div>
            <div class="buyList" v-for="(item,index) in buyListByDate" :key="index">
              <div class="goodsTop">
                <img :src="item.img[0].url" />
                <span>{{item.goods.goodsName}}</span>
              </div>
              <div class="goodsCenter">{{item.goods.old/10}}成新</div>
              <div class="goodsCenter">
                <span v-if="item.goods.mail">免邮费</span>
                <span v-else>需付邮费</span>
              </div>
              <div class="goodsCenter">￥{{item.goods.price}}</div>
              <div class="goodsBottom">{{item.seller.mail}}</div>
              <div class="goodsBottom">{{item.user.mail}}</div>
              <div class="goodsBottom">{{item.date|dateformat()}}</div>
            </div>
            <div class="exportExcel">
              <Button type="info" size="large" @click="exportExcel()">导出数据</Button>
            </div>
          </div>
          <div class="findShow" v-else>
            <span>没有结果</span>
          </div>
        </TabPane>
        <TabPane label="用户名" icon="md-people">
          <div class="dateFind">
            <div>
              <span>卖家邮箱</span>
              <Input v-model="sellerMail" placeholder="请输入邮箱" style="width: 300px" />
            </div>
            <div>
              <Button type="primary" icon="ios-search" @click="getGoodsBySeller()">Search</Button>
            </div>
          </div>
          <div class="buyLists" v-if="buyListBySeller.length>0">
            <div class="headLists">
              <div class="goodsTop goodsSame">商品名</div>
              <div class="goodsCenter goodsSame">成色</div>
              <div class="goodsCenter goodsSame">邮寄</div>
              <div class="goodsCenter goodsSame">价格</div>
              <div class="goodsBottom goodsSame">卖家</div>
              <div class="goodsBottom goodsSame">买家</div>
              <div class="goodsBottom goodsSame">交易日期</div>
            </div>
            <div class="buyList" v-for="(item,index) in buyListBySeller" :key="index">
              <div class="goodsTop">
                <img :src="item.img[0].url" />
                <span>{{item.goods.goodsName}}</span>
              </div>
              <div class="goodsCenter">{{item.goods.old/10}}成新</div>
              <div class="goodsCenter">
                <span v-if="item.goods.mail">免邮费</span>
                <span v-else>需付邮费</span>
              </div>
              <div class="goodsCenter">￥{{item.goods.price}}</div>
              <div class="goodsBottom">{{item.seller.mail}}</div>
              <div class="goodsBottom">{{item.user.mail}}</div>
              <div class="goodsBottom">{{item.date|dateformat()}}</div>
            </div>
            <div class="exportExcel">
              <Button type="info" size="large" @click="exportExcel()">导出数据</Button>
            </div>
          </div>
          <div class="findShow" v-else>
            <span>没有结果</span>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "transactionInquiry",
  data() {
    return {
      fromDate: "",
      toDate: "",
      buyListByDate: [],
      buyListBySeller: [],
      tHeader: ["商品名", "成色", "邮寄", "价格", "卖家", "买家", "交易日期"],
      filterVal: ["name", "old", "mail", "price", "seller", "buyer", "date"],
      tableData: [],
      sellerMail: ""
    };
  },
  created() {},
  methods: {
    //根据日期获取交易信息
    async getGoodsByDate() {
      try {
        this.toDate == "" ? (this.toDate = new Date()) : "";
        let { data } = await this.$http.get("/api/admin/getGoodsByDate", {
          params: {
            fromDate: this.fromDate,
            toDate: this.toDate,
            adminId: this.$getUser.userId
          }
        });
        this.$logout(data.status, data.text);
        this.buyListByDate = data;
        this.$Message.success("查询成功");
        this.setTableData(this.buyListByDate);
      } catch (error) {
        console.error(error);
      }
    },

    //根据卖家获取交易信息
    async getGoodsBySeller() {
      try {
        if (this.sellerMail == "") {
          this.$Message.error("请填写需要查找的卖家邮箱");
          return;
        }
        let { data } = await this.$http.get("/api/admin/getGoodsBySeller", {
          params: {
            sellerMail: this.sellerMail,
            adminId: this.$getUser.userId
          }
        });
        this.$logout(data.status, data.text);
        if (!data) {
          this.$Message.error("卖家不存在");
          this.buyListBySeller = [];
          return;
        }
        this.buyListBySeller = data;
        this.$Message.success("查询成功");
        this.setTableData(this.buyListBySeller);
      } catch (error) {
        console.error(error);
      }
    },

    //设置表格数据
    setTableData(list) {
      this.tableData = [];
      for (let i = 0; i < list.length; i++) {
        var str = {};
        str.name = list[i].goods.goodsName;
        str.old = list[i].goods.old / 10 + "成新";
        str.mail = list[i].goods.mail ? "免邮费" : "需付邮费";
        str.price = list[i].goods.price.toString();
        str.seller = list[i].seller.mail;
        str.buyer = list[i].user.mail;
        str.date = this.$moment(list[i].date)
          .format("YYYY-MM-DD HH:mm:ss")
          .toString();
        this.tableData.push(str);
      }
    },

    //导出表格数据
    exportExcel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../plugins/excel/Export2Excel");
        const data = this.formatJson(this.filterVal, this.tableData);
        export_json_to_excel(this.tHeader, data, "商品交易记录");
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style lang="scss" scoped>
#transactionInquiry {
  width: 100%;
  .headTop {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    padding-left: 30px;
    align-items: center;
    background-color: rgb(245, 246, 248);
    border-bottom: 1px solid rgb(237, 240, 245);
    font-size: 18px;
  }
  .body {
    width: 100%;
    background-color: white;
    padding-top: 30px;
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 50px;
    .dateFind {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-left: 50px;
      span {
        padding-right: 30px;
      }
    }
    .findShow {
      height: 300px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 20px;
        font-weight: 500;
      }
    }
    .buyLists {
      width: 100%;
      margin-bottom: 50px;
      .headLists {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid rgb(241, 237, 237);
        .goodsSame {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .goodsTop {
          width: 31%;
        }
        .goodsCenter {
          width: 7%;
        }
        .goodsBottom {
          width: 16%;
        }
      }
      .buyList {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100px;
        .goodsTop {
          width: 31%;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 78px;
            height: 78px;
            border: 1px dashed rgb(199, 164, 255);
          }
          span {
            color: #686868;
            font-size: 12px;
            padding-left: 20px;
          }
        }
        .goodsCenter {
          width: 7%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .goodsBottom {
          width: 16%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .exportExcel {
        width: 100%;
        display: flex;
        padding-top: 30px;
        justify-content: center;
      }
    }
  }
}
</style>