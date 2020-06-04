<template>
  <div id="index">
    <HeadTop isAction="index" />
    <div class="body">
      <div class="lun">
        <transition-group name="list" tag="ul" class="lun_ul">
          <li v-for="(item,index) in lists" :key="index" v-show="action === index" class="lun_li">
            <a :href="item.url">
              <img :src="item.img" :alt="index" />
            </a>
          </li>
        </transition-group>
        <ul class="list_ul">
          <li v-for="(item,index) in lists" :key="index" class="list_li">
            <div
              :class="[{list_in:action === index},{list_out:preAction === index},carousel]"
              @mouseover="next(index)"
            ></div>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="release">
          <router-link :to="{ name: 'release'}">
            <Icon type="ios-add-circle" size="50" color="#1985ff" />
          </router-link>
          <span>发布闲置</span>
        </div>
        <div class="lists">
          <Commodity :commodityData="commodityData" />
          <div class="next">
            <Page
              :total="pageCount"
              show-sizer
              show-total
              :page-size="pageSize"
              :page-size-opts="pageSizeOpts"
              @on-page-size-change="changePageSize"
              @on-change="getGoods"
            />
          </div>
        </div>
      </div>
    </div>
    <Foot />
    <BackTop></BackTop>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
import HeadTop from "./index/headTop";
import Foot from "./index/foot";
import Commodity from "./index/commodity";
export default {
  name: "index",
  components: {
    HeadTop: HeadTop,
    Commodity: Commodity,
    Foot: Foot
  },
  data() {
    return {
      lists: [
        {
          url: "#",
          img: require("@/assets/img/1017404h0vezpgr5o7myt6.png")
        },
        {
          url: "#",
          img: require("@/assets/img/101850064m2a8gmrdzlio9.png")
        },
        {
          url: "#",
          img: require("@/assets/img/112449kz77w48oq6w65mse.png")
        },
        {
          url: "#",
          img: require("@/assets/img/171200azl8w4zoiuszma2c.png")
        },
        {
          url: "#",
          img: require("@/assets/img/101121k3nxmeko8jinbdc6.jpg")
        }
      ],
      action: 0,
      preAction: -1,
      timer: null,
      carousel: "carousel",
      list_in: "list_in",
      list_out: "list_out",
      actionTime: 5,
      pageCount: 0,
      pageSize: 10,
      commodityData: [],
      pageSizeOpts: [10, 20, 50, 100]
    };
  },
  created() {
    //在DOM加载完成后，开始轮播
    this.autoPlay();
    this.getGoods();
  },
  methods: {
    next(id) {
      if (id != this.action) {
        clearInterval(this.timer);
        this.preAction = this.action;
        this.action = id;
        this.autoPlay();
      }
    },
    autoPlay() {
      this.timer = setInterval(() => {
        this.preAction = this.action;
        this.action++;
        if (this.action > this.lists.length - 1) {
          this.action = 0;
        }
      }, this.actionTime * 1000);
    },
    async getGoods(page) {
      try {
        let { data } = await this.$http.get("/api/getGoods", {
          params: {
            page: (page - 1) * this.pageSize,
            pageSize: this.pageSize
          }
        });
        this.commodityData = data.result;
        this.pageCount = data.count;
      } catch (error) {
        console.error(error);
      }
    },
    changePageSize(size) {
      this.pageSize = size;
      this.getGoods();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#index {
  width: 100%;
  background-color: #f0f1f3;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .body {
    width: 75%;
    .lun {
      width: 100%;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
      .lun_ul {
        width: 100%;
        // height: 460px;
        padding-bottom: 41.07%;
        .lun_li {
          width: 100%;
          position: absolute;
          list-style: none;
          img {
            width: 100%;
            border-radius: 5px;
          }
        }
      }
      .list_ul {
        height: 20px;
        position: absolute;
        top: 85%;
        right: 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .list_li {
          width: 45px;
          height: 7px;
          margin-left: 10px;
          list-style-type: none;
          .carousel {
            width: 7px;
            height: 100%;
            background-color: #8391a5;
            opacity: 0.9;
            border-radius: 50%;
          }
          .list_in {
            animation: action_in 5s;
            background-color: #1985ff;
          }
          .list_out {
            animation: action_out 1.5s;
          }
          @keyframes action_in {
            from {
              width: 7px;
            }
            to {
              width: 40px;
            }
          }
          @keyframes action_out {
            from {
              width: 40px;
            }
            to {
              width: 7px;
            }
          }
        }
      }
      .list-enter-to {
        transition: all 1.5s ease-out;
        transform: translateX(0);
      }

      .list-leave-active {
        transition: all 1.5s ease-out;
        transform: translateX(-100%);
      }

      .list-enter {
        transform: translateX(100%);
      }

      .list-leave {
        transform: translateX(0);
      }
    }
    .content {
      width: 100%;
      margin-top: 20px;
      .release {
        width: 100%;
        height: 110px;
        background-color: #ffffff;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          padding-left: 20px;
          font-size: 18px;
          font-weight: 600;
        }
      }
      .lists {
        width: 100%;
        margin-top: 20px;
        .next {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
