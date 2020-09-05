// connecting with sockets.
 const socket = io('http://localhost:3000');
//const socket = io('http://chatApi.gotoonlinetest.tk'); // link

const authToken = "authTokenForUser1"
const userId = "socket20201"

let chatMessage = {
  createdOn:Date.now(),
  receiverId: 'socket20202',//putting user2's id here 
  receiverName: "User2",
  senderId: userId,
  senderName: "User1"
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

  socket.on('typing', (name) => {

    console.log(name+" is typing");
    
    
  });
  let data={
    userId:userId,
    senderId:'socket20202'
  }
  socket.emit('mark-chat-as-seen',data);

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","User1")

  })
 
  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    
    socket.emit("chat-msg",chatMessage)

  })

 

}// end chat socket function

chatSocket();
