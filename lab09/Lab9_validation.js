/* write functions that define the action for each event */
function validate() {
    var sid = document.getElementById("sid").value;
    var pwd1 = document.getElementById("pwd1").value;
    var pwd2 = document.getElementById("pwd2").value;
    var uname = document.getElementById("uname").value;

    /* (1) radio buttons */
    var genm = document.getElementById("genm").checked;
    var genf = document.getElementById("genf").checked;

    var errMsg = "";                 /* stores the error message */
    var result = true;               /* assumes no errors */
    var pattern = /^[a-zA-Z ]+$/;    /* letters and spaces only */

    /* Rule 1: empty fields */
    if (sid == "") {
        errMsg += "User ID cannot be empty.\n";
    }
    if (pwd1 == "") {
        errMsg += "Password cannot be empty.\n";
    }
    if (pwd2 == "") {
        errMsg += "Retype password cannot be empty.\n";
    }
    if (uname == "") {
        errMsg += "User name cannot be empty.\n";
    }
    if (!genm && !genf) {
        errMsg += "A gender must be selected.\n";
    }

    /* Rule 2: @ symbol checks */
    if (sid.indexOf('@') == 0) {
        errMsg += "User ID cannot start with an @ symbol.\n";
    }
    if (sid.indexOf('@') < 0) {
        errMsg += "User ID must contain an @ symbol.\n";
    }

    /* Rule 3: passwords match */
    if (pwd1 != pwd2) {
        errMsg += "Passwords do not match.\n";
    }

    /* Rule 4: name pattern */
    if (!uname.match(pattern)) {
        errMsg += "User name contains symbols.\n";
    }

    /* Display errors */
    if (errMsg != "") {
        alert(errMsg);
        result = false;
    }
    return result;
}

/* link HTML elements to corresponding event function */
function init() {
    var regForm = document.getElementById("regform");
    regForm.onsubmit = validate;
}

/* execute the initialisation function once the window loads */
window.onload = init;
