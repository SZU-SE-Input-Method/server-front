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
    //knowledge
    url = `http://1.12.74.230/api/knowledge/page/${pagenum}/${pagesize}`;
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.response);
            console.log(response);

            //初始化用户信息
            init_knowledge(response.data.records);

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

//构造知识表格内容（设置隐藏长度！！！）
function init_knowledge(res) {
    var tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    var info = "";
    for (let i = 0; i < res.length; i++) {
        info += '<tr>\n' +

            '<th scope="row"><a href="knowledge_one.html?kid=' + res[i]['kid'] + '">' + res[i]['title'] + '</a></th>\n' +
            '<td><a href="knowledge_one.html?kid=' + res[i]['kid'] + '">'

        // 调节知识的隐藏长度
        if (res[i]['text'].length > 35) {
            info += res[i]['text'].slice(0, 35) + "..."
        }
        else {
            info += res[i]['text']
        }
        info += '</a></td>\n' +
            '<td>\n' +
            '<div class="d-flex order-actions">\n' +
            '<p>&nbsp;&nbsp;&nbsp;</p>\n' +
            '<a href="javascript: delete_knowledge(' + res[i]['kid'] + ');"><i class="bx bxs-trash"></i></a>\n' +
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

// ???????
//删除用户
function delete_knowledge(kid) {

    var xhr = new XMLHttpRequest();
    var url = `http://1.12.74.230/api/knowledge/${kid}`;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response = JSON.parse(xhr.response);
            alert(response.msg);
            location.reload();
        }
    });

    xhr.open("DELETE", url);
    xhr.send();




}



//搜索知识（title）
function knowledge_handleKeyPress(event) {
    if (event.keyCode === 13) {
        var inputTitle = document.getElementById("knowledge_search").value;


        url = `http://1.12.74.230/api/knowledge/page/1/5?title=${inputTitle}`;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.response);
                console.log(response);


                //没有获取到返回数据
                if (response.data == null || (response.data.records != null && response.data.records.length == 0)) {
                    alert("未查询到相关知识,请重新搜索");
                    location.reload();
                }

                //获取单个返回数据
                else if (response.data != null && response.data.records == null) {
                    response = Array.from([response.data]);
                    init_knowledge(response);
                    document.getElementById("pagelist").innerHTML = "";
                }

                //获取到多个返回数据
                else if (response.data != null) {
                    init_knowledge(response.data.records);
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
