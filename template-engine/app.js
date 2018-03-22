var users = [
    { "name": "Byron", "url": "http://localhost" },
    { "name": "Casper", "url": "http://localhost" },
    { "name": "Frank", "url": "http://localhost" }
]

var data = {
    users
}

document.getElementById('container').innerHTML = Engine.templateEval("user_tmpl");
document.getElementById('container').innerHTML += Engine.templateFunction("user_tmpl");
document.getElementById('container').innerHTML += Engine.templateWith("user_tmpl")(data);

document.getElementById('container').innerHTML += Engine.template("user_tmpl")(data);