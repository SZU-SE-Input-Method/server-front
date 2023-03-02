//author: wch

function initialization(tablename)
{
    const querystring = window.location.search;
    const urlparams = new URLSearchParams(querystring);
    const pagesize = 1;

    var pagenum = urlparams.get('pagenum');
    if (pagenum == null)
        pagenum = 1;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `http://1.12.74.230/api/publicphrases/page/${pagenum}/${pagesize}`, true);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status === 200) 
        {
            var response = JSON.parse(xhr.response);
            console.log(response);

            //初始化短语内容
            if (tablename == "public_phrases")
                public_init_phrasetext(response);
            else if (tablename == "private_phrases")
                private_init_phrasetext(response);

            //初始化进度栏
            init_pagelist(response,tablename,pagenum);
            
        } 
        else
            console.error(xhr.statusText);
    }
}

//获取用户输入的进度栏页数
function get_pagenum(tablename)
{
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

//构造页面内容
function public_init_phrasetext(response)
{
    var res = response.data.records;

    var table = document.getElementById("public_phrases_table");
    var tbody = document.createElement("tbody");

    for (let i = 0; i < res.length; i++)
    {
        var tr = document.createElement("tr");

        var id = document.createElement("th");
        id.setAttribute("scope","row");
        id.appendChild(document.createTextNode(res[i]['ppid']));

        var content = document.createElement("td");
        content.appendChild(document.createTextNode(res[i]['content']));

        var time = document.createElement("td");
        time.appendChild(document.createTextNode(res[i]['createTime']));

        var operration = document.createElement("td");
        var div = document.createElement("div");
        div.setAttribute("class","d-flex order-actions")
        var a1 = document.createElement("a");
        a1.setAttribute("href","javascript: renew_phrases(this);");
        var i1 = document.createElement("i");
        i1.setAttribute("class","bx bxs-edit");
        a1.appendChild(i1);
        div.appendChild(a1);
        var p = document.createElement("p");
        p.innerHTML = "&nbsp;&nbsp;&nbsp;";
        div.appendChild(p)
        var a2 = document.createElement("a");
        a2.setAttribute("href","javascript: delete_phrases(" + res[i]['pid'] + ");");
        var i2 = document.createElement("i");
        i2.setAttribute("class","bx bxs-trash");
        a2.appendChild(i2);
        div.appendChild(a2);
        operration.appendChild(div);

        tr.appendChild(id);
        tr.appendChild(content);
        tr.appendChild(time);
        tr.appendChild(operration);

        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

function private_init_phrasetext(response)
{
    var res = response.data;

    var table = document.getElementById("private_phrases_table");
    var tbody = createElement("tbody");

    for (let i = 0; i < res.length; i++)
    {
        var tr = document.createElement("tr");

        var id = document.createElement("th");
        id.setAttribute("scope","row");
        id.appendChild(document.createTextNode(res[i]['pid']));

        var title = document.createElement("td");
        title.appendChild(document.createTextNode(res[i]['title']));

        var text = document.createElement("td");
        text.appendChild(document.createTextNode(res[i]['text']));

        var time = document.createElement("td");
        time.appendChild(document.createTextNode(res[i]['create_time']));

        tr.appendChild(id);
        tr.appendChild(title);
        tr.appendChild(text);
        tr.appendChild(time);

        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

//构造进度栏
function init_pagelist(response,tablename,nowpage)
{
    var pagelist = document.getElementById("pagelsit");
    var totlepage = parseInt(response.data.pages);
    nowpage = parseInt(nowpage);

    var pagelist = document.getElementById("pagelist");

    var input_node = document.createElement("li");
    input_node.setAttribute("class","page-item");
    var a_input = document.createElement("a");
    a_input.setAttribute("class","page-link");
    a_input.setAttribute("href", `javascript: get_pagenum("${tablename}");`);
    a_input.innerText = "...";
    input_node.appendChild(a_input);

    var input_node_co = document.createElement("li");
    input_node_co.setAttribute("class","page-item");
    var a_input_co = document.createElement("a");
    a_input_co.setAttribute("class","page-link");
    a_input_co.setAttribute("href", `javascript: get_pagenum("${tablename}");`);
    a_input_co.innerText = "...";
    input_node_co.appendChild(a_input_co);

    pagelist.appendChild(create_listnode("First", 1, 0, tablename));

    //两个省略号都不显示
    if (totlepage <= 7)
    {
        for (let i = 1; i <= totlepage; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }
    }

    //显示左省略号
    else if (totlepage > 7 && nowpage > 4 && nowpage >= totlepage - 3)
    {
        pagelist.appendChild(create_listnode(1, 1, 0, tablename));
        pagelist.appendChild(input_node);

        for (let i = nowpage - 2; i <= totlepage; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }
    }

    //显示右省略号
    else if (totlepage > 7 && nowpage <= 4)
    {
        for (var i = 1; i <= nowpage + 2; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0, tablename));
            else
                pagelist.appendChild(create_listnode(i, i, 1, tablename));
        }

        pagelist.appendChild(input_node);
        pagelist.appendChild(create_listnode(totlepage, totlepage, 0, tablename));
    }

    //显示两个省略号
    else if (totlepage > 7)
    {
        pagelist.appendChild(create_listnode(1, 1, 0, tablename));
        pagelist.appendChild(input_node_co);

        for (let i = nowpage - 2; i <= nowpage + 2; i++)
        {
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

function create_listnode(name, value, isactive, tablename)
{
    var li_node = document.createElement("li");
    if (isactive == false)
        li_node.setAttribute("class","page-item");
    else
        li_node.setAttribute("class","page-item active");
    var a_node = document.createElement("a");
    a_node.setAttribute("class","page-link");
    a_node.setAttribute("href", `${tablename}.html?pagenum=${value}")`);
    a_node.innerText = name;
    li_node.appendChild(a_node);

    return li_node;
}

//添加更多行
function addrow()
{
    for (let i = 0; i < 3 ; i++)
    {
        var table = document.getElementById("add_phrases_table");
        var newrow = table.insertRow();
        var cell1 = newrow.insertCell();
        var cell2 = newrow.insertCell();

        var newinput1 = document.createElement("input");
        newinput1.type = "text";
        newinput1.placeholder = "标题";
        newinput1.setAttribute("class","form-control");
        cell1.appendChild(newinput1);

        var newinput2 = document.createElement("input");
        newinput2.type = "text";
        newinput2.placeholder = "内容";
        newinput2.setAttribute("class","form-control");
        cell2.appendChild(newinput2);
    }
}

//上传新增短语
function get_tablevalue()
{
    var table = document.getElementById("add_phrases_table");
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) 
    {
        var inputs = rows[i].getElementsByTagName("input");
        for (var j = 0; j < inputs.length / inputs.length; j++) 
        {
            var title = inputs[0].value;
            var text = inputs[1].value;
            
            if (title != null && text != null)
                upload(title,text);
        }
    }

    alert("添加成功!");
    window.history.back();
}

function upload(title,text)
{
    var xhr = new XMLHttpRequest();

    var url = "/phrase";
    var params = `title=${title}&text=${text}`;
    xhr.open("POST", url, true);
    xhr.send(params);
}

//删除短语
function delete_phrases(pid)
{
    var xhr = new XMLHttpRequest();
    var url = `/phrase/${pid}`;

    xhr.onreadystatechange = function() 
    {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) 
        {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            location.reload();
        }
        else
        {
            alert("删除失败!");
            location.reload();
        }
    };

    xhr.open("DELETE", url);
    xhr.send();
}

//修改短语
const table = document.getElementById('public_phrases_table');
table.addEventListener('click', handleTableClick);

function handleTableClick(event) 
{
    const target = event.target;
    if (target.tagName.toLowerCase() === 'a') 
    {
        event.preventDefault();
        const row = target.parentNode.parentNode.parentNode;
        const cells = row.querySelectorAll('td');
        const cell1 = cells[0];
        const cell2 = cells[1];
        const cell3 = cells[3];

        var text1 = cell1.innerHTML;
        var text2 = cell2.innerHTML;
        
        cell1.innerHTML = `<input class="form-control" type="text" value=${text1}>`;
        cell2.innerHTML = `<input class="form-control" type="text" value=${text2}>`;
        cell3.innerHTML = '<div class="d-flex order-actions"><button type="button" class="btn btn-info px-3 radius-30" onclick="submitchange(this)">保存</button><p>&nbsp;&nbsp;&nbsp;</p><button type="button" class="btn btn-secondary px-3 radius-30" onclick="cancel(this,`' + text1 + '`,`' + text2 + '`)">取消</button></div>';
    }
}

function cancel(button,title,text)
{
    const row = button.parentNode.parentNode.parentNode;
    const pid = row.querySelectorAll('th')[0];
    const cells = row.querySelectorAll('td');
    const cell1 = cells[0];
    const cell2 = cells[1];
    const cell3 = cells[3];

    cell1.innerHTML = title;
    cell2.innerHTML = text;
    cell3.innerHTML = '<div class="d-flex order-actions"><a href="#"><i class="bx bxs-edit"></i></a><p>&nbsp;&nbsp;&nbsp;</p><a href="javascript: delete_phrases(' + pid.innerHTML + ');"><i class="bx bxs-trash"></i></a></div>';
}

function submitchange(button)
{
    const row = button.parentNode.parentNode.parentNode;
    const pid = row.querySelectorAll('th')[0];
    const cells = row.querySelectorAll('td');
    const cell1 = cells[0];
    const cell2 = cells[1];
    const input1 = cell1.querySelectorAll("input")[0];
    const input2 = cell2.querySelectorAll("input")[0];

    xhr.open('PUT', '/phrase');
    xhr.onreadystatechange = function() 
    {
        if (xhr.readyState === 4) 
        {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
            location.reload();
        }
        else
        {
            console.log("修改失败!");
            location.reload();
        }
    };
    const data = 
    {
        pid: pid.innerHTML,
        title: input1.value,
        age: input2.value
    };
    const requestBody = JSON.stringify(data);
    xhr.send(requestBody);
}