<template>
  <div id="headTop">
    <div class="head">
      <div class="left">
        <img src="@/assets/img/logo.png" alt="logo" />
        <span class="logo">旧肆</span>
        <div style="height:100%;">
          <router-link
            :to="{ name: 'index'}"
            style="height:100%;"
            :class="[{ action: isAction=='index' }, sou]"
          >
            <span>首页</span>
          </router-link>
        </div>
        <div style="height:100%;">
          <router-link
            :to="{ name: 'community'}"
            style="height:100%;"
            :class="[{ action: isAction=='community' }, sou]"
          >
            <span>社区</span>
          </router-link>
        </div>
        <div class="search">
          <Input
            v-model="goodsData"
            v-if="isAction=='index'||isAction=='goodsSearch'"
            search
            enter-button
            placeholder="商品名"
            @on-search="goodsSearch"
          />
          <Input
            v-model="postData"
            v-if="isAction=='community'||isAction=='postSearch'"
            search
            enter-button
            placeholder="帖子"
            @on-search="postSearch"
          />
        </div>
        <div class="addPost" v-if="isAction=='community'||isAction=='postSearch'">
          <router-link :to="{ name: 'addPost'}">
            <Button type="primary">发帖</Button>
          </router-link>
        </div>
      </div>
      <div class="right">
        <div :class="[{ action: isAction=='goodsCar' }, icon]">
          <router-link :to="{ name: 'goodsCar'}">
            <Icon v-if="isAction=='goodsCar'" type="ios-cart" size="30" color="#1985ff" />
            <Icon v-else type="ios-cart-outline" size="30" color="black" />
          </router-link>
        </div>
        <div :class="[{ action: isAction=='goodsBuyNotice' }, icon]">
          <router-link :to="{ name: 'goodsBuyNotice'}">
            <Icon
              v-if="isAction=='goodsBuyNotice'"
              type="md-notifications"
              color="#1985ff"
              size="28"
            />
            <Badge v-else :dot="noticeNum>0">
              <Icon type="md-notifications-outline" size="28" color="black" />
            </Badge>
          </router-link>
        </div>
        <div :class="[{ action: isAction=='userCenter' }, icon]">
          <Dropdown @on-click="logout">
            <router-link :to="{ name: 'userCenter'}">
              <Icon v-if="isAction=='userCenter'" type="ios-contact" color="#1985ff" size="30" />
              <Icon v-else type="ios-contact-outline" color="black" size="30" />
            </router-link>
            <DropdownMenu slot="list">
              <DropdownItem>退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "headTop",
  data() {
    return {
      action: "action",
      sou: "sou",
      icon: "icon",
      noticeNum: 0,
      goodsData: "",
      postData: ""
    };
  },
  props: ["isAction"],
  created() {
    this.getMarkBuyCount();
  },
  methods: {
    async getMarkBuyCount() {
      try {
        let { data } = await this.$http.get("/api/getMarkBuyCount", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.noticeNum = data;
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      //清空localStorage
      localStorage.clear();
      this.$router.push("/login");
    },
    goodsSearch() {
      this.$router.push({
        path: "/goodsSearch",
        query: { id: this.goodsData }
      });
    },
    postSearch() {
      this.$router.push({
        path: "/postSearch",
        query: { id: this.postData }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#headTop {
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-shadow: 0 2px 4px 0 rgba(114, 144, 179, 0.06);
  .head {
    width: 75%;
    height: 100%;
    // background-color: red;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left {
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 45px;
        height: 45px;
        transition: 1s;
        &:hover {
          transform: rotateZ(180deg);
        }
      }
      .logo {
        font-family: "Boyfriend";
        font-size: 23px;
        padding-left: 5px;
      }
      .action {
        border-bottom: 2px solid #1985ff;
        font-weight: 600;
      }
      .sou {
        height: 100%;
        font-size: 16px;
        color: #18191a;
        display: flex;
        align-items: center;
        margin-left: 40px;
      }
      .search {
        margin-left: 30px;
      }
      .addPost {
        margin-left: 30px;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .icon {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 30px;
      }
    }
  }
}
</style>