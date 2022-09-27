function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var userid = getCookie("cookieName");
var isRequestAcceptedOrDeclined = getCookie("isRequestAcceptedOrDeclined");
var isrequestPending = getCookie("isrequestPending");
var requestSent = getCookie("requestSent");

var modal = document.getElementById("popUpModal");

fetch(`http://localhost:3000/friends/getfriends/${userid}`)
  .then((response) => response.json())
  .then((data) => {
    var friendsList = data.filter(function (friend) {
      if (friend.id == userid) {
        return false;
      }
      return true;
    });

    console.log(friendsList[0].datesincefriends);

    var updatedFriendsList = friendsList.map(
      (friend) =>
        `<form action="http://localhost:3000/friends/seefriendstodo/${
          friend.id
        }">
            <button type="submit">
              <div class="friendName">${friend.username}</div>
              <div class="date">${parseDate(friend.datesincefriends)}</div>
            </button>
        </form>`
    );
    var list = document.getElementById("friendsContainer");
    list.innerHTML = updatedFriendsList.join("");
  });

modal.addEventListener("click", close);

if (isrequestPending) {
  modal.style.display = "block";
  modal.innerHTML = "<div>The request is pending</div><button>okay</button>";
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}

if (isRequestAcceptedOrDeclined) {
  modal.style.display = "block";
  modal.innerHTML =
    "<div>The request has been accepted or declined</div><button>okay</button>";
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}

if (requestSent) {
  modal.style.display = "block";
  modal.innerHTML = "<div>Request Sent</div><button>okay</button>";
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}

function close() {
  document.getElementById("popUpModal").style.display = "none";
}
