<template>
  <div id="homePage">
    <div class="head">
      <span></span>
      <span @click="logout()">注销登录</span>
    </div>
    <div class="body">
      <div class="bodyHead">
        <span>欢迎你，{{$getUser.userId}}</span>
      </div>
      <div class="bodyContent">
        <div class="poetry">
          <div class="everyPoetry">
            <Card style="width:100%">
              <p>每日诗词</p>
              <p>{{poetryList.content}}</p>
              <Tag v-for="(item,index) in poetryList.matchTags" color="green">{{item}}</Tag>
              <div class="changePoetry">
                <span>换一首</span>
                <Icon @click="getPoetry" size="22" type="ios-refresh" />
              </div>
            </Card>
          </div>
          <div class="weather">
            <Card style="width:100%">
              <div class="citySelect">
                <Select v-model="province" style="width:150px">
                  <Option
                    v-for="(item,index) in cityList"
                    :value="index"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
                <Select
                  v-model="cityCode"
                  style="width:200px;margin-left:20px;margin-right:20px;"
                  filterable
                  @on-change="getWeather"
                >
                  <Option
                    v-for="(item,index) in cityList[province].districts"
                    :value="item.adcode"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
                <Icon @click="getWeather(cityCode)" size="22" type="ios-sync" />
              </div>
              <div class="weatherContent">
                <div class="weatherLeft">
                  <p>
                    <img :src="weatherLogo" alt />
                    <span>{{weather.weather}}</span>
                  </p>
                  <p>
                    <span>{{weather.temperature}}</span>
                    <span>℃</span>
                  </p>
                </div>
                <div class="weatherRight">
                  <p>
                    <span>风向：</span>
                    <span>{{weather.winddirection}}</span>
                  </p>
                  <p>
                    <span>风速：</span>
                    <span>{{weather.windpower}}</span>
                  </p>
                  <p>
                    <span>湿度：</span>
                    <span>{{weather.humidity}}%</span>
                  </p>
                  <p>
                    <span>发布时间：</span>
                    <span>{{weather.reporttime}}</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <Divider>诗词原文</Divider>
        <div class="original">
          <div class="originalCenter">
            <p class="originalPoetry">{{poetryList.origin.title}}</p>
            <p class="originalPoetry">
              <span>{{poetryList.origin.dynasty}}</span>
              <span style="padding-left:10px;">{{poetryList.origin.author}}</span>
            </p>
            <p
              class="originalPoetry"
              v-for="(item,index) in poetryList.origin.content"
              :key="index"
            >{{item}}</p>
            <div class="translation">
              <Divider>诗词翻译</Divider>
              <p v-if="poetryList.origin.translate==null">诗文好像没有翻译🙄</p>
              <p v-else v-for="(item,index) in poetryList.origin.translate" :key="index">{{item}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const jinrishici = require("jinrishici");
import amapKey from "../assets/amapKey.json";
export default {
  name: "homePage",
  data() {
    return {
      poetryList: {},
      localCity: {},
      weather: {},
      cityList: [{ districts: [] }],
      province: 0,
      cityCode: 0,
      weatherLogo: ""
    };
  },
  created() {
    this.getPoetry();
    this.getLocation();
  },
  methods: {
    //获取诗词
    getPoetry() {
      jinrishici.load(result => {
        this.poetryList = result.data;
      });
    },

    //登出
    logout() {
      //清空localStorage
      localStorage.clear();
      this.$router.push("/login");
    },

    //获取当前位置信息
    async getLocation() {
      try {
        let data = await this.$http.get(
          "/web/ip?output=json&key=" + amapKey.key
        );
        this.localCity = data.data;
        this.getWeather(this.localCity.adcode);
        this.getProvince();
      } catch (error) {
        console.error(error);
      }
    },

    //获取实时天气信息
    async getWeather(adcode) {
      try {
        let data = await this.$http.get(
          "/web/weather/weatherInfo?city=" + adcode + "&key=" + amapKey.key
        );
        if (data.data.infocode == 10000) {
          this.weather = data.data.lives[0];
          switch (this.weather.weather) {
            case "晴":
              this.weatherLogo = require("@/assets/weather/sunny.png");
              break;
            case "阴":
              this.weatherLogo = require("@/assets/weather/cloudy.png");
              break;
            case "多云":
              this.weatherLogo = require("@/assets/weather/partlyCloudy.png");
              break;
            case "雨":
              this.weatherLogo = require("@/assets/weather/rain.png");
              break;
            case "雪":
              this.weatherLogo = require("@/assets/weather/snow.png");
              break;

            default:
              this.weatherLogo = "";
              break;
          }
        } else {
          this.$Message.error("天气信息获取失败");
          this.weather = "";
        }
      } catch (error) {}
    },

    //获取省份信息
    async getProvince() {
      try {
        let data = await this.$http.get(
          "/web/config/district?subdistrict=2&key=" + amapKey.key
        );
        this.cityList = data.data.districts[0].districts;
        for (let i = 0; i < this.cityList.length; i++) {
          if (this.cityList[i].name == this.localCity.province) {
            this.province = i;
            this.cityCode = this.localCity.adcode;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#homePage {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .head {
    width: 80%;
    height: 45px;
    border-radius: 5px;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding-left: 30px;
    padding-right: 30px;
    span {
      font-size: 15px;
      cursor: pointer;
      color: rgb(84, 138, 253);
      &:hover {
        color: rgb(255, 111, 111);
      }
    }
  }
  .body {
    width: 80%;
    background-color: white;
    margin-top: 50px;
    margin-bottom: 50px;
    border-radius: 5px;
    .bodyHead {
      width: 100%;
      height: 70px;
      padding-left: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid rgb(243, 237, 237);
      span {
        font-size: 23px;
      }
    }
    .bodyContent {
      width: 100%;
      padding-left: 50px;
      padding-right: 50px;
      padding-top: 20px;
      margin-bottom: 50px;
      .poetry {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .everyPoetry {
          width: 45%;
          p:nth-child(1) {
            font-size: 18px;
          }
          p:nth-child(2) {
            padding-top: 20px;
            font-size: 16px;
            color: rgb(110, 111, 119);
          }
          .changePoetry {
            width: 100%;
            display: flex;
            align-items: center;
            padding-top: 20px;
            span {
              margin-right: 10px;
            }
          }
        }
        .weather {
          width: 50%;
          .citySelect {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          .weatherContent {
            width: 100%;
            padding-top: 20px;
            display: flex;
            justify-content: flex-start;
            .weatherLeft {
              width: 50%;
              p:nth-child(1) {
                font-size: 20px;
                margin-bottom: 10px;
              }
              p:nth-child(2) {
                font-size: 25px;
              }
            }
            .weatherRight {
              width: 50%;
              p {
                font-size: 13px;
              }
            }
          }
        }
      }
      .original {
        width: 100%;
        display: flex;
        justify-content: center;
        .originalCenter {
          width: 70%;
          height: 500px;
          background-color: rgb(242, 243, 233);
          border-radius: 5px;
          padding-top: 30px;
          padding-bottom: 30px;
          overflow-x: hidden;
          overflow-y: scroll;
          .originalPoetry {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding-top: 5px;
            padding-left: 10px;
            padding-right: 1opx;
            padding-bottom: 5px;
          }
          .translation {
            width: 100%;
            margin-top: 30px;
            padding-left: 30px;
            padding-right: 30px;
            p {
              padding-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>