function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var userid = getCookie("cookieName");

fetch(`http://localhost:3000/home/todos/${userid}`)
  .then((response) => response.json())
  .then((data) => {
    var todoList = data.map(
      (todo) =>
        `<section class="todoRow">
          <p class="todo">${todo.todo}</p>

          <form action="http://localhost:3000/home/edit/${todo.id}">
            <button type="submit" class="editButton">
              <img src="../images/editIcon.png" alt="edit" width="40" height="40" title="Edit"/>
              
            </button>
          </form>
          
          <form action="http://localhost:3000/home/delete/${todo.id}">
            <button type="submit" class="deleteButton">
              <img src="../images/deleteIcon.png" alt="" width="38" height="38" title="Delete"/>
              
            </button>
          </form>
          
        </section>
        `
    );
    todoList.splice(0, 0, "<h1>Home</h1>");
    var list = document.getElementById("todos");
    list.innerHTML = todoList.join("");
  });
