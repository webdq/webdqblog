exports.checkLogin = function(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '请先登录!');
    return res.redirect('/users/login');
  }
  next();
}

exports.checkNotLogin = function(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!');
    return res.redirect('back');
  }
  next();
}