<template>
  <div id="editPost">
    <div class="head">
      <div class="header">
        <div class="left">
          <img src="@/assets/img/logo.png" alt="logo" />
          <span>旧肆</span>
          <Button @click="$router.go(-1)">返回</Button>
        </div>
        <div class="right">
          <Button type="primary" @click="updatePostByPostId">发布</Button>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="title">
        <input type="text" maxlength="30" placeholder="请输入标题..." v-model="title" />
      </div>
      <div class="content">
        <div class="edit">
          <textarea placeholder="输入文章内容..." class="textarea" v-model="content"></textarea>
        </div>
        <div class="show markdown-body" v-html="editMark"></div>
      </div>
    </div>
  </div>
</template>
<script>
import marked from "marked";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/monokai-sublime.css";
import "github-markdown-css/github-markdown.css";
export default {
  name: "editPost",
  data() {
    return {
      title: "",
      content: "",
      postList: {}
    };
  },
  created() {
    this.getPostById();
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
      return marked(this.content);
    }
  },
  methods: {
    async getPostById() {
      try {
        let data = await this.$http.get("api/post/getPostDetail", {
          params: {
            postId: this.$route.params.id
          }
        });
        this.postList = data.data;
        this.title = this.postList.title;
        this.content = this.postList.content;
      } catch (error) {
        console.error(error);
      }
    },
    async updatePostByPostId() {
      try {
        if (this.title == "" || this.content == "") {
          this.$Message.warning("请把内容填写完整");
        } else {
          let data = await this.$http.post("/api/post/updatePostByPostId", {
            title: this.title,
            content: this.content,
            postId: this.$route.params.id
          });
          if (data.data.status == 200) {
            this.$Message.success(data.data.text);
          } else {
            this.$Message.error(data.data.text);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#editPost {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  .head {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    box-shadow: 0 2px 4px 0 rgba(114, 144, 179, 0.06);
    .header {
      width: 75%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      .left {
        height: 100%;
        display: flex;
        align-items: center;
        img {
          width: 45px;
          height: 45px;
          transition: 1s;
          &:hover {
            transform: rotateY(180deg);
          }
        }
        span {
          font-family: "Boyfriend";
          font-size: 23px;
          padding-left: 5px;
          padding-right: 30px;
        }
      }
      .right {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
  .body {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .title {
      width: 100%;
      height: 60px;
      margin-top: 10px;
      border-bottom: 1px solid rgb(245, 240, 240);
      input {
        width: 50%;
        height: 100%;
        padding-left: 20px;
        font-size: 25px;
        font-weight: 600;
        border: 0 solid white;
        outline: none;
      }
    }
    .content {
      width: 100%;
      margin-top: 5px;
      position: absolute;
      top: 8rem;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      background-color: rgb(243, 235, 235);
      .edit {
        width: 50%;
        height: 100%;
        .textarea {
          width: 100%;
          height: 100%;
          outline: none;
          padding-left: 20px;
          font-size: 16px;
          border: 0 solid white;
          resize: none;
          background-color: #f8f9fa;
          padding-top: 10px;
        }
      }
      .show {
        width: 50%;
        height: 100%;
        padding: 30px;
        background-color: white;
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }
  }
}
</style>