class verticalNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
            vertical-nav {
                width:20%;
                border: 1px solid rgba(55, 55, 55, 0.1);
                border-left: none;
                overflow-y: hidden;
            }

            section#verticalNav > * {
                padding-top: 20%;
                font-size: 2em;
                padding-left: 19%;
            }
            #createTodo {
                padding: 0% 5% 0% 5%;
                font-size: 0.9em;
                border: none;
                color: rgb(75, 75, 75);
                background-color: rgb(124, 185, 255);
                border-radius: 20px;
                color: rgb(249, 249, 249);
            }

            #createTodo:hover {
                background-color: rgb(99, 147, 202);
                cursor: pointer;
            }

            #createTodo > img {
                filter: invert(100%);
            }

            button.otherButton {
                padding: 0% 5% 0% 5%;
                font-size: 0.9em;
                border: none;
                background-color: rgb(249, 249, 249);
                color: rgb(75, 75, 75);
            }

            button.otherButton:hover {
                background-color: rgb(210, 210, 210);
                cursor: pointer;
                border-radius: 20px;
            }
        </style>
        <section id="verticalNav">
      <form id="name" action="http://localhost:3000/home/create" method="get">
        <button id="createTodo" type="submit">
          <img
            src="../images/pencilIcon.png"
            alt=""
            width="30"
            height="25"
          />
          Create Todo
        </button>
      </form>
      <form id="messages" action="http://localhost:3000/home" method="get">
        <button class="otherButton" type="submit">
          <img
            src="../images/homeIcon.png"
            alt=""
            width="30"
            height="25"
          />Home
        </button>
      </form>
      <form id="messages" action="http://localhost:3000/friends" method="get">
        <button class="otherButton" type="submit">
          <img
            src="../images/friendsIcon.png"
            alt=""
            width="30"
            height="25"
          />Friends
        </button>
      </form>
      <form id="messages" action="http://localhost:3000/messages" method="get">
        <button class="otherButton" type="submit">
          <img
            src="../images/messagesIcon.png"
            alt=""
            width="30"
            height="25"
          />Messages
        </button>
      </form>
    </section>
    `;
  }
}

customElements.define("vertical-nav", verticalNav);
