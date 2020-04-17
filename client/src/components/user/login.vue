<template>
  <div id="login">
    <div :class="[{cartHeight:tab},cart]">
      <Tabs value="name1" @on-click="tabHandle">
        <TabPane label="登录" name="name1">
          <Form
            ref="loginData"
            :model="loginData"
            :rules="ruleLogin"
            :label-width="80"
            style="padding-top:20px;"
          >
            <FormItem label="E-mail" prop="mail">
              <Input v-model="loginData.mail" placeholder="请输入你的邮箱"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input type="password" v-model="loginData.password" placeholder="输入你的密码"></Input>
            </FormItem>
            <div class="find">
              <router-link :to="{ name: 'findPassword'}">
                <!-- <span>找回密码</span> -->
                找回密码
              </router-link>
            </div>
            <Button :size="buttonSize" type="primary" @click="loginSubmit('loginData')" long>登录</Button>
          </Form>
        </TabPane>
        <TabPane label="注册" name="name2">
          <Form ref="registerData" :model="registerData" :rules="ruleRegister" :label-width="80">
            <FormItem label="E-mail" prop="mail">
              <Input v-model="registerData.mail" placeholder="请输入你的邮箱"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input type="password" v-model="registerData.password" placeholder="请输入你的密码"></Input>
            </FormItem>
            <FormItem label="二次密码" prop="passwordCheck">
              <Input type="password" v-model="registerData.passwordCheck" placeholder="请再次输入你的密码"></Input>
            </FormItem>
            <FormItem label="验证码" prop="code">
              <div class="code">
                <Input type="text" size="large" v-model="registerData.code"></Input>
                <div @click="getCode" v-html="img"></div>
              </div>
            </FormItem>
            <FormItem label="验证码" prop="v_code">
              <div class="code">
                <Input type="text" size="large" v-model="registerData.v_code"></Input>
                <div style="padding-left:20px;">
                  <Button type="info" :size="buttonSize" @click="getMail" :loading="loading">
                    <span v-if="!loading">获取验证码</span>
                    <span v-else>loading...{{codeNum}}</span>
                  </Button>
                </div>
              </div>
            </FormItem>
            <Button
              :size="buttonSize"
              type="primary"
              @click="registerSubmit('registerData')"
              long
            >注册</Button>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
export default {
  name: "login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你的密码"));
      } else {
        if (this.registerData.passwordCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.registerData.validateField("passwordCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入你的密码"));
      } else if (value !== this.registerData.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (value == this.imgCode) {
          callback();
        } else {
          callback(new Error("验证码不正确！"));
        }
      }, 100);
    };
    return {
      buttonSize: "large",
      img: "",
      imgCode: "",
      tab: false,
      cart: "cart",
      loading: false,
      codeNum: 1,
      loginData: {
        mail: "",
        password: ""
      },
      registerData: {
        mail: "",
        password: "",
        passwordCheck: "",
        code: "",
        v_code: ""
      },
      ruleLogin: {
        mail: [
          {
            required: true,
            message: "邮箱不可以为空",
            trigger: "blur"
          },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      },
      ruleRegister: {
        mail: [
          {
            required: true,
            message: "邮箱不可以为空",
            trigger: "blur"
          },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ],
        v_code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ],
        code: [{ required: true, validator: validateCode, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getCode();
    //清空localStorage
    localStorage.clear();
  },
  methods: {
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
    //获取邮箱验证码
    async getMail() {
      try {
        if (this.registerData.mail) {
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
            params: { mail: this.registerData.mail }
          });
        } else {
          this.$Message.error("请填写邮箱!");
        }
      } catch (error) {
        console.error(error);
      }
    },
    loginSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.login();
        } else {
          this.$Message.error("请把带星号项填写完整!");
        }
      });
    },
    registerSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.register();
        } else {
          this.$Message.error("请把带星号项填写正确!");
        }
      });
    },
    async login() {
      try {
        //获取公钥
        let key = await this.$getKey();
        //验证用户
        let { data } = await this.$http.post("/api/user/login", {
          mail: this.loginData.mail,
          password: this.$getSecret(this.loginData.password, key)
        });
        if (data.status == 200) {
          //保存token
          localStorage.setItem(
            window.$project,
            JSON.stringify({
              token: data.token,
              user: this.loginData.mail,
              userId: data.userId
            })
          );
          this.$router.push("/");
          location.reload();
        } else if (data.status == 404) {
          this.$Message.error("你还没有注册呢！");
        } else if (data.status == 300) {
          this.$Message.error("密码错误！");
        } else {
          this.$Message.error("登录失败！稍后再试");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async register() {
      try {
        //获取公钥
        let key = await this.$getKey();
        let { data } = await this.$http.post("/api/user/register", {
          mail: this.registerData.mail,
          password: this.$getSecret(this.registerData.password, key),
          v_code: this.registerData.v_code
        });
        if (data.status) {
          if (data.status == 200) {
            this.$Message.success(data.text);
            registerData = {
              mail: "",
              password: "",
              passwordCheck: "",
              code: "",
              v_code: ""
            };
          } else {
            this.$Message.error(data.text);
          }
        } else {
          this.$Message.error("网络异常！");
        }
      } catch (error) {
        console.error(error);
      }
    },
    tabHandle(id) {
      if (id == "name1") {
        this.tab = false;
      } else {
        this.tab = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/img/d11aea1.png");
  background-size: 100% 100%;
  background-color: #f7f9fa;
  .cartHeight {
    height: 65% !important;
  }
  .cart {
    width: 28%;
    height: 50%;
    border-radius: 5px;
    background-color: #ffffff;
    padding-right: 30px;
    padding-top: 20px;
    padding-left: 30px;
    .find {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding-right: 20px;
      padding-bottom: 20px;
      font-size: 12px;
    }
    .code {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    }
  }
}
</style>