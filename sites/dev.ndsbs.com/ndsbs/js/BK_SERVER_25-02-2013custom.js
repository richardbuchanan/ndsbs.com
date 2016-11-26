$(document).ready(function () {
 /* Start img function*/
    var theWindow = $(window),
        $bg = $("#bg"),
        aspectRatio = $bg.width() / $bg
            .height();

    function resizeBg() {
        if (($('.slide').width() / $('.slide')
            .height()) < aspectRatio) {
            $bg.removeClass()
                .addClass('bgheight');

        } else {
            $bg.removeClass()
                .addClass('bgwidth');
        }
    }

    theWindow.resize(function () {
        resizeBg();
    })
        .trigger("resize");		
/* End img function*/ 
 /* Start Universal textbox watermark function*/
    $('.watermark').each(function () {
        var default_value = this.value;
        $(this).focus(function () {
            if (this.value == default_value) {
                this.value = '';
            }
        });
        $(this).blur(function () {
            if (this.value == '') {
                this.value = default_value;
            }
        });  
    });
/* End Universal textbox watermark function*/
/* Starts dropdown menu function*/
    var $leftNav = {
        switchNav: function () {
            jQuery('.left_menu ul li span.main_link').click(function () {
                if($(this).hasClass('expanded'))
				{
					$(this).removeClass('expanded');
					jQuery(this).next()
                        .slideToggle(500);
				}
				else{
					$(this).addClass('expanded')
					$(this).next()
                        .slideToggle(500);
				}			
            });
        },
        //event on clicking the link items
        leftNavContent: function () {
            jQuery('.left_menu ul li ul li a').click(function (e) {
                //e.preventDefault();
            });
        }
    }
    $leftNav.switchNav();
    $leftNav.leftNavContent();
	
/* End dropdown menu function*/
/* Starts dropdown function*/
    var x = {
		toggleLogin1 : function( elem ){
			jQuery(".ndrequests_jewel").removeClass("ndrequests_jewel_active");	
			jQuery("#ndrequests_layout").slideUp(400);
			if(jQuery(elem).hasClass("ndmassage_jewel_active")){
				jQuery(".ndmassage_jewel").removeClass("ndmassage_jewel_active");	
				jQuery("#ndmassage_layout").slideUp(400);
			}
			else{
				jQuery("#ndmassage_layout").slideDown(400);
				jQuery(elem).addClass("ndmassage_jewel_active");
			}
		},
		closeLogin1 : function(){
			jQuery(".ndmassage_jewel").removeClass("ndmassage_jewel_active");	
			jQuery("#ndmassage_layout").slideUp(400);
		},
		
		toggleLogin2 : function( elem ){
			jQuery(".ndmassage_jewel").removeClass("ndmassage_jewel_active");	
			jQuery("#ndmassage_layout").slideUp(400);
			if(jQuery(elem).hasClass("ndrequests_jewel_active")){
				jQuery(".ndrequests_jewel").removeClass("ndrequests_jewel_active");	
				jQuery("#ndrequests_layout").slideUp(400);
			}
			else{
				jQuery("#ndrequests_layout").slideDown(400);
				jQuery(elem).addClass("ndrequests_jewel_active");
			}
		},
		closeLogin2 : function(){
			jQuery(".ndrequests_jewel").removeClass("ndrequests_jewel_active");	
				jQuery("#ndrequests_layout").slideUp(400);
		}
	}
		
	jQuery(".ndmassage_jewel").click(function (event) {
		event.preventDefault()
        x.toggleLogin1(this);
    });
	
	jQuery(".ndrequests_jewel").click(function (event) {
		event.preventDefault()
        x.toggleLogin2(this);
    });  
	
	jQuery(".ndmassage_jewel").click(function(event){
		jQuery("html").click(function(){
			x.closeLogin1()	
		});
		event.stopPropagation();
	});
	jQuery(".ndrequests_jewel").click(function(event){
		jQuery("html").click(function(){
			x.closeLogin2()	
		});
		event.stopPropagation();
	});
/* End dropdown function*/
/*accordian interaction starts here*/
	var $accordian = {
	  ppAcordian : function(){
		jQuery('h2.trigger').click(function(){
		//toggle active class
		  jQuery(this).toggleClass('active');
		  //toggle content box
		  jQuery(this).siblings('.toggle_box').slideToggle();
	  });			
		}	
	}
	$accordian.ppAcordian();
/*accordian interaction ends here*/
/*slider starts here*/
jQuery(".slides_b ul li").click(function() {
	var x = $(this).attr("id");
	jQuery(".slides_b ul li").removeClass("active");
	for (i = 0; i <= 4; i++) {
		jQuery(".li"+i).hide();
	}
	//jQuery("." + x).fadeIn(1000);
	jQuery("." + x).slideToggle(1000);
	this.className = 'active'
});
/*slider ends here*/

/* Starts menu function*/
	$('.nav li').hover(
		function()
		{
			$(this).children('ul').slideToggle(500);
			$(this).children('a:first').addClass('selected');	
		},
		function()
		{
			$(this).children('ul').hide();
			$(this).children('a:first').removeClass('selected');
		}
	);
/* Ends menu function*/

});