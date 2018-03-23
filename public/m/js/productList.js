var letao;
// 定义一个全局的页面
var page = 1;
// 获取url中地址栏的参数的值
var search;
$(function () {
    letao = new Letao();
    letao.initPullRefresh();
    letao.searchProduct();
    letao.productSort();
    search = letao.getQueryString('key');
})
var Letao = function () {

}
Letao.prototype = {

    //初始化下拉刷新
    /*上拉刷新及下拉刷新依赖于区域滚动*/
    initPullRefresh: function () {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    // contentdown: "下拉可以刷新",
                    contentrefresh: "正在加载更多...",
                    contentover: "释放立即刷新",
                    style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                    color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                    // height: '50px', //可选,默认50px.下拉刷新控件的高度,
                    range: '100px', //可选 默认100px,控件可下拉拖拽的范围
                    offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
                    auto: true, //可选,默认false.首次加载自动上拉刷新一次
                    // callback: pullfresh - function //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    callback: function () {
                        /*定义一个定时器模拟请求*/
                        setTimeout(function () {
                            letao.getProduct({
                                proName: search,
                                page: 1,
                                pageSize: 6
                            }, function (data) {
                                var html = template('productListTmp', data);
                                $('.product-list .mui-row').html(html);
                                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                                // 4. 重置上拉加载更多 （不然如果之前已经拉到底就无法上拉了）
                                mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                            });
                            //结束下拉刷新 调用结束下拉刷新的方法 传入下拉刷新的父容器
                            // mui('.mui-scroll-wrapper').pullRefresh().endPulldown();
                            // 注意这个结束下拉刷新的方法更新为下面这个
                            page = 1;
                        }, 1000)
                    }
                },
                up: {
                    contentrefresh: "正在加载更多...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    contentnomore: '我是有底线的', //可选，请求完毕若没有更多数据时显示的提醒内容；
                    // 上拉加载更多的回调函数
                    callback: function () {
                        /*延迟1秒钟结束上拉加载更多*/
                        setTimeout(function () {
                            page++;
                            letao.getProduct({
                                proName: search,
                                page: page,
                                pageSize: 6
                            }, function (data) {
                                var html = template('productListTmp', data);
                                if (html) {
                                    $('.product-list .mui-row').append(html);
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                                } else {
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                                }

                            });
                            // 结束上拉加载的方法  endPullupToRefresh可以传入参数  false 或者 true 
                            //传入true就会结束上拉加载更多并且提示没有更多数据了
                            //传入false就表示结束上拉加载 但是后面还可以上拉（还有数据）

                        }, 1000);
                    }
                }
            }
        });
    },
    /*获取商品数据*/

    getProduct: function (options, callback) {
        // 1.给参数添加默认值
        options.proName = options.proName || '';
        options.brandId = options.brandId || '';
        options.price = options.price || 1;
        options.num = options.num || 1;
        options.page = options.page || 1;
        options.pageSize = options.pageSize || 2;
        /* 2.调用获取商品的api并且传入options参数*/
        $.ajax({
            url: '/product/queryProduct',
            type: 'get',
            data: options,
            success: function (data) {
                callback(data);
            }
        })
    },
    /*搜索商品*/
    searchProduct: function () {
        $('.search-btn').on('tap', function () {
            var val = $('.search-input').val();
            letao.getProduct({
                proName: val,
                pageSize:6
            }, function (data) {
                var html = template('productListTmp', data);
                $('.product-list .mui-row').html(html);
            });
        })
        $('.product-list').on('click','.btn',function(){
            var id = $(this).data('id');
            window.location.href = 'http://localhost:3000/m/detail.html?id='+id;
            
        })
    },
    /*商品的排序*/
    productSort: function () {
        $('.nav').on('tap', '.mui-row > a', function () {
            $('.nav .mui-row > a').removeClass('active');
            $('.nav .mui-row > a > span').removeClass('active');
            $(this).addClass('active');
            $(this).find('span').addClass('active');
            var sortType = $(this);
            var datasort = sortType.data('sort-type');
            var sort = sortType.data('sort');
            if (datasort == 'price') {
                if (sort == 1) {
                    sort = 2;
                    $(this).attr('data-sort', sort);

                } else if (sort == 2) {
                    sort = 1;
                    $(this).attr('data-sort', sort);
                }
                letao.getProduct({
                    proName: search,
                    price: sort,
                    page: 1,
                    pageSize: 6
                }, function (data) {
                    var html = template('productListTmp', data);
                    $('.product-list .mui-row').html(html);
                });
            } else if (datasort == 'num') {
                if (sort == 1) {
                    sort = 2;
                    $(this).attr('data-sort', sort);

                } else if (sort == 2) {
                    sort = 1;
                    $(this).attr('data-sort', sort);
                }
                letao.getProduct({
                    proName: search,
                    num: sort,
                    page: 1,
                    pageSize: 6
                }, function (data) {
                    var html = template('productListTmp', data);
                    $('.product-list .mui-row').html(html);
                });
            }
        })
    },
    // 获取url中参数的值
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }


}