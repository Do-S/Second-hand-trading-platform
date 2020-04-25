<template>
  <div id="register">
    <div class="content">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="oncePassword">
          <Input type="password" v-model="formInline.oncePassword" placeholder="oncePassword">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="adminCode">
          <Input
            type="text"
            v-model="formInline.adminCode"
            placeholder="adminCode"
            style="width:300px"
          >
            <Icon type="ios-key-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem style="display:flex;justify-content: space-around;">
          <router-link :to="{ name: 'login'}">
            <Button style="margin-right: 20px">登录</Button>
          </router-link>
          <Button type="primary" @click="handleSubmit('formInline')">注册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你的密码"));
      } else {
        if (this.formInline.oncePassword !== "") {
          // 对第二个密码框单独验证
          this.$refs.formInline.validateField("oncePassword");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入你的密码"));
      } else if (value !== this.formInline.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        user: "",
        password: "",
        oncePassword: "",
        adminCode: ""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        oncePassword: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ],
        adminCode: [
          {
            required: true,
            message: "请输入授权码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    async register() {
      try {
        //获取公钥
        let key = await this.$getKey();
        let { data } = await this.$http.post("api/admin/register", {
          user: this.formInline.user,
          password: this.$getSecret(this.formInline.password, key),
          adminCode: this.formInline.adminCode
        });
        if (data.status == 200) {
          this.user = "";
          this.password = "";
          this.oncePassword = "";
          this.adminCode = "";
          this.$Message.success(data.text);
        } else {
          this.$Message.error(data.text);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.register();
        } else {
          this.$Message.error("提交失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#register {
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/d11aea1.png");
  background-size: 100% 100%;
  background-color: #f7f9fa;
  .content {
    width: 30%;
    // height: 30%;
    padding-top: 30px;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  }
}
</style>