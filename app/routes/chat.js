const express = require('express');
// const router = express.Router();
const chatController = require("./../../app/controllers/chatController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/chat`;
  app.get(baseUrl,(req,res)=>{
    res.send("Hello i am active")
  })
  app.get(`${baseUrl}/getChat`, chatController.getUsersChat);

  
}
