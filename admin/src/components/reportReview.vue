<template>
  <div id="reportReview">
    <div class="body">
      <Tabs value="name1">
        <TabPane label="待处理" name="name1">
          <div class="pending">
            <div class="headTop">
              <div class="left">商品名</div>
              <div class="center">卖家</div>
              <div class="right">举报人数</div>
              <div class="last">操作</div>
            </div>
            <div class="pendingList" v-for="(item,index) in reportList" :key="index">
              <div class="head">
                <div class="title">
                  <img :src="item.img[0].url" alt />
                  <span>{{item.goods.goodsName}}</span>
                </div>
                <div class="center">
                  <span>{{item.reported.mail}}</span>
                </div>
                <div class="bottom">
                  <span>{{item.count}}</span>
                </div>
                <div class="last">
                  <Button type="success" @click="()=>{modal1=true;delGoodsId=item.goods._id}">无违规</Button>
                  <Modal v-model="modal1" width="360">
                    <p slot="header" style="color:#f60;text-align:center">
                      <Icon type="ios-information-circle"></Icon>
                      <span>审核确认</span>
                    </p>
                    <div style="text-align:center">
                      <p>你确定该商品不存在违规?</p>
                    </div>
                    <div slot="footer">
                      <Button type="success" size="large" long @click="handleReport()">无违规</Button>
                    </div>
                  </Modal>
                  <Button
                    style="margin-left:30px;"
                    type="warning"
                    @click="()=>{modal=true;delGoodsId=item.goods._id}"
                  >违规</Button>
                  <Modal v-model="modal" width="360">
                    <p slot="header" style="color:#f60;text-align:center">
                      <Icon type="ios-information-circle"></Icon>
                      <span>审核确认</span>
                    </p>
                    <div style="text-align:center">
                      <p>你确定该商品存在违规情况吗?</p>
                    </div>
                    <div slot="footer">
                      <Button type="error" size="large" long @click="submit()">违规</Button>
                    </div>
                  </Modal>
                </div>
              </div>
              <div class="content">
                <Collapse simple>
                  <Panel name="1">
                    举报信息
                    <div
                      class="report"
                      v-for="(items,index) in item.report"
                      :key="index"
                      slot="content"
                    >
                      <p>{{items.content}}</p>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </TabPane>
        <!-- <TabPane label="已处理" name="name2">已处理</TabPane> -->
      </Tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "reportReview",
  data() {
    return {
      reportList: [],
      modal: false,
      modal1: false,
      selectDate: "",
      delGoodsId: ""
    };
  },
  created() {
    this.getReport();
  },
  methods: {
    async getReport() {
      try {
        let data = await this.$http.get("/api/admin/getReport", {
          params: {
            adminId: this.$getUser.userId
          }
        });
        if (data.data.status == 401) {
          this.$Message.error(data.data.text);
          localStorage.clear();
          this.$router.push("/login");
        }
        this.reportList = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async handleReport() {
      try {
        this.modal1 = false;
        let data = await this.$http.get("/api/admin/delReportByGoodsId", {
          params: {
            goodsId: this.delGoodsId,
            adminId: this.$getUser.userId
          }
        });
        if (data.data.status == 200) {
          this.getReport();
          this.$Message.success(data.data.text);
        } else {
          if (data.data.status == 401) {
            this.$Message.error(data.data.text);
            localStorage.clear();
            this.$router.push("/login");
          } else {
            this.$Message.error(data.data.text);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      try {
        this.modal = false;
        let data = await this.$http.get("/api/delGoodsById", {
          params: {
            goodsId: this.delGoodsId,
            adminId: this.$getUser.userId
          }
        });
        if (data.data.status == 200) {
          this.getReport();
          this.$Message.success(data.data.text);
        } else {
          if (data.data.status == 401) {
            this.$Message.error(data.data.text);
            localStorage.clear();
            this.$router.push("/login");
          } else {
            this.$Message.error(data.data.text);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#reportReview {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-content: center;
  justify-content: center;
  .body {
    width: 80%;
    margin-top: 30px;
    background-color: white;
    padding: 30px;
    border-radius: 5px;
    margin-bottom: 50px;
    .pending {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 50px;
      .headTop {
        width: 90%;
        height: 50px;
        display: flex;
        justify-content: flex-start;
        border-bottom: 1px solid rgb(245, 240, 240);
        .left {
          width: 40%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .center {
          width: 25%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .right {
          width: 15%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .last {
          width: 20%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .pendingList {
        width: 90%;
        margin-top: 30px;
        .head {
          width: 100%;
          height: 110px;
          display: flex;
          justify-content: flex-start;
          .title {
            width: 40%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            img {
              width: 85px;
              height: 85px;
            }
            span {
              color: #686868;
              font-size: 12px;
              padding-left: 20px;
            }
          }
          .center {
            width: 25%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .bottom {
            width: 15%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .last {
            width: 20%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .content {
          width: 100%;
          .report {
            width: 90%;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 30px;
            border-radius: 5px;
            margin-bottom: 10px;
            border: 1px solid rgb(245, 239, 239);
          }
        }
      }
    }
  }
}
</style>