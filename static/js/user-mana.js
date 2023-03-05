//页面初始化
function initialization(tablename) {
    // 获取url参数
    const querystring = window.location.search;
    const urlparams = new URLSearchParams(querystring);
    //默认一页展示5
    const pagesize = 5;
    // 没有就默认第一页
    var pagenum = urlparams.get('pagenum');
    if (pagenum == null)
        pagenum = 1;

    var xhr = new XMLHttpRequest();
    //user_management
    // if (tablename == "user_management")
    url = `http://1.12.74.230/api/user/page/${pagenum}/${pagesize}`;
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.response);
            console.log(response);

            //初始化用户信息
            init_user(response.data.records);

            //初始化进度栏   第几页， 总共几页
            init_pagelist(tablename, pagenum, response.data.pages);
        }
        else
            console.error(xhr.statusText);
    }
}

//获取用户输入的分页栏页数
function get_pagenum(tablename) {
    var url = "";
    let result = window.prompt("请输入页码:", "1");
    while (result !== null && !/^\d+$/.test(result))
        result = window.prompt("请输入正确的数字页码:", "1");

    if (tablename == "public_phrases")
        url = `/public_phrases.html?pagenum=${result}`;
    else if (tablename == "private_phrases")
        url = `/private_phrases.html?pagenum=${result}`;

    if (result !== null)
        location.href = url;
}

//构造用户表格内容
function init_user(res) {
    var tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    var info = "";
    for (let i = 0; i < res.length; i++) {
        info += '<tr>\n' +
            '<th scope="row">' + res[i]['uid'] + '</th>\n' +
            '<td>' + res[i]['username'] + '</td>\n' +
            ' <td>' + res[i]['name'] + '</td>\n' +
            '<td>' + res[i]['email'] + '</td>\n' +
            '<td>' + res[i]['phone'] + '</td>\n' +
            ' <td>' + res[i]['gender'] + '</td>\n' +
            '<td>' + res[i]['createTime'] + '</td>\n' +
            '<td>\n' +
            '<div class="d-flex order-actions">\n' +
            '<a href="edit_user.html?uid=' + res[i]['uid'] + '"><i class="bx bxs-edit"></i></a>\n' +
            '<p>&nbsp;&nbsp;&nbsp;</p>\n' +
            '<a href="javascript: delete_user(' + res[i]['uid'] + ');"><i class="bx bxs-trash"></i></a>\n' +
            '</div>\n' +
            '</td>\n' +
            '</tr>'

        tbody.innerHTML = info;
    }
}


//构造分页栏
function init_pagelist(tablename, nowpage, totlepage) {
    totlepage = parseInt(totlepage);
    nowpage = parseInt(nowpage);

    if (totlepage == 1)
        return;

    var pagelist = document.getElementById("pagelist");

    var input_node = document.createElement("li");
    input_node.setAttribute("class", "page-item");
    var a_input = document.createElement("a");
    a_input.setAttribute("class", "page-link");
    a_input.setAttribute("href", `javascript: get_pagenum("${tablename}");`);
    a_input.innerText = "...";
    input_node.appendChild(a_input);

    var input_node_co = document.createElement("li");
    input_node_co.setAttribute("class", "page-item");
    var a_input_co = document.createElement("a");
    a_input_co.setAttribute("class", "page-link");
    a_input_co.setAttribute("href", `javascript: get_pagenum("${tablename}");`);
    a_input_co.innerText = "...";
    input_node_co.appendChild(a_input_co);

    pagelist.appendChild(create_listnode("First", 1, 0, tablename));

    //两个省略号都不显示
    if (totlepage <= 7) {
        for (let i = 1; i <= totlepage; i++) {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }
    }

    //显示左省略号
    else if (totlepage > 7 && nowpage > 4 && nowpage >= totlepage - 3) {
        pagelist.appendChild(create_listnode(1, 1, 0, tablename));
        pagelist.appendChild(input_node);

        for (let i = nowpage - 2; i <= totlepage; i++) {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }
    }

    //显示右省略号
    else if (totlepage > 7 && nowpage <= 4) {
        for (var i = 1; i <= nowpage + 2; i++) {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }

        pagelist.appendChild(input_node);
        pagelist.appendChild(create_listnode(totlepage, totlepage, 0, tablename));
    }

    //显示两个省略号
    else if (totlepage > 7) {
        pagelist.appendChild(create_listnode(1, 1, 0, tablename));
        pagelist.appendChild(input_node_co);

        for (let i = nowpage - 2; i <= nowpage + 2; i++) {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }

        pagelist.appendChild(input_node);
        pagelist.appendChild(create_listnode(totlepage, totlepage, 0, tablename));
    }

    pagelist.appendChild(create_listnode("Last", totlepage, 0, tablename));
}

//构造分页栏的一个节点
function create_listnode(name, value, isactive, tablename) {
    var li_node = document.createElement("li");
    if (isactive == false)
        li_node.setAttribute("class", "page-item");
    else
        li_node.setAttribute("class", "page-item active");
    var a_node = document.createElement("a");
    a_node.setAttribute("class", "page-link");
    a_node.setAttribute("href", `${tablename}.html?pagenum=${value}`);
    a_node.innerText = name;
    li_node.appendChild(a_node);

    return li_node;
}





//添加更多行
function addrow() {
    for (let i = 0; i < 3; i++) {
        var table = document.getElementById("add_phrases_table");
        var newrow = table.insertRow();
        var cell = newrow.insertCell();

        var newinput = document.createElement("input");
        newinput.type = "text";
        newinput.placeholder = "短语内容";
        newinput.setAttribute("class", "form-control");
        cell.appendChild(newinput);
    }
}

//上传新增短语
function get_tablevalue() {
    var table = document.getElementById("add_phrases_table");
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var inputs = rows[i].getElementsByTagName("input");
        for (var j = 0; j < inputs.length / inputs.length; j++) {
            var text = inputs[0].value;
            if (text != null && text != "")
                upload(text);
        }
    }

    alert("添加成功!");
    window.history.back();
}

function upload(text) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://1.12.74.230/api/publicphrases");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });
    let data = { "content": text };
    let jsonData = JSON.stringify(data);
    xhr.send(jsonData);
}
// ???????
//删除用户
function delete_user(uid) {

    var xhr = new XMLHttpRequest();
    var url = `http://1.12.74.230/api/user/${uid}`;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response = JSON.parse(xhr.response);
            alert(response.msg);
            location.reload();
        }
    });

    xhr.open("DELETE", url);
    xhr.send();


    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function () {
    //     if (this.readyState === 4) {
    //         console.log(this.responseText);
    //     }
    // });

    // xhr.open("DELETE", "http://1.12.74.230/api/user/" + uid);
    // xhr.setRequestHeader("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Nzc3MzY1NTksInVzZXJuYW1lIjoiYWRtaW4ifQ._YnP37NcvX56xu-ZJC6udMs76C7KeYQ9lzjtpFsJ248");
    // xhr.setRequestHeader("User-Agent", "Apifox/1.0.0 (https://www.apifox.cn)");
    // xhr.setRequestHeader("Accept", "*/*");
    // xhr.setRequestHeader("Host", "1.12.74.230");
    // xhr.setRequestHeader("Connection", "keep-alive");

    // xhr.send();

}

//修改短语
function handleTableClick(event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'a') {
        event.preventDefault();
        const row = target.parentNode.parentNode.parentNode;
        const cells = row.querySelectorAll('td');
        const cell1 = cells[0];
        const cell2 = cells[2];

        var text1 = cell1.innerHTML;

        cell1.innerHTML = `<input class="form-control" type="text" value=${text1}>`;
        cell2.innerHTML = '<div class="d-flex order-actions"><button type="button" class="btn btn-info px-3 radius-30" onclick="submitchange(this)">保存</button><p>&nbsp;&nbsp;&nbsp;</p><button type="button" class="btn btn-secondary px-3 radius-30" onclick="cancel(this,`' + text1 + '`)">取消</button></div>';
    }
}

//取消修改短语
function cancel(button, text) {
    const row = button.parentNode.parentNode.parentNode;
    const pid = row.querySelectorAll('th')[0];
    const cells = row.querySelectorAll('td');
    const cell1 = cells[0];
    const cell2 = cells[2];

    cell1.innerHTML = text;
    cell2.innerHTML = '<div class="d-flex order-actions"><a href="#"><i class="bx bxs-edit"></i></a><p>&nbsp;&nbsp;&nbsp;</p><a href="javascript: delete_phrases(' + pid.innerHTML + ');"><i class="bx bxs-trash"></i></a></div>';
}

//上传修改的短语
function submitchange(button) {
    const row = button.parentNode.parentNode.parentNode;
    const ppid = row.querySelectorAll('th')[0];
    const cells = row.querySelectorAll('td');
    const cell = cells[0];
    const content = cell.querySelectorAll("input")[0];

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://1.12.74.230/api/publicphrases");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response = JSON.parse(xhr.response);
            alert(response.msg);
            location.reload();
        }
    });
    let data = { "ppid": ppid.innerText, "content": content.value };
    let jsonData = JSON.stringify(data);
    console.log(jsonData)
    xhr.send(jsonData);
}

//搜索用户（uid）
function user_handleKeyPress(event) {
    if (event.keyCode === 13) {
        var inputContent = document.getElementById("user_search").value;

        var Uid = parseInt(inputContent);
        var url = "";

        if (/^\d+$/.test(inputContent))
            url = `http://1.12.74.230/api/user/${Uid}`;
        else
            url = `http://1.12.74.230/api/user/page/1/5`;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.response);
                console.log(response);


                //没有获取到返回数据
                if (response.data == null || (response.data.records != null && response.data.records.length == 0)) {
                    alert("未查询到该用户,请重新搜索");
                    location.reload();
                }

                //获取单个返回数据
                else if (response.data != null && response.data.records == null) {
                    response = Array.from([response.data]);
                    init_user(response);
                    document.getElementById("pagelist").innerHTML = "";
                }

                //获取到多个返回数据
                else if (response.data != null) {
                    init_user(response.data.records);
                    document.getElementById("pagelist").innerHTML = "";
                }
                else
                    console.log("into else");
            }
            else
                console.error(xhr.statusText);
        }
        xhr.send();
    }
}
