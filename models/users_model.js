/**
 * Created by kyle on 2016/12/2.
 */

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
  username:{type:String, unique:true},
  password:String,
  email:String,
  color:String,
  hashed_password:String

}); // 如果有第二个参数{collection:'user'} 就会连接到第二个集合上去

mongoose.model('User',userSchema);