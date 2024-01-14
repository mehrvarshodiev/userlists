const containerEl = document.querySelector(".container");

let searchInputValue = null,
  idx = null,
  isEditUser = false;

// let users = [
//   {
//     id: 1,
//     name: "John",
//     email: "john-smith@gmail.com",
//     isActive: true,
//   },
//   {
//     id: 2,
//     name: "Nina",
//     email: "nina@mail.ru",
//     isActive: false,
//   },
//   {
//     id: 3,
//     name: "Ivan",
//     email: "ivanov02@mail.ru",
//     isActive: true,
//   },
//   {
//     id: 4,
//     name: "Dave",
//     email: "davegray03@gmail.com",
//     isActive: false,
//   },
// ];

let users = JSON.parse(localStorage.getItem("users")) || [];

const leftSideEl = document.createElement("div");
const addBtn = document.createElement("button");
addBtn.setAttribute("class", "add_btn");
addBtn.innerText = "add new user";
addBtn.onclick = () => {
  dialogEl.showModal();
  isEditUser = false;
  nameInputEl.value = "";
  emailInputEl.value = "";
  activeStatusInputEl.checked = false;
  inactiveStatusInputEl.checked = false;
  !isEditUser &&
    ((nameInputEl.placeholder = "Enter your name"),
    (emailInputEl.placeholder = "Enter your email"),
    (submitBtn.innerText = "submit"));
};
const searchInputEl = document.createElement("input");
searchInputEl.type = "search";
searchInputEl.placeholder = "search user...";
searchInputEl.classList.add("search_input");

searchInputEl.onsearch = handleSearchUser;

const selectEl = document.createElement("select");
selectEl.classList.add("filter_users");
for (let i = 0; i < 3; i++) {
  const optionEl = document.createElement("option");
  selectEl.appendChild(optionEl);
}

selectEl.childNodes[0].innerText = "all";
selectEl.childNodes[0].value = "";
selectEl.childNodes[1].innerText = "active";
selectEl.childNodes[1].value = true;
selectEl.childNodes[2].innerText = "inactive";
selectEl.childNodes[2].value = false;
selectEl.onchange = handleFilterUsers;

// Popup Start

const dialogEl = document.createElement("dialog");
dialogEl.classList.add("modal_container");
const modalBoxEl = document.createElement("div");
modalBoxEl.id = "modal_box";
dialogEl.appendChild(modalBoxEl);
dialogEl.onclick = (e) => {
  dialogEl.close();
};

modalBoxEl.onclick = (e) => {
  e.stopPropagation();
};
const nameInputEl = document.createElement("input");
nameInputEl.type = "text";

nameInputEl.autocomplete = "off";
const emailInputEl = document.createElement("input");
emailInputEl.setAttribute("type", "email");
emailInputEl.autocomplete = "off";
const activeStatusInputEl = document.createElement("input");
activeStatusInputEl.type = "radio";
activeStatusInputEl.id = "active_status";
activeStatusInputEl.value = true;
activeStatusInputEl.name = "status_input";
const activeStatusLabel = document.createElement("label");
activeStatusLabel.htmlFor = "active_status";
activeStatusLabel.innerText = "active";
const inactiveStatusInputEl = document.createElement("input");
inactiveStatusInputEl.type = "radio";
inactiveStatusInputEl.value = false;
inactiveStatusInputEl.id = "inactive_status";
const inactiveStatusLabel = document.createElement("label");
inactiveStatusLabel.innerText = "inactive";
inactiveStatusLabel.htmlFor = "inactive_status";
inactiveStatusInputEl.name = "status_input";
const submitBtn = document.createElement("button");
submitBtn.classList.add("submit_btn");

submitBtn.onclick = () => {
  isEditUser == true ? handleUpdateUser() : handleAddUser();
};

modalBoxEl.append(
  nameInputEl,
  emailInputEl,
  activeStatusInputEl,
  activeStatusLabel,
  inactiveStatusInputEl,
  inactiveStatusLabel,
  submitBtn
);
// Popup End

const ulEl = document.createElement("ul");
ulEl.classList.add("user_wrapper");
const fragment = document.createDocumentFragment();

function renderUsers(users) {
  ulEl.innerHTML = "";
  users?.length > 0
    ? users
        .map((user) => {
          const liEL = document.createElement("li");
          const leftSide = document.createElement("div");
          leftSide.classList.add("left_side");
          const userName = document.createElement("strong");
          userName.innerText = user.name;
          userName.classList.add("user_name");

          const userActive = document.createElement("span");
          userActive.innerText =
            user.isActive.toString() == "true" ? "active" : "inactive";
          userActive.classList.add(
            "user_status",
            `${user.isActive.toString() == "true" ? "active" : "inactive"}`
          );

          const userEmail = document.createElement("span");
          userEmail.classList.add("user_email");
          userEmail.innerText = user.email;

          const rightSide = document.createElement("div");
          rightSide.classList.add("right_side");
          const editBtn = document.createElement("button");
          editBtn.innerText = "Edit";
          editBtn.classList.add("edit_btn");
          editBtn.onclick = () => handleEditUser(user);

          const deleteBtn = document.createElement("button");
          deleteBtn.innerText = "Delete";
          deleteBtn.classList.add("delete_btn");
          deleteBtn.onclick = () => handleDeleteUser(user);

          leftSide.append(userName, userActive, userEmail);
          rightSide.append(editBtn, deleteBtn);
          liEL.append(leftSide, rightSide);
          fragment.appendChild(liEL);
        })
        .join("")
    : (ulEl.innerHTML = "<h2>No user here!</h2>");

  ulEl.append(fragment);
}

renderUsers(users);

function handleAddUser() {
  if (isEditUser == false) {
    emailInputEl?.value == "" && emailInputEl.focus();
    nameInputEl?.value == "" && nameInputEl.focus();

    const newUser = {
      id: new Date().getMilliseconds(),
      name: nameInputEl.value,
      email: emailInputEl.value,
      isActive: activeStatusInputEl.checked
        ? "true"
        : inactiveStatusInputEl.checked
        ? "false"
        : "",
    };

    nameInputEl?.value !== "" &&
      emailInputEl?.value !== "" &&
      (activeStatusInputEl?.checked == true ||
        inactiveStatusInputEl?.checked == true) &&
      (users.push(newUser),
      localStorage.setItem("users", JSON.stringify(users)),
      renderUsers(users),
      dialogEl.close(),
      (nameInputEl.value = ""),
      (emailInputEl.value = ""),
      (activeStatusInputEl.checked = false),
      (inactiveStatusInputEl.checked = false));
  }
}

function handleDeleteUser({ id }) {
  selectEl.value = "";
  const deleteConfirmation = confirm("Are you sure you want to delete a user?");
  deleteConfirmation &&
    ((users = users.filter((user) => user.id !== id)),
    localStorage.setItem("users", JSON.stringify(users)),
    renderUsers(users));
}

function handleFilterUsers(e) {
  searchInputValue = null;
  searchInputEl.value = searchInputValue;
  const value = e.target.value;
  let filteredUsers = null;
  if (value == "") {
    filteredUsers = [...users];
  } else {
    filteredUsers = users.filter((user) => String(user.isActive) == value);
  }
  renderUsers(filteredUsers);
}

function handleEditUser(user) {
  idx = user.id;
  isEditUser = true;
  isEditUser &&
    ((nameInputEl.placeholder = "Edit a name"),
    (emailInputEl.placeholder = "Edit an email"),
    (submitBtn.innerText = "update"));

  dialogEl.showModal();
  nameInputEl.value = user.name;
  emailInputEl.value = user.email;
  user.isActive.toString() == "true"
    ? ((activeStatusInputEl.checked = true),
      (activeStatusInputEl.value = user.isActive))
    : user.isActive.toString() == "false"
    ? ((inactiveStatusInputEl.checked = true),
      (inactiveStatusInputEl.value = user.isActive))
    : "";
}

function handleUpdateUser() {
  searchInputValue = null;
  searchInputEl.value = searchInputValue;
  selectEl.value = "";
  const newUser = users.find((user) => user.id == idx);
  newUser["name"] = nameInputEl.value;
  newUser["email"] = emailInputEl.value;
  if (activeStatusInputEl.checked) {
    newUser["isActive"] = activeStatusInputEl.value;
  } else if (inactiveStatusInputEl.checked) {
    newUser["isActive"] = inactiveStatusInputEl.value;
  }

  users = users.map((user) => {
    if (user.id == idx) {
      user = newUser;
    }
    return user;
  });
  localStorage.setItem("users", JSON.stringify(users));

  nameInputEl?.value == "" && nameInputEl?.focus();
  emailInputEl?.value == "" && emailInputEl?.focus();
  nameInputEl?.value != "" &&
    emailInputEl?.value != "" &&
    (renderUsers(users), dialogEl.close());

  nameInputEl.value = "";
  emailInputEl.value = "";
}

function handleSearchUser(e) {
  searchInputValue = e.target.value.toLowerCase().trim();
  let searchedUser = users.filter((user) => {
    if (selectEl.value == "true" && user.isActive.toString() == "true") {
      if (user.name.toLowerCase().trim().includes(searchInputValue)) {
        return user;
      }
    } else if (
      selectEl.value == "false" &&
      user.isActive.toString() == "false"
    ) {
      if (user.name.toLowerCase().trim().includes(searchInputValue)) {
        return user;
      }
    } else if (selectEl.value == "") {
      if (user.name.toLowerCase().trim().includes(searchInputValue)) {
        return user;
      }
    }
  });
  renderUsers(searchedUser);
}

leftSideEl.append(addBtn, searchInputEl, selectEl);
containerEl.appendChild(dialogEl);
containerEl.appendChild(leftSideEl);
containerEl.appendChild(ulEl);
