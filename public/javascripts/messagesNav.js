function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var userid = getCookie("cookieName");
var messageSent = getCookie("messageSent");

class messagesNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch(`http://localhost:3000/messages/get/${userid}`)
      .then((response) => response.json())
      .then((data) => {
        var messageList = data.map(
          (message) =>
            `
            <form class="messageRow" action="http://localhost:3000/messages/get/conversation/${message.senderid}" >
              <button class="messageButton" type="submit">
                <div class="username">${message.username}</div>
                <div class="lastText">${message.message}</div>
              </button>
            </form>
        `
        );

        messageList.splice(
          0,
          0,
          `
          <style>
            messages-nav {
              width: 30%;
              overflow-y: scroll;
            }

            form#createMessage {
              height: 80px;
            }

            form#createMessage > button {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 1.3em;
            }

            form#createMessage > button > div {
              padding-left: 3%;
            }

            form.messageRow {
              height: 100px;
            }

            form.messageRow > button {
              width: 100%;
              height: 100%;
              font-size: 1.5em;
            }

            div.username {
              font-weight: bold;
              font-size: 1.2em;
              height: 25%;
            }

            div.lastText {
              font-size: 0.75em;
              overflow-y: auto;
              height: 75%;
              padding-top: 10px;
            }

          </style>
          <form id="createMessage" action="http://localhost:3000/messages/get/create">
            <button type="submit">
              <img 
                  src="../images/sendMessageIcon.png"
                  alt=""
                />
              <div>Create message</div>
            </button>
          </form>
        `
        );

        this.innerHTML = messageList.join("");

        if (messageSent) {
          var messageSentModal = document.getElementById("messageSentModal");
          messageSentModal.innerHTML = "<div>Message Sent</div>";
          setTimeout(() => {
            messageSentModal.style.display = "none";
          }, 3000);
        }
      });
  }
}

customElements.define("messages-nav", messagesNav);
