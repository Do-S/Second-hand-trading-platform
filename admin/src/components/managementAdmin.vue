<template>
  <div id="managementAdmin">
    <div class="admin">
      <div class="produceCode">
        <Button type="success" @click="modal=true">生成授权码</Button>
        <Modal v-model="modal" title="申请验证码" @on-ok="ok">
          <p style="margin-bottom:20px">请输入密码：</p>
          <Input v-model="password" placeholder="请输入密码..." style="width: 300px" />
        </Modal>
      </div>
      <div class="unused">
        <div class="title">
          <span>未使用</span>
        </div>
        <div class="content">
          <div class="tTitle">
            <div class="tCode tSame">
              <span>授权码</span>
            </div>
            <div class="tDate tSame">
              <span>申请时间</span>
            </div>
            <div class="tOperate tSame">
              <span>操作</span>
            </div>
          </div>
          <div class="cBody">
            <div class="cList" v-for="(item,index) in adminList" :key="index" v-if="item.status==0">
              <div class="cCode cSame">
                <span v-if="item.__v!=0">{{item.adminCode}}</span>
                <span v-else>*************************</span>
                <Icon
                  @click="()=>{adminList[index].__v = 0}"
                  v-if="item.__v!=0"
                  type="ios-eye-outline"
                />
                <Icon @click="()=>{adminList[index].__v = 1}" v-else type="ios-eye-off-outline" />
              </div>
              <div class="cDate cSame">
                <span>{{item.date|dateformat()}}</span>
              </div>
              <div class="cOperate cSame">
                <Button
                  type="error"
                  size="small"
                  @click="()=>{unUsedCode=item._id;modal_two=true}"
                >删除</Button>
              </div>
              <Modal v-model="modal_two" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                  <Icon type="ios-information-circle"></Icon>
                  <span>删除确认</span>
                </p>
                <div style="text-align:center">
                  <p>你确定要删除该授权码吗?</p>
                </div>
                <div slot="footer">
                  <Button type="error" size="large" long @click="delAdminCode()">违规</Button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div class="used">
        <div class="title">
          <span>已使用</span>
        </div>
        <div class="content">
          <div class="tTitle">
            <div class="tCode tSame">
              <span>授权码</span>
            </div>
            <div class="tDate tSame">
              <span>申请时间</span>
            </div>
            <div class="tUser tSame">
              <span>注册人</span>
            </div>
            <div class="tUserDate tSame">
              <span>注册时间</span>
            </div>
            <div class="tOperate tSame">
              <span>操作</span>
            </div>
          </div>
          <div class="cBody">
            <div class="cList" v-for="(item,index) in adminList" v-if="item.status==1">
              <div class="cCode cSame">
                <span v-if="item.__v!=0">{{item.adminCode}}</span>
                <span v-else>*************************</span>
                <Icon
                  @click="()=>{adminList[index].__v = 0}"
                  v-if="item.__v!=0"
                  type="ios-eye-outline"
                />
                <Icon @click="()=>{adminList[index].__v = 1}" v-else type="ios-eye-off-outline" />
              </div>
              <div class="cDate cSame">
                <span>{{item.date|dateformat()}}</span>
              </div>
              <div class="cUser cSame">
                <span>{{item.admin[0].user}}</span>
              </div>
              <div class="cUserDate cSame">
                <span>{{item.userDate|dateformat()}}</span>
              </div>
              <div class="cOperate cSame">
                <i-switch
                  style="margin-right:20px"
                  :before-change="changeAdminStatus"
                  true-color="#13ce66"
                  false-color="#ff4949"
                  :true-value="0"
                  :false-value="2"
                  :disabled="item.admin[0].status==1"
                  @on-change="change(item.admin[0].userId,item.admin[0].status)"
                  v-model="item.admin[0].status"
                />
                <Button
                  v-if="item.admin[0].status!==1"
                  type="error"
                  size="small"
                  @click="()=>{modal_one=true,usedCode=item._id,usedUserId=item.admin[0].userId}"
                >删除</Button>
                <Modal v-model="modal_one" title="删除授权码" @on-ok="ok_one">
                  <p style="margin-bottom:20px">请输入密码：</p>
                  <Input v-model="password" placeholder="请输入密码..." style="width: 300px" />
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "managementAdmin",
  data() {
    return {
      adminList: [],
      codeDisplay: false,
      modal: false,
      modal_one: false,
      modal_two: false,
      password: "",
      unUsedCode: "",
      usedCode: "",
      usedUserId: ""
    };
  },
  created() {
    this.getAdminCode();
  },
  methods: {
    async getAdminCode() {
      try {
        let { data } = await this.$http.get("/api/admin/getAdminCode", {
          params: {
            userId: this.$getUser.userId
          }
        });
        this.adminList = data;
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    ok() {
      if (this.password == "") {
        this.$Message.error("请输入密码");
      } else {
        this.applyAdminCode();
      }
    },
    ok_one() {
      if (this.password == "") {
        this.$Message.error("请输入密码");
      } else {
        this.delAdminUsedCode();
      }
    },
    async applyAdminCode() {
      try {
        let key = await this.$getKey();
        let { data } = await this.$http.get("/api/admin/applyAdminCode", {
          params: {
            userId: this.$getUser.userId,
            password: this.$getSecret(this.password, key)
          }
        });
        this.password = "";
        this.getAdminCode();
        if (data.status == 200) {
          this.$Message.success(data.text);
        } else {
          this.$Message.error(data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async delAdminCode() {
      try {
        let { data } = await this.$http.get("/api/admin/delAdminCode", {
          params: {
            codeId: this.unUsedCode
          }
        });
        this.unUsedCode = "";
        this.getAdminCode();
        this.modal_two = false;
        if (data.status == 200) {
          this.$Message.success(data.text);
        } else {
          this.$Message.error(data.text);
        }
        this.getAdminCode();
      } catch (error) {
        console.error(error);
      }
    },
    async delAdminUsedCode() {
      try {
        let key = await this.$getKey();
        let { data } = await this.$http.get("/api/admin/delAdminUsedCode", {
          params: {
            codeId: this.usedCode,
            userId: this.usedUserId,
            adminId: this.$getUser.userId,
            password: this.$getSecret(this.password, key)
          }
        });
        this.password = "";
        this.usedCode = "";
        this.usedUserId = "";
        this.getAdminCode();
        if (data.status == 200) {
          this.$Message.success(data.text);
        } else {
          this.$Message.error(data.text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    changeAdminStatus() {
      return new Promise(resolve => {
        this.$Modal.confirm({
          title: "请输入密码",
          render: h => {
            return h("Input", {
              props: {
                value: this.password,
                autofocus: true,
                placeholder: "请输入密码..."
              },
              on: {
                input: val => {
                  this.password = val;
                }
              }
            });
          },
          onOk: () => {
            if (this.password == "") {
              this.$Message.error("请输入密码");
            } else {
              resolve();
            }
          }
        });
      });
    },
    async change(userId, status) {
      try {
        let key = await this.$getKey();
        let { data } = await this.$http.get("/api/admin/changeAdminStatus", {
          params: {
            userId: userId,
            status: status,
            adminId: this.$getUser.userId,
            password: this.$getSecret(this.password, key)
          }
        });
        this.password = "";
        this.getAdminCode();
        if (data.status == 200) {
          this.$Message.success(data.text);
        } else {
          this.$Message.error(data.text);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#managementAdmin {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .admin {
    width: 80%;
    background-color: white;
    border-radius: 5px;
    margin-top: 30px;
    margin-bottom: 50px;
    display: flex;
    align-content: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    .produceCode {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgb(226, 226, 226);
    }
    .unused {
      width: 100%;
      margin-bottom: 50px;
      .title {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 16px;
        padding-left: 20px;
        color: #3a404e;
        font-weight: 600;
      }
      .content {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        .tTitle {
          width: 100%;
          display: flex;
          .tSame {
            line-height: 40px;
            color: #515a6e;
            font-size: 14px;
            background-color: #f8f8f9;
          }

          .tCode {
            width: 40%;
            padding-left: 15px;
            border: 1px solid #e8eaec;
          }
          .tDate {
            width: 40%;
            padding-left: 15px;
            border-top: 1px solid #e8eaec;
            border-bottom: 1px solid #e8eaec;
          }
          .tOperate {
            width: 20%;
            text-align: center;
            border: 1px solid #e8eaec;
          }
        }
        .cBody {
          width: 100%;
          .cList {
            width: 100%;
            display: flex;
            .cSame {
              line-height: 40px;
              color: #515a6e;
              font-size: 14px;
            }

            .cCode {
              width: 40%;
              padding-left: 15px;
              padding-right: 15px;
              border: 1px solid #e8eaec;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .cDate {
              width: 40%;
              padding-left: 15px;
              border-top: 1px solid #e8eaec;
              border-bottom: 1px solid #e8eaec;
            }
            .cOperate {
              width: 20%;
              text-align: center;
              border: 1px solid #e8eaec;
            }
          }
        }
      }
    }
    .used {
      width: 100%;
      margin-bottom: 50px;
      .title {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 16px;
        padding-left: 20px;
        color: #3a404e;
        font-weight: 600;
      }
      .content {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        .tTitle {
          width: 100%;
          display: flex;
          .tSame {
            line-height: 40px;
            color: #515a6e;
            font-size: 14px;
            background-color: #f8f8f9;
          }

          .tCode {
            width: 30%;
            padding-left: 15px;
            border: 1px solid #e8eaec;
          }
          .tDate {
            width: 18%;
            padding-left: 15px;
            border-top: 1px solid #e8eaec;
            border-bottom: 1px solid #e8eaec;
          }
          .tUser {
            width: 18%;
            padding-left: 15px;
            border: 1px solid #e8eaec;
          }
          .tUserDate {
            width: 18%;
            padding-left: 15px;
            border-top: 1px solid #e8eaec;
            border-bottom: 1px solid #e8eaec;
          }
          .tOperate {
            width: 16%;
            text-align: center;
            border: 1px solid #e8eaec;
          }
        }
        .cBody {
          width: 100%;
          .cList {
            width: 100%;
            display: flex;
            .cSame {
              line-height: 40px;
              color: #515a6e;
              font-size: 14px;
            }

            .cCode {
              width: 30%;
              padding-left: 15px;
              padding-right: 15px;
              border: 1px solid #e8eaec;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .cDate {
              width: 18%;
              padding-left: 15px;
              border-top: 1px solid #e8eaec;
              border-bottom: 1px solid #e8eaec;
            }
            .cUser {
              width: 18%;
              padding-left: 15px;
              border: 1px solid #e8eaec;
            }
            .cUserDate {
              width: 18%;
              padding-left: 15px;
              border-top: 1px solid #e8eaec;
              border-bottom: 1px solid #e8eaec;
            }
            .cOperate {
              width: 16%;
              text-align: center;
              border: 1px solid #e8eaec;
            }
          }
        }
      }
    }
  }
}
</style>