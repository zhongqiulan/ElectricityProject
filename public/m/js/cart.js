var letao;
$(function(){
    letao = new Letao();
    letao.queryCart();
})
var Letao = function(){

}
Letao.prototype = {
    queryCart:function(){
        $.ajax({
            url:'/cart/queryCart',
            success:function(data){
                data={data};
                console.log(data);
                var html = template('queryCartTmp',data);
                $('#main').html(html);

            }
        })
    }
}