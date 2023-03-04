//author: wch

//页面初始化
function initialization(tablename)
{
    const querystring = window.location.search;
    const urlparams = new URLSearchParams(querystring);
    const pagesize = 5;

    var pagenum = urlparams.get('pagenum');
    if (pagenum == null)
        pagenum = 1;

    var xhr = new XMLHttpRequest();
    if (tablename == "public_phrases")
        url = `http://1.12.74.230/api/publicphrases/page/${pagenum}/${pagesize}`;
    else if (tablename == "private_phrases")
        url = `http://1.12.74.230/api/phrase/private/page/${pagenum}/${pagesize}`;
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status === 200) 
        {
            var response = JSON.parse(xhr.response);
            console.log(response);

            //初始化短语内容
            if (tablename == "public_phrases")
                public_init_phrasetext(response.data.records);
            else if (tablename == "private_phrases")
                private_init_phrasetext(response.data.records);

            //初始化进度栏
            init_pagelist(tablename,pagenum,response.data.pages);
            
        } 
        else
            console.error(xhr.statusText);
    }
}

//获取用户输入的分页栏页数
function get_pagenum(tablename)
{
    var url = "";
    let result = window.prompt("请输入页码:", "1");
    while (result !== null && !/^\d+$/.test(result))
        result = window.prompt("请输入正确的数字页码:", "1");

    var pagelist = document.getElementById("pagelist");
    var lst = pagelist.querySelectorAll("li");
    var maxpage = lst[lst.length - 2].innerText;
    if (parseInt(result) > parseInt(maxpage))
    {
        alert("超过页数范围,请重新输入");
        location.reload();
        return;
    }
    
    if (tablename == "public_phrases")
        url = `http://1.12.74.230/backend/public_phrases.html?pagenum=${result}`;
    else if (tablename == "private_phrases")
        url = `http://1.12.74.230/backend/private_phrases.html?pagenum=${result}`;
    location.href = url;
}

//构造公有短语表格内容
function public_init_phrasetext(res)
{
    var table = document.getElementById("public_phrases_table");
    var tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

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
        a1.setAttribute("href","javascript:;");
        var i1 = document.createElement("i");
        i1.setAttribute("class","bx bxs-edit");
        a1.appendChild(i1);
        div.appendChild(a1);
        var p = document.createElement("p");
        p.innerHTML = "&nbsp;&nbsp;&nbsp;";
        div.appendChild(p)
        var a2 = document.createElement("a");
        a2.setAttribute("href","javascript: delete_phrases('" + res[i]['ppid'] + "');");
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
}

//构造私有短语表格内容
function private_init_phrasetext(res)
{
    var table = document.getElementById("private_phrases_table");
    var tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < res.length; i++)
    {
        var tr = document.createElement("tr");

        var pid = document.createElement("th");
        pid.setAttribute("scope","row");
        pid.appendChild(document.createTextNode(res[i]['pid']));

        var content = document.createElement("td");
        content.appendChild(document.createTextNode(res[i]['content']));

        var uid = document.createElement("td");
        uid.appendChild(document.createTextNode(res[i]['uid']));

        var time = document.createElement("td");
        time.appendChild(document.createTextNode(res[i]['createTime']));

        tr.appendChild(pid);
        tr.appendChild(content);
        tr.appendChild(uid);
        tr.appendChild(time);

        tbody.appendChild(tr);
    }
}

//构造分页栏
function init_pagelist(tablename,nowpage,totlepage)
{
    totlepage = parseInt(totlepage);
    nowpage = parseInt(nowpage);

    if (totlepage == 1)
        return;

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

//构造分页栏的一个节点
function create_listnode(name, value, isactive, tablename)
{
    var li_node = document.createElement("li");
    if (isactive == false)
        li_node.setAttribute("class","page-item");
    else
        li_node.setAttribute("class","page-item active");
    var a_node = document.createElement("a");
    a_node.setAttribute("class","page-link");
    a_node.setAttribute("href", `${tablename}.html?pagenum=${value}`);
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
        var cell = newrow.insertCell();

        var newinput = document.createElement("input");
        newinput.type = "text";
        newinput.placeholder = "短语内容";
        newinput.setAttribute("class","form-control");
        cell.appendChild(newinput);
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
            var text = inputs[0].value;
            if (text != null && text != "")
                upload(text);
        }
    }

    alert("添加成功!");
    window.history.back();
}

function upload(text)
{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://1.12.74.230/api/publicphrases");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            console.log(this.responseText);
        }
    });
    let data = { "content": text };
    let jsonData = JSON.stringify(data);
    xhr.send(jsonData);
}

//删除短语
function delete_phrases(pid)
{
    var xhr = new XMLHttpRequest();
    var url = `http://1.12.74.230/api/publicphrases/${pid}`;

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            var response = JSON.parse(xhr.response);
            alert(response.msg);
            location.reload();
        }
    });

    xhr.open("DELETE", url);
    xhr.send();
}

//修改短语
function handleTableClick(event) 
{
    const target = event.target;
    if (target.tagName.toLowerCase() === 'a') 
    {
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
function cancel(button,text)
{
    const row = button.parentNode.parentNode.parentNode;
    const pid = row.querySelectorAll('th')[0];
    const cells = row.querySelectorAll('td');
    const cell1 = cells[0];
    const cell2 = cells[2];

    cell1.innerHTML = text;
    cell2.innerHTML = '<div class="d-flex order-actions"><a href="#"><i class="bx bxs-edit"></i></a><p>&nbsp;&nbsp;&nbsp;</p><a href="javascript: delete_phrases(' + pid.innerHTML + ');"><i class="bx bxs-trash"></i></a></div>';
}

//上传修改的短语
function submitchange(button)
{
    const row = button.parentNode.parentNode.parentNode;
    const ppid = row.querySelectorAll('th')[0];
    const cells = row.querySelectorAll('td');
    const cell = cells[0];
    const content = cell.querySelectorAll("input")[0];

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://1.12.74.230/api/publicphrases");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            var response = JSON.parse(xhr.response);
            alert(response.msg);
            location.reload();
        }
    });
    let data = { "ppid": ppid.innerText, "content" : content.value};
    let jsonData = JSON.stringify(data);
    console.log(jsonData)
    xhr.send(jsonData);
}

//公有短语的搜索
function public_handleKeyPress(event)
{
    if (event.keyCode === 13) 
    { 
        var inputContent = document.getElementById("public_search").value;
        var ppid = parseInt(inputContent);
        var url = "";

        if (/^\d+$/.test(inputContent))
            url = `http://1.12.74.230/api/publicphrases/${ppid}`;
        else 
            url = `http://1.12.74.230/api/publicphrases/page/1/5?content=${inputContent}`;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function() 
        {
            if (xhr.status === 200) 
            {
                var response = JSON.parse(xhr.response);
                console.log(response);


                //没有获取到返回数据
                if (response.data == null || (response.data.records != null && response.data.records.length == 0))
                {
                    alert("未查询到相关短语,请重新搜索");
                    location.reload();
                }
    
                //获取单个返回数据
                else if (response.data != null && response.data.records == null)
                {
                    response = Array.from([response.data]);
                    public_init_phrasetext(response);
                    document.getElementById("pagelist").innerHTML = "";
                }

                //获取到多个返回数据
                else if (response.data != null)
                {
                    public_init_phrasetext(response.data.records);
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

//私有短语的搜索
function private_handleKeyPress(event)
{
    if (event.keyCode === 13) 
    { 
        var inputContent = document.getElementById("private_search").value;
        var ppid = parseInt(inputContent);
        var url = "";

        if (/^\d+$/.test(inputContent))
            url = `http://1.12.74.230/api/phrase/private/${ppid}`;
        else 
            url = `http://1.12.74.230/api/phrase/private/page/1/5?content=${inputContent}`;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function() 
        {
            if (xhr.status === 200) 
            {
                var response = JSON.parse(xhr.response);
                console.log(response);

                //没有获取到返回数据
                if (response.data == null || (response.data.records != null && response.data.records.length == 0))
                {
                    alert("未查询到相关短语,请重新搜索");
                    location.reload();
                }
    
                //获取单个返回数据
                else if (response.data != null && response.data.records == null)
                {
                    response = Array.from([response.data]);
                    private_init_phrasetext(response);
                    document.getElementById("pagelist").innerHTML = "";
                }

                //获取到多个返回数据
                else if (response.data != null)
                {
                    private_init_phrasetext(response.data.records);
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