document.addEventListener('DOMContentLoaded', function () {
    // 获取搜索按钮和输入框元素
    var searchuid = document.getElementById('search-uid-click');
    var Input = document.getElementById('search-uid');

    // 监听搜索按钮的点击事件
    searchuid.addEventListener('click', function (event) {
        // 阻止默认行为
        event.preventDefault();

        // 获取输入框的值
        var uid = Input.value;

        window.alert("search");
        // 发送搜索请求并更新结果
        // search(uid);
    });
});

function search(uid) {
    // 发送搜索请求并获取结果
    // 这里使用了一个虚构的 API URL
    var apiUrl = 'http://example.com/api/search?q=' + encodeURIComponent(searchTerm);
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // 处理搜索结果
            var searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '';
            data.forEach(function (result) {
                var li = document.createElement('li');
                li.textContent = result.title;
                searchResults.appendChild(li);
            });
        })
        .catch(function (error) {
            console.error('搜索错误：', error);
        });
}
