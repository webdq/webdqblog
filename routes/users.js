var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

function md5(val){
  return require('crypto').createHash('md5').update(val).digest('hex');
}

/*用户注册*/
router.get('/reg', middleware.checkNotLogin, function (req, res) {
  res.render('user/reg', {title: 'webdqblog--注册'});
});

router.post('/reg', function (req, res) {
  var user = req.body;
  if(user.username == ''){
    req.flash('error','用户名不能为空');
    return res.redirect('/users/reg');
  }
  if(user.email == ''){
    req.flash('error','邮箱不能为空');
    return res.redirect('/users/reg');
  }
  if(user.password == ''){
    req.flash('error','密码不能为空');
    return res.redirect('/users/reg');
  }
  if(user.password != user.repassword){
    req.flash('error','两次输入的密码不一致');
    return res.redirect('/users/reg');
  }
  Model('User').findOne({username: user.username},function(err,doc){
    if(doc){
      req.flash('error','用户已注册');
      return res.redirect('/users/reg');
    }

    delete user.repassword;
    user.password = md5(user.password);
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=100";
    new Model('User')(user).save(function(err,doc){
      if(err){
        req.flash('error','注册失败');
        return res.redirect('/users/reg');
      }
      req.session.user = doc;
      res.redirect('/');
    });
  });
});

/*用户登录*/
router.get('/login', middleware.checkNotLogin, function (req, res) {
  res.render('user/login', {title: 'webdqblog--登录'});
});

router.post('/login', function (req, res) {
  var user = req.body;
  if(user.username == ''){
    req.flash('error','用户名不能为空');
    return res.redirect('/users/login');
  }
  if(user.password == ''){
    req.flash('error','密码不能为空');
    return res.redirect('/users/login');
  }
  user.password = md5(user.password);
  Model('User').findOne(user,function(err,doc){
    if(doc){
      req.session.user = doc;
      res.redirect('/');
    }else{
      req.flash('error','用户名或密码错误');
      res.redirect('/users/login');
    }
  });
});

/*用户中心*/
router.get('/center', middleware.checkLogin, function (req, res) {
  res.render('user/center',{title:'webdqblog--用户中心', pageName:'/users/center'});
});

/*我的文章*/
router.get('/article', middleware.checkLogin, function (req, res) {
  var pageNum = req.query.pageNum&&req.query.pageNum>0 ? parseInt(req.query.pageNum) : 1;
  var pageSize = req.query.pageSize&&req.query.pageSize>0 ? parseInt(req.query.pageSize) : 10;
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
                      res.render('user/article',{
                        title:'webdqblog--我的文章',
                        pageName: '/users/article',
                        pageNum:pageNum,
                        pageSize:pageSize,
                        keyword:keyword,
                        totalPage:Math.ceil(count/pageSize),
                        count: count,
                        articles:articles
                      });
                    });
  });
});

/*添加文章*/
router.get('/article/add', middleware.checkLogin, function (req, res) {
  res.render('user/article_add', { title: 'webdqblog--添加文章',pageName:'/users/article' });
});

router.post('/article/add', function (req, res) {
  req.body.user = req.session.user._id;
  new Model('Article')(req.body).save(function(err,doc){
    if(err){
      req.flash('error', '添加文章失败!');
    }else {
      req.flash('success', '添加文章成功!');
    }
    res.redirect('/users/article?pageNum=1&pageSize=10');
  });
});

/*编辑文章*/
router.get('/article/edit/:_id', middleware.checkLogin, function (req, res) {
  Model('Article').findById(req.params._id,function(err,doc){
    res.render('user/article_edit', { title: 'webdqblog--修改文章',pageName:'/users/article',article: doc });
  });
});

router.post('/article/edit', function (req, res) {
  Model('Article').update({_id: req.body.articleId},{$set : {title: req.body.title, des: req.body.des, content: req.body.content}},function(err,doc){
    if(err){
      req.flash('error','修改文章失败');
    }else{
      req.flash('success','修改文章成功');
    }
    res.redirect('/users/article?pageNum=1&pageSize=10');
  });
});

/*删除文章*/
router.post('/article/delete', function (req, res) {
  Model('Article').remove({_id: req.body.articleId},function(err,doc){
    if(err){
      req.flash('error','删除文章失败');
    }else{
      req.flash('success','删除文章成功');
    }
    res.redirect('/users/article?pageNum=1&pageSize=10');
  });
});

/*用户退出*/
router.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;