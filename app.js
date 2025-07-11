const API_BASE = "https://borjomi.loremipsum.ge/api";

const createUserUrl = `${API_BASE}/register`; // POST
const getAllUsersUrl = `${API_BASE}/all-users`; // GET
const getSingleUserUrl = `${API_BASE}/get-user/`; // + id, GET
const updateUserUrl = `${API_BASE}/update-user/`; // + id, PUT
const deleteUserUrl = `${API_BASE}/delete-user/`; // + id, DELETE

const regForm = document.querySelector("#registration-form"),
  userName = regForm.querySelector("#user-name"),
  userSurname = regForm.querySelector("#user-surname"),
  userEmail = regForm.querySelector("#user-email"),
  userPhone = regForm.querySelector("#user-phone"),
  userPersonalID = regForm.querySelector("#user-personal-id"),
  userZip = regForm.querySelector("#user-zip-code"),
  userId = document.querySelector("#user-id");

const addNewUserBtn = document.querySelector("#add-new-user"),
  addRandomUserBtn = document.querySelector("#add-random-user"),
  dialogEl = document.querySelector("dialog"),
  closeDialog = dialogEl.querySelector("#close");

addNewUserBtn.addEventListener("click", () => {
  // Clear form when adding new user
  regForm.reset();
  userId.value = "";
  dialogEl.showModal();
});

closeDialog.addEventListener("click", () => {
  dialogEl.close();
});

///rendom user test
// add
addRandomUserBtn.addEventListener("click", () => {
  const randomUser = generateRandomUser();
  sendUserData(randomUser);
});

//generator function
function generateRandomUser() {
  const randomNum = Math.floor(Math.random() * 10000);
  return {
    first_name: `TestName${randomNum}`,
    last_name: `TestLast${randomNum}`,
    phone: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
    id_number: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    email: `test${randomNum}@gmail.com`,
    gender: ["male", "female", "other"][Math.floor(Math.random() * 3)],
    zip_code: `${Math.floor(1000 + Math.random() * 9000)}`,
  };
}
// Test fetch
function getCharacters1() {
  fetch("https://hp-api.onrender.com/api/characters")
    .then((res) => res.json())
    .then((data) => {
      console.log("getCharacters1", data);
    })
    .catch((e) => {
      console.log("Error fetching characters:", e);
    })
    .finally(() => {
      console.log("finally Fetch completed");
    });
}

// updateUser
async function updateUser(userObj) {
  try {
    const response = await fetch(`${updateUserUrl}${userObj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });
    const data = await response.json();
    console.log("Updated:", data);
    getUsers();
  } catch (e) {
    console.log("Error updating user:", e);
  }
}

async function sendUserData(userDataObject) {
  try {
    const response = await fetch(createUserUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataObject),
    });
    const data = await response.json();
    console.log("Created:", data);
    getUsers();
  } catch (e) {
    console.log("Error creating user:", e);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`${deleteUserUrl}${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("Deleted:", data);
    getUsers();
  } catch (e) {
    console.log("Error deleting user:", e);
  }
}

const deleteAllUsersBtn = document.querySelector("#delete-all-users");

deleteAllUsersBtn.addEventListener("click", () => {
  deleteAllUsersOneByOne();
});

async function deleteAllUsersOneByOne() {
  try {
    const response = await fetch(getAllUsersUrl);
    const data = await response.json();
    const users = data.users;

    for (const user of users) {
      await fetch(`${deleteUserUrl}${user.id}`, { method: "DELETE" });
      console.log(`Deleted user ${user.id}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    getUsers();
  } catch (e) {
    console.log("Error deleting all users:", e);
  }
}

function userActions() {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.userId;
      const data = await getSingleUser(id);

      userName.value = data.first_name;
      userSurname.value = data.last_name;
      userEmail.value = data.email;
      userPhone.value = data.phone;
      userPersonalID.value = data.id_number;
      userZip.value = data.zip_code;

      if (data.gender === "male") regForm.querySelector("#male").checked = true;
      if (data.gender === "female")
        regForm.querySelector("#female").checked = true;
      if (data.gender === "other")
        regForm.querySelector("#other").checked = true;

      userId.value = data.id;

      dialogEl.showModal();
    });
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.userId;
      deleteUser(id);
    });
  });
}

async function getSingleUser(id) {
  try {
    const response = await fetch(`${getSingleUserUrl}${id}`);
    const data = await response.json();
    console.log("Returned from getSingleUser:", data);

    if (data && data.users) {
      return data.users;
    } else {
      console.log("getSingleUser returned unexpected:", data);
      return null;
    }
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function getUsers() {
  try {
    const response = await fetch(getAllUsersUrl);
    const data = await response.json();
    const users = data.users;

    console.log("getUsers", users);

    const container = document.getElementById("users-container");
    container.innerHTML = "";

    // table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
    <th>ID</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Email</th>
    <th>Personal ID</th>
    <th>Mobile Number</th>
    <th>Zip</th>
    <th>Gender</th>
    <th>Actions</th>
  </tr>
      `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.id_number}</td>
          <td>${user.phone}</td>
          <td>${user.zip_code}</td>
          <td>${user.gender}</td>
          <td>
            <button class="edit-btn" data-user-id="${user.id}">Edit</button>
            <button class="delete-btn" data-user-id="${user.id}">Delete</button>
          </td>
        `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    userActions();
  } catch (e) {
    console.log("Error fetching users:", e);
  }
}

regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userData = {
    first_name: userName.value,
    last_name: userSurname.value,
    phone: userPhone.value,
    id_number: userPersonalID.value,
    email: userEmail.value,
    gender: regForm.querySelector("[name='gender']:checked").value,
    zip_code: userZip.value,
    id: userId.value,
  };

  if (userId.value === "") {
    sendUserData(userData);
  } else {
    updateUser(userData);
  }

  dialogEl.close();
});

getCharacters1();
getUsers();
