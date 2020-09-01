// connecting with sockets.
const socket = io('http://localhost:3000');
// const socket = io('http://chatApi.gotoonlinetest.tk');  // link
 
const authToken = "authTokenForUser2"
const userId = "socket20202"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'socket20201',//putting user2's id here 
  receiverName: "User1",
  senderId: userId,
  senderName: "User2"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });

  socket.on('online-user-list',(data)=>{
    console.log("online users list updated");
    console.log(data);
  })

  socket.on("typing", (name) => {

    console.log(name+" is typing")
    
    
  });

  
  
  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","User2")

  })
 
  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

 

}// end chat socket function

chatSocket();
