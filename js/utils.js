async function addUserToServer(id, user) {
    const res = await fetch(`${BASE_URL}/maktabusers`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    });
    console.log({res})
    return res;
}

const searchUsers = (text) => {
    if (text) {
        text = text.toLowerCase();
    }
    const result = usersData.filter((user) => {
        let isSelected = false;
        Object.values(user).forEach((userProp) => {
            userProp = userProp.toLowerCase();
            if (
                !isSelected &&
                typeof userProp === "string" &&
                userProp.includes(text)
            ) {
                isSelected = true;
                return;
            }
        });
        if (isSelected) return user;
    });
    return result;
};

function findUserById(id) {
    return usersData.find((user) => user.id.toString() === id.toString());
}

const searchData = (search) => {
    const searchValue = search.toLowerCase();
    const filteredData = allData.filter(user => {
        return Object.keys(user).some(key => {
            return user[key].toString().toLowerCase().includes(searchValue);
        });
    });
    displayData(filteredData);
}


async function editFromServer(id, newData) {
    try {
        const res = await fetch(`${BASE_URL}/maktabusers/${id}`, {
            method: "PUT",
            body: JSON.stringify(newData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
        return res;
    } catch (e) {
        console.warn(e)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: 'Why do I have this issue?'
        })
    }
}

async function getUsersFromServer() {
    try {
        const res = await fetch(BASE_URL + "/maktabusers");
        const json = await res.json();
        return json;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            footer: "Why do I have this issue?",
        });
    }
}

async function deleteUserFromServer(id) {
    try {
        const re = await fetch(`${BASE_URL}/maktabusers/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {``
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            footer: "Why do I have this issue?",
        });
    }
}
