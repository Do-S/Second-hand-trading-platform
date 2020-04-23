<template>
  <div id="accountSecurity">
    <div class="title">
      <span>账号安全</span>
    </div>
    <div class="content">
      <div class="mail">
        <span>邮箱</span>
        <span>{{userList.mail}}</span>
        <a @click="modalMail=true">修改邮箱</a>
        <Modal v-model="modalMail" title="修改邮箱" @on-ok="mailOk" @on-cancel="mailCancel">
          <div>
            <Input
              v-model="v_code"
              size="large"
              placeholder="请输入验证码"
              clearable
              style="width: 250px"
            />
            <Button
              style="margin-left:30px"
              type="info"
              size="large"
              @click="getMail"
              :loading="loading"
            >
              <span v-if="!loading">获取验证码</span>
              <span v-else>loading...{{codeNum}}</span>
            </Button>
            <p style="font-size:15px;padding-top:20px;padding-bottom:5px;">请输入新邮箱:</p>
            <Input
              v-model="newMail"
              size="large"
              placeholder="请输入新邮箱"
              clearable
              style="width: 250px"
            />
          </div>
        </Modal>
      </div>
      <div class="password">
        <span>密码</span>
        <a @click="modalPassword=true">修改密码</a>
        <Modal v-model="modalPassword" title="修改密码" @on-ok="passwordOk" @on-cancel="passwordCancel">
          <div>
            <span>原密码：</span>
            <Input
              v-model="password"
              type="password"
              password
              placeholder="原密码"
              style="width: 250px"
            />
          </div>
          <div style="margin-top:30px;
          margin-bottom:30px">
            <span>新密码：</span>
            <Input
              v-model="newPassword"
              @on-change="judgePassword"
              type="password"
              password
              placeholder="新密码"
              style="width: 250px"
            />
          </div>
          <div>
            <span>再次输入新密码：</span>
            <Input
              @on-change="judgePassword"
              v-model="oncePassword"
              type="password"
              password
              placeholder="再次输入新密码"
              style="width: 250px"
            />
            <p v-show="onceJudge" style="padding-left:120px;padding-top:10px;color:red;">两次密码不一致</p>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>
<script>
import { setInterval, clearInterval } from "timers";
export default {
  name: "accountSecurity",
  data() {
    return {
      userList: {},
      modalPassword: false,
      modalMail: false,
      loading: false,
      v_code: "",
      codeNum: 1,
      newMail: "",
      password: "",
      newPassword: "",
      oncePassword: "",
      onceJudge: false
    };
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
        console.log(this.userList);
      } catch (error) {
        console.error(error);
      }
    },
    //获取邮箱验证码
    async getMail() {
      try {
        this.loading = true;
        var time = setInterval(() => {
          this.codeNum = this.codeNum + 1;
        }, 1000);
        setTimeout(() => {
          this.loading = false;
          clearInterval(time);
          this.codeNum = 1;
        }, 60000);
        let { data } = await this.$http.get("/api/user/mail", {
          params: { mail: this.userList.mail }
        });
      } catch (error) {
        console.error(error);
      }
    },
    async mailOk() {
      try {
        let data = await this.$http.post("/api/user/updateMail", {
          mail: this.userList.mail,
          newMail: this.newMail,
          v_code: this.v_code
        });
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
          this.newMail = "";
          this.v_code = "";
          this.getUser();
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    judgePassword() {
      if (this.oncePassword !== "") {
        if (this.newPassword !== this.oncePassword) {
          this.onceJudge = true;
        } else {
          this.onceJudge = false;
        }
      }
    },
    mailCancel() {},
    async passwordOk() {
      //获取公钥
      let key = await this.$getKey();
      if (
        this.password !== "" &&
        this.newPassword !== "" &&
        this.oncePassword !== ""
      ) {
        if (this.newPassword == this.oncePassword) {
          let data = await this.$http.post("/api/user/changePasswordByOld", {
            mail: this.userList.mail,
            oldPassword: this.$getSecret(this.password, key),
            password: this.$getSecret(this.newPassword, key)
          });
          if (data.data.status == 200) {
            this.getUser();
            this.password = "";
            this.newPassword = "";
            this.oncePassword = "";
            this.$Message.success(data.data.text);
          } else {
            this.$Message.error(data.data.text);
          }
        } else {
          this.$Message.warning("提交失败");
        }
      } else {
        this.$Message.warning("请把表单填写完整");
      }
    },
    passwordCancel() {}
  }
};
</script>
<style lang="scss" scoped>
#accountSecurity {
  width: 100%;
  height: 300px;
  padding-left: 80px;
  padding-top: 50px;
  margin-bottom: 50px;
  .title {
    span {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .content {
    padding-left: 30px;
    padding-top: 50px;
    font-size: 15px;
    font-weight: 400;
    color: #797c80;
    .mail {
      span {
        padding-right: 50px;
      }
      span:nth-child(2) {
        color: black;
      }
    }
    .password {
      padding-top: 50px;
      span {
        padding-right: 50px;
      }
    }
  }
}
</style>