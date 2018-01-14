var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var settings = require('../settings');

mongoose.connect(settings.url)
        .then(function(){
            console.log("数据库连接成功");
        },function(err){
            console.log("数据库连接失败"+err);
        });

var UserSchema = new Schema({
    username: {type:String,required:true},
    password: {type:String,required:true},
    email: {type:String,required:true},
    avatar: {type:String,required:true}
});

var ArticleSchema = new Schema({
    user: {type:ObjectId,ref:'User'},
    title: {type:String,required:true},
    des: {type:String},
    content: {type:String},
    pv: {type:Number,default:0},
    comments: [{
        user:{type:ObjectId,ref:'User'},
        content:String,
        createAt:{type: Date, default: Date.now()}
    }],
    createAt: {type: Date, default: Date.now()}
});

mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);

global.Model = function (modelName) {
  return mongoose.model(modelName);
}