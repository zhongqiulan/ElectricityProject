var letao;
$(function(){
    letao = new Letao();
    letao.getUserMessage();
})
var Letao = function(){

}
Letao.prototype = {
    // 获取用户信息
    getUserMessage:function(){
        $.ajax({
            url:'/user/queryUserMessage',
            success:function(data){
                console.log(data);
            }
        })
    }
}