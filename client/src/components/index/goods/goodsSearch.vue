<template>
  <div id="goodsSearch">
    <HeadTop isAction="goodsSearch" />
    <div class="lists">
      <Commodity :commodityData="goodsData" />
      <div class="next">
        <Page :total="pageCount" :page-size="pageSize" @on-change="getGoodsBySearch" />
      </div>
    </div>
  </div>
</template>
<script>
import HeadTop from "../headTop";
import Commodity from "../commodity";
export default {
  name: "goodsSearch",
  data() {
    return {
      goodsData: [],
      pageCount: 0,
      pageSize: 20
    };
  },
  components: {
    HeadTop: HeadTop,
    Commodity
  },
  created() {
    this.getGoodsBySearch();
  },
  methods: {
    async getGoodsBySearch(page) {
      try {
        let data = await this.$http.get("/api/getGoodsBySearch", {
          params: {
            goodsSearch: this.$route.query.id,
            page: (page - 1) * this.pageSize,
            pageSize: this.pageSize
          }
        });

        this.goodsData = data.data.result;
        this.pageCount = data.data.count[0].count;
        console.log(this.pageCount);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#goodsSearch {
  width: 100%;
  min-height: 100vh;
  background-color: #f0f1f3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-start;
  .lists {
    width: 75%;
    margin-top: 20px;
    .next {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
  }
}
</style>