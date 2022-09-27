function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var senderid = getCookie("cookieName");

var form = document.getElementById("formContainer");
form.innerHTML = `
    <h1>Add Friend</h1>
    <form action="http://localhost:3000/friends/api/addFriend/${senderid}" method="post">
        <input name="retrieverName" id="retrieverName" type="text" placeholder="user name of recipient" />
        <button type="submit">Send Request</button>
    </form>`;
