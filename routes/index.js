var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  Model('Article').find({},null,{sort:{createAt:-1},limit:5})
                  .populate({path:'user', select: 'username avatar'})
                  .exec(function(err,articles){
                    res.render('index', {title: 'webdqblog--首页',articles:articles});
                  });
});

module.exports = router;