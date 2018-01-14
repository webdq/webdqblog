var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var markdown = require('markdown').markdown;
var async = require('async');

/*所有文章*/
router.get('/list',function(req, res) {
  var pageNum = req.query.pageNum&&req.query.pageNum>0 ? parseInt(req.query.pageNum) : 1;
  var pageSize = req.query.pageSize&&req.query.pageSize >0 ? parseInt(req.query.pageSize): 10;
  var query = {};
  var keyword = req.query.keyword ? req.query.keyword : '';
  if(keyword){
    query['title'] = new RegExp(keyword,"i");
  }
  Model('Article').count(query,function(err,count){
    Model('Article').find(query)
                    .sort({createAt:-1})
                    .skip((pageNum-1)*pageSize)
                    .limit(pageSize)
                    .populate({path:'user', select: 'username avatar'})
                    .exec(function(err,articles){
                      res.render('article/article_list',{
                        title: 'webdqblog--所有文章',
                        pageNum: pageNum,
                        pageSize: pageSize,
                        keyword: keyword,
                        totalPage: Math.ceil(count/pageSize),
                        count: count,
                        articles: articles
                      });
                    });
    });
});

/*文章详情*/
router.get('/detail/:_id', function (req, res, next) {
  async.parallel([function(callback){
    Model('Article').findById(req.params._id)
                    .populate({path:'user', select: 'username avatar'})
                    .populate({path:'comments.user', select: 'username avatar'})
                    .exec(function (err, article) {
                      if(article){
                        article.comments = article.comments.reverse();
                        article.content = markdown.toHTML(article.content);
                      }
                      callback(err, article);
                    });
  },function(callback){
    Model('Article').update({_id: req.params._id},{$inc: {pv: 1}}, callback);
  }],function(err,result) {
    console.log('结果1'+err)
    console.log('结果2'+result[0])

    if (err) {
      req.flash('error', err);
      return next(err);
    }
    if (result[0]) {
      res.render('article/article_detail', {title: 'webdqblog--文章详情', article: result[0]});
    }else{
      next();
    }
  });
});

/*评论*/
router.post('/comment', middleware.checkLogin, function (req, res) {
  var user = req.session.user;
  Model('Article').update({_id:req.body.articleId}, {$push:{comments:{user:user._id,content:req.body.content}}}, function(err,result){
    if(err){
      req.flash('error','评论失败!');
      //return res.render('error',{message:'评论失败',error:err});
    }else {
      req.flash('success', '评论成功!');
    }
    res.redirect('back');
  });
});

module.exports = router;