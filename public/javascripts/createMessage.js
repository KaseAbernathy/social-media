function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var senderid = getCookie("cookieName");

var createForm = document.getElementById("form");
createForm.innerHTML = `
    <form action="http://localhost:3000/messages/create/${senderid}" method="post">
      <div id="username">
        <input id="retrieverid" name="retrieverid" type="text" placeholder="user name of recipient"/>
      </div>

      <div id="messagediv">
        <label for="message"></label>
        <textarea id="message" name="message" placeholder="type message in here!"></textarea>
      </div>

      <button type="submit">Send Message</button>
    </form>`;
