## 二手交易平台

>假期的一个练手项目

主要是为了学习代码知识，所以产品设计的不是很好（代码可能也不好，需要改进的地方很多😂），以后会多多努力的

>技术栈

```
前端：vue vue-router 
后端：express 
数据库：mongodb 
使用的技术：JWT 非对称加密 echart...
```

>功能

客户端

- 购买和售卖二手商品
- 社区发布帖子

管理端

- 查询并导出订单数据
- 举报审核
- 订单图表 


PS：由于使用到高德天气的接口和邮箱验证，所以需要在`Second-hand-trading-platform\server\public\key`下面添加`amapKey.json`和`mailKey.json`文件

>amapKey.json
```
{
    "key": "此处填写你从高德地图中申请的`web服务`key值"
}
```

>mailKey.json
```
{
    "mail": "此处填写你的QQ邮箱",
    "mailPassword": "此处填写邮箱授权码"
}
```

