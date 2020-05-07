<template>
  <div id="login">
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
        <FormItem style="display:flex;justify-content: space-around;">
          <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
          <router-link :to="{ name: 'register'}">
            <Button style="margin-left: 20px">注册</Button>
          </router-link>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      formInline: {
        user: "",
        password: ""
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
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    async login() {
      try {
        //获取公钥
        let key = await this.$getKey();
        let data = await this.$http.post("api/admin/login", {
          user: this.formInline.user,
          password: this.$getSecret(this.formInline.password, key)
        });
        if (data.data.status == 200) {
          if (data.data.adminStatus == 2) {
            this.$Message.error("你的注册授权码已被停用");
          } else {
            //保存token
            localStorage.setItem(
              window.$project,
              JSON.stringify({
                token: data.data.token,
                userName: data.data.userName,
                userId: data.data.userId,
                admin: data.data.adminStatus
              })
            );
            this.$router.push("/");
            location.reload();
          }
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.login();
        } else {
          this.$Message.error("提交失败");
        }
      });
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
  background-image: url("../assets/d11aea1.png");
  background-size: 100% 100%;
  background-color: #f7f9fa;
  .content {
    width: 30%;
    height: 30%;
    padding-top: 25px;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  }
}
</style>