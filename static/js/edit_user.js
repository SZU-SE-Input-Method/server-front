// 初始化
function initialization() {
    console.log(window.location.search.slice(5));
    uid = window.location.search.slice(5);
    url = `http://1.12.74.230/api/user/${uid}`;
    console.log(uid);
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.response);
            // public_init_phrasetext(response);
            console.log(response);
            init_user_edit(response);
        }
    }
    xhr.send();
}
//初始化数据
function init_user_edit(res) {
    var tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    var info = "";
    info += '<tr>' +
        '<td>' +
        '<label for="uid">UID:</label>' +
        '<input class="form-control" id="uid" name="uid" type="text" value="' + res.data['uid'] + '">' +
        '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>' +
        '<label for="name">Name:</label>' +
        ' <input class="form-control" id="name" name="name" type="text" value="' + res.data['name'] + '">' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="phone">Phone:</label><input class="form-control" id="phone" name="phone" value="' + res.data['phone'] + '">' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="password">Password:</label><input class="form-control" id="password" name="password" type="text" value="' + res.data['password'] + '">' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="email">Email:</label><input class="form-control" id="email" name="email" type="text" value="' + res.data['email'] + '">' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><label for="gender">Gender:</label><input class="form-control" id="gender" name="gender" type="text" value="' + res.data['gender'] + '">' +
        '</td>' +
        '</tr>'

    tbody.innerHTML = info;
}

function edit_submit() {
    const uid = document.getElementById('uid').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const gender = document.getElementById('gender').value;

    const data = JSON.stringify({
        "uid": uid,
        "name": name,
        "phone": phone,
        "password": password,
        "email": email,
        "gender": gender
    });

    const xhr = new XMLHttpRequest();

    xhr.open("PUT", "http://1.12.74.230/api/user");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            var response = JSON.parse(xhr.response);
            alert(response.msg);
            window.history.back();
        }
    });
    xhr.send(data);
}

//取消编辑
function cancelEdit() {
    // console.log(window.location.search.slice(5));
    // uid = window.location.search.slice(5);
    // url = `http://1.12.74.230/api/user/${uid}`;
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", url, true);
    // xhr.onload = function () {
    //     if (xhr.status === 200) {
    //         var response = JSON.parse(xhr.response);
    //         document.getElementById('uid').value = res.data['uid'];
    //         document.getElementById('name').value = res.data['name'];
    //         document.getElementById('phone').value = res.data['phone'];
    //         document.getElementById('password').value = res.data['password'];
    //         document.getElementById('email').value = res.data['email'];
    //         document.getElementById('gender').value = res.data['gender'];

    //     }
    // }
    // xhr.send();

    initialization();
}
