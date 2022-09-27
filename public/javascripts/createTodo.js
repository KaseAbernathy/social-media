function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var userid = getCookie("cookieName");

var header = document.getElementById("formContainer");
header.innerHTML = `
    <h1>Create a todo</h1>
    <form action="http://localhost:3000/home/api/create/${userid}" method="post">
        <textarea id="todoText" name="todo" placeholder="Type in here!"></textarea>
        <button type="submit">Create</button>
    </form>
`;
