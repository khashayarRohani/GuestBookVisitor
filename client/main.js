//here we get the element for displaying messages

const listMesaagas = document.getElementById("messages");
const Form = document.getElementById("messageForm");
const h1 = document.getElementById("Welcome");
const Filter = document.getElementById("filter");
const Filterbtn = document.getElementById("filterbtn");
const selectedword = document.getElementById("searchword");
const AllmsgBtn = document.getElementById("allmsg");
const textarea = document.getElementById("textarea");
const smile = document.getElementById("smile");
const sad = document.getElementById("sad");
const angry = document.getElementById("angry");
const love = document.getElementById("love");
let glbID = 0;
//function to fetch data of users
async function getUsers() {
  console.log("get user is called");
  const request = await fetch("http://localhost:3000/users");

  const data = await request.json();
  console.log(data);
  loadMessages(data);
}

function loadMessages(array) {
  for (let i = 0; i < array.length; i++) {
    const listItem = document.createElement("li");
    const btn = document.createElement("button");
    // console.log(array[i].id);

    btn.textContent = "Delete";
    const paragraph = document.createElement("p");
    listItem.setAttribute("id", `message${i}`);
    paragraph.textContent = `${array[i].username}: ${array[i].message}`;
    listItem.appendChild(paragraph);
    listItem.appendChild(btn);
    listMesaagas.appendChild(listItem);
    glbID = i;
    btn.classList.add("delButton");
    btn.addEventListener("click", () => deleteMessage(array[i].id));
  }
}
Form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(Form);
  const formValues = Object.fromEntries(formData);
  console.log(`form values:${formValues.username} `);
  //   const btn = document.createElement("button");
  //   btn.textContent = "Delete";
  //   const listItem = document.createElement("li");
  //   listItem.setAttribute("id", `message${glbID + 1}`);
  //   glbID++;

  //   const paragraph = document.createElement("p");
  //   paragraph.textContent = `${formValues.username}: ${formValues.message}`;
  //   listItem.appendChild(paragraph);
  //   listItem.appendChild(btn);
  //   listMesaagas.appendChild(listItem);
  //   btn.addEventListener("click", () => deleteMessage());
  const text = document.getElementById("username");

  const response = await fetch("http://localhost:3000/sendmessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });

  const data = await response.json();
  console.log(data);
  listMesaagas.innerHTML = "";
  textarea.textContent = "";
  await getUsers();
});

async function deleteMessage(id) {
  const response = await fetch("http://localhost:3000/messages/?id=" + id, {
    method: "DELETE",
  });
  console.log(`delete : ${response}`);
  listMesaagas.innerHTML = ``;
  await getUsers();
}
Filter.addEventListener("change", async () => {
  const selectedWord = Filter.value;
  if (selectedWord == "all") {
    listMesaagas.innerHTML = "";
    getUsers();
  } else {
    const response = await fetch(
      `http://localhost:3000/filtermessages?word=${selectedWord}`
    );

    const messages = await response.json();
    console.log(messages);
    listMesaagas.innerHTML = "";
    await loadMessages(messages);
  }
});
Filterbtn.addEventListener("click", async () => {
  const selectedWord = selectedword.value;
  if (selectedWord) {
    const response = await fetch(
      `http://localhost:3000/filtermessages?word=${selectedWord}`
    );
    const messages = await response.json();
    console.log(messages);
    listMesaagas.innerHTML = "";
    loadMessages(messages);
  }
});
AllmsgBtn.addEventListener("click", async () => {
  listMesaagas.innerHTML = "";
  getUsers();
});
function appendEmoji(emoji) {
  textarea.value += emoji;
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length); //this technique set cursor on the current position of the text
}

// Add event listeners to all emoji radio buttons
smile.addEventListener("change", () => {
  if (smile.checked) appendEmoji(smile.value);
});

sad.addEventListener("change", () => {
  if (sad.checked) appendEmoji(sad.value);
});

angry.addEventListener("change", () => {
  if (angry.checked) appendEmoji(angry.value);
});

love.addEventListener("change", () => {
  if (love.checked) appendEmoji(love.value);
});

getUsers();
