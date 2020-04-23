<template>
  <div id="modifyInformation">
    <div class="box">
      <p>修改管理员密码</p>
      <div>
        <span>原密码：</span>
        <Input
          v-model="password"
          type="password"
          password
          placeholder="输入原密码"
          style="width: 250px"
        />
      </div>
      <div>
        <span>新密码：</span>
        <Input
          v-model="newPassword"
          type="password"
          password
          placeholder="输入新密码"
          style="width: 250px"
        />
      </div>
      <div>
        <span>再次输入密码：</span>
        <Input
          v-model="oncePassword"
          type="password"
          password
          placeholder="再次输入新密码"
          style="width: 250px"
        />
      </div>
      <div class="button">
        <button @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "modifyInformation",
  data() {
    return {
      password: "",
      newPassword: "",
      oncePassword: ""
    };
  },
  created() {},
  methods: {
    async submit() {
      try {
        if (
          this.password != "" &&
          this.newPassword != "" &&
          this.oncePassword != ""
        ) {
          if (this.newPassword == this.oncePassword) {
            //获取公钥
            let key = await this.$getKey();
            let data = await this.$http.post("/api/admin/updatePassword", {
              user: this.$getUser.userId,
              password: this.$getSecret(this.password, key),
              newPassword: this.$getSecret(this.newPassword, key)
            });
            if (data.data.status == 200) {
              this.password = "";
              this.newPassword = "";
              this.oncePassword = "";
              this.$Message.success(data.data.text);
            } else {
              this.$Message.error(data.data.text);
            }
          } else {
            this.$Message.warning("两次密码不一样");
          }
        } else {
          this.$Message.warning("请把表单填写完整");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#modifyInformation {
  width: 84%;
  height: 100%;
  position: fixed;
  background-color: #f0f1f3;
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    width: 38%;
    height: 48%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    border-radius: 5px;
    p {
      width: 100%;
      height: 30px;
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      font-size: 18px;
      font-weight: 500;
    }
    .button {
      width: 100%;
      display: flex;
      justify-content: center;
      button {
        width: 80px;
        line-height: 35px;
        text-align: center;
        border: 1px solid rgb(179, 120, 255);
        border-radius: 5px;
        background-color: rgb(233, 244, 255);
        margin-bottom: 10px;
      }
    }
  }
}
</style>