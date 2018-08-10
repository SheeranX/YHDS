/**
 * 验证身份证
 */
var isIdCard = function isIdCard(Str) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  var result = Str.match(reg); 
  if (result == null) {
    return false;
  }
  return true;
}

/**
 * 验证手机号
 */
var isPhoneNo = function isPhoneNo(Str) {
  var reg = /^((1[0-9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
  var result = Str.match(reg);
  if (result == null) {
    return false;
  }
  return true;
}

module.exports = {
  isIdCard: isIdCard,
  isPhoneNo: isPhoneNo
}