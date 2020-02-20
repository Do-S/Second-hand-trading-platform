<template>
  <div id="release">
    <div class="head">
      <div class="header">
        <div class="left">
          <img src="@/assets/img/logo.png" alt="logo" />
          <span>旧肆</span>
          <router-link :to="{ name: 'index'}">
            <Button>返回</Button>
          </router-link>
        </div>
        <div class="right">
          <Button @click="release" type="primary">发布</Button>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="title">
        <span>商品名称:</span>
        <Input
          v-model="commodityData.name"
          placeholder="请输入商品名称"
          maxlength="30"
          clearable
          show-word-limit
          size="large"
          style="width: 600px"
        />
      </div>
      <div class="detail">
        <div class="de_left">
          <span>价格:</span>
          <Input
            v-model="commodityData.price"
            placeholder="开个价"
            type="number"
            size="large"
            style="width: 100px"
          />
          <div class="mail">
            <span>邮寄:</span>
            <i-switch v-model="commodityData.mail">
              <Icon type="md-checkmark" slot="open"></Icon>
              <Icon type="md-close" slot="close"></Icon>
            </i-switch>
          </div>
        </div>
        <div class="de_right">
          <i-circle :percent="commodityData.old" :stroke-color="color">
            <span style="font-size:24px">{{ commodityData.old }}%</span>
            <p style="padding-top:10px;">新旧程度</p>
          </i-circle>
          <ButtonGroup size="large">
            <Button icon="ios-add" @click="add"></Button>
            <Button icon="ios-remove" @click="minus"></Button>
          </ButtonGroup>
        </div>
      </div>
      <div class="picture">
        <div class="select">
          <div class="update" v-if="imgDetail.count != 5">
            <Icon type="md-camera" size="18" color="black" />
            <input class="upload_file" type="file" accept="image/*" multiple @change="uploadBefore" />
          </div>
          <div
            class="selectShow"
            v-for="(item,index) in imgUrl"
            :key="index"
            @mouseover="()=>{imgDelete=index}"
            @mouseout="()=>{imgDelete=-1}"
          >
            <img class="img" :src="item.url" />
            <div v-show="imgDelete===index" class="imgDelete" @click="img_delete(index)">
              <Icon size="30" color="white" type="ios-trash-outline" />
            </div>
          </div>
        </div>
        <div class="show">
          <span>图片个数：</span>
          <span style="padding-right:50px;">{{imgDetail.count}} / 5</span>
          <span>文件大小：</span>
          <span>{{imgDetail.size}}</span>
        </div>
      </div>
      <div class="content">
        <span>商品介绍：</span>
        <Input
          v-model="commodityData.content"
          maxlength="500"
          show-word-limit
          type="textarea"
          placeholder="请输入关于商品的介绍"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "release",
  data() {
    return {
      commodityData: {
        name: "",
        price: "",
        old: 0,
        mail: false,
        content: ""
      },
      uploadList: [],
      imgUrl: [],
      imgSize: 0,
      imgDetail: {
        size: "0.00KB",
        count: 0
      },
      imgDelete: -1
    };
  },
  computed: {
    color() {
      let color = "#2db7f5";
      return color;
    }
  },
  methods: {
    add() {
      if (this.commodityData.old >= 100) {
        return false;
      }
      this.commodityData.old += 10;
    },
    minus() {
      if (this.commodityData.old <= 0) {
        return false;
      }
      this.commodityData.old -= 10;
    },
    uploadBefore(e) {
      this.imgDetail.count = 0;
      this.imgUrl = [];
      this.uploadList = [];
      let _this = this;
      if (e.target.files.length < 6) {
        let list = e.target.files;
        for (let i = 0; i < list.length; i++) {
          let files = list[i];
          // 看支持不支持FileReader
          if (!e || !window.FileReader) return;
          let reader = new FileReader();
          reader.readAsDataURL(files);
          reader.onloadend = function() {
            let obj = {};
            obj.url = this.result;
            _this.imgUrl.push(obj);
          };
          this.uploadList.push(files);
        }
        this.autoImgSize();
        this.imgDetail.count = this.uploadList.length;
      } else {
        this.$Notice.warning({
          title: "图片超过限制",
          desc: "图片数量不可以超过5个！"
        });
      }
    },
    //自动更新文件大小
    autoImgSize() {
      this.imgSize = 0;
      this.imgDetail.size = "0.00KB";
      for (let i = 0; i < this.uploadList.length; i++) {
        let files = this.uploadList[i];
        this.imgSize += files.size;
      }
      if (this.imgSize / 1024 > 1024) {
        this.imgDetail.size =
          parseFloat(this.imgSize / 1024 ** 2).toFixed(2) + "MB";
      } else {
        this.imgDetail.size = parseFloat(this.imgSize / 1024).toFixed(2) + "KB";
      }
    },
    //删除图片
    img_delete(id) {
      this.$delete(this.uploadList, id);
      this.$delete(this.imgUrl, id);
      this.imgDetail.count--;
      this.autoImgSize();
    },
    //上传表单
    async release() {
      try {
        if (
          this.commodityData.name &&
          this.commodityData.price &&
          this.commodityData.content &&
          this.uploadList.length > 0
        ) {
          let { data } = await this.$http.post("/api/release", {
            commodityData: this.commodityData,
            userId: this.$getUser.userId
          });
          if (data.status) {
            if (data.status == 200) {
              this.uploadImg(data.id);
              this.commodityData.name = "";
              this.commodityData.price = "";
              this.commodityData.old = 0;
              this.commodityData.mail = false;
              this.commodityData.content = "";
              this.$Message.success(data.text);
            } else {
              this.$Message.error(data.text);
            }
          } else {
            this.$Message.error("网络异常");
          }
        } else {
          this.$Message.error("请把表单内容填写完整");
        }
      } catch (error) {
        console.error(error);
      }
    },
    //上传图片
    async uploadImg(id) {
      try {
        for (let i = 0; i < this.uploadList.length; i++) {
          let file = this.uploadList[i];
          let fileImg = new FormData();
          fileImg.append("file", file);
          fileImg.append("id", id);
          console.log(file);
          console.log(fileImg);
          let { data } = await this.$http.post("/api/uploadImg", fileImg);
          if (data.status) {
            if (data.status == 200) {
              this.$Message.success(data.text);
            } else {
              this.$Message.error(data.text);
            }
          }
        }
        this.uploadList = [];
        this.imgUrl = [];
        this.imgDetail.count = 0;
        this.autoImgSize();
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#release {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .head {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    box-shadow: 0 2px 4px 0 rgba(114, 144, 179, 0.06);
    .header {
      width: 75%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      .left {
        height: 100%;
        display: flex;
        align-items: center;
        img {
          width: 45px;
          height: 45px;
          transition: 1s;
          &:hover {
            transform: rotateY(180deg);
          }
        }
        span {
          font-family: "Boyfriend";
          font-size: 23px;
          padding-left: 5px;
          padding-right: 30px;
        }
      }
      .right {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
  .body {
    width: 75%;
    margin-top: 50px;
    margin-left: 30px;
    margin-bottom: 50px;
    .title {
      span {
        padding-right: 20px;
        font-size: 17px;
      }
    }
    .detail {
      width: 100%;
      margin-top: 50px;
      display: flex;
      flex-direction: row;
      .de_left {
        width: 30%;
        span {
          padding-right: 20px;
          font-size: 17px;
        }
        .mail {
          padding-top: 50px;
        }
      }
    }
    .picture {
      border: 1px solid rgb(180, 180, 180);
      width: 60%;
      border-radius: 5px;
      margin-top: 50px;
      .select {
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        .update {
          width: 100px;
          line-height: 100px;
          text-align: center;
          border: 1px dashed rgb(199, 199, 199);
          border-radius: 5px;
          margin-right: 10px;
          position: relative;
          .upload_file {
            opacity: 0;
            width: 100%;
            height: 100%;
            background-color: red;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        .selectShow {
          width: 100px;
          height: 100px;
          border: 1px dashed rgb(199, 199, 199);
          position: relative;
          border-radius: 5px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          .imgDelete {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.6);
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
      }
      .show {
        width: 100%;
        line-height: 30px;
        padding-left: 20px;
        border-top: 1px solid rgb(185, 185, 185);
      }
    }
    .content {
      width: 60%;
      margin-top: 50px;
      span {
        font-size: 17px;
        margin-bottom: 20px;
        display: inline-block;
      }
    }
  }
}
</style>