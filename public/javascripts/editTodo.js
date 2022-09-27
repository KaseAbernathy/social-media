function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

var todoid = getCookie("todoid");

fetch(`http://localhost:3000/home/edit/get/${todoid}`)
  .then((response) => response.json())
  .then((data) => {
    var header = document.getElementById("formContainer");
    header.innerHTML = `
    <h1>Edit Todo</h1>
    <form action="http://localhost:3000/home/api/edit/${todoid}" method="post">
        <textarea id="todoText" name="todo" placeholder="Type in here!">${data[0].todo}</textarea>
        <button type="submit">Edit</button>
    </form>
`;
  });
