const axios = require('axios');

async function login(){
    const response = await axios.post("http://localhost:8000/login", {
        headers: {"email": "test@gmail.com","password": "password"}
    })
    console.log(response);
}

login();