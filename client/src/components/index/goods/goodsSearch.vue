<template>
  <div id="goodsSearch">
    <HeadTop isAction="goodsSearch" />
    <div class="lists">
      <Commodity :commodityData="goodsData" />
      <div class="next">
        <Page :total="pageCount" @on-change="pageChange" />
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
      page: 1,
      goodsData: []
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
    async getGoodsBySearch() {
      try {
        let data = await this.$http.get("/api/getGoodsBySearch", {
          params: {
            goodsSearch: this.$route.query.id,
            page: (this.page - 1) * 20
          }
        });
        this.goodsData = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    pageChange(id) {
      this.page = id;
      this.getGoods();
    }
  }
};
</script>
<style lang="scss" scoped>
#goodsSearch {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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