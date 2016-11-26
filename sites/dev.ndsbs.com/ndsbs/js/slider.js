 // JavaScript Document
// JavaScript Document
flag = 2;
var sec = 10;
var tmp = 1;
jQuery(document).ready(function() {
	
jQuery(".thumbs li").click(function() {
tmp = 2;
var x = $(this).attr("id");
var y = x.substr(x.length - 1);
jQuery(".thumbs li").removeClass("active");
for (i = 0; i <= 3; i++) {
//jQuery(".slide"+i).fadeOut(600);
jQuery(".slide"+i).fadeOut(2000);
}
//jQuery("." + x).fadeIn(600);
jQuery("." + x).fadeIn(2000);
flag = parseInt(y)+1;
this.className = 'active'


});
setInterval(function(){
if( tmp == 2 ) {
sleep(4000);
tmp = 1;
//return;
}
jQuery(".thumbs li").removeClass("active");
for (i = 0; i <= 3; i++) {
jQuery(".slide"+i).hide();
}
if(flag<=3){
//jQuery(".slide"+flag).fadeIn(600)
jQuery(".slide"+flag).fadeIn(2000)
}
else{
flag=1;
//jQuery(".slide"+flag).fadeIn(600)
jQuery(".slide"+flag).fadeIn(2000)
}
jQuery("#slide"+flag).addClass('active');
flag++;

},sec*1000
);
});


function sleep(ms)
{
var dt = new Date();
dt.setTime(dt.getTime() + ms);
while (new Date().getTime() < dt.getTime());
}

