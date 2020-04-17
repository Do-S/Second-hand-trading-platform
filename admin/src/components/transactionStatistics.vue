<template>
  <div id="transactionStatistics">
    <div class="charts">
      <div class="dailyTurnover">
        <div class="title">
          <span>过去七日交易额</span>
          <Icon @click="getDailyTurnover()" type="md-sync" size="25" />
        </div>
        <div class="content">
          <div id="dailyTurnoverBar"></div>
          <div id="dailyTurnoverLine"></div>
          <div id="dailyTurnoverPie"></div>
        </div>
      </div>
      <div class="monthlyTransaction">
        <div class="title">
          <span>过去12月交易额</span>
          <Icon @click="getMonthlyTransaction()" type="md-sync" size="25" />
        </div>
        <div class="content">
          <div id="monthlyTransactionBar"></div>
          <div id="monthlyTransactionLine"></div>
          <div id="monthlyTransactionPie"></div>
        </div>
      </div>
      <div class="dailyTradingVolume">
        <div class="title">
          <span>过去七日订单数</span>
          <Icon @click="getDailyTradingVolume()" type="md-sync" size="25" />
        </div>
        <div class="content">
          <div id="dailyTradingVolumeBar"></div>
          <div id="dailyTradingVolumeLine"></div>
          <div id="dailyTradingVolumePie"></div>
        </div>
      </div>
      <div class="monthlyTradingVolume">
        <div class="title">
          <span>过去12月订单数</span>
          <Icon @click="getMonthlyTradingVolume()" type="md-sync" size="25" />
        </div>
        <div class="content">
          <div id="monthlyTradingVolumeBar"></div>
          <div id="monthlyTradingVolumeLine"></div>
          <div id="monthlyTradingVolumePie"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "../plugins/echarts";
export default {
  name: "transactionStatistics",
  data() {
    return {
      dailyTurnover: [],
      dailyTurnoverPie: [],

      monthlyTransaction: [],
      monthlyTransactionPie: [],

      dailyTradingVolume: [],
      dailyTradingVolumePie: [],

      monthlyTradingVolume: [],
      monthlyTradingVolumePie: [],

      sevenDays: [],
      twelveMonths: []
    };
  },
  mounted() {
    // this.initChart();
  },
  created() {
    this.getSevenDays();
    this.getTwelveMonths();
    this.getDailyTurnover();
    this.getMonthlyTransaction();
    this.getDailyTradingVolume();
    this.getMonthlyTradingVolume();
  },
  methods: {
    //获取过去七日交易额
    async getDailyTurnover() {
      try {
        let data = await this.$http.get("api/admin/getDailyTurnover");
        var list = [];
        this.dailyTurnover = [];
        this.dailyTurnoverPie = [];
        for (let i = 0; i < data.data.length; i++) {
          list.push(data.data[i]._id.day);
        }
        for (let j = 0; j < this.sevenDays.length; j++) {
          if (list.indexOf(this.sevenDays[j]) == -1) {
            this.dailyTurnover.push(0);
            var str = {};
            str.value = 0;
            str.name = this.sevenDays[j] + "号";
            this.dailyTurnoverPie.push(str);
          } else {
            this.dailyTurnover.push(
              data.data[list.indexOf(this.sevenDays[j])].count
            );
            var str = {};
            str.value = data.data[list.indexOf(this.sevenDays[j])].count;
            str.name = this.sevenDays[j] + "号";
            this.dailyTurnoverPie.push(str);
          }
        }
        this.dailyTurnoverChart();
      } catch (error) {
        console.error(error);
      }
    },

    //获取过去12个月交易额
    async getMonthlyTransaction() {
      try {
        let data = await this.$http.get("api/admin/getMonthlyTransaction");
        var list = [];
        this.monthlyTransaction = [];
        this.monthlyTransactionPie = [];
        for (let i = 0; i < data.data.length; i++) {
          list.push(data.data[i]._id.month);
        }
        for (let j = 0; j < this.twelveMonths.length; j++) {
          if (list.indexOf(this.twelveMonths[j]) == -1) {
            this.monthlyTransaction.push(0);
            var str = {};
            str.value = 0;
            str.name = this.twelveMonths[j] + "月";
            this.monthlyTransactionPie.push(str);
          } else {
            this.monthlyTransaction.push(
              data.data[list.indexOf(this.twelveMonths[j])].count
            );
            var str = {};
            str.value = data.data[list.indexOf(this.twelveMonths[j])].count;
            str.name = this.twelveMonths[j] + "月";
            this.monthlyTransactionPie.push(str);
          }
        }
        this.monthlyTransactionChart();
      } catch (error) {
        console.error(error);
      }
    },

    //获取过去七日交易数
    async getDailyTradingVolume() {
      try {
        let data = await this.$http.get("api/admin/getDailyTradingVolume");
        var list = [];
        this.dailyTradingVolume = [];
        this.dailyTradingVolumePie = [];
        for (let i = 0; i < data.data.length; i++) {
          list.push(data.data[i]._id.day);
        }
        for (let j = 0; j < this.sevenDays.length; j++) {
          if (list.indexOf(this.sevenDays[j]) == -1) {
            this.dailyTradingVolume.push(0);
            var str = {};
            str.value = 0;
            str.name = this.sevenDays[j] + "号";
            this.dailyTradingVolumePie.push(str);
          } else {
            this.dailyTradingVolume.push(
              data.data[list.indexOf(this.sevenDays[j])].count
            );
            var str = {};
            str.value = data.data[list.indexOf(this.sevenDays[j])].count;
            str.name = this.sevenDays[j] + "号";
            this.dailyTradingVolumePie.push(str);
          }
        }
        this.dailyTradingVolumeChart();
      } catch (error) {
        console.error(error);
      }
    },

    //获取过去12个月交易数
    async getMonthlyTradingVolume() {
      try {
        let data = await this.$http.get("api/admin/getMonthlyTradingVolume");
        var list = [];
        this.monthlyTradingVolume = [];
        this.monthlyTradingVolumePie = [];
        for (let i = 0; i < data.data.length; i++) {
          list.push(data.data[i]._id.month);
        }
        for (let j = 0; j < this.twelveMonths.length; j++) {
          if (list.indexOf(this.twelveMonths[j]) == -1) {
            this.monthlyTradingVolume.push(0);
            var str = {};
            str.value = 0;
            str.name = this.twelveMonths[j] + "月";
            this.monthlyTradingVolumePie.push(str);
          } else {
            this.monthlyTradingVolume.push(
              data.data[list.indexOf(this.twelveMonths[j])].count
            );
            var str = {};
            str.value = data.data[list.indexOf(this.twelveMonths[j])].count;
            str.name = this.twelveMonths[j] + "月";
            this.monthlyTradingVolumePie.push(str);
          }
        }
        this.monthlyTradingVolumeChart();
      } catch (error) {
        console.error(error);
      }
    },

    //获取过去七日日期
    getSevenDays() {
      let today = new Date();

      // 获取前七天的日期
      let date1 = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      let date2 = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      let date3 = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
      let date4 = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000);
      let date5 = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      let date6 = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
      let date7 = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
      this.sevenDays.push(date1.getDate());
      this.sevenDays.push(date2.getDate());
      this.sevenDays.push(date3.getDate());
      this.sevenDays.push(date4.getDate());
      this.sevenDays.push(date5.getDate());
      this.sevenDays.push(date6.getDate());
      this.sevenDays.push(date7.getDate());
      // console.log(this.sevenDays);
    },

    //获取过去12个月日期
    getTwelveMonths() {
      let nowDate = new Date();
      var result = [];
      for (var i = 0; i < 12; i++) {
        nowDate.setMonth(nowDate.getMonth() - 1);
        var month = nowDate.getMonth() + 1;
        // month = month < 10 ? "0" + month : month;
        //在这里可以自定义输出的日期格式
        result.push(month);
      }
      this.twelveMonths = result.reverse();
    },

    //渲染过去七日交易额图表
    dailyTurnoverChart() {
      let dailyTurnoverBar = echarts.init(
        document.getElementById("dailyTurnoverBar")
      );
      let dailyTurnoverLine = echarts.init(
        document.getElementById("dailyTurnoverLine")
      );
      let dailyTurnoverPie = echarts.init(
        document.getElementById("dailyTurnoverPie")
      );
      // 绘制图表
      dailyTurnoverBar.setOption(
        this.setOption(
          "柱状图",
          this.sevenDays,
          this.dailyTurnover,
          "bar",
          "交易额",
          "号",
          "元"
        )
      );
      dailyTurnoverLine.setOption(
        this.setOption(
          "折形图",
          this.sevenDays,
          this.dailyTurnover,
          "line",
          "交易额",
          "号",
          "元"
        )
      );
      dailyTurnoverPie.setOption(this.setOptionByPie(this.dailyTurnoverPie));
    },

    //渲染过去12个月交易额图表
    monthlyTransactionChart() {
      let monthlyTransactionBar = echarts.init(
        document.getElementById("monthlyTransactionBar")
      );
      let monthlyTransactionLine = echarts.init(
        document.getElementById("monthlyTransactionLine")
      );
      let monthlyTransactionPie = echarts.init(
        document.getElementById("monthlyTransactionPie")
      );
      // 绘制图表
      monthlyTransactionBar.setOption(
        this.setOption(
          "柱状图",
          this.twelveMonths,
          this.monthlyTransaction,
          "bar",
          "交易额",
          "月",
          "元"
        )
      );
      monthlyTransactionLine.setOption(
        this.setOption(
          "折形图",
          this.twelveMonths,
          this.monthlyTransaction,
          "line",
          "交易额",
          "月",
          "元"
        )
      );
      monthlyTransactionPie.setOption(
        this.setOptionByPie(this.monthlyTransactionPie)
      );
    },

    //渲染过去七日交易数图表
    dailyTradingVolumeChart() {
      let dailyTradingVolumeBar = echarts.init(
        document.getElementById("dailyTradingVolumeBar")
      );
      let dailyTradingVolumeLine = echarts.init(
        document.getElementById("dailyTradingVolumeLine")
      );
      let dailyTradingVolumePie = echarts.init(
        document.getElementById("dailyTradingVolumePie")
      );
      // 绘制图表
      dailyTradingVolumeBar.setOption(
        this.setOption(
          "柱状图",
          this.sevenDays,
          this.dailyTradingVolume,
          "bar",
          "订单量",
          "日",
          "个"
        )
      );
      dailyTradingVolumeLine.setOption(
        this.setOption(
          "折形图",
          this.sevenDays,
          this.dailyTradingVolume,
          "line",
          "订单量",
          "日",
          "个"
        )
      );
      dailyTradingVolumePie.setOption(
        this.setOptionByPie(this.dailyTradingVolumePie)
      );
    },

    //渲染过去12个月交易数图表
    monthlyTradingVolumeChart() {
      let monthlyTradingVolumeBar = echarts.init(
        document.getElementById("monthlyTradingVolumeBar")
      );
      let monthlyTradingVolumeLine = echarts.init(
        document.getElementById("monthlyTradingVolumeLine")
      );
      let monthlyTradingVolumePie = echarts.init(
        document.getElementById("monthlyTradingVolumePie")
      );
      // 绘制图表
      monthlyTradingVolumeBar.setOption(
        this.setOption(
          "柱状图",
          this.twelveMonths,
          this.monthlyTradingVolume,
          "bar",
          "订单量",
          "月",
          "个"
        )
      );
      monthlyTradingVolumeLine.setOption(
        this.setOption(
          "折形图",
          this.twelveMonths,
          this.monthlyTradingVolume,
          "line",
          "订单量",
          "月",
          "个"
        )
      );
      monthlyTradingVolumePie.setOption(
        this.setOptionByPie(this.monthlyTradingVolumePie)
      );
    },

    
    setOption(title, xData, yData, type, name, date, yname) {
      let option = {
        title: { text: title },
        tooltip: {},
        xAxis: {
          name: date,
          data: xData
        },
        yAxis: {
          type: "value",
          name: yname
        },
        series: [
          {
            name: name,
            type: type,
            data: yData
          }
        ]
      };
      return option;
    },

    //饼形图
    setOptionByPie(data) {
      let option = {
        title: {
          text: "饼形图"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          show: true,
          x: "left",
          textStyle: {
            fontSize: 7
          },
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "日期",
            type: "pie",
            radius: "48%",
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      return option;
    }
  }
};
</script>
<style lang="scss" scoped>
#transactionStatistics {
  width: 100%;
  display: flex;
  justify-content: center;
  .charts {
    width: 90%;
    margin-bottom: 50px;
    .dailyTurnover {
      width: 100%;
      background-color: white;
      margin-top: 30px;
      border-radius: 5px;
      .title {
        width: 100%;
        height: 50px;
        display: flex;
        color: black;
        font-weight: 500;
        font-size: 18px;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        border-bottom: 1px solid rgb(243, 237, 237);
        display: flex;
        justify-content: space-between;
        padding-right: 30px;
      }
      .content {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        #dailyTurnoverBar {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
        #dailyTurnoverLine {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
        #dailyTurnoverPie {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
      }
    }
    .monthlyTransaction {
      width: 100%;
      background-color: white;
      margin-top: 30px;
      border-radius: 5px;
      .title {
        width: 100%;
        height: 50px;
        display: flex;
        color: black;
        font-weight: 500;
        font-size: 18px;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        border-bottom: 1px solid rgb(243, 237, 237);
        display: flex;
        justify-content: space-between;
        padding-right: 30px;
      }
      .content {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        #monthlyTransactionBar {
          width: 35%;
          height: 100%;
          font-size: 5px;
        }
        #monthlyTransactionLine {
          width: 35%;
          height: 100%;
          font-size: 5px;
        }
        #monthlyTransactionPie {
          width: 25%;
          height: 100%;
          font-size: 5px;
        }
      }
    }
    .dailyTradingVolume {
      width: 100%;
      background-color: white;
      margin-top: 30px;
      border-radius: 5px;
      .title {
        width: 100%;
        height: 50px;
        display: flex;
        color: black;
        font-weight: 500;
        font-size: 18px;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        border-bottom: 1px solid rgb(243, 237, 237);
        display: flex;
        justify-content: space-between;
        padding-right: 30px;
      }
      .content {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        #dailyTradingVolumeBar {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
        #dailyTradingVolumeLine {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
        #dailyTradingVolumePie {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
      }
    }
    .monthlyTradingVolume {
      width: 100%;
      background-color: white;
      margin-top: 30px;
      border-radius: 5px;
      .title {
        width: 100%;
        height: 50px;
        display: flex;
        color: black;
        font-weight: 500;
        font-size: 18px;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        border-bottom: 1px solid rgb(243, 237, 237);
        display: flex;
        justify-content: space-between;
        padding-right: 30px;
      }
      .content {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        #monthlyTradingVolumeBar {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
        #monthlyTradingVolumeLine {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
        #monthlyTradingVolumePie {
          width: 28%;
          height: 100%;
          font-size: 5px;
        }
      }
    }
  }
}
</style>