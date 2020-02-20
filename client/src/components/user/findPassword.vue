<template>
  <div id="findPassword">
    <div class="find">
      <div class="title">
        <span>找回密码</span>
      </div>
      <div style="width:100%;">
        <Steps :current="current">
          <Step title="步骤1" content="验证账号"></Step>
          <Step title="步骤2" content="验证邮箱验证码"></Step>
          <Step title="步骤3" content="设置新密码"></Step>
          <Step title="步骤4" content="完成"></Step>
        </Steps>
      </div>
      <div class="stepOne" v-if="current==0">
        <div class="box">
          <Input v-model="mail" size="large" placeholder="请输入邮箱" clearable style="width: 400px" />
        </div>
        <div class="box code">
          <Input v-model="code" size="large" placeholder="请输入验证码" clearable style="width: 250px" />
          <div @click="getCode" v-html="img"></div>
        </div>
        <div class="button">
          <Button type="primary" size="large" @click="stepFour">返回登录</Button>
          <Button type="primary" size="large" @click="stepOne">下一步</Button>
        </div>
      </div>
      <div class="stepTwo" v-if="current==1">
        <div class="box">
          <Input v-model="v_code" size="large" placeholder="请输入验证码" clearable style="width: 250px" />
          <Button type="info" size="large" @click="getMail" :loading="loading">
            <span v-if="!loading">获取验证码</span>
            <span v-else>loading...{{codeNum}}</span>
          </Button>
          <div class="button">
            <Button type="primary" size="large" @click="preStep">上一步</Button>
            <Button type="primary" size="large" @click="stepTwo">下一步</Button>
          </div>
        </div>
      </div>
      <div class="stepThree" v-if="current==2">
        <Form ref="formPassword" :model="formPassword" :rules="rulePassword" :label-width="80">
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="formPassword.password" placeholder="请输入你的密码"></Input>
          </FormItem>
          <FormItem label="二次密码" prop="passwordCheck">
            <Input type="password" v-model="formPassword.passwordCheck" placeholder="请再次输入你的密码"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formPassword')">提交</Button>
          </FormItem>
        </Form>
      </div>
      <div class="stepFour" v-if="current==3">
        <div class="center">
          <Icon type="md-checkmark-circle" size="80" color="green" />
        </div>
        <div class="center">
          <Button type="primary" size="large" @click="stepFour">完成并返回</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
export default {
  name: "findPassword",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你的密码"));
      } else {
        if (this.formPassword.passwordCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formPassword.validateField("passwordCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入你的密码"));
      } else if (value !== this.formPassword.password) {
        callback(new Error("两次密码不一样!"));
      } else {
        callback();
      }
    };
    return {
      current: 0,
      mail: "",
      img: "",
      imgCode: "",
      code: "",
      v_code: "",
      loading: false,
      codeNum: 1,
      formPassword: {
        password: "",
        passwordCheck: ""
      },
      rulePassword: {
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ]
      }
    };
  },
  created: async function() {
    try {
      let code = await this.$http.get("/api/user/getCode");
      this.img = code.data.test;
      this.imgCode = document.cookie.split("=")[1];
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    preStep() {
      this.current--;
    },
    //获取图片验证码
    async getCode() {
      try {
        let code = await this.$http.get("/api/user/getCode");
        this.img = code.data.test;
        this.imgCode = document.cookie.split("=")[1];
      } catch (error) {
        console.error(error);
      }
    },
    async stepOne() {
      try {
        if (this.mail) {
          if (this.imgCode == this.code) {
            let data = await this.$http.get("/api/user/findMail", {
              params: { mail: this.mail }
            });
            if (data.status == 200) {
              this.current++;
            } else if (data.status == 404) {
              this.$Message.error("该账户不存在!");
            } else {
              this.$Message.error("网络异常！");
            }
          } else {
            this.$Message.error("验证码错误！");
          }
        } else {
          this.$Message.error("请输入邮箱！");
        }
      } catch (error) {
        console.error(error);
      }
    },
    //获取邮箱验证码
    async getMail() {
      try {
        if (this.mail) {
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
            params: { mail: this.mail }
          });
        } else {
          this.$Message.error("请填写邮箱!");
        }
      } catch (error) {
        console.error(error);
      }
    },
    //验证邮箱验证码
    async stepTwo() {
      try {
        if (this.v_code) {
          //获取公钥
          let key = await this.$getKey();
          let { data } = await this.$http.post("/api/user/findCode", {
            v_code: this.$getSecret(this.v_code, key),
            mail: this.mail
          });
          if (data.status == 200) {
            this.current++;
          } else if (data.status == 404) {
            this.$Message.error("验证码过期!");
          } else if (data.status == 300) {
            this.$Message.error("验证码错误!");
          } else {
            this.$Message.error("网络异常!");
          }
        } else {
          this.$Message.error("请填写验证码!");
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.stepThree();
        } else {
          this.$Message.error("提交失败!");
        }
      });
    },
    async stepThree() {
      try {
        //获取公钥
        let key = await this.$getKey();
        //验证用户
        let { data } = await this.$http.post("/api/user/changePassword", {
          mail: this.mail,
          password: this.$getSecret(this.formPassword.password, key)
        });
        if (data.status == 200) {
          this.mail = "";
          this.imgCode = "";
          this.code = "";
          this.v_code = "";
          this.current++;
        } else if (data.status == 404) {
          this.$Message.error("修改失败!");
        } else {
          this.$Message.error("网络异常!");
        }
      } catch (error) {
        console.error(error);
      }
    },
    stepFour() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
#findPassword {
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #f7f9fa;
  .find {
    width: 60%;
    height: 70%;
    // border: 1px solid black;
    margin: 0 auto;
    .title {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-bottom: 10px;
      span {
        font-size: 24px;
        font-weight: 600;
      }
    }
    .stepOne {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 50px;
      .box {
        width: 100%;
        margin-top: 30px;
        display: flex;
        justify-content: center;
      }
      .code {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
      }
      .button {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 50px;
        button:nth-child(2) {
          margin-left: 100px;
        }
      }
    }
    .stepTwo {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 50px;
      .box {
        width: 100%;
        margin-top: 30px;
        display: flex;
        margin-bottom: 30px;
        justify-content: center;
        flex-wrap: wrap;
        .button {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 50px;
          button:nth-child(2) {
            margin-left: 100px;
          }
        }
      }
    }
    .stepThree {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 50px;
    }
    .stepFour {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 50px;
      .center {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 60px;
      }
    }
  }
}
</style>