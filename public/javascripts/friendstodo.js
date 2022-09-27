function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var friendid = getCookie("friendid");

fetch(`http://localhost:3000/friends/get/seefriendstodo/${friendid}`)
  .then((response) => response.json())
  .then((data) => {
    var todolist = data.map(
      (todo) =>
        `<section class="todoRow">
        <p>${todo.todo}</p>
      </section>`
    );
    var todos = document.getElementById("todoContainer");
    todos.innerHTML = todolist.join("");

    var friendName = document.getElementById("friendName");
    friendName.innerHTML = `${data[0].username}'s Todos`;
  });
