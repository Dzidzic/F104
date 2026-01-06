const authModel = require("../models/authModel");

async function getLogin(req, res) {
    const validator = {
        login: "",
        password: "",
    };
    
    res.render("pages/auth/login.ejs", { validator });
}

async function getRegister(req, res) {
    const validator = {
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    };
    
    res.render("pages/auth/register.ejs", { validator });
}

async function postLogin(req, res) {
    const { login, password } = req.body;

    const validator = {
        login: "invalid",
        password: "invalid",
    };
    
    const userExist = await authModel.getUserByNameOrEmail(login, login);
    
    if(!userExist){
        validator.password = "";
        return res.render("pages/auth/login.ejs", { validator });
    }

    validator.login = login;
    const hash = await authModel.hashPassword(password);

    if(hash !== userExist.password)
        return res.render("pages/auth/login.ejs", { validator });

    req.session.user = {
        id: userExist._id.toString(),
        username: userExist.username
    };

    res.redirect("/");
}

async function postRegister(req, res) {
    const { username, email, password, passwordConfirm } = req.body;

    const validator = {
        username: "invalid",
        email: "invalid",
        password: "invalid",
        passwordConfirm: "invalid"
    };

    if (username.length >= 3 && username.length <= 20) 
        validator.username = username;

    if (email.includes("@")) 
        validator.email = email

    var passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (passwordRegex.test(password)) 
        validator.password = password;

    if (password === passwordConfirm) 
        validator.passwordConfirm = passwordConfirm;

    const hasInvalid = Object.values(validator).some(value => value === "invalid");
    if (hasInvalid) 
        return res.render("pages/auth/register.ejs", { validator });
       
    const result = await authModel.addNewUser(validator);

    if(result === "userExist"){
        validator.username = result;
        validator.email = result;
    }else if(result.acknowledged == true){
        req.session.user = {
            id: result.insertedId,
            username: validator.username
        };
        return res.redirect("/");
    }      

    return res.render("pages/auth/register.ejs", { validator });
}

function logout(req, res) {
    req.session.destroy(() => {
        res.clearCookie("f104.sid");
        res.redirect("/");
    });
}

module.exports = {
    getLogin,
    getRegister,
    postRegister,
    postLogin,
    logout
};