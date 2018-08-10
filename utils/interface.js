
const BASE = "https://www.lekou.store";
//const BASE = 'https://www.shyuehussp.com';
const personnel = {
  "getQrCode": "/wxnkInterface/getQrCode.do",
  "getMycard": "/wxnkInterface/getMycard.do",
  "getMyCardBaseInfo": "/wxnkInterface/getMyCardBaseInfo.do",
  "getCardBaseInfo": "/wxnkInterface/getCardBaseInfo.do",
  "getCardDetailInfo": "/wxnkInterface/getCardDetailInfo.do",
  "returnCard": "/wxnkInterface/returnCard.do",
  "giveFriend": "/wxnkInterface/giveFriend.do",
  "getCheckDetail": "/wxnkInterface/getCheckDetail.do",
  "getRecommendDetail": "/wxnkInterface/getRecommendDetail.do",
  "unbindTicketCard": "/wxnkInterface/unbindTicketCard.do",
  "rechargeTicketCard": "/wxnkInterface/rechargeTicketCard.do",
  "queryCardForBind": '/wxnkInterface/getSaleInfoCardByCertificateNo.do',
  "bindCard": '/wxnkInterface/bindTicketCard.do',
  "sendSms": '/wxnkInterface/sendSMS.do',
  "queryCardByNoAndPwd": '/wxnkInterface/findTicketOrderCard.do',
  "queryCardType": '/wxnkInterface/getCertificateType.do',
  "checkRefferrerId": '/wxnkInterface/checkRefferrerId.do',
  "activateTicketOrderCard": '/wxnkInterface/activateTicketOrderCard.do',
  "queryCardStatus": '/wxnkInterface/getCertificateCardInfo.do',
  "uploadPhoto": "/wxnkInterface/uploadPhoto.do",
  "queryCard": "/wxnkInterface/getTicketCard.do",
  "checkVip": "/wxnkInterface/checkRefferrerId.do",
  "saveOrder": "/wxnkInterface/saveTicketOrderCard.do",
  "testPay": "/wxnkInterface/testPay.do",
  "queryCardType": "/wxnkInterface/getCertificateType.do",
  "queryCardStatus": "/wxnkInterface/getCertificateCardInfo.do",
  "uploadPhoto": "/wxnkInterface/uploadPhoto.do",
  "pay": "/wxnkInterface/submitWechatOrder.do",
  "getPhotoIo": "/wxnkInterface/getPhotoIo.do",
  "getTicketCardForRecharge": "/wxnkInterface/getTicketCardForRecharge.do",
  "addVipPhoto": "/wxnkInterface/collectionPhoto.do",
  "getAddVipPhotoInfo": "/wxnkInterface/findOldTicketCard.do",
  "updateCardFingerDataInfo":"/wxnkInterface/updateCardFingerDataInfo.do",
  "findAdvertiseList":"/wxnkInterface/findAdvertiseList.do",
  "getCardDetailInfo":"/wxnkInterface/getCardDetailInfo.do"
};

const loginStatus = {
  "checkLoginStatus": "/wxnkInterface/checkLoginStatus.do",
  "toLogin": '/wxnkInterface/toLogin.do'
}

module.exports = {
  personnel: personnel,
  loginStatus: loginStatus,
  BASE: BASE
}
