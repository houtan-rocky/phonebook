async function init() {
    if (!localStorage.hasOwnProperty(LOCAL_KEY)) {
        const users = await getUsersFromServer();
        if (users) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
        }
    }
    try {
        return getLocalData(LOCAL_KEY);
    } catch (error) {
    }
}

function getLocalData(key) {
    if (localStorage.hasOwnProperty(key)) {
        const localDataString = localStorage.getItem(key);
        return JSON.parse(localDataString);
    } else {
        throw new Error(key + " not found");
    }
}

function renderTableBody(data = usersData) {
    tableBody.innerHTML = "";
    data.forEach((userObj) => {
        let tr = /* html */ `<tr>`;

        TABLE_HEAD.forEach(({id, value}) => {
            if (id === "action") {
                tr += /* html */ ` 
				<td class="action">
					<button class="edit-btn" onclick="handleEdit(${userObj.id})">Edit</button><button class="delete-btn" onclick="handleDelete(${userObj.id})">Delete</button>
				</td>`;
            } else {
                tr += /* html */ ` 
				<td>
					${value ? value(userObj[id]) : userObj[id]}
				</td>`;
            }
        });
        tr += /* html */ `</tr>`;
        tableBody.innerHTML += tr;
    });
}

function renderTableHeader() {
    tableHead.innerHTML = "";
    let tr = `<tr>`;
    TABLE_HEAD.forEach(({label}) => {
        tr += /* html */ `<th>${label}</th>`;
    });
    tr += /* html */ `</tr>`;
    tableHead.innerHTML += tr;
}

function handleEdit(id) {
    submitAction = "edit";
    console.log(submitAction)
    document.getElementsByClassName("modal-app")[0].style.display = "flex";
    const inputs = document.querySelectorAll(".modal-app input");
    const user = findUserById(id);
    [...inputs].forEach((input) => {
        input.value = user[input.name]
    })
    userToEditId = id;
}

async function handleDelete(id) {
    console.log(findUserById(id))
    const {username} = findUserById(id);
    Swal.fire({
        title: "Are you sure?",
        text: `You are deleting "${username}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            handleDeleteSubmit(id)
            Swal.fire(
                "Deleted!",
                `${username} has been deleted.`,
                "success"
            );
            load();
        }
    }).catch(() => console.log('cancelled'))
}

function deleteLocalData(id) {
    const users = JSON.parse(localStorage.getItem("users"));
    const filteredUsers = users.filter((user) => {
        if (user.id != id) {
            return user;
        }
    });
    localStorage.setItem("users", JSON.stringify(filteredUsers));
    usersData = filteredUsers;
}

function editLocalData(id, newUser) {
    const users = JSON.parse(localStorage.getItem('users'))
    const filteredUsers = users.filter((user) => {
        if (user.id == id) {
            usersData.id = newUser
        }
    });
    localStorage.setItem('users', [...usersData, newUser])
}

async function handleDeleteSubmit(id) {
    deleteLocalData(id)
    await deleteUserFromServer(id)
    await load();
}

async function handleEditSubmit(id) {

}

async function load() {
    renderTableHeader();
    usersData = await init();
    renderTableBody();
}

load();

async function searchRender(text, url) {
    const result = searchUsers(text);
    console.log({result});
    renderTableBody(result);
}

// SECTION - Event listeners
document.getElementById("search-field").addEventListener("keyup", (event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const searchText = document.getElementById("search-field").value;
        searchRender(searchText, BASE_URL);
    }, 1000);
});

// Modal submit
document.getElementById("modal__form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const inputs = document.querySelectorAll(".modal-app input");
        let newUser = {};
        [...inputs].forEach((input) => {
            if (input.value) {
                newUser =
                    {
                        ...newUser,
                        [input.name]: input.value
                    };
            }
        });
        // debugger;
        document.getElementById('modal-app').style.display = "none";
        console.log(submitAction)
        let res;
        if (submitAction === "edit") {
            res = await editFromServer(userToEditId, newUser)
            if (!res.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: 'Why do I have this issue?'
                })
            } else {
                Swal.fire(
                    "User Edited",
                    `${newUser.username} has been edited.`,
                    "success"
                );
            }

        } else if (submitAction === "add") {
            res = await addUserToServer(userToEditId, newUser)
            if (!res.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: 'Why do I have this issue?'
                })
            } else {
                Swal.fire(
                    "User Added",
                    `${newUser.username} has been added.`,
                    "success"
                );
            }
        }

        localStorage.removeItem('users')
        await load();
    } catch (e) {
        console.warn(e)
    }
});

// Modal cancel
document.getElementById("modal-cancel").addEventListener("click", () => {
    document.getElementById('modal-app').style.display = "none";
})

// Add button
document.getElementById("add-button").addEventListener("click", () => {
    const inputs = document.querySelectorAll(".modal-app input");
    [...inputs].forEach((input) => {
        input.value = "";
    })
    submitAction = "add"
    const modal = document.getElementById('modal-app');
    const modalForm = document.getElementById("modal__form");
    modal.style.display = 'flex';
})
