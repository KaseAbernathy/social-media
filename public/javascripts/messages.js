function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var senderid = getCookie("senderid");
var retrieverid = getCookie("cookieName");
var messageSent = getCookie("messageSent");

/////////////////////////////////////////////
/* for send message form*/
var reverseSenderid = getCookie("cookieName");
var reverseRetrieverid = getCookie("senderid");
/////////////////////////////////////////////

var modal = document.getElementById("popUpModal");
var sendMessage = document.getElementById("sendMessage");

fetch(
  `http://localhost:3000/messages/get/conversation/${retrieverid}/${senderid}`
)
  .then((response) => response.json())
  .then((data) => {
    var conversationList = data.map(
      (message) =>
        `<li class="messageRow ${
          retrieverid == message.senderid ? "left" : "right"
        }">
            <h2>${message.username}</h2>
            <p>${message.message}</p>
        </li>
        `
    );

    var conversation = document.getElementById("conversation");
    conversation.innerHTML = conversationList.join("");

    modal.addEventListener("click", close);

    if (messageSent) {
      modal.style.display = "block";
      modal.innerHTML = "<div>Message Sent</div><button>okay</button>";
      setTimeout(() => {
        modal.style.display = "none";
      }, 3000);
    }

    function close() {
      document.getElementById("popUpModal").style.display = "none";
    }
  });

if (!senderid) {
  sendMessage.style.display = "none";
}

sendMessage.innerHTML = `
    <form action="http://localhost:3000/messages/sendMessage/${reverseSenderid}/${reverseRetrieverid}" method="post">
      <input name="message" placeholder="send Message"/>
      <button type="submit">Send</button>
    </form>
  `;
