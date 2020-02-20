<template>
  <div id="myCollect">
    <div class="postLists">
      <div class="list" v-for="(item,index) in postList">
        <div class="head">
          <router-link :to="{name:'postDetail', params:{id:item.post.postId}}">{{item.post.title}}</router-link>
        </div>
        <div class="bottom">
          <div class="date">
            <span>{{item.date|dateformat()}}</span>
          </div>
          <div class="look">
            <Icon size="15" type="ios-eye-outline" />
            <span>{{item.post.count}}</span>
            <Dropdown @on-click="delPostByPostId(item.post._id)">
              <Icon size="23" type="ios-more" color="#aaaeb3" />
              <DropdownMenu slot="list">
                <DropdownItem>
                  <span>删除</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
      postList: []
    };
  },
  created() {
    this.getPostByUserId();
  },
  methods: {
    async getPostByUserId() {
      try {
        let data = await this.$http.get("/api/post/getCollectByUserId", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.postList = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async delPostByPostId(id) {
      try {
        let data = await this.$http.get("/api/post/delCollect", {
          params: {
            postId: id,
            userId: this.$getUser.userId
          }
        });
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
#myCollect {
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