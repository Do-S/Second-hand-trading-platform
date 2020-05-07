<template>
  <div id="managementAdmin">
    <div class="admin">
      <div class="produceCode">
        <Button type="success" @click="modal=true">生成授权码</Button>
        <Drawer title="申请授权码" v-model="modal" width="350">
          <p style="margin-bottom:20px">请输入密码：</p>
          <Input
            type="password"
            prefix="ios-lock-outline"
            v-model="password"
            placeholder="请输入密码..."
            style="width: 300px"
          />
          <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="modal = false">取消</Button>
            <Button type="primary" @click="applyAdminCode">提交</Button>
          </div>
        </Drawer>
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
              <Icon @click="sortUnusedDate=!sortUnusedDate" type="ios-funnel" />
            </div>
            <div class="tOperate tSame">
              <span>操作</span>
            </div>
          </div>
          <div class="cBody">
            <div class="cList" v-for="(item,index) in adminUnused" :key="index">
              <div class="cCode cSame">
                <span
                  v-if="item.__v!=0"
                  style="cursor: pointer;"
                  v-clipboard:copy="item.adminCode"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >{{item.adminCode}}</span>
                <span v-else>*************************</span>
                <Icon
                  @click="()=>{adminUnused[index].__v = 0}"
                  v-if="item.__v!=0"
                  type="ios-eye-outline"
                />
                <Icon @click="()=>{adminUnused[index].__v = 1}" v-else type="ios-eye-off-outline" />
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
                  <Button type="error" size="large" long @click="delAdminCode()">删除</Button>
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
              <Icon @click="()=>{sortRegDate=false;sortUsedDate=!sortUsedDate}" type="ios-funnel" />
            </div>
            <div class="tUser tSame">
              <span>注册人</span>
            </div>
            <div class="tUserDate tSame">
              <span>注册时间</span>
              <Icon @click="()=>{sortRegDate=true;sortUsedDate=!sortUsedDate}" type="ios-funnel" />
            </div>
            <div class="tOperate tSame">
              <span>操作</span>
            </div>
          </div>
          <div class="cBody">
            <div class="cList" v-for="(item,index) in adminUsed">
              <div class="cCode cSame">
                <span
                  style="cursor: pointer;"
                  v-if="item.__v!=0"
                  v-clipboard:copy="item.adminCode"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >{{item.adminCode}}</span>
                <span v-else>*************************</span>
                <Icon
                  @click="()=>{adminUsed[index].__v = 0}"
                  v-if="item.__v!=0"
                  type="ios-eye-outline"
                />
                <Icon @click="()=>{adminUsed[index].__v = 1}" v-else type="ios-eye-off-outline" />
              </div>
              <div class="cDate cSame">
                <span>{{item.date|dateformat()}}</span>
              </div>
              <div class="cUser cSame">
                <span>{{item.admin[0].user}}</span>
              </div>
              <div class="cUserDate cSame">
                <span>{{item.admin[0].date|dateformat()}}</span>
              </div>
              <div class="cOperate cSame">
                <i-switch v-if="item.admin[0].status==1" style="margin-right:20px" disabled />
                <i-switch
                  v-else
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
                  <Input
                    type="password"
                    prefix="ios-lock-outline"
                    v-model="password"
                    placeholder="请输入密码..."
                    style="width: 300px"
                  />
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
      usedUserId: "",
      sortRegDate: true,
      sortUsedDate: false,
      sortUnusedDate: false
    };
  },
  created() {
    this.getAdminCode();
  },
  computed: {
    adminUsed() {
      let _this = this;
      return this.changeUsedDate(
        _this.adminList.filter(function(item) {
          return item.status == 1;
        }),
        "date"
      );
    },
    adminUnused() {
      return this.changeUnusedDate(
        this.adminList.filter(function(item) {
          return item.status == 0;
        }),
        "date"
      );
    }
  },
  methods: {
    async getAdminCode() {
      try {
        let { data } = await this.$http.get("/api/admin/getAdminCode", {
          params: {
            adminId: this.$getUser.userId
          }
        });
        this.$logout(data.status, data.text);
        this.adminList = data;
      } catch (error) {
        console.error(error);
      }
    },
    changeUsedDate(array, key) {
      let _this = this;
      return array.sort(function(a, b) {
        if (_this.sortRegDate) {
          var x = a.admin[0][key];
          var y = b.admin[0][key];
        } else {
          var x = a[key];
          var y = b[key];
        }
        if (_this.sortUsedDate) {
          return x < y ? -1 : x > y ? 1 : 0;
        }
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    changeUnusedDate(array, key) {
      let _this = this;
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        if (_this.sortUnusedDate) {
          return x < y ? -1 : x > y ? 1 : 0;
        }
        return x > y ? -1 : x < y ? 1 : 0;
      });
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
        if (this.password == "") {
          this.$Message.error("请输入密码");
          return;
        }
        this.modal = false;
        let key = await this.$getKey();
        let { data } = await this.$http.get("/api/admin/applyAdminCode", {
          params: {
            adminId: this.$getUser.userId,
            password: this.$getSecret(this.password, key)
          }
        });
        this.password = "";
        this.getAdminCode();
        this.$logout(data.status, data.text);
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
            codeId: this.unUsedCode,
            adminId: this.$getUser.userId
          }
        });
        this.unUsedCode = "";
        this.getAdminCode();
        this.modal_two = false;
        this.$logout(data.status, data.text);
        if (data.status == 200) {
          this.$Message.success(data.text);
        } else {
          this.$Message.error(data.text);
        }
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
        this.$logout(data.status, data.text);
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
                type: "password",
                prefix: "ios-lock-outline",
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
        this.$logout(data.status, data.text);
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
    onCopy() {
      this.$Message.success("复制成功");
    },
    onError() {
      this.$Message.error("复制失败");
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
              height: 40px;
              color: #515a6e;
              font-size: 14px;
              display: flex;
              align-items: center;
            }

            .cCode {
              width: 40%;
              padding-left: 15px;
              padding-right: 15px;
              border: 1px solid #e8eaec;
              justify-content: space-between;
            }
            .cDate {
              width: 40%;
              padding-left: 15px;
              border-top: 1px solid #e8eaec;
              border-bottom: 1px solid #e8eaec;
            }
            .cOperate {
              width: 20%;
              justify-content: center;
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
              height: 40px;
              color: #515a6e;
              font-size: 14px;
              display: flex;
              align-items: center;
            }

            .cCode {
              width: 30%;
              padding-left: 15px;
              padding-right: 15px;
              border: 1px solid #e8eaec;
              justify-content: space-between;
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
              justify-content: center;
              border: 1px solid #e8eaec;
            }
          }
        }
      }
    }
  }
}
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 15px 16px;
  text-align: right;
  background: #fff;
}
</style>