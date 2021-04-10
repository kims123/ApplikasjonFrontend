const baseUrl = "http://localhost:8080";

// const baseUrl = "https://secure-badlands-30357.herokuapp.com";

function createUser() {
    let user = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
        "email": document.getElementById("email").value
    };

    let options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json"}
    }
    console.log("Sender post")
    fetch(baseUrl + "/createUser", options)
        .then(function (response) {
            if (response.status !== 201) {
                return response.text();
            } else {
                window.location = "login.html"
            }
        })
        .then(function (result) {
            console.log(result);
            throw new Error(result.toString());
        })
        .catch(error => {
            console.log("Catcher error: " + error);
            document.getElementById("createUser-message").innerHTML = error.message;
        });
}

function loginUser() {
    let user = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    };

    $.ajax({
        url: baseUrl + "/login",
        dataType: "text",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function (response) {
            console.log("Success: " + response);
            document.getElementById("login-overskrift").innerHTML = "Du er logget inn med token: " + response;
            window.localStorage.setItem("userToken", response);
            window.location = "minSide.html";
        },
        error: function (error) {
            console.log(error);
            if (error.status === 401) {
                document.getElementById("login-message").innerHTML = "Feil brukernavn eller passord";
            } else {
                document.getElementById("login-message").innerHTML = "Ukjent feil";
            }
        }
    });
}

function logoutUser() {
    let token = {
        "token": window.localStorage.getItem("userToken")
    };

    $.ajax({
        url: baseUrl + "/logoutUser",
        dataType: "text",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(token),
        success: function (response) {
            console.log("Success: " + response);
            window.localStorage.setItem("userToken", null);
            window.location.reload(true);
        },
        error: function (error) {
            console.log(error);
            if (error.status === 400) {
                document.getElementById("index-message").innerHTML = "Du var ikke logget inn";
            } else {
                document.getElementById("index-message").innerHTML = "Ukjent feil";
            }
        }
    });
}

function fetchAllUsers() {
    fetch(baseUrl + "/allUsers")
        .then(function (response) {
            return response.text();
        }).then(function (responseString) {
        const allUsers = JSON.parse(responseString);
        createTable(allUsers);
        return allUsers.length;
    }).then(function (result) {
            document.getElementById("visAlle").innerHTML = "Det er " + result + " registrerte brukere";
        }
    )

    startBackend();
}

function fetchMinSide() {
    let userToken = window.localStorage.getItem("userToken");

    let token = {
        "token": userToken
    };

    fetch(baseUrl + "/user", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(token)
    })
        .then(function (response) {
            return response.text();
        }).then(function (responseString) {
        if (responseString.length !== 0) {
            document.getElementById("minSide_login").style.visibility = "hidden";
            return JSON.parse(responseString);
        }
    }).then(function (result) {
        console.log(result);
        document.getElementById("minSide-overskrift").innerHTML = "Bruker: " + result.username + ". Token: " + userToken;
    }).catch((error) => {
        console.log("En error: " + error);
    });

    startBackend();
}

function startBackend() {
    let userToken = window.localStorage.getItem("userToken");

    let token = {
        "token": userToken
    };

    fetch(baseUrl + "/user", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(token)
    })
        .then(function (result) {
            console.log(result);
            document.getElementById("index-message").innerHTML = "Dette er en enkel frontend (Backend startet)";
            document.getElementById("index-message").style.backgroundColor = "green";
        })
        .catch((error) => {
            console.log("En error: " + error);
        });
}