function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var userid = getCookie("cookieName");

fetch(`http://localhost:3000/friends/getRequests/${userid}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var requestList = data.map(
      (request) =>
        `<section class="requestRow">
            <h2>${request.username}</h2>
            <form action="http://localhost:3000/friends/accept/${request.friendsid}">
                <button type="submit">Accept</button>
            </form>
            <form action="http://localhost:3000/friends/decline/${request.friendsid}">
                <button id="declineButton" type="submit">Decline</button>
            </form>
        </section>`
    );
    requestList.splice(0, 0, "<h1>Friend requests</h1>");
    var friendRequests = document.getElementById("requestsContainer");
    friendRequests.innerHTML = requestList.join("");
  });
