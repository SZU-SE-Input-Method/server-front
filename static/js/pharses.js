//author: wch

function initialization()
{
    const querystring = window.location.search;
    const urlparams = new URLSearchParams(querystring);
    const pagenum = urlparams.get('pagenum');
    get_pagecontext(pagenum);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/pharse?page=${pagenum}`, true);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status === 200) 
        {
            var response = JSON.parse(xhr.response);
            console.log(response);

            //初始化短语内容
            init_phrasetext(response);

            //初始化进度栏
            init_pagelist(response);
            
        } 
        else
            console.error(xhr.statusText);
    }
}

//获取用户输入的进度栏页数
function get_pagenum()
{
    let result = window.prompt("请输入页码:", "1");
    while (result !== null && !/^\d+$/.test(result))
        result = window.prompt("请输入正确的数字页码:", "1");
    const url = `public_phrases.html?pagenum=${result}`;

    if (result !== null)
        window.location.href = url;
}

//构造页面内容
function init_phrasetext(response)
{
    var res = response.data;

    var table = document.getElementById("public_phrases_table");
    var tbody = createElement("tbody");

    for (let i = 0; i < res.length; i++)
    {
        var tr = document.createElement("tr");

        var id = document.createElement("th");
        id.setAttribute("scope","row");
        id.appendChild(document.createTextNode(res[i]['pid']));

        var title = document.createElement("td");
        title.appendChild(document.createTextNode(res[i][title]));

        var text = document.createElement("td");
        text.appendChild(document.createTextNode(res[i]['text']));

        var time = document.createElement("td");
        time.appendChild(document.createTextNode(res[i]['create_time']));

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
        p.appendChild(document.createTextNode("&nbsp;&nbsp;&nbsp;"));
        div.appendChild(p)
        var a2 = document.createElement("a");
        a2.setAttribute("href","javascript:;");
        var i2 = document.createElement("i");
        i2.setAttribute("class","bx bxs-trash");
        a2.appendChild(i2);
        div.appendChild(a2);
        operration.appendChild(div);

        tr.appendChild(id);
        tr.appendChild(title);
        tr.appendChild(text);
        tr.appendChild(time);
        tr.appendChild(operration);

        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

//构造进度栏
function init_pagelist(response)
{
    var pagelist = document.getElementById("pagelsit");
    var nowpage = response.nowpage;
    var totlepage = response.totlepage;

    var pagelist = document.getElementById("pagelist");
    var input_node = document.createElement("li");
    input_node.setAttribute("class","page-item");
    var a_input = document.createElement("a");
    a_input.setAttribute("class","page-link");
    a_input.setAttribute("href", "javascript: get_pagenum();");
    a_input.innerText = "...";
    input_node.appendChild(a_node);

    pagelist.appendChild(create_listnode("First page", 1, 0));

    //两个省略号都不显示
    if (totlepage <= 7)
    {
        for (let i = 1; i <= totlepage; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0));
            else
                pagelist.appendChild(create_listnode(i, i, 1));
        }
    }

    //显示左省略号
    else if (totlepage > 7 && nowpage > 4)
    {
        pagelist.appendChild(create_listnode(1, 1, 0));
        pagelist.appendChild(input_node);

        for (let i = nowpage - 2; i <= totlepage; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0));
            else
                pagelist.appendChild(create_listnode(i, i, 1));
        }
    }

    //显示右省略号
    else if (totlepage > 7 && nowpage <= 4)
    {
        for (let i = 1; i <= nowpage + 2; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0));
            else
                pagelist.appendChild(create_listnode(i, i, 1));
        }

        pagelist.appendChild(input_node);
        pagelist.appendChild(create_listnode(totlepage, totlepage, 0));
    }

    //显示两个省略号
    else if (totlepage > 7)
    {
        pagelist.appendChild(1, 1, 0);
        pagelist.appendChild(input_node);

        for (let i = nowpage - 2; i <= nowpage + 2; i++)
        {
            if (i != nowpage)
                pagelist.appendChild(create_listnode(i, i, 0));
            else
                pagelist.appendChild(create_listnode(i, i, 1));
        }

        pagelist.appendChild(input_node);
        pagelist.appendChild(totlepage, totlepage, 0);
    }

    pagelist.appendChild(create_listnode("Last page", totlepage, 0));
}

function create_listnode(name, value, isactive)
{
    var li_node = document.createElement("li");
    if (isactive == false)
        li_node.setAttribute("class","page-item");
    else
        li_node.setAttribute("class","page-item active");
    var a_node = document.createElement("a");
    a_node.setAttribute("class","page-link");
    a_node.setAttribute("href", `javascript: window.location.href("public_phrases.html?pagenum=${value}")`);
    a_node.innerText = name;
    li_node.appendChild(a_node);

    return li_node;
}