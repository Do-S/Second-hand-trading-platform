<template>
  <div id="commodity">
    <div class="lists">
      <div v-for="(item,index) in commodityData" :key="index" class="list">
        <div class="commPic">
          <!-- <router-link :to="{ name: 'goodsDetails',params: { id: item._id }}">
            <img :src="item.img[0].url" :alt="index" />
          </router-link>-->
          <a @click="hrefDetail(item._id )">
            <img :src="item.img[0].url" :alt="index" />
          </a>
        </div>
        <div class="message">
          <div class="goodsName">
            <router-link :to="{ name: 'goodsDetails',params: { id: item._id }}">{{item.goodsName}}</router-link>
          </div>
          <p>￥{{item.price}}</p>
          <hr style="opacity: 0.4;" />
        </div>
        <div class="user">
          <router-link :to="{ name: 'goodsUser',params: { id: item.user._id }}">
            <img :src="item.user.avatar" :alt="index" />
          </router-link>
          <router-link :to="{ name: 'goodsUser',params: { id: item.user._id }}">{{item.user.mail}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commodity",
  data() {
    return {};
  },
  props: ["commodityData"],
  created() {},
  methods: {
    hrefDetail(id) {
      let newpage = this.$router.resolve({
        name: "goodsDetails",
        params: {
          id: id
        }
      });
      window.open(newpage.href, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
#commodity {
  .lists {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    .list {
      width: 19%;
      margin-bottom: 3vh;
      margin-right: 1%;
      border-radius: 5px;
      background-color: white;
      .commPic {
        width: 100%;
        padding-bottom: 100%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
      }
      .message {
        padding-top: 5%;
        padding-left: 5%;
        padding-right: 5%;
        .goodsName {
          height: 40px;
          overflow: hidden;
          a {
            color: rgb(91, 94, 109);
            font-size: 13px;
            &:hover {
              color: #1985ff;
            }
          }
        }
        p {
          padding-top: 5%;
          padding-bottom: 5%;
          font-size: 16px;
          color: red;
        }
      }
      .user {
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        padding-left: 5%;
        padding-right: 5%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        img {
          height: 35px;
          width: 35px;
          margin-right: 5px;
          border: 1px solid #9ccaff;
          border-radius: 50%;
          cursor: pointer;
        }
        a:nth-child(2) {
          color: rgb(91, 94, 109);
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            color: #1985ff;
          }
        }
      }
    }
  }
}
</style>