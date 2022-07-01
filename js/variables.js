const LOCAL_KEY = "users";
// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://629cc2ac3798759975daef0d.mockapi.io";
const tableHead = document.getElementById("table-head");
const tableBody = document.getElementById("table-body");
let usersData = null;
let userToDeleteId = null;
let userToEditId = null;
let timeoutId;
let submitAction = null;
const TABLE_HEAD = [
    {
        id: "id",
        label: "#",
    },
    {
        id: "avatar",
        label: "Avatar",
        value: (value) =>  `<img src="${value}" alt="user avatar" width="40px" height="40px"/>`
    },

    {
        id: "username",
        label: "Username",
    },
    {
        id: "name",
        label: "Name",
    },
    {
        id: "phone",
        label: "Phone Number",
    },
    {
        id: "email",
        label: "Email",
    },
    {
        id: "company",
        label: "Company Name",
    },
    {
        id: "website",
        label: "Website",
    },
    {
        id: "action",
        label: "Action",
    },
];

const USER_PROPERTIES = [
    "username",
    "name",
    "phone",
    "email",
    "company",
    "website",
];