<template>
  <div id="myPost">
    <div class="postLists">
      <div class="list" v-for="(item,index) in postList">
        <div class="head">
          <router-link :to="{name:'postDetail', params:{id:item.postId}}">{{item.title}}</router-link>
        </div>
        <div class="bottom">
          <div class="date">
            <span>{{item.date|dateformat()}}</span>
          </div>
          <div class="look">
            <Icon size="15" type="ios-eye-outline" />
            <span>{{item.count}}</span>
            <Dropdown @on-click="()=>{modal_one=true;delPostId=item._id}">
              <Icon size="23" type="ios-more" color="#aaaeb3" />
              <DropdownMenu slot="list">
                <DropdownItem>
                  <span>删除</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Modal v-model="modal_one" width="360">
              <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
              </p>
              <div style="text-align:center">
                <p>你确定要删除该商品吗?</p>
              </div>
              <div slot="footer">
                <Button type="error" size="large" long @click="delPostByPostId">删除</Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "myPost",
  data() {
    return {
      postList: [],
      modal_one: false,
      delPostId: ""
    };
  },
  created() {
    this.getPostByUserId();
  },
  methods: {
    async getPostByUserId() {
      try {
        let data = await this.$http.get("/api/post/getPostByUserId", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.postList = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async delPostByPostId() {
      try {
        let data = await this.$http.get("/api/post/delPostByPostId", {
          params: {
            postId: this.delPostId
          }
        });
        this.modal_one = false;
        if (data.data.status == 200) {
          this.$Message.success(data.data.text);
          this.getPostByUserId();
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#myPost {
  width: 100%;
  .postLists {
    width: 100%;
    padding-left: 20px;
    margin-bottom: 50px;
    .list {
      width: 100%;
      padding-top: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgb(247, 242, 242);
      .head {
        width: 100%;
        padding-bottom: 10px;
        a {
          color: #18191a;
          font-weight: 600;
          font-size: 16px;
          &:hover {
            color: #1985ff;
          }
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .date {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #aaaeb3;
          font-size: 12px;
        }
        .look {
          width: 15%;
          margin-right: 50px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            display: block;
            width: 80px;
            padding-left: 5px;
            padding-right: 25px;
          }
        }
      }
    }
  }
}
</style>