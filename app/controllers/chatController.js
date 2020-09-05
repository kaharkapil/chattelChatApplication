
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('./../libs/responseLib')
const check = require('../libs/checkLib');
const { reduceRight, result } = require('lodash');

//
const ChatModel = mongoose.model('Chat')
const UserModel=mongoose.model('User')



let getUsersChat = (req, res) => {
  // function to validate params.
  let validateParams = () => {
    return new Promise((resolve, reject) => {
      if (check.isEmpty(req.query.senderId) || check.isEmpty(req.query.receiverId)) {
        let apiResponse = response.generate(true, 'parameters missing.', 403, null)
        reject(apiResponse)
      } else {
        resolve()
      }
    })
  } // end of the validateParams function.

  // function to get chats.
  let findChats = () => {
    return new Promise((resolve, reject) => {

      // creating find query.
      let findQuery = {
        $or: [
          {
            $and: [{ senderId: req.query.senderId }, { receiverId: req.query.receiverId }]
          },
          {
            $and: [{ receiverId: req.query.senderId }, { senderId: req.query.receiverId }]
          }
        ]
      }
      console.log("Query"+findQuery)

      ChatModel.find(findQuery)
        .select('-_id -__v -chatRoom')
        .sort('-createdOn')
        .skip(parseInt(req.query.skip) || 0)
        .lean()
        .limit(10)
        .exec((err, result) => {
          if (err) {
            console.log(err)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            reject(apiResponse)
          } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'No Chat Found', 404, null)
            reject(apiResponse)
          } else {
            console.log('chat found and listed.')

            // reversing array.
            let reverseResult = result.reverse()

            resolve(result)
          }
        })
    })
  } // end of the findChats function.

  // making promise call.
  validateParams()
    .then(findChats)
    .then((result) => {
      let apiResponse = response.generate(false, 'All Chats Listed', 200, result)
      res.send(apiResponse)
    })
    .catch((error) => {
      res.send(error)
    })
} // end of the getUsersChat function.

//count unseen chats
let findUnseenChat=(req,res)=>{
  if(check.isEmpty(req.query.userId) || check.isEmpty(req.query.senderId)  ){
    let apiResponse=response.generate(true,"Parameter Missing",403,null)
    res.send(apiResponse);
  }else{
    let findQuery={
      $and:[{receiverId:req.query.userId},{senderId:req.query.senderId},{seen:false}]
    }
    ChatModel.find(findQuery)
    .select('-_id -__v')
    .sort('-createdOn')
    .lean()
    .limit(10)
    .exec((err, result) => {
      if (err) {
        console.log(err)
        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(result)) {
        let apiResponse = response.generate(true, 'No Chat Found', 404, null)
        res.send(apiResponse)
      } else {
        console.log('chat found and listed.')

        // reversing array.
        let reverseResult = result.reverse()
        let apiResponse=response.generate(false,"Unseen chat found and listed",200,result)
        res.send(apiResponse)
      }
    })
    
  }
}


// function to find all users
let getAllUsers=(req,res)=>{
  UserModel.find()
  .select('-_id -__v')
  .lean()
  .exec((err,result)=>{
    if(err){
      let apiResponse=response.generate(true,"some error occured",500,null);
      res.send(apiResponse);
    }else if(check.isEmpty(result)){
      let apiResponse=response.generate(true,"no users found",404,null);
      res.send(apiResponse);
    }else{
      let apiResponse=response.generate(false,"Users found and listed ",200,result);
      res.send(apiResponse);
    }
    })
  
}


let getUser=(req,res)=>{
  UserModel.findOne({authToken:req.params.authToken})
  .select('-_id -__v')
  .lean()
  .exec((err,result)=>{
    if(err){
      let apiResponse=response.generate(true,"some error occured",500,null);
      res.send(apiResponse);
    }else if(check.isEmpty(result)){
      let apiResponse=response.generate(true,"no user found",404,null);
      res.send(apiResponse);
    }else{
      let apiResponse=response.generate(false,"Users found",200,result);
      res.send(apiResponse);
    }
    })
  
}



module.exports = {
  getUsersChat: getUsersChat,
  findUnseenChat:findUnseenChat,
  getAllUsers:getAllUsers,
  getUser:getUser

 
}
