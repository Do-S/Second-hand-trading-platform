<template>
  <div id="postDetail">
    <BackTop></BackTop>
    <HeadTop isAction="community" />
    <div class="router">
      <span @click="$router.go(-1)">上一层</span>
      <span>></span>
      <span>正文</span>
    </div>
    <div class="body">
      <div class="left">
        <div class="post">
          <div class="head">
            <div class="title">
              <p>{{postList.title}}</p>
            </div>
            <div class="user_lists">
              <div class="date">
                <span>发表于</span>
                <span>{{postList.date|dateformat()}}</span>
                <router-link
                  v-if="postList.userId==$getUser.userId"
                  :to="{name:'editPost',params:{id:postList.postId}}"
                >编辑</router-link>
              </div>
              <div class="look">
                <Icon size="15" type="ios-eye-outline" />
                <span>{{postList.count}}</span>
              </div>
            </div>
          </div>
          <div class="content markdown-body" v-html="editMark"></div>
          <Affix :offset-bottom="0">
            <div class="commentInput">
              <Input v-model="comment" placeholder="输入评论内容" style="width: 80%" />
              <Button
                style="margin-left:30px;padding-left:30px;padding-right:30px;"
                type="primary"
                @click="addComment"
              >回复</Button>
            </div>
          </Affix>
        </div>
        <div class="comment">
          <div class="head">
            <span>全部回复({{commentList.length}})</span>
          </div>
          <div class="commentLists">
            <div class="list" v-for="(item,index) in commentList" :key="index">
              <div class="userAvatar">
                <img :src="item.user.avatar" />
              </div>
              <div class="userComment">
                <span>{{item.user.mail}}</span>
                <Tag
                  style="margin-left:10px;"
                  color="green"
                  v-if="item.user.userId==postList.user.userId"
                >楼主</Tag>
                <p>{{item.content}}</p>
                <div class="timeComment">
                  <Time class="time" :time="item.date" />
                  <Dropdown
                    @on-click="delComment(item._id)"
                    v-if="item.user.userId==$getUser.userId"
                  >
                    <Icon size="28" type="ios-more" color="#aaaeb3" />
                    <DropdownMenu slot="list">
                      <DropdownItem>
                        <span>删除</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown @on-click="report(item._id)" v-else>
                    <Icon size="28" type="ios-more" color="#aaaeb3" />
                    <DropdownMenu slot="list">
                      <DropdownItem>
                        <span>举报</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="user">
          <div class="userTop">
            <div class="userAvatar">
              <router-link :to="{ name: 'goodsUser',params: { id: postList.user.userId }}">
                <img :src="postList.user.avatar" />
              </router-link>
            </div>
            <div class="userName">
              <router-link
                :to="{ name: 'goodsUser',params: { id: postList.user.userId}}"
              >{{postList.user.mail}}</router-link>
            </div>
          </div>
          <div class="userBottom">
            <span v-if="postList.user.introduction==''">这位道友什么都没有留下...</span>
            <span v-else>{{postList.user.introduction}}</span>
          </div>
        </div>
        <PopularPost />
      </div>
    </div>
    <div class="collect" v-if="collect==0" @click="addCollect">
      <Icon size="32" type="ios-cube-outline" />
    </div>
    <div class="collect" v-else @click="delCollect">
      <Icon size="32" type="md-cube" color="#1985ff" />
    </div>
  </div>
</template>
<script>
import HeadTop from "../index/headTop";
import PopularPost from "./popularPost";
import marked from "marked";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/monokai-sublime.css";
import "github-markdown-css/github-markdown.css";
export default {
  name: "postDetail",
  data() {
    return {
      postList: {
        content: ""
      },
      collect: 0,
      comment: "",
      commentList: []
    };
  },
  computed: {
    editMark() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function(code) {
          return hljs.highlightAuto(code).value;
        },
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });
      return marked(this.postList.content);
    }
  },
  components: {
    HeadTop: HeadTop,
    PopularPost
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      if (to.params.id != from.params.id) {
        // this.$route.params.id = to.params.id;
        this.getPostDetail();
        this.getCommentByPostId();
      }
    }
  },
  created() {
    this.getPostDetail();
    this.getCommentByPostId();
    this.getCollectByPostId();
  },
  methods: {
    async getPostDetail() {
      try {
        let data = await this.$http.get("api/post/getPostDetail", {
          params: {
            postId: this.$route.params.id
          }
        });
        this.postList = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getCommentByPostId() {
      try {
        let data = await this.$http.get("/api/post/getCommentByPostId", {
          params: {
            postId: this.$route.params.id
          }
        });
        this.commentList = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addComment() {
      try {
        if (this.comment == "") {
          this.$Message.warning("请填写评论内容");
        } else {
          let data = await this.$http.post("/api/post/addComment", {
            userId: this.$getUser.userId,
            comment: this.comment,
            postId: this.postList._id
          });
          if (data.data.status == 200) {
            this.comment = "";
            this.getCommentByPostId();
            this.$Message.success(data.data.text);
          } else {
            this.$Message.error(data.data.text);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async delComment(id) {
      try {
        let data = await this.$http.get("/api/post/delComment", {
          params: {
            commentId: id
          }
        });
        if (data.data.status == 200) {
          this.getCommentByPostId();
          this.$Message.success(data.data.text);
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    report(id) {
      this.$Message.info("该功能还未上架");
    },
    async getCollectByPostId() {
      try {
        let data = await this.$http.get("/api/post/getCollectByPostId", {
          params: {
            postId: this.$route.params.id,
            userId: this.$getUser.userId
          }
        });
        this.collect = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addCollect() {
      try {
        let data = await this.$http.get("/api/post/addCollect", {
          params: {
            userId: this.$getUser.userId,
            postId: this.postList._id
          }
        });
        if (data.data.status == 200) {
          this.getCollectByPostId();
          this.$Message.success(data.data.text);
        } else {
          this.$Message.error(data.data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async delCollect() {
      try {
        let data = await this.$http.get("/api/post/delCollect", {
          params: {
            userId: this.$getUser.userId,
            postId: this.$route.params.id
          }
        });
        if (data.data.status == 200) {
          this.getCollectByPostId();
          this.$Message.success(data.data.text);
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
#postDetail {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: #f7f9fa;
  .router {
    width: 75%;
    padding-left: 10px;
    padding-bottom: 5px;
    padding-top: 5px;
    span {
      padding-right: 20px;
      color: #aaaeb3;
      font-size: 13px;
    }
    span:nth-child(1) {
      cursor: pointer;
      &:hover {
        color: #667280;
      }
    }
  }
  .body {
    width: 75%;
    display: flex;
    justify-content: space-between;
    .left {
      width: 71%;
      .post {
        width: 100%;
        border-radius: 5px;
        background-color: white;
        padding-left: 30px;
        padding-right: 30px;
        .head {
          width: 100%;
          padding-top: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f5f6f7;
          .title {
            font-size: 28px;
            color: #18191a;
            font-weight: 600;
          }
          .user_lists {
            width: 100%;
            padding-top: 20px;
            color: #797c80;
            font-weight: 400;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            .date {
              span {
                padding-right: 10px;
              }
            }
            .look {
              width: 10%;
              span {
                padding-left: 5px;
              }
            }
          }
        }
        .content {
          width: 100%;
          padding-top: 30px;
          padding-bottom: 30px;
        }
        .commentInput {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          background-color: white;
        }
      }
      .comment {
        width: 100%;
        background-color: white;
        margin-top: 30px;
        border-radius: 5px;
        .head {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 30px;
          border-bottom: 1px solid rgb(245, 240, 240);
          span {
            color: #18191a;
            font-size: 16px;
            font-weight: 600;
          }
        }
        .commentLists {
          width: 100%;
          .list {
            width: 100%;
            border-bottom: 1px solid rgb(243, 238, 238);
            margin-bottom: 30px;
            display: flex;
            justify-content: flex-start;
            .userAvatar {
              padding-left: 10px;
              padding-top: 10px;
              img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid #1985ff;
              }
            }
            .userComment {
              width: 100%;
              padding-left: 20px;
              padding-top: 10px;
              padding-bottom: 10px;
              span {
                color: #18191a;
                font-weight: 500;
                font-size: 16px;
              }
              p {
                padding-top: 10px;
                padding-bottom: 10px;
                font-size: 15px;
                font-weight: 400;
                color: #494b4d;
              }
              .timeComment {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding-right: 30px;
                .time {
                  font-size: 12px;
                  font-weight: 400;
                  color: #797c80;
                }
              }
            }
          }
        }
      }
    }
    .right {
      width: 28%;
      .user {
        width: 100%;
        background-color: white;
        border-radius: 5px;
        padding-left: 10px;
        margin-bottom: 30px;
        .userTop {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding-top: 10px;
          .userAvatar {
            img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border: 1px solid #1985ff;
            }
          }
          .userName {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;
            a {
              font-size: 17px;
              font-weight: 600;
              color: #18191a;
            }
          }
        }
        .userBottom {
          padding-top: 10px;
          font-size: 13px;
          font-weight: 400;
          width: 100%;
          color: #797c80;
          padding-bottom: 20px;
        }
      }
    }
  }
  .collect {
    position: fixed;
    left: 8%;
    top: 40vh;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid rgb(241, 235, 235);
  }
}
</style>