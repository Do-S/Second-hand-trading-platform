var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('zh-cn');
var goods = require('../service/goods');
var user = require('../service/user');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: './public/images/goodsImg' });
var uploadAvatar = multer({ dest: './public/images/avatar' });
const NodeRSA = require('node-rsa')
var publicKey = fs.readFileSync(path.join(__dirname, '../public/key/pub.key')).toString();
var privateKey = fs.readFileSync(path.join(__dirname, '../public/key/pri.key')).toString();
var priKey = new NodeRSA(privateKey);
var pubKey = new NodeRSA(publicKey);
priKey.setOptions({ encryptionScheme: 'pkcs1' });
pubKey.setOptions({ encryptionScheme: 'pkcs1' })
// toObject

/* GET home page. */
router.get('/', function (req, res, next) {
  res.type('html');
  res.render('index', { title: 'Express' });
});
router.post('/release', function (req, res, next) {
  let commodityData = req.body.commodityData;
  let userId = req.body.userId;
  goods.setGoods(commodityData, userId, function (goodsId, err) {
    if (err) {
      const data = {
        text: "发布失败",
        status: 404,
      }
      res.json(data);
    }
    const data = {
      text: "发布成功",
      status: 200,
      id: goodsId,
    }
    res.json(data);
  })
});
router.post('/uploadImg', upload.array("file"), function (req, res, next) {
  let imgId = req.body.id;
  for (var i = 0; i < req.files.length; i++) {
    var imgName = req.files[i].originalname;
    var filePath = "/images/goodsImg/" + moment().format('YYYY-MM-DD-HH-mm-ss-') + imgName;
    fs.rename(req.files[i].path, 'public' + filePath, function (err) {
      if (err) {
        throw err;
      }
      goods.setGoodsImg(imgId, 'http://localhost:3000' + filePath, function (err) {
        if (err) {
          const data = {
            text: imgName + "图片上传失败",
            status: 404,
          }
          res.json(data);
        }
        const data = {
          text: imgName + "图片上传成功",
          status: 200,
        }
        res.json(data);
      });
    })
  }
});
router.get('/getGoods', function (req, res, next) {
  let page = req.query.page;
  goods.getGoods(+page, function (result) {
    res.json(result);
  })
});
router.get('/getGoodsCount', function (req, res, next) {
  goods.getGoodsCount(function (count) {
    if (count) {
      res.json({ count: count, });
    } else {
      res.json({ count: 0, });
    }
  })
})
router.get('/getGoodsById', function (req, res, next) {
  let goodsId = req.query.goodsId;
  goods.getGoodsById(goodsId, function (result) {
    if (result) {
      goods.addCount(goodsId, function (err) {
        user.getUserById(result.userId, function (userData) {
          goods.getGoodsImgs(result._id, function (imgData) {
            var list = result.toObject();
            list.user = userData;
            list.img = imgData;
            const data = {
              list: list,
              status: 200
            }
            res.json(data);
          })
        })
      })
    } else {
      const data = {
        text: "该商品已经被商家删除！",
        status: 404
      }
      res.json(data);
    }
  })
})
router.get('/addGoodsCar', function (req, res, next) {
  let goodsId = req.query.goodsId;
  let userId = req.query.userId;
  goods.getGoodsCarById(userId, goodsId, function (result) {
    if (result) {
      const data = {
        text: "你已经添加过购物车了",
        status: 300,
      }
      res.json(data);
    } else {
      goods.addGoodsCar(goodsId, userId, function (err) {
        if (err) {
          const data = {
            text: "添加购物车失败",
            status: 404,
          }
          res.json(data);
        }
        const data = {
          text: "添加购物车成功",
          status: 200,
        }
        res.json(data);
      })
    }
  })
})
router.get('/addGoodsBuy', function (req, res, next) {
  let goodsId = req.query.goodsId;
  let userId = req.query.userId;
  goods.getGoodsById(goodsId, function (goodsData) {
    if (goodsData.status == 0) {
      const data = {
        text: "该商品已经下架了",
        status: 300,
      }
      res.json(data);
    } else {
      goods.addGoodsBuy(goodsId, userId, function (err) {
        if (err) {
          const data = {
            text: "购买失败",
            status: 404,
          }
          res.json(data);
        }
        const data = {
          text: "购买成功",
          status: 200,
        }
        res.json(data);
      })
    }
  })
});
router.get('/addGoodsBuyList', function (req, res, next) {
  let carIdList = req.query.carIdList;
  let userId = req.query.userId;
  let count = 0;
  for (let i = 0; i < carIdList.length; i++) {
    goods.getGoodsBuyById(carIdList[i], function (result) {
      if (result) {
        count++;
      } else {
        goods.addGoodsBuy(carIdList[i], userId, function (err) {
          if (err) {
            console.log(err);
          }
        })
      }
      if (i == carIdList.length - 1) {
        if (count > 0) {
          const data = {
            text: "你付款的商品中包含下架商品，未下架商品你已购买成功！",
            status: 300,
          }
          res.json(data);
        } else {
          const data = {
            text: "购买成功",
            status: 200,
          }
          res.json(data);
        }
      }
    })
  }
});
router.get('/getGoodsCar', function (req, res, next) {
  let userId = req.query.userId;
  goods.getGoodsCar(userId, function (result) {
    var lists = [];
    if (result.length != 0) {
      for (let i = 0; i < result.length; i++) {
        goods.getGoodsById(result[i].goodsId, function (goodsData) {
          goods.getGoodsImg(result[i].goodsId, function (imgData) {
            var list = goodsData.toObject();
            list.url = imgData.url;
            lists.push(list)
            if (lists.length == result.length) {
              res.send(lists);
            }
          })
        })
      }
    } else {
      res.send(lists);
    }
  })
})
router.get('/delCarById', function (req, res, next) {
  let userId = req.query.userId;
  let goodsId = req.query.goodsId;
  goods.delCarById(userId, goodsId, function (err) {
    if (err) {
      const data = {
        text: "删除失败",
        status: 404
      }
      res.json(data);
    }
    const data = {
      text: "删除成功",
      status: 200,
    }
    res.json(data);
  })
})
router.get('/delCarByIdList', function (req, res, next) {
  let userId = req.query.userId;
  let carIdList = req.query.carIdList;
  goods.delCarByIdList(userId, carIdList, function (err) {
    if (err) {
      const data = {
        text: "删除失败",
        status: 404
      }
      res.json(data);
    }
    const data = {
      text: "删除成功",
      status: 200,
    }
    res.json(data);
  })
})
router.get('/getMyRelease', function (req, res, next) {
  let userId = req.query.userId;
  goods.getMyRelease(userId, function (result) {
    res.json(result);
  })
})
router.get('/updateStatus', function (req, res, next) {
  let goodsId = req.query.goodsId;
  let status = req.query.status;
  goods.getGoodsBuyById(goodsId, function (result) {
    if (result) {
      const data = {
        text: "该商品已经有人购买了，不可修改",
        status: 300
      }
      res.json(data);
    } else {
      goods.updateStatus(goodsId, status, function (err) {
        if (err) {
          const data = {
            text: "修改失败",
            status: 404
          }
          res.json(data);
        }
        const data = {
          text: "修改成功",
          status: 200,
        }
        res.json(data);
      })
    }
  })
})
router.post('/editGoods', function (req, res, next) {
  let commodityData = req.body.commodityData;
  let goodsId = req.body.goodsId;
  goods.updateGoods(commodityData, goodsId, function (goodsId, err) {
    if (err) {
      const data = {
        text: "修改失败",
        status: 404,
      }
      res.json(data);
    }
    const data = {
      text: "修改成功",
      status: 200,
    }
    res.json(data);
  })
})
router.get('/delGoodsImg', function (req, res, next) {
  let goodsId = req.query.goodsId;
  goods.delGoodsImg(goodsId, function (err) {
    if (err) {
      const data = {
        text: "删除失败",
        status: 404
      }
      res.json(data);
    }
    const data = {
      text: "删除成功",
      status: 200,
    }
    res.json(data);
  })
})
router.get('/delGoodsById', function (req, res, next) {
  let goodsId = req.query.goodsId;
  goods.getGoodsBuyById(goodsId, function (result) {
    if (result) {
      const data = {
        text: "该商品已经有人购买了，不可删除！",
        status: 300
      }
      res.json(data);
    } else {
      goods.delGoodsById(goodsId, function (err) {
        if (err) {
          const data = {
            text: "删除失败",
            status: 404
          }
          res.json(data);
        }
        const data = {
          text: "删除成功",
          status: 200,
        }
        res.json(data);
      })
    }
  })
})
router.get('/getSuccessSale', function (req, res, next) {
  let userId = req.query.userId;
  goods.getGoodsBuyBySellerId(userId, function (result) {
    res.json(result);
  })
})
router.get('/getPurchaseHistory', function (req, res, next) {
  let userId = req.query.userId;
  goods.getGoodsBuyByUserId(userId, function (result) {
    res.json(result);
  })
})
router.post('/loadAvatar', uploadAvatar.single("file"), function (req, res, next) {
  let userId = req.body.id;
  var imgName = req.file.mimetype.slice(6);
  var filePath = "/images/avatar/" + moment().format('YYYY-MM-DD-HH-mm-ss') + '.' + imgName;
  fs.rename(req.file.path, 'public' + filePath, function (err) {
    if (err) {
      throw err;
    }
    user.updateAvatar(userId, 'http://localhost:3000' + filePath, function (err) {
      if (err) {
        const data = {
          text: "图片上传失败",
          status: 404,
        }
        res.json(data);
      }
      const data = {
        text: "图片上传成功",
        status: 200,
      }
      res.json(data);
    });
  })
})
router.get('/markAllBuy', function (req, res, next) {
  let userId = req.query.userId;
  goods.markAllBuy(userId, function (err) {
    if (err) {
      const data = {
        text: "修改失败",
        status: 404,
      }
      res.json(data);
    }
    const data = {
      text: "修改成功",
      status: 200,
    }
    res.json(data);
  })
})
router.get('/markBuyById', function (req, res, next) {
  let id = req.query.id;
  goods.markBuyById(id, function (err) {
    if (err) {
      const data = {
        text: "修改失败",
        status: 404,
      }
      res.json(data);
    }
    const data = {
      text: "修改成功",
      status: 200,
    }
    res.json(data);
  })
})
router.get('/getMarkBuyCount', function (req, res, next) {
  let userId = req.query.userId;
  goods.getMarkBuyCount(userId, function (result) {
    const data = {
      count: result
    }
    res.json(result);
  })
})
router.get('/addReport', function (req, res, next) {
  let reporter = req.query.reporter;
  let reported = req.query.reported;
  let goodsId = req.query.goodsId;
  let content = req.query.content;
  goods.addReport(reporter, reported, goodsId, content, function (err) {
    if (err) {
      const data = {
        status: 404,
        text: '举报失败'
      }
      res.json(data);
    }
    const data = {
      status: 200,
      text: '举报成功'
    }
    res.json(data);
  })
})
router.get('/getGoodsBySearch', function (req, res, next) {
  let page = req.query.page;
  let goodsSearch = req.query.goodsSearch;
  goods.getGoodsBySearch(+page, goodsSearch, function (result) {
    res.json(result);
  })
})

module.exports = router;
