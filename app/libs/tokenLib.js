
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const secretKey = 'someVeryRandomStringThatNobodyCanGuess';

const check=require('./checkLib')

//adding model queries for testing purpose
const UserModel=mongoose.model('User')




let generateToken = (data, cb) => {

  try {
    let claims = {
      jwtid: shortid.generate(),
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      sub: 'authToken',
      iss: 'chatApplication',
      data: data
    }
    let tokenDetails = {
      token: jwt.sign(claims, secretKey),
      tokenSecret : secretKey
    }
    cb(null, tokenDetails)
  } catch (err) {
    console.log(err)
    cb(err, null)
  }
}// end generate token 

let verifyClaim = (token,secretKey,cb) => {
  // verify a token symmetric
  jwt.verify(token, secretKey, function (err, decoded) {
    if(err){
      console.log("error while verify token");
      console.log(err);
      cb(err,null)
    }
    else{
      console.log("user verified");
      console.log(decoded);
      cb(null,decoded);
    }  
 
 
  });


}// end verify claim 

let verifyClaimWithoutSecret = (token,cb) => {
  // verify a token symmetric
  jwt.verify(token, secretKey, function (err, decoded) {
    if(err){
      console.log("error while verify token");
      console.log(err);
      cb(err,null)
    }
    else{
      console.log("user verified");
      cb (null,decoded)
    }  
 
 
  });


}// end verify claim 


//dummy function to verify claim 
let dummy_VerifyClaim = (token,cb) => {
  UserModel.findOne({authToken: token})
  .select(' -__v -_id')
  .lean()
  .exec((err, result) => {
    if (err) {
      console.log("error while verify token");
      console.log(err);
      cb(err, null)
    }else if(check.isEmpty(result)){
      console.log("No User found")
      cb('empty',null)
    }
    else {
      cb(null, result)
    }


  });
 



}// end verify claim 




module.exports = {
  generateToken: generateToken,
  verifyToken :verifyClaim,
  verifyClaimWithoutSecret: verifyClaimWithoutSecret,
  dummy_VerifyClaim:dummy_VerifyClaim
}
