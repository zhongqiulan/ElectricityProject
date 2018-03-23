var letao;
/*入口函数，可以延迟执行*/
$(function () {
    letao = new Letao();
    letao.addHistory();
    letao.queryHistory();
    letao.removeHistory();
    letao.clearHistory();
})
var Letao = function () {

}
Letao.prototype = {
    /*添加搜索记录*/
    addHistory: function () {

        $('.search-form .search-btn').on('tap', function (e) {
            var search = $('.search-form>input').val();
            if (search) {
                var searchHistory = localStorage.getItem('searchHistory');
                // 判断本地存储的searchHistory是否有值
                if (searchHistory) {
                    // 如果有值是一个字符串 要转成数组  JSON.parse() 把字符串转成数组
                    searchHistory = JSON.parse(searchHistory);
                } else {
                    //如果没有值就为空数组
                    searchHistory = [];
                }
                /*数组去重*/
                for (var i = 0; i < searchHistory.length; i++) {
                    if (searchHistory[i].search == search) {
                         // 跳转页面之前阻止默认的表单提交       
                        e.preventDefault();
                        // 调转到商品列表页面并且跟上key=search
                        window.location.href = "http://localhost:3000/m/productlist.html?key=" + search;    
                        return;
                    }
                }
                // 定义一个当前搜索立记录的id 如果本地存储没有值  id就默认为1
                // 如果已经有值 id就为最后一个记录的id+1
                var id;
                if (searchHistory.length > 0) {
                    id = searchHistory[searchHistory.length - 1].id + 1;
                } else {
                    id = 1;
                }
                // 给每个搜索记录添加一个id  用来后面方便去删除	
                var obj = {
                    id: id,
                    search: search
                }
                searchHistory.push(obj);
                // 4. 把当前输入的内容添加到数组里面
                // 5. 把搜索历史数组存储到本地存储中（转成json格式的字符串）
                searchHistory = JSON.stringify(searchHistory);
                // 6. 调用本地存储存储方法存储当前数组
                localStorage.setItem('searchHistory', searchHistory);
                // 阻止默认的表单提交

                letao.queryHistory();
                // 跳转页面之前阻止默认的表单提交       
                e.preventDefault();
                // 调转到商品列表页面并且跟上key=search
                window.location.href = "http://localhost:3000/m/productlist.html?key=" + search;    
            }

        })
        $('.search-history .search-list').on('tap','li',function(){
            var value = $(this).find('a').data('value');
            window.location.href = "http://localhost:3000/m/productList.html?key="+value;
        })
    },
    /*查询搜索记录*/
    queryHistory: function () {
        var searchHistory = localStorage.getItem('searchHistory');
        if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
        } else {
            searchHistory = [];
        }

        /*把数组包装成对象，因为模板引擎只能传入对象*/
        var obj = {
            rows: searchHistory.reverse()
        }
        var html = template('searchHistoryTmp', obj);
        $('.search-history .search-list').html(html);

    },
    /*删除某条指定的搜索记录*/
    removeHistory: function () {
        $('.search-history .search-list').on('tap', 'li > span', function () {
            var id = $(this).data('id');
            /*先获取所有的本地存储数据*/
            var searchHistory = localStorage.getItem('searchHistory');
            /*做一个判断，如果有值，转化成数组*/
            if (searchHistory) {
                searchHistory = JSON.parse(searchHistory);
            } else {
                searchHistory = [];
            }
            for (var i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].id == id) {
                    searchHistory.splice(i, 1);
                }
            }
            searchHistory = JSON.stringify(searchHistory);
            localStorage.setItem('searchHistory', searchHistory);
            letao.queryHistory();

        })
    },

    /*清空搜索记录*/
    clearHistory: function () {
        $('.history-title .icon-right').click(function () {
            var searchHistory = localStorage.setItem('searchHistory', '');
            letao.queryHistory();
        })
    }
}