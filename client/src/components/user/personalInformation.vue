<template>
  <div id="personalInformation">
    <div class="avatar">
      <img class="avatarImg" :src="userList.avatar" />
      <span class="editAvatar" @click="changModel()">编辑头像</span>
      <div class="modelAvatar" v-if="modelAvatar" transition="modal">
        <div class="modelBack" @click="changModel()"></div>
        <div class="modelBox">
          <div class="modelTop">
            <span>选择头像</span>
          </div>
          <div class="modelCenter">
            <div class="operate">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixedBox="option.fixedBox"
                @realTime="previewImg"
              ></vueCropper>
            </div>
            <div class="preview">
              <p>预览</p>
              <img :src="previewImgData" alt="空" v-if="previewImgData!==''" />
              <img src="@/assets/img/defaultImg.png" alt="logo" v-else />
              <div>
                <span>选择图片</span>
                <input type="file" @change="loadImg" accept="image/*" />
              </div>
            </div>
          </div>
          <div class="modelBottom">
            <Button size="large" @click="changModel()" type="default">取消</Button>
            <Button size="large" class="submitImg" @click="submitImg()" type="primary">上传</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="userName">
      <span>昵称：</span>
      <Input
        v-model="userList.nickname"
        maxlength="15"
        show-word-limit
        size="large"
        placeholder="昵称"
        style="width:300px"
      />
    </div>
    <div class="userName">
      <span>性别：</span>
      <Select v-model="userList.sex" size="large" style="width:100px">
        <Option value="保密">保密</Option>
        <Option value="男">男</Option>
        <Option value="女">女</Option>
      </Select>
    </div>
    <div class="userName">
      <span>生日：</span>
      <DatePicker v-model="userList.birthday" type="date" placeholder="生日日期" style="width: 200px"></DatePicker>
    </div>
    <div class="userIntroduction">
      <span>个人介绍：</span>
      <Input
        v-model="userList.introduction"
        maxlength="120"
        show-word-limit
        type="textarea"
        placeholder="个人介绍"
        style="width: 400px;"
      />
    </div>
    <div class="userButton">
      <button @click="submit">提交</button>
    </div>
  </div>
</template>
<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "personalInformation",
  data() {
    return {
      userList: {},
      modelAvatar: false,
      previewImgData: "",
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true
      }
    };
  },
  components: {
    VueCropper
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        let data = await this.$http.post("/api/user/getUserById", {
          id: this.$getUser.userId
        });
        this.userList = data.data;
        this.userList.birthday = new Date(
          this.userList.birthday.toLocaleString()
        );
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      try {
        let data = await this.$http.post("/api/user/updateUser", {
          userId: this.$getUser.userId,
          userList: this.userList
        });
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
          this.modelAvatar = false;
          this.getUser();
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    changModel() {
      this.modelAvatar = !this.modelAvatar;
      this.previewImgData = "";
      this.option.img = "";
    },
    previewImg() {
      this.$refs.cropper.getCropData(data => {
        this.previewImgData = data;
      });
    },
    loadImg(e) {
      let _this = this;
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        _this.option.img = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    submitImg() {
      this.$refs.cropper.getCropBlob(async data => {
        try {
          let fileImg = new FormData();
          fileImg.append("file", data);
          fileImg.append("id", this.$getUser.userId);
          let result = await this.$http.post("/api/loadAvatar", fileImg);
          if (result.data.status == 200) {
            this.$Message.success(result.data.text);
            this.modelAvatar = false;
            this.getUser();
          } else {
            this.$Message.error(result.data.text);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#personalInformation {
  width: 100%;
  .avatar {
    display: flex;
    align-items: center;
    padding-left: 60px;
    padding-top: 40px;
    .modelAvatar {
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: opacity 0.3s ease;
      top: 0;
      left: 0;
      z-index: 99;
      .modal-enter .modal-container,
      .modal-leave .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
      }
      .modelBox {
        width: 530px;
        height: 440px;
        border-radius: 5px;
        background-color: white;
        position: fixed;
        .modelTop {
          width: 100%;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            color: black;
            font-weight: 600;
            font-size: 19px;
          }
        }
        .modelCenter {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          .operate {
            width: 228px;
            height: 228px;
            margin-right: 30px;
          }
          .preview {
            width: 140px;
            // text-align: center;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            p {
              width: 100%;
              text-align: center;
            }
            img {
              width: 100px;
              height: 100px;
              margin-top: 30px;
              margin-bottom: 30px;
              border-radius: 50%;
              border: 1px solid rgb(240, 232, 232);
            }
            div {
              width: 100px;
              line-height: 35px;
              border: 1px solid #99c9ff;
              border-radius: 20px;
              text-align: center;
              position: relative;
              color: #1985ff;
              font-size: 14px;
              &:hover {
                background-color: #ecf5ff;
              }
              input {
                width: 100%;
                height: 100%;
                opacity: 0;
                position: absolute;
                top: 0;
                left: 0;
              }
            }
          }
        }
        .modelBottom {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 40px;
          .submitImg {
            margin-left: 50px;
          }
        }
      }
      .modelBack {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    .avatarImg {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #1985ff;
    }
    .editAvatar {
      padding-left: 30px;
      cursor: pointer;
      color: #1985ff;
    }
  }
  .userName {
    padding-top: 40px;
    padding-left: 50px;
    span {
      padding-right: 70px;
    }
  }
  .userIntroduction {
    padding-top: 40px;
    padding-left: 50px;
    span {
      padding-right: 40px;
    }
  }
  .userButton {
    padding-left: 20%;
    padding-top: 50px;
    padding-bottom: 50px;
    button {
      width: 250px;
      line-height: 50px;
      text-align: center;
      background-color: #1985ff;
      border: 1px solid rgb(183, 128, 255);
      border-radius: 5px;
    }
  }
}
</style>