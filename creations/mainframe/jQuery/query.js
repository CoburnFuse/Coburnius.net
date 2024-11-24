//QUICK SEARCH REFERENCE
//FNDIRLIST (Function for Directory Listing)
//FNCOMMANDS (Function for Commands)
//BTNS (Buttons on left side)


var dir = "root"
var admin = false
var user = "guest"
var directories = ["files", "images", "debug"]
var users = ["admin", "blanc", "nepgear"]
var passwords = ["inazuma", "white", "neptune"]


//FNDIRLIST
function dirList() {
    $.each(directories, function(index, lsDir) {
        $("#console").append(lsDir + "</br>");
    });
}

//FNCOMMANDS
function commands() {
    $("#console").append("help - shows all commands</br>")
    $("#console").append("clear - clears console</br>")
    $("#console").append("dir - shows directory</br>")
    $("#console").append("cd /folder - changes directory</br>")
    $("#console").append("login /user /password - login to admin</br>")
}

function empty() {
    $("#console").empty()
}

function userList() {
    $.each(users, function(index, user) {
        $("#console").append(user + "</br>");
    });
}

function load() {
    $("#fullsite").fadeOut(0);
    $("#fullsite").fadeIn(2000);
    $("#main").animate({height: "99vh"}, {duration: 2000, queue: false});
}

function panic() {
    document.getElementById("bgm").pause();
    document.getElementById("panic").play();
    $("#error").animate({height: "100%"},{duration: 15000});
}


function reloadSide() {
    $("#sideinfo").empty()
    $("#sideinfo").append("user: " + user + "</br> admin: " + admin + "</br> directory: " + dir + "</br>")
}

$(document).ready(function(){
    load()
    $("#sideinfo").append("user: " + user + "</br> admin: " + admin + "</br> directory: " + dir + "</br>")
    $(document).keypress(function(e){
        var input = $("input[name=console]").val();
        if(e.which == 13) {
            var inputSp = $("input[name=console]").val().split(" ");
            $("#console").append(input + "</br>")
            $("input").val("")
            if (inputSp[0] == "help" || inputSp[0] == "commands") {
                document.getElementById("goodInput").play();
                commands()
            } else if (inputSp[0] == "dir" || inputSp[0] == "ls") {
                $("#console").append("current directory: " + dir + "</br>")
                document.getElementById("goodInput").play();
                dirList()
            } else if (inputSp[0] == "clear" || inputSp[0] == "clr") {
                document.getElementById("goodInput").play();
                empty()
            } else if (inputSp[0] == "hello") {
                document.getElementById("goodInput").play();
                $("#console").append("Hello world!</br>")
            } else if (inputSp[0] == "cd") {
                if(inputSp.length == 2) {
                    if (inputSp[1] == directories[0]) {
                        dir = "files"
                        $("#console").append( dir + "</br>")
                        document.getElementById("goodInput").play();
                        reloadSide()
                    } else if (inputSp[1] == directories[1]) {
                        dir = "images"
                        $("#console").append( dir + "</br>")
                        document.getElementById("goodInput").play();
                        reloadSide()
                    } else if (inputSp[1] == directories[2]) {
                        if (admin == true) {
                            dir = "debug"
                            $("#console").append( dir + "</br>")
                            document.getElementById("goodInput").play();
                            reloadSide()
                        } else {
                            document.getElementById("badInput").play();
                            $("#console").append("access denied, admin access required</br>")
                        }
                    } else {
                        document.getElementById("badInput").play();
                        $("#console").append("invalid folder</br>")
                    }
                } else {
                    document.getElementById("badInput").play();
                    $("#console").append("correct usage: cd /folder </br>")
                }
            } else if(inputSp[0] == "login") {
                if(inputSp.length == 3) {
                    if(inputSp[1] == users[0] && inputSp[2] == passwords[0]) {
                        admin = true
                        user = inputSp[1]
                        $("#console").append("password accepted, admin logged in</br>")
                        document.getElementById("goodInput").play();
                        reloadSide()
                    } else if (inputSp[1] == users[1] && inputSp[2] == passwords[1]) {
                        user = inputSp[1]
                        admin = false
                        $("#console").append("password accepted, " + inputSp[1] + " logged in</br>")
                        document.getElementById("goodInput").play();
                        reloadSide()
                    } else {
                        document.getElementById("badInput").play();
                        $("#console").append("invalid username or password</br>")
                    }
                } else {
                    document.getElementById("badInput").play();
                    $("#console").append("correct usage: login /user /password </br>")
                }
            } else if(inputSp[0] == "users") {
                userList()
                document.getElementById("goodInput").play();
            } else if(inputSp[0] == "error") {
                document.getElementById("panicSnd").play();
                panic()
            } else {
                $("#console").append("invalid command or filename</br>")
                document.getElementById("badInput").play();
            }
        }
    });

//Buttons on left side (BTNS)
    $(".button").hover(function(){
        $(this).toggleClass("buttonHover")
    });
    $(".button[name=btnHelp]").click(function(){
        commands()
        document.getElementById("button").play();
    });
    $(".button[name=btnDir]").click(function(){
        $("#console").append("Current directory: " + dir + "</br>")
        dirList()
        document.getElementById("button").play();
    });
    $(".button[name=btnClear]").click(function(){
        empty()
        document.getElementById("button").play();
    });
    $(".button[name=btnUsr]").click(function(){
        userList()
        document.getElementById("button").play();
    });
});
