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
const text = document.getElementById("username");

//function to fetch data of users
async function getUsers() {
  console.log("get user is called");
  const request = await fetch(
    "https://guestbookvisitor-server.onrender.com/users"
  );

  const data = await request.json();
  console.log(data);
  loadMessages(data);
}

function loadMessages(array) {
  for (let i = 0; i < array.length; i++) {
    const listItem = document.createElement("li");
    const btn = document.createElement("button");
    const likeBtn = document.createElement("button");
    const div = document.createElement("div");
    // console.log(array[i].id);
    likeBtn.textContent = "Like";
    btn.textContent = "Delete";
    const paragraph = document.createElement("p");
    listItem.setAttribute("id", `message${i}`);
    paragraph.textContent = `${array[i].username}: ${array[i].message}`;
    paragraph.classList.add("FontSize");
    const likeSpan = document.createElement("span");

    listItem.appendChild(paragraph);
    listItem.appendChild(likeSpan);

    listItem.appendChild(div);

    div.appendChild(btn);
    div.appendChild(likeBtn);
    listItem.classList.add("btnTextgap");
    listMesaagas.appendChild(listItem);
    glbID = i;
    btn.classList.add("delButton");
    likeBtn.classList.add("delButton");
    likeBtn.addEventListener("click", () => likeMessage(array[i].id, likeBtn));
    btn.addEventListener("click", () => deleteMessage(array[i].id));
  }
}
Form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(Form);
  const formValues = Object.fromEntries(formData);
  h1.textContent = `Welcome ${formValues.username}`;
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

  const response = await fetch(
    "https://guestbookvisitor-server.onrender.com/sendmessage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );

  const data = await response.json();
  console.log(`post message : ${data}`);
  listMesaagas.innerHTML = "";
  textarea.value = "";
  await getUsers();
});

async function deleteMessage(id) {
  const response = await fetch(
    "https://guestbookvisitor-server.onrender.com/messages/?id=" + id,
    {
      method: "DELETE",
    }
  );
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
      `https://guestbookvisitor-server.onrender.com/filtermessages?word=${selectedWord}`
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
      `https://guestbookvisitor-server.onrender.com/filtermessages?word=${selectedWord}`
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
async function likeMessage(id, likeBtn) {
  const response = await fetch(
    "https://guestbookvisitor-server.onrender.com/likemessage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    }
  );

  const data = await response.json();
  console.log(`like response: ${data.likes}`);

  likeBtn.textContent = data.likes;

  setTimeout(() => {
    likeBtn.textContent = "like";
  }, 1000);
}

getUsers();
