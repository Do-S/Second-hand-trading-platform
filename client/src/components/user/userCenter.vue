<template>
  <div id="userCenter">
    <HeadTop isAction="userCenter" />
    <div class="body">
      <div class="user">
        <div class="userLeft">
          <div class="userAvatar">
            <img :src="userList.avatar" />
          </div>
          <div class="userMessage">
            <p v-if="userList.nickname !== ''">{{userList.nickname}}</p>
            <p v-else>{{userList.mail}}</p>
            <div class="userSex">
              <span>性别</span>
              <span>{{userList.sex}}</span>
            </div>
            <div class="userSex">
              <span>简介</span>
              <span v-if="userList.introduction !== ''">{{userList.introduction}}</span>
              <span v-else>这位道友什么都没有留下...</span>
            </div>
          </div>
        </div>
        <div class="userRight">
          <router-link :to="{name:'setting'}" class="userButton">
            <span>编辑个人资料</span>
          </router-link>
        </div>
      </div>
      <div class="myList">
        <Tabs :value="tabName" class="ListTab" @on-click="tabChang">
          <TabPane label="商品" name="name1" :class="[goodsMall,{action:tabs=='name2'}]">
            <i-menu theme="light" :active-name="$route.name" width="20%">
              <i-menuGroup title="售卖">
                <router-link :to="{ name: 'myRelease'}" style="color:black">
                  <i-menuItem name="myRelease">
                    <Icon type="ios-paper-plane" />我的发布
                  </i-menuItem>
                </router-link>
                <router-link :to="{ name: 'successSale'}" style="color:black">
                  <i-menuItem name="successSale">
                    <Icon type="logo-usd" />售卖成功
                  </i-menuItem>
                </router-link>
              </i-menuGroup>
              <i-menuGroup title="购买">
                <router-link :to="{ name: 'purchaseHistory'}" style="color:black">
                  <i-menuItem name="purchaseHistory">
                    <Icon type="md-basket" />购买记录
                  </i-menuItem>
                </router-link>
              </i-menuGroup>
            </i-menu>
            <div class="goodsShow">
              <router-view></router-view>
            </div>
          </TabPane>
          <TabPane label="帖子" name="name2" :class="[goodsMall,{action:tabs=='name1'}]">
            <i-menu theme="light" :active-name="$route.name" width="20%">
              <i-menuGroup title="发布">
                <router-link :to="{ name: 'myPost'}" style="color:black">
                  <i-menuItem name="myPost">
                    <Icon type="ios-paper-plane" />我的发布
                  </i-menuItem>
                </router-link>
              </i-menuGroup>
              <i-menuGroup title="收藏">
                <router-link :to="{ name: 'myCollect'}" style="color:black">
                  <i-menuItem name="myCollect">
                    <Icon type="md-basket" />我的收藏
                  </i-menuItem>
                </router-link>
              </i-menuGroup>
            </i-menu>
            <div class="goodsShow">
              <router-view></router-view>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "../index/headTop";
export default {
  name: "userCenter",
  data() {
    return {
      userList: {},
      goodsMall: "goodsMall",
      action: "action",
      tabs: "name1",
      tabName: "name1"
    };
  },
  components: {
    HeadTop: HeadTop
  },
  created() {
    this.getUser();
    this.routerChang();
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      this.routerChang();
    }
  },
  methods: {
    async getUser() {
      try {
        let data = await this.$http.post("/api/user/getUserById", {
          id: this.$getUser.userId
        });
        this.userList = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    tabChang(name) {
      if (name == "name2") {
        this.tabs = "name2";
        this.$router.push("/userCenter/myPost");
      } else {
        this.tabs = "name1";
        this.$router.push("/userCenter/myRelease");
      }
    },
    routerChang() {
      if (this.$route.name == "myPost" || this.$route.name == "myCollect") {
        this.tabName = "name2";
      } else {
        this.tabName = "name1";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#userCenter {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: #f7f9fa;
  .body {
    width: 75%;
    margin-top: 20px;
    .user {
      width: 100%;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      background-color: white;
      border-radius: 5px;
      .userLeft {
        display: flex;
        .userAvatar {
          width: 120px;
          height: 120px;
          margin-left: 20px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid #1985ff;
          }
        }
        .userMessage {
          padding-left: 30px;
          p {
            font-size: 28px;
            font-weight: 500;
            color: #18191a;
          }
          span {
            font-weight: 500;
            color: #494b4d;
            font-size: 14px;
          }
          span:nth-child(2) {
            color: #797c80;
            width: 350px;
            padding-left: 20px;
          }
          .userSex {
            padding-top: 10px;
          }
        }
      }
      .userRight {
        align-self: flex-end;
        padding-right: 10px;
        .userButton {
          width: 180px;
          line-height: 36px;
          text-align: center;
          border: 1px solid #99c9ff;
          border-radius: 5px;
          display: inline-block;
          cursor: pointer;
          span {
            font-size: 13px;
            color: #1985ff;
            font-weight: 500;
          }
          &:hover {
            background-color: #ecf5ff;
          }
        }
      }
    }
    .myList {
      width: 100%;
      padding: 10px;
      margin-top: 20px;
      border-radius: 5px;
      background-color: white;
      margin-bottom: 30px;
      .ListTab {
        width: 100%;
        .goodsMall {
          display: flex;
          align-items: flex-start;
          .goodsShow {
            width: 80%;
            padding-left: 10px;
          }
        }
        .action {
          height: 0;
        }
      }
    }
  }
}
</style>