<template>
  <div id="myRelease">
    <div class="goodsLists">
      <div class="listHead">
        <div class="headLeft headSame">
          <span>商品名</span>
        </div>
        <div class="headCenter headSame">
          <span>成色</span>
        </div>
        <div class="headCenter headSame">
          <span>邮寄</span>
        </div>
        <div class="headCenter headSame">
          <span>价格</span>
        </div>
        <div class="headRight headSame">
          <span>操作</span>
        </div>
      </div>
      <div class="listBody" v-for="(item,index) in goodsData" :key="index">
        <div class="bodyLeft">
          <div class="goodsPic">
            <!-- <router-link :to="{ name: 'goodsDetails',params: { id: item._id }}"> -->
            <a @click="hrefDetail(item._id)">
              <img :src="item.img[0].url" :alt="index" />
            </a>
            <!-- </router-link> -->
          </div>
          <div class="titleName">
            <a @click="hrefDetail(item._id)">{{item.goodsName}}</a>
            <!-- <router-link :to="{ name: 'goodsDetails',params: { id: item._id }}">{{item.goodsName}}</router-link> -->
          </div>
        </div>
        <div class="bodyCenter bodySame">
          <span>{{item.old/10}}成新</span>
        </div>
        <div class="bodyCenter bodySame">
          <span v-if="item.mail">免邮费</span>
          <span v-else>需付邮费</span>
        </div>
        <div class="bodyCenter bodySame">
          <span style="color:red;">￥{{item.price}}</span>
        </div>
        <div class="bodyRight bodySame">
          <router-link :to="{ name: 'editGoods',params: { id: item._id }}">修改</router-link>
          <a @click="()=>{modal_one=true;delGoodsId=item._id}">删除</a>
          <Modal v-model="modal_one" width="360">
            <p slot="header" style="color:#f60;text-align:center">
              <Icon type="ios-information-circle"></Icon>
              <span>删除确认</span>
            </p>
            <div style="text-align:center">
              <p>你确定要删除该商品吗?</p>
            </div>
            <div slot="footer">
              <Button type="error" size="large" long @click="delGoods">删除</Button>
            </div>
          </Modal>
          <i-switch
            size="large"
            v-model="item.status"
            :true-value="1"
            :false-value="0"
            @on-change="getTrue(item.goodsId,item.status)"
          >
            <span slot="open">上架</span>
            <span slot="close">下架</span>
          </i-switch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "myRelease",
  data() {
    return {
      goodsData: [],
      modal_one: false,
      delGoodsId: ""
    };
  },
  created() {
    this.getMyRelease();
  },
  methods: {
    async getMyRelease() {
      try {
        let data = await this.$http.get("/api/getMyRelease", {
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
    async delGoods() {
      try {
        let data = await this.$http.get("/api/delGoodsById", {
          params: {
            goodsId: this.delGoodsId
          }
        });
        this.modal_one = false;
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
#myRelease {
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
        width: 13%;
      }
      .headRight {
        width: 31%;
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
          width: 80px;
          height: 80px;
          a {
            width: 100%;
            height: 100%;
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
        width: 13%;
      }
      .bodyRight {
        width: 31%;
        a {
          padding-right: 25px;
        }
      }
    }
  }
}
</style>