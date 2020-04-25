<template>
  <div id="report">
    <HeadTop isAction="report" />
    <div class="body">
      <div class="title">
        <span style="font-weight:600">举报商品：</span>
        <span>{{goodsData.goodsName}}</span>
      </div>
      <div class="title">
        <span style="font-weight:600">举报卖家：</span>
        <span>{{goodsData.user.mail}}</span>
      </div>
      <div class="content">
        <p>举报理由</p>
        <Input
          v-model="content"
          maxlength="200"
          show-word-limit
          type="textarea"
          placeholder="举报该商品的理由"
          style="width: 80%"
          :rows="7"
        />
      </div>
      <div class="submit">
        <Button @click="submit()" type="primary">提交</Button>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "./headTop";
export default {
  name: "report",
  data() {
    return {
      goodsData: {},
      content: ""
    };
  },
  components: {
    HeadTop: HeadTop
  },
  created() {
    this.getGoodsById();
  },
  methods: {
    async getGoodsById() {
      try {
        let data = await this.$http.get("/api/getGoodsById", {
          params: { goodsId: this.$route.params.id }
        });
        if (data.data.status == 200) {
          this.goodsData = data.data.list;
        } else {
          this.$router.push("/");
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      try {
        if (this.content == "") {
          this.$Message.warning("请填写举报理由");
        } else {
          let data = await this.$http.get("api/addReport", {
            params: {
              reporter: this.$getUser.userId,
              reported: this.goodsData.user._id,
              goodsId: this.goodsData._id,
              content: this.content
            }
          });
          if (data.data.status == 200) {
            this.content = "";
            this.$Message.success(data.data.text);
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
#report {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .body {
    width: 60%;
    .title {
      width: 100%;
      line-height: 60px;
      font-size: 16px;
      overflow: hidden;
      margin-top: 50px;
      padding-left: 50px;
      border-radius: 5px;
      border: 1px solid rgb(241, 237, 237);
    }
    .content {
      width: 100%;
      font-size: 18px;
      margin-top: 50px;
      padding-left: 50px;
      padding-top: 30px;
      padding-bottom: 30px;
      padding-right: 50px;
      border-radius: 5px;
      border: 1px solid rgb(241, 237, 237);
      p {
        margin-bottom: 10px;
        font-weight: 600;
      }
    }
    .submit {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 30px;
      margin-bottom: 30px;
    }
  }
}
</style>