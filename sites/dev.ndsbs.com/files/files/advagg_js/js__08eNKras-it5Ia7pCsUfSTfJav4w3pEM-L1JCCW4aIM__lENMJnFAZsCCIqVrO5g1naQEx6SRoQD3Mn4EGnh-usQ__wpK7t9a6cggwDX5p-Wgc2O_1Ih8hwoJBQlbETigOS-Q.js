/*
  @file
  Defines the simple modal behavior
*/

(function ($) {
  /*
    Add the class 'simple-dialog' to open links in a dialog
    You also need to specify 'rev="<selector>"' where the <selector>
    is the unique id of the container to load from the linked page.
    Any additional jquery ui dialog options can be passed through
    the rel tag using the format:
       rel="<option_name1>:<value1>;<option_name2>:<value2>;"
    e.g. <a href="financing/purchasing-options" class="simple-dialog"
          rel="width:900;resizable:false;position:[60,center]"
          rev="content-area" title="Purchasing Options">Link</a>
    NOTE: This method doesn't not bring javascript files over from
    the target page. You will need to make sure your javascript is
    either inline in the html that's being loaded, or in the head tag
    of the page you are on.
    ALSO: Make sure the jquery ui.dialog library has been added to the page
  */
  Drupal.behaviors.simpleDialog = {
    attach: function (context, settings) {
      // Create a container div for the modal if one isn't there already
      if ($("#simple-dialog-container").length == 0) {
        // Add a container to the end of the body tag to hold the dialog
        $('body').append('<div id="simple-dialog-container" style="display:none;"></div>');
        try {
          // Attempt to invoke the simple dialog
          $( "#simple-dialog-container", context).dialog({
            autoOpen: false,
            modal: true,
            close: function(event, ui) {
              // Clear the dialog on close. Not necessary for your average use
              // case, butis useful if you had a video that was playing in the
              // dialog so that it clears when it closes
              $('#simple-dialog-container').html('');
            }
          });
          var defaultOptions = Drupal.simpleDialog.explodeOptions(settings.simpleDialog.defaults);
          $('#simple-dialog-container').dialog('option', defaultOptions);
        }
        catch (err) {
          // Catch any errors and report
          Drupal.simpleDialog.log('[error] Simple Dialog: ' + err);
        }
      }
      // Add support for custom classes if necessary
      var classes = '';
      if (settings.simpleDialog.classes) {
        classes = ', .' + settings.simpleDialog.classes;
      }
      $('a.simple-dialog' + classes, context).each(function(event) {
        if (!event.metaKey && !$(this).hasClass('simpleDialogProcessed')) {
          // Add a class to show that this link has been processed already
          $(this).addClass('simpleDialogProcessed');
          $(this).click(function(event) {
            // prevent the navigation
            event.preventDefault();
            // Set up some variables
            var url = $(this).attr('href');
      	    // Use default title if not provided
      	    var title = $(this).attr('title') ? $(this).attr('title') : settings.simpleDialog.title;
      	    if (!title) {
      		    title = $(this).text();
      	    }
            // Use defaults if not provided
            var selector = $(this).attr('name') ? $(this).attr('name') : settings.simpleDialog.selector;
            var options = $(this).attr('rel') ? Drupal.simpleDialog.explodeOptions($(this).attr('rel')) : Drupal.simpleDialog.explodeOptions(settings.simpleDialog.defaults);
            if (url && title && selector) {
              // Set the custom options of the dialog
              $('#simple-dialog-container').dialog('option', options);
              // Set the title of the dialog
              $('#simple-dialog-container').dialog('option', 'title', title);
              // Add a little loader into the dialog while data is loaded
              $('#simple-dialog-container').html('<div class="simple-dialog-ajax-loader"></div>');
              // Change the height if it's set to auto
              if (options.height && options.height == 'auto') {
                $('#simple-dialog-container').dialog('option', 'height', 200);
              }
              // Use jQuery .get() to request the target page
              $.get(url, function(data) {
                // Re-apply the height if it's auto to accomodate the new content
                if (options.height && options.height == 'auto') {
                  $('#simple-dialog-container').dialog('option', 'height', options.height);
                }
                // Some trickery to make sure any inline javascript gets run.
                // Inline javascript gets removed/moved around when passed into
                // $() so you have to create a fake div and add the raw data into
                // it then find what you need and clone it. Fun.
                $('#simple-dialog-container').html( $( '<div></div>' ).html( data ).find( '#' + selector ).clone() );
                // Attach any behaviors to the loaded content
                Drupal.attachBehaviors($('#simple-dialog-container'));
                // Trigger a custom event
                $('#simple-dialog-container').trigger('simpleDialogLoaded');
              });
              // Open the dialog
              $('#simple-dialog-container').dialog('open');
              // Return false for good measure
              return false;
            }
          });
        }
      });
    }
  }

  // Create a namespace for our simple dialog module
  Drupal.simpleDialog = {};

  // Convert the options to an object
  Drupal.simpleDialog.explodeOptions = function (opts) {
    var options = opts.split(';');
    var explodedOptions = {};
    for (var i in options) {
      if (options[i]) {
        // Parse and Clean the option
        var option = Drupal.simpleDialog.cleanOption(options[i].split(':'));
        explodedOptions[option[0]] = option[1];
      }
    }
    return explodedOptions;
  }

  // Function to clean up the option.
  Drupal.simpleDialog.cleanOption = function(option) {
    // If it's a position option, we may need to parse an array
    if (option[0] == 'position' && option[1].match(/\[.*,.*\]/)) {
      option[1] = option[1].match(/\[(.*)\]/)[1].split(',');
      // Check if positions need be converted to int
      if (!isNaN(parseInt(option[1][0]))) {
        option[1][0] = parseInt(option[1][0]);
      }
      if (!isNaN(parseInt(option[1][1]))) {
        option[1][1] = parseInt(option[1][1]);
      }
    }
    // Convert text boolean representation to boolean
    if (option[1] === 'true') {
      option[1]= true;
    }
    else if (option[1] === 'false') {
      option[1] = false;
    }
    return option;
  }

  Drupal.simpleDialog.log = function(msg) {
    if (window.console) {
      window.console.log(msg);
    }

  }

})(jQuery);

;/**/
(function ($) {

/**
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').once().before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
;/**/
/**
* JavaScript routines for Krumo
*
* @link http://sourceforge.net/projects/krumo
*/

/////////////////////////////////////////////////////////////////////////////

/**
* Krumo JS Class
*/
function krumo() {
	}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

/**
* Add a CSS class to an HTML element
*
* @param HtmlElement el 
* @param string className 
* @return void
*/
krumo.reclass = function(el, className) {
	if (typeof el.className !== 'undefined' && el.className.indexOf(className) < 0) {
		el.className += (' ' + className);
		}
	}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

/**
* Remove a CSS class to an HTML element
*
* @param HtmlElement el 
* @param string className 
* @return void
*/
krumo.unclass = function(el, className) {
	if (typeof el.className !== 'undefined' && el.className.indexOf(className) > -1) {
		el.className = el.className.replace(className, '');
		}
	}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

/**
* Toggle the nodes connected to an HTML element
*
* @param HtmlElement el 
* @return void
*/
krumo.toggle = function(el) {
	var ul = el.parentNode.getElementsByTagName('ul');
	for (var i=0; i<ul.length; i++) {
		if (ul[i].parentNode.parentNode == el.parentNode) {
			ul[i].parentNode.style.display = (ul[i].parentNode.style.display == 'none')
				? 'block'
				: 'none';
			}
		}

	// toggle class
	//
	if (ul[0].parentNode.style.display == 'block') {
		krumo.reclass(el, 'krumo-opened');
		} else {
		krumo.unclass(el, 'krumo-opened');
		}
	}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

/**
* Hover over an HTML element
*
* @param HtmlElement el 
* @return void
*/
krumo.over = function(el) {
	krumo.reclass(el, 'krumo-hover');
	}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

/**
* Hover out an HTML element
*
* @param HtmlElement el 
* @return void
*/

krumo.out = function(el) {
	krumo.unclass(el, 'krumo-hover');
	}
	
/////////////////////////////////////////////////////////////////////////////;/**/
// jQuery Mask Plugin v1.13.4
// github.com/igorescobar/jQuery-Mask-Plugin
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):"object"===typeof exports?module.exports=b(require("jquery")):b(jQuery||Zepto)})(function(b){var y=function(a,c,d){a=b(a);var g=this,k=a.val(),l;c="function"===typeof c?c(a.val(),void 0,a,d):c;var e={invalid:[],getCaret:function(){try{var q,b=0,e=a.get(0),f=document.selection,c=e.selectionStart;if(f&&-1===navigator.appVersion.indexOf("MSIE 10"))q=f.createRange(),q.moveStart("character",a.is("input")?-a.val().length:-a.text().length),
  b=q.text.length;else if(c||"0"===c)b=c;return b}catch(d){}},setCaret:function(q){try{if(a.is(":focus")){var b,c=a.get(0);c.setSelectionRange?c.setSelectionRange(q,q):c.createTextRange&&(b=c.createTextRange(),b.collapse(!0),b.moveEnd("character",q),b.moveStart("character",q),b.select())}}catch(f){}},events:function(){a.on("input.mask keyup.mask",e.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){a.keydown().keyup()},100)}).on("change.mask",function(){a.data("changed",!0)}).on("blur.mask",
  function(){k===a.val()||a.data("changed")||a.triggerHandler("change");a.data("changed",!1)}).on("blur.mask",function(){k=a.val()}).on("focus.mask",function(a){!0===d.selectOnFocus&&b(a.target).select()}).on("focusout.mask",function(){d.clearIfNotMatch&&!l.test(e.val())&&e.val("")})},getRegexMask:function(){for(var a=[],b,e,f,d,h=0;h<c.length;h++)(b=g.translation[c.charAt(h)])?(e=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),f=b.optional,(b=b.recursive)?(a.push(c.charAt(h)),d={digit:c.charAt(h),
  pattern:e}):a.push(f||b?e+"?":e)):a.push(c.charAt(h).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));a=a.join("");d&&(a=a.replace(new RegExp("("+d.digit+"(.*"+d.digit+")?)"),"($1)?").replace(new RegExp(d.digit,"g"),d.pattern));return new RegExp(a)},destroyEvents:function(){a.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(b){var c=a.is("input")?"val":"text";if(0<arguments.length){if(a[c]()!==b)a[c](b);c=a}else c=a[c]();return c},getMCharsBeforeCount:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        b){for(var e=0,f=0,d=c.length;f<d&&f<a;f++)g.translation[c.charAt(f)]||(a=b?a+1:a,e++);return e},caretPos:function(a,b,d,f){return g.translation[c.charAt(Math.min(a-1,c.length-1))]?Math.min(a+d-b-f,d):e.caretPos(a+1,b,d,f)},behaviour:function(a){a=a||window.event;e.invalid=[];var c=a.keyCode||a.which;if(-1===b.inArray(c,g.byPassKeys)){var d=e.getCaret(),f=e.val().length,n=d<f,h=e.getMasked(),k=h.length,m=e.getMCharsBeforeCount(k-1)-e.getMCharsBeforeCount(f-1);e.val(h);!n||65===c&&a.ctrlKey||(8!==
c&&46!==c&&(d=e.caretPos(d,f,k,m)),e.setCaret(d));return e.callbacks(a)}},getMasked:function(a){var b=[],k=e.val(),f=0,n=c.length,h=0,l=k.length,m=1,p="push",u=-1,t,w;d.reverse?(p="unshift",m=-1,t=0,f=n-1,h=l-1,w=function(){return-1<f&&-1<h}):(t=n-1,w=function(){return f<n&&h<l});for(;w();){var x=c.charAt(f),v=k.charAt(h),r=g.translation[x];if(r)v.match(r.pattern)?(b[p](v),r.recursive&&(-1===u?u=f:f===t&&(f=u-m),t===u&&(f-=m)),f+=m):r.optional?(f+=m,h-=m):r.fallback?(b[p](r.fallback),f+=m,h-=m):e.invalid.push({p:h,
  v:v,e:r.pattern}),h+=m;else{if(!a)b[p](x);v===x&&(h+=m);f+=m}}a=c.charAt(t);n!==l+1||g.translation[a]||b.push(a);return b.join("")},callbacks:function(b){var g=e.val(),l=g!==k,f=[g,b,a,d],n=function(a,b,c){"function"===typeof d[a]&&b&&d[a].apply(this,c)};n("onChange",!0===l,f);n("onKeyPress",!0===l,f);n("onComplete",g.length===c.length,f);n("onInvalid",0<e.invalid.length,[g,b,a,e.invalid,d])}};g.mask=c;g.options=d;g.remove=function(){var b=e.getCaret();e.destroyEvents();e.val(g.getCleanVal());e.setCaret(b-
  e.getMCharsBeforeCount(b));return a};g.getCleanVal=function(){return e.getMasked(!0)};g.init=function(c){c=c||!1;d=d||{};g.byPassKeys=b.jMaskGlobals.byPassKeys;g.translation=b.jMaskGlobals.translation;g.translation=b.extend({},g.translation,d.translation);g=b.extend(!0,{},g,d);l=e.getRegexMask();!1===c?(d.placeholder&&a.attr("placeholder",d.placeholder),b("input").length&&!1==="oninput"in b("input")[0]&&"on"===a.attr("autocomplete")&&a.attr("autocomplete","off"),e.destroyEvents(),e.events(),c=e.getCaret(),
  e.val(e.getMasked()),e.setCaret(c+e.getMCharsBeforeCount(c,!0))):(e.events(),e.val(e.getMasked()))};g.init(!a.is("input"))};b.maskWatchers={};var A=function(){var a=b(this),c={},d=a.attr("data-mask");a.attr("data-mask-reverse")&&(c.reverse=!0);a.attr("data-mask-clearifnotmatch")&&(c.clearIfNotMatch=!0);"true"===a.attr("data-mask-selectonfocus")&&(c.selectOnFocus=!0);if(z(a,d,c))return a.data("mask",new y(this,d,c))},z=function(a,c,d){d=d||{};var g=b(a).data("mask"),k=JSON.stringify;a=b(a).val()||
  b(a).text();try{return"function"===typeof c&&(c=c(a)),"object"!==typeof g||k(g.options)!==k(d)||g.mask!==c}catch(l){}};b.fn.mask=function(a,c){c=c||{};var d=this.selector,g=b.jMaskGlobals,k=b.jMaskGlobals.watchInterval,l=function(){if(z(this,a,c))return b(this).data("mask",new y(this,a,c))};b(this).each(l);d&&""!==d&&g.watchInputs&&(clearInterval(b.maskWatchers[d]),b.maskWatchers[d]=setInterval(function(){b(document).find(d).each(l)},k));return this};b.fn.unmask=function(){clearInterval(b.maskWatchers[this.selector]);
  delete b.maskWatchers[this.selector];return this.each(function(){var a=b(this).data("mask");a&&a.remove().removeData("mask")})};b.fn.cleanVal=function(){return this.data("mask").getCleanVal()};b.applyDataMask=function(a){a=a||b.jMaskGlobals.maskElements;(a instanceof b?a:b(a)).filter(b.jMaskGlobals.dataMaskAttr).each(A)};var p={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},
  9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};b.jMaskGlobals=b.jMaskGlobals||{};p=b.jMaskGlobals=b.extend(!0,{},p,b.jMaskGlobals);p.dataMask&&b.applyDataMask();setInterval(function(){b.jMaskGlobals.watchDataMask&&b.applyDataMask()},p.watchInterval)});;/**/
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;/**/
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .closest('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).closest('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;/**/
/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);

/**
* Use the jQuery no-conflict method so it dosent conflict with drupal's own jQuery.
* This will make the "$" variable to be used by the default Drupal jQuery version 1.4.4,
* And the "$jQueryAdminimal" will be used by the newer jQuery verssion 1.7.2.
*/
var $jQueryAdminimal = jQuery.noConflict(true);
;/**/
/*!
	SlickNav Responsive Mobile Menu
	(c) 2014 Josh Cope
	licensed under MIT
*/
;(function ($, document, window) {
	var
	// default settings object.
	defaults = {
		label: 'MENU',
		duplicate: true,
		duration: 200,
		easingOpen: 'swing',
		easingClose: 'swing',
		closedSymbol: '&#9658;',
		openedSymbol: '&#9660;',
		prependTo: 'body',
		parentTag: 'a',
		closeOnClick: false,
		allowParentLinks: false,
		init: function(){},
		open: function(){},
		close: function(){}
	},
	mobileMenu = 'slicknav',
	prefix = 'slicknav';
	
	function Plugin( element, options ) {
		this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = mobileMenu;
        
        this.init();
	}
	
	Plugin.prototype.init = function () {
        var $this = this;
		var menu = $(this.element);
		var settings = this.settings;
		
		// clone menu if needed
		if (settings.duplicate) {
			$this.mobileNav = menu.clone();
			//remove ids from clone to prevent css issues
			$this.mobileNav.removeAttr('id');
			$this.mobileNav.find('*').each(function(i,e){
				$(e).removeAttr('id');
			});
		}
		else
			$this.mobileNav = menu;
		
		// styling class for the button
		var iconClass = prefix+'_icon';
		
		if (settings.label == '') {
			iconClass += ' '+prefix+'_no-text';
		}
		
		if (settings.parentTag == 'a') {
			settings.parentTag = 'a href="#"';
		}
		
		// create menu bar
		$this.mobileNav.attr('class', prefix+'_nav');
		var menuBar = $('<div class="'+prefix+'_menu"></div>');
		$this.btn = $('<'+settings.parentTag+' aria-haspopup="true" tabindex="0" class="'+prefix+'_btn '+prefix+'_collapsed"><span class="'+prefix+'_menutxt">'+settings.label+'</span><span class="'+iconClass+'"><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span><span class="'+prefix+'_icon-bar"></span></span></a>');
		$(menuBar).append($this.btn);		
		$(settings.prependTo).prepend(menuBar);
		menuBar.append($this.mobileNav);
		
		// iterate over structure adding additional structure
		var items = $this.mobileNav.find('li');
		$(items).each(function () {
			var item = $(this);
			data = {};
			data.children = item.children('ul').attr('role','menu');
			item.data("menu", data);
			
			// if a list item has a nested menu
			if (data.children.length > 0) {
			
				// select all text before the child menu
				var a = item.contents();
				var nodes = [];
				$(a).each(function(){
					if(!$(this).is("ul")) {
						nodes.push(this);
					}
					else {
						return false;
					}
				});
				
				// wrap item text with tag and add classes
				var wrap = $(nodes).wrapAll('<'+settings.parentTag+' role="menuitem" aria-haspopup="true" tabindex="-1" class="'+prefix+'_item"/>').parent();
				
				item.addClass(prefix+'_collapsed');
				item.addClass(prefix+'_parent');
				
				// create parent arrow
				$(nodes).last().after('<span class="'+prefix+'_arrow">'+settings.closedSymbol+'</span>');
				
			
			} else if ( item.children().length == 0) {
				 item.addClass(prefix+'_txtnode');
			}
			
			// accessibility for links
			item.children('a').attr('role', 'menuitem').click(function(){
				//Emulate menu close if set
				if (settings.closeOnClick)
					$($this.btn).click();
			});
		});
		
		// structure is in place, now hide appropriate items
		$(items).each(function () {
			var data = $(this).data("menu");
			$this._visibilityToggle(data.children, false, null, true);
		});
		
		// finally toggle entire menu
		$this._visibilityToggle($this.mobileNav, false, 'init', true);
		
		// accessibility for menu button
		$this.mobileNav.attr('role','menu');
		
		// outline prevention when using mouse
		$(document).mousedown(function(){
			$this._outlines(false);
		});
		
		$(document).keyup(function(){
			$this._outlines(true);
		});
		
		// menu button click
		$($this.btn).click(function (e) {
			e.preventDefault();
			$this._menuToggle();			
		});
		
		// click on menu parent
		$this.mobileNav.on('click', '.'+prefix+'_item', function(e){
			e.preventDefault();
			$this._itemClick($(this));
		});
		
		// check for enter key on menu button and menu parents
		$($this.btn).keydown(function (e) {
			var ev = e || event;
			if(ev.keyCode == 13) {
				e.preventDefault();
				$this._menuToggle();
			}
		});
		
		$this.mobileNav.on('keydown', '.'+prefix+'_item', function(e) {
			var ev = e || event;
			if(ev.keyCode == 13) {
				e.preventDefault();
				$this._itemClick($(e.target));
			}
		});
		
		// allow links clickable within parent tags if set
		if (settings.allowParentLinks) {
			$('.'+prefix+'_item a').click(function(e){
					e.stopImmediatePropagation();
			});
		}
    };
	
	//toggle menu
	Plugin.prototype._menuToggle = function(el){
		var $this = this;
		var btn = $this.btn;
		var mobileNav = $this.mobileNav;
		
		if (btn.hasClass(prefix+'_collapsed')) {
			btn.removeClass(prefix+'_collapsed');
			btn.addClass(prefix+'_open');
		} else {
			btn.removeClass(prefix+'_open');
			btn.addClass(prefix+'_collapsed');
		}
		btn.addClass(prefix+'_animating');
		$this._visibilityToggle(mobileNav, true, btn);
	}
	
	// toggle clicked items
	Plugin.prototype._itemClick = function(el) {
		var $this = this;
		var settings = $this.settings;
		var data = el.data("menu");
		if (!data) {
			data = {};
			data.arrow = el.children('.'+prefix+'_arrow');
			data.ul = el.next('ul');
			data.parent = el.parent();
			el.data("menu", data);
		}
		if (data.parent.hasClass(prefix+'_collapsed')) {
			data.arrow.html(settings.openedSymbol);
			data.parent.removeClass(prefix+'_collapsed');
			data.parent.addClass(prefix+'_open');
			data.parent.addClass(prefix+'_animating');
			$this._visibilityToggle(data.ul, true, el);
		} else {
			data.arrow.html(settings.closedSymbol);
			data.parent.addClass(prefix+'_collapsed');
			data.parent.removeClass(prefix+'_open');
			data.parent.addClass(prefix+'_animating');
			$this._visibilityToggle(data.ul, true, el);
		}
	}

	// toggle actual visibility and accessibility tags
	Plugin.prototype._visibilityToggle = function(el, animate, trigger, init) {
		var $this = this;
		var settings = $this.settings;
		var items = $this._getActionItems(el);
		var duration = 0;
		if (animate)
			duration = settings.duration;
		
		if (el.hasClass(prefix+'_hidden')) {
			el.removeClass(prefix+'_hidden');
			el.slideDown(duration, settings.easingOpen, function(){
				
				$(trigger).removeClass(prefix+'_animating');
				$(trigger).parent().removeClass(prefix+'_animating');
				
				//Fire open callback
				if (!init) {
					settings.open(trigger);
				}
			});
			el.attr('aria-hidden','false');
			items.attr('tabindex', '0');
			$this._setVisAttr(el, false);
		} else {
			el.addClass(prefix+'_hidden');
			el.slideUp(duration, this.settings.easingClose, function() {
				el.attr('aria-hidden','true');
				items.attr('tabindex', '-1');
				$this._setVisAttr(el, true);
				el.hide(); //jQuery 1.7 bug fix
				
				$(trigger).removeClass(prefix+'_animating');
				$(trigger).parent().removeClass(prefix+'_animating');
				
				//Fire init or close callback
				if (!init)
					settings.close(trigger);
				else if (trigger == 'init')
					settings.init();
			});
		}
	}

	// set attributes of element and children based on visibility
	Plugin.prototype._setVisAttr = function(el, hidden) {
		var $this = this;
		
		// select all parents that aren't hidden
		var nonHidden = el.children('li').children('ul').not('.'+prefix+'_hidden');
		
		// iterate over all items setting appropriate tags
		if (!hidden) {
			nonHidden.each(function(){
				var ul = $(this);
				ul.attr('aria-hidden','false');
				var items = $this._getActionItems(ul);
				items.attr('tabindex', '0');
				$this._setVisAttr(ul, hidden);
			});
		} else {
			nonHidden.each(function(){
				var ul = $(this);
				ul.attr('aria-hidden','true');
				var items = $this._getActionItems(ul);
				items.attr('tabindex', '-1');
				$this._setVisAttr(ul, hidden);
			});
		}
	}

	// get all 1st level items that are clickable
	Plugin.prototype._getActionItems = function(el) {
		var data = el.data("menu");
		if (!data) {
			data = {};
			var items = el.children('li');
			var anchors = items.children('a');
			data.links = anchors.add(items.children('.'+prefix+'_item'));
			el.data("menu", data);
		}
		return data.links;
	}

	Plugin.prototype._outlines = function(state) {
		if (!state) {
			$('.'+prefix+'_item, .'+prefix+'_btn').css('outline','none');
		} else {
			$('.'+prefix+'_item, .'+prefix+'_btn').css('outline','');
		}
	}
	
	Plugin.prototype.toggle = function(){
		$this._menuToggle();
	}
	
	Plugin.prototype.open = function(){
		$this = this;
		if ($this.btn.hasClass(prefix+'_collapsed')) {
			$this._menuToggle();
		}
	}
	
	Plugin.prototype.close = function(){
		$this = this;
		if ($this.btn.hasClass(prefix+'_open')) {
			$this._menuToggle();
		}
	}
	
	$.fn[mobileMenu] = function ( options ) {
		var args = arguments;

		// Is the first parameter an object (options), or was omitted, instantiate a new instance
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {

				// Only allow the plugin to be instantiated once due to methods
				if (!$.data(this, 'plugin_' + mobileMenu)) {

					// if it has no instance, create a new one, pass options to our plugin constructor,
					// and store the plugin instance in the elements jQuery data object.
					$.data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
				}
			});

		// If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

			// Cache the method call to make it possible to return a value
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + mobileMenu);

				// Tests that there's already a plugin-instance and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance, and pass it the supplied arguments.
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			});

			// If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};
}($jQueryAdminimal, document, window));

(function($) {

// Create the responsive menu using SlickNav.
Drupal.admin.behaviors.responsivemenu = function (context, settings, $adminMenu) {

    $('#admin-menu-menu-responsive').slicknav({
		label: 'Menu',
		prependTo:'body',
		closedSymbol: "<i class=\"closed\"></i>",
		openedSymbol: "<i class=\"open\"></i>",
		allowParentLinks: true
	});

};

// Create the responsive shortcuts dropdown.
Drupal.admin.behaviors.responsiveshortcuts = function (context, settings, $adminMenu) {

  // Check if there are any shortucts to respondify.
  if(jQuery("div.toolbar-shortcuts ul.menu li").length){

	  // Create the dropdown base
	  $("<select id='responsive-shortcuts-dropdown'/>").appendTo("#admin-menu-shortcuts-responsive div.toolbar-shortcuts");

	  // Create default option "Select"
	  $("<option />", {
	    "selected"  :  "selected",
	    "class"     :  "hide",
	    "value"     :  "",
	    "text"      :  Drupal.t('Shortcuts')
	  }).appendTo("#admin-menu-shortcuts-responsive div.toolbar-shortcuts select");

	  // Populate dropdown with menu items
	  $("#admin-menu-shortcuts-responsive div.toolbar-shortcuts a").each(function() {
	    var el = $(this);
	    $("<option />", {
	      "value"   :  el.attr("href"),
	      "text"    :  el.text()
	    }).appendTo("#admin-menu-shortcuts-responsive div.toolbar-shortcuts select");
	  });

      // Redirect the user when selecting an option.
	  $("#admin-menu-shortcuts-responsive div.toolbar-shortcuts select").change(function() {
	    window.location = $(this).find("option:selected").val();
	  });

	  // Clean the mess.
	  $('#admin-menu-shortcuts-responsive div.toolbar-shortcuts ul').remove();
	  // Move the select box into the responsive menu.
	  $("#admin-menu-shortcuts-responsive").prependTo(".slicknav_menu");

	  }

  // Remove the edit shortcuts link from the DOM to avoid duble rendering.
  $('#admin-menu-shortcuts-responsive #edit-shortcuts').remove();

};
})($jQueryAdminimal);;/**/
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};

/**
 * @ingroup admin_behaviors
 * @{
 */

/**
 * Apply active trail highlighting based on current path.
 *
 * @todo Not limited to toolbar; move into core?
 */
Drupal.admin.behaviors.toolbarActiveTrail = function (context, settings, $adminMenu) {
  if (settings.admin_menu.toolbar && settings.admin_menu.toolbar.activeTrail) {
    $adminMenu.find('> div > ul > li > a[href="' + settings.admin_menu.toolbar.activeTrail + '"]').addClass('active-trail');
  }
};

Drupal.admin.behaviors.shorcutcollapsed = function (context, settings, $adminMenu) {

  // Create the dropdown base 
  $("<li class=\"label\"><a>"+Drupal.t('Shortcuts')+"</a></li>").prependTo("body.menu-render-collapsed #toolbar div.toolbar-shortcuts ul"); 

};

Drupal.admin.behaviors.shorcutselect = function (context, settings, $adminMenu) {

  // Create the dropdown base
  $("<select id='shortcut-menu'/>").appendTo("body.menu-render-dropdown #toolbar div.toolbar-shortcuts");

  // Create default option "Select"
  $("<option />", {
    "selected"  :  "selected",
    "value"     :  "",
    "text"      :  Drupal.t('Shortcuts')
  }).appendTo("body.menu-render-dropdown #toolbar div.toolbar-shortcuts select");

  // Populate dropdown with menu items
  $("body.menu-render-dropdown #toolbar div.toolbar-shortcuts a").each(function() {
    var el = $(this);
    $("<option />", {
      "value"   :  el.attr("href"),
      "text"    :  el.text()
    }).appendTo("body.menu-render-dropdown #toolbar div.toolbar-shortcuts select");
    });

  $("body.menu-render-dropdown #toolbar div.toolbar-shortcuts select").change(function() {
    window.location = $(this).find("option:selected").val();
  });

  $('body.menu-render-dropdown #toolbar div.toolbar-shortcuts ul').remove();

};

})(jQuery);
;/**/
/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.5",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.5",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.5",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.5",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.5",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.5",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.5",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.5",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.5",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),
d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.5",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.5",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);;/**/
(function ($) {
  // Table cells that have a checkbox will have an unwanted wrapper div that
  // does not style correctly. We replace that div with just the checkbox input
  // element.
  $('form td input[type="checkbox"]').each(function() {
    var updateID = $(this).attr('id');
    var updateName = $(this).attr('name');
    var updateValue = $(this).attr('value');
    var updateState = $(this).attr('checked');

    var updateChecked = '';

    if (updateState == 'checked') {
      updateChecked = ' checked="checked"';
    }

    var updateText = '<input type="checkbox" id="' + updateID + '" name="' + updateName + '" value="' + updateValue + '"' + updateChecked + '>';
    $(this).parents('div.checkbox').replaceWith(updateText);
  });

  // Wrap vertical tabs panels with a group div to help us style vertical tabs
  // correctly. We use the equivalent of Bootstrap's accordian plugin without
  // implicitely declaring it in this script.
  $('.vertical-tabs-panes .panel').wrapAll('<div class="vertical-tabs-panel-group"></div>');

  $('.vertical-tabs-panel-group .panel:first')
    .find('.collapse')
    .addClass('in')
    .attr('aria-expanded', 'true')
    .prev('.panel-heading').addClass('panel-open');

  $('.vertical-tabs-panel-group .panel-heading a').click(function() {
    $(this).closest('.panel-heading').toggleClass('panel-open');
  });

  // Render dropdown menus correctly using Bootstrap's dropdown menu
  // attributes.
  $('ul.navbar-nav li.dropdown ul.nav').attr('class', 'dropdown-menu');

  $('ul.navbar-nav li.dropdown > a').each(function () {
    $(this).closest('li.dropdown').removeClass('active');

    var dropdownTitle = $(this).text();
    $(this).html(dropdownTitle + ' <span class="caret"></span>');

    $(this)
      .attr('href', '#')
      .attr('class', 'dropdown-toggle')
      .attr('data-toggle', 'dropdown')
      .attr('role', 'button')
      .attr('aria-haspopup', 'true')
      .attr('aria-expanded', 'false');
  });

  // Replace menu items entered as a separator with the correct HTML.
  $('ul.navbar-nav ul.dropdown-menu a').each(function() {
    if ($(this).html() == '&lt;separator&gt;') {
      $(this).closest('li').attr('class', 'divider').attr('role', 'separator');
    }
    if ($(this).closest('li').hasClass('divider')) {
      $(this).remove();
    }
  });

  // Add the active class to the parent menu item in a dropdown menu when it is
  // in the active trail.
  $('ul.dropdown-menu li.active').each(function() {
    $(this).parents('li.dropdown').addClass('active');
  });

  // Update the autocomplete status glyphicon class to use animations.
  if (Drupal.jsAC) {
    Drupal.jsAC.prototype.setStatus = function (status) {
      switch (status) {
        case 'begin':
          $(this.input).addClass('throbbing').next('.glyphicon-refresh').addClass('glyphicon-refresh-animate');
          $(this.ariaLive).html(Drupal.t('Searching for matches...'));
          break;
        case 'cancel':
        case 'error':
        case 'found':
          $(this.input).removeClass('throbbing').next('.glyphicon-refresh').removeClass('glyphicon-refresh-animate');
          break;
      }
    };
  }

  $('.reset-password').once(function() {
    var field = $(this).next('input[type="password"]');
    $(this).width(field.outerWidth());
  });
})(jQuery);

// So the theme does not seem to "jump" on page load, we initially hid the
// body. Once the document is ready, go ahead and show the body.
jQuery(document).ready(function($) {
  $('body').fadeTo('slow' , 1, function() {
  });
});;/**/
// Add Facebook SDK integration to all pages.
window.fbAsyncInit = function() {
  FB.init({
    appId      : '1334749103208264',
    xfbml      : true,
    version    : 'v2.5'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function ($) {
  // When using a medium or larger screen, use animations to open the dropdown
  // menus.
  if (window.matchMedia('(min-width: 768px)').matches) {
    $('ul.navbar-nav li.dropdown > a').each(function () {
      var dropdownTitle = $(this).text();
      $(this).html(dropdownTitle);
    });
  }

  if (window.matchMedia('(max-width: 767px)').matches) {
    $('#main-menu-wrapper').find('#main-menu').removeClass('nav-justified');
  }
}(jQuery));

jQuery(document).ready(function($) {
  var html = $('html');
  var body = $('body');
  var dropdown = $('ul.nav li.dropdown');
  var accordion = $('[data-parent=#accordion]');
  var trigger = $('.trigger');
  var staffTrigger = $('.staff-profile-more-info');
  var carouselItem = $('[data-carousel-item]');
  var menuPosition = 1;
  var staffRole = (body.hasClass('role-client') &&
    (body.hasClass('role-therapist') ||
      body.hasClass('role-staff-admin') ||
      body.hasClass('role-developer') ||
      body.hasClass('role-super-admin'))) ? true : false;

  // First add a menu position class to each user menu item.
  $('.header-nav #user-menu-wrapper .dropdown-menu>li>a').each(function() {
    $(this).addClass('menu-position-' + menuPosition);
    menuPosition++;
  });

  // Now we can get the "My Dashboard" link for later use.
  var dashboardLink = $('.header-nav #user-menu-wrapper .dropdown-menu>li>a.menu-position-2');

  dashboardLink.click(function(event) {
    if (staffRole) {
      event.preventDefault();
      var text = 'Since you have both a staff role and a client role assigned to your account, please select which dashboard should be opened.';

      $('<div id="dialog">' + text + '</div>').appendTo('body');

      var host = location.protocol + "//" + location.host;
      $('#dialog').dialog({
        draggable: true,
        width: body.outerWidth() - 100,
        modal: true,
        title: 'Select Dashboard',
        buttons: {
          "Staff Dashboard": function() {
            window.location.href = host + '/user/clients/list';
          },
          "Client Dashboard": function() {
            window.location.href = host + '/questionnaire/start/trans';
          }
        }
      }).prev().find('.ui-dialog-titlebar-close').hide();
    }
  });

  $(document).ready(function () {
    $('[data-toggle="offcanvas"]').click(function () {
      html.toggleClass('offcanvas-active');
      body.toggleClass('offcanvas-active');
      $('.row-offcanvas').toggleClass('active');
      $('#offcanvas-overlay').toggleClass('overlayed');
      $('#toggle-dashboard').toggleClass('open');
      $(this).toggleClass('open');

      if ($(this).hasClass('open')) {
        $(this).attr('title', 'Close Dashboard');
      }
      else {
        $(this).attr('title', 'Open Dashboard');
      }
    });
  });

  body.click(function(event ){
    var $target = $(event.target);
    if(!$target.parents().is(".staff-profile-popup") && !$target.is(".staff-profile-popup")){
      body.find(".staff-profile-popup").fadeOut();
      body.removeClass('overlay');
      $('.staff-profile-overlay').delay(100).fadeOut();

      // Un-lock scroll position
      var html = jQuery('html');
      var scrollPosition = html.data('scroll-position');
      html.css('overflow', html.data('previous-overflow'));
      if (scrollPosition) {
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
      }
    }
  });

  // When using a medium or larger screen, use animations to open the dropdown
  // menus.
  if (window.matchMedia('(min-width: 768px)').matches) {
    dropdown.hover(function () {
        $(this).find('.dropdown-toggle').addClass('open');
        $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn();
      },
      function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut();
        $(this).find('.dropdown-toggle').removeClass('open');
      }
    );

    dropdown.click(function (event) {
      event.stopPropagation();
    });

    $('.header-nav').css('overflow', 'visible');
  }


  // Apply better styling to collapsed panel headings and add a data state.
  var toggled = false;
  accordion.parents('.panel-heading')
    .attr('data-descendant-expanded', $(this).attr('aria-expanded'))
    .css('border-bottom-width', '0');

  // React on the accordion click event to toggle the heading data states.
  accordion.click(function() {
    var heading = $(this).parents('.panel-heading');
    toggled = !toggled;

    // Use a closure to toggle the data state of the heading.
    heading.attr('data-descendant-expanded', toggled ? 'true' : 'false');

    // Use a delay queue to add/remove the bottom border from the heading.
    heading.delay(100).queue(function() {
      $(this).css('border-bottom-width', toggled ? '1px' : '0').dequeue();
    });
  });

  // Expands the trigger box content, and scrolls to the top of the content if
  // the content extends below the browser window.
  trigger.click(function() {
    $(this).find('span').toggleClass('expanded');

    $(this).next('.toggle_box').toggle( "slow", function() {
      var windowPosition = $(window).scrollTop() + $(window).height();
      var toggleBoxPosition = $(this).offset().top + $(this).height() + 30;
      if(windowPosition < toggleBoxPosition) {
        $('html, body').animate(
          { scrollTop: $(this).offset().top }, 600
        );
      }
    });
  });

  // Show the active menu item in dashboard menus.
  $('ul.nav-staff-dropdown li.active').each(function() {
    $(this).parents('.dropdown-link').addClass('expanded');
    $(this).parents('.nav-staff-dropdown').show();
  });

  $('ul.nav-client-dropdown li a.active').parent('li').addClass('active');

  $('ul.nav-client-dropdown li.active').each(function() {
    $(this).parents('.dropdown-link').addClass('expanded');
    $(this).parents('.nav-client-dropdown').show();
  });

  // Creates an accordion-style animation effect for dashboard menus.
  $('ul.nav-staff-tree li .dropdown-link').click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
    else {
      $('ul.nav-staff-tree li .dropdown-link.expanded').removeClass('expanded');
      $(this).addClass('expanded');
      $('ul.nav-staff-tree li ul.nav-staff-dropdown').slideUp();
      $(".left_menu ul li ul li ul").show();
      $(this).children().toggleClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
  });
  $('ul.nav-client-tree li .dropdown-link').click(function (e) {
    e.preventDefault();

    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
    else {
      $('ul.nav-client-tree li .dropdown-link.expanded').removeClass('expanded');
      $(this).addClass('expanded');
      $('ul.nav-client-tree li ul.nav-client-dropdown').slideUp();
      $(".left_menu ul li ul li ul").show();
      $(this).children().toggleClass('expanded');
      $(this).next().children().show();
      $(this).next().slideToggle();
    }
  });

  // Add the required form-control class to data tables. jQuery strips these
  // classes out.
  var dataTablesWrapper = $('.dataTables_wrapper');
  dataTablesWrapper.find('input[type=search]').addClass('form-control');
  dataTablesWrapper.find('select').addClass('form-control');

  // Staff profiles
  if (staffTrigger.length > 0) {
    body.append('<div class="staff-profile-overlay"></div>');
    body.css('position', 'relative');
  }

  staffTrigger.click(function(e) {
    e.stopPropagation();
    var parent = $(this).parents('.profile-row').attr('id');
    $('body').toggleClass('overlay');
    $('.staff-profile-overlay').delay(100).fadeIn();
    $("[data-parent=#" + parent + "]").fadeIn();

    // Lock page scroll position, but retain settings for later.
    var scrollPosition = [
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];

    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
  });

  $('.staff-profile-popup .close').click(function(e) {
    var parent = $(this).parents('.profile-row').attr('id');
    body.toggleClass('overlay');
    $("[data-parent=#" + parent + "]").fadeOut();
    $('.staff-profile-overlay').delay(100).fadeOut();

    // Un-lock scroll position
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
  });

  // Staff Profiles Popup Modal
  resizeStaffProfileModal = function (e, no_shrink) {
    var $modal = $('.staff-profile-popup');
    var $scroll = $('.staff-profile-scroll', $modal);
    if ($modal.size() == 0 || $modal.css('display') == 'none') {
      //return;
    }

    var maxWidth = parseInt($(window).width() * .85); // 70% of window
    var minWidth = parseInt($(window).width() * .6); // 70% of window

    // Set the modal to the minwidth so that our width calculation of
    // children works.
    $modal.css('width', minWidth);
    var width = minWidth;

    // Don't let the window get more than 80% of the display high.
    var maxHeight = parseInt($(window).height() * .8);
    var minHeight = 300;
    if (no_shrink) {
      minHeight = $modal.height();
    }

    if (minHeight > maxHeight) {
      minHeight = maxHeight;
    }

    var height = 0;

    // Calculate the height of the 'scroll' region.
    var scrollHeight = 0;

    scrollHeight += parseInt($scroll.css('padding-top'));
    scrollHeight += parseInt($scroll.css('padding-bottom'));

    $scroll.children().each(function () {
      var w = $(this).innerWidth();
      if (w > width) {
        width = w;
      }
      scrollHeight += $(this).outerHeight(true);
    });

    // Now, calculate what the difference between the scroll and the modal
    // will be.

    var difference = 0;
    difference += parseInt($scroll.css('padding-top'));
    difference += parseInt($scroll.css('padding-bottom'));
    difference += $('.staff-profile-title').outerHeight(true);
    difference += $('.views-add-form-selected').outerHeight(true);

    height = scrollHeight + difference;

    if (height > maxHeight) {
      height = maxHeight;
      scrollHeight = maxHeight - difference;
    }
    else if (height < minHeight) {
      height = minHeight;
      scrollHeight = minHeight - difference;
    }

    if (width > maxWidth) {
      width = maxWidth;
    }

    // Get where we should move content to
    var top = ($(window).height() / 2) - (height / 2);
    var left = ($(window).width() / 2) - (width / 2);

    $modal.css({
      'top': top + 'px',
      'left': left + 'px',
      'width': width + 'px'
    });

    $scroll.css({
      'max-height': (height + 25) + 'px'
    });
  };

  resizeStaffProfileModal(true);

  $(window).resize(function() {
    resizeStaffProfileModal(true);
  });

  var docHeight = $(window).height();
  var footer = $('#site-footer');
  var footerHeight = footer.height();
  var footerTop = footer.position().top + footerHeight;

  if (footerTop < docHeight) {
    footer.css('margin-top', (docHeight - footerTop) + 'px');
  }

  $('#arrows-wrapper').width($('#steps-badge-wrapper').outerWidth(false));
  $('#arrows-wrapper-bottom').width($('#steps-badge-wrapper').outerWidth(false));

  var i = 0;
  carouselItem.each(function () {
    $(this).addClass('item-' + i);
    i++;
  });

  var stepsButton = $('#steps-sidebar-button');
  var slidesButton = $('.slides-button');
  var loggedInButton = '';
  var NotloggedInButton = '<p><a href="/user/register" class="btn btn-primary">Get started</a></p>';
  var loggedInButtonSlides = '<p><a href="/user/register" class="btn btn-slide btn-sm">Get started</a></p>';
  var NotloggedInButtonSlides = '';

  if (body.hasClass('not-logged-in')) {
    stepsButton.html(NotloggedInButton + stepsButton.html());
    slidesButton.html(loggedInButtonSlides);
  }
  else {
    stepsButton.html(loggedInButton + stepsButton.html());
    slidesButton.html(NotloggedInButtonSlides);
  }
});;/**/
/*!
 * FormValidation (http://formvalidation.io)
 * The best jQuery plugin to validate form fields. Support Bootstrap, Foundation, Pure, SemanticUI, UIKit and custom frameworks
 *
 * @version     v0.7.1-dev, built on 2015-08-01 5:22:37 PM
 * @author      https://twitter.com/formvalidation
 * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
if (window.FormValidation = {
    AddOn: {},
    Framework: {},
    I18n: {},
    Validator: {}
  }, "undefined" == typeof jQuery)throw new Error("FormValidation requires jQuery");
!function (a) {
  var b = a.fn.jquery.split(" ")[0].split(".");
  if (+b[0] < 2 && +b[1] < 9 || 1 === +b[0] && 9 === +b[1] && +b[2] < 1)throw new Error("FormValidation requires jQuery version 1.9.1 or higher")
}(jQuery), function (a) {
  FormValidation.Base = function (b, c, d) {
    this.$form = a(b), this.options = a.extend({}, a.fn.formValidation.DEFAULT_OPTIONS, c), this._namespace = d || "fv", this.$invalidFields = a([]), this.$submitButton = null, this.$hiddenButton = null, this.STATUS_NOT_VALIDATED = "NOT_VALIDATED", this.STATUS_VALIDATING = "VALIDATING", this.STATUS_INVALID = "INVALID", this.STATUS_VALID = "VALID", this.STATUS_IGNORED = "IGNORED", this.DEFAULT_MESSAGE = a.fn.formValidation.DEFAULT_MESSAGE, this._ieVersion = function () {
      for (var a = 3, b = document.createElement("div"), c = b.all || []; b.innerHTML = "<!--[if gt IE " + ++a + "]><br><![endif]-->", c[0];);
      return a > 4 ? a : document.documentMode
    }();
    var e = document.createElement("div");
    this._changeEvent = 9 !== this._ieVersion && "oninput" in e ? "input" : "keyup", this._submitIfValid = null, this._cacheFields = {}, this._init()
  }, FormValidation.Base.prototype = {
    constructor: FormValidation.Base, _exceedThreshold: function (b) {
      var c = this._namespace, d = b.attr("data-" + c + "-field"), e = this.options.fields[d].threshold || this.options.threshold;
      if (!e)return !0;
      var f = -1 !== a.inArray(b.attr("type"), ["button", "checkbox", "file", "hidden", "image", "radio", "reset", "submit"]);
      return f || b.val().length >= e
    }, _init: function () {
      var b = this, c = this._namespace, d = {
        addOns: {},
        autoFocus: this.$form.attr("data-" + c + "-autofocus"),
        button: {
          selector: this.$form.attr("data-" + c + "-button-selector") || this.$form.attr("data-" + c + "-submitbuttons"),
          disabled: this.$form.attr("data-" + c + "-button-disabled")
        },
        control: {
          valid: this.$form.attr("data-" + c + "-control-valid"),
          invalid: this.$form.attr("data-" + c + "-control-invalid")
        },
        err: {
          clazz: this.$form.attr("data-" + c + "-err-clazz"),
          container: this.$form.attr("data-" + c + "-err-container") || this.$form.attr("data-" + c + "-container"),
          parent: this.$form.attr("data-" + c + "-err-parent")
        },
        events: {
          formInit: this.$form.attr("data-" + c + "-events-form-init"),
          formPreValidate: this.$form.attr("data-" + c + "-events-form-prevalidate"),
          formError: this.$form.attr("data-" + c + "-events-form-error"),
          formSuccess: this.$form.attr("data-" + c + "-events-form-success"),
          fieldAdded: this.$form.attr("data-" + c + "-events-field-added"),
          fieldRemoved: this.$form.attr("data-" + c + "-events-field-removed"),
          fieldInit: this.$form.attr("data-" + c + "-events-field-init"),
          fieldError: this.$form.attr("data-" + c + "-events-field-error"),
          fieldSuccess: this.$form.attr("data-" + c + "-events-field-success"),
          fieldStatus: this.$form.attr("data-" + c + "-events-field-status"),
          localeChanged: this.$form.attr("data-" + c + "-events-locale-changed"),
          validatorError: this.$form.attr("data-" + c + "-events-validator-error"),
          validatorSuccess: this.$form.attr("data-" + c + "-events-validator-success"),
          validatorIgnored: this.$form.attr("data-" + c + "-events-validator-ignored")
        },
        excluded: this.$form.attr("data-" + c + "-excluded"),
        icon: {
          valid: this.$form.attr("data-" + c + "-icon-valid") || this.$form.attr("data-" + c + "-feedbackicons-valid"),
          invalid: this.$form.attr("data-" + c + "-icon-invalid") || this.$form.attr("data-" + c + "-feedbackicons-invalid"),
          validating: this.$form.attr("data-" + c + "-icon-validating") || this.$form.attr("data-" + c + "-feedbackicons-validating"),
          feedback: this.$form.attr("data-" + c + "-icon-feedback")
        },
        live: this.$form.attr("data-" + c + "-live"),
        locale: this.$form.attr("data-" + c + "-locale"),
        message: this.$form.attr("data-" + c + "-message"),
        onPreValidate: this.$form.attr("data-" + c + "-onprevalidate"),
        onError: this.$form.attr("data-" + c + "-onerror"),
        onSuccess: this.$form.attr("data-" + c + "-onsuccess"),
        row: {
          selector: this.$form.attr("data-" + c + "-row-selector") || this.$form.attr("data-" + c + "-group"),
          valid: this.$form.attr("data-" + c + "-row-valid"),
          invalid: this.$form.attr("data-" + c + "-row-invalid"),
          feedback: this.$form.attr("data-" + c + "-row-feedback")
        },
        threshold: this.$form.attr("data-" + c + "-threshold"),
        trigger: this.$form.attr("data-" + c + "-trigger"),
        verbose: this.$form.attr("data-" + c + "-verbose"),
        fields: {}
      };
      this.$form.attr("novalidate", "novalidate").addClass(this.options.elementClass).on("submit." + c, function (a) {
        a.preventDefault(), b.validate()
      }).on("click." + c, this.options.button.selector, function () {
        b.$submitButton = a(this), b._submitIfValid = !0
      }), (this.options.declarative === !0 || "true" === this.options.declarative) && this.$form.find("[name], [data-" + c + "-field]").each(function () {
        var e = a(this), f = e.attr("name") || e.attr("data-" + c + "-field"), g = b._parseOptions(e);
        g && (e.attr("data-" + c + "-field", f), d.fields[f] = a.extend({}, g, d.fields[f]))
      }), this.options = a.extend(!0, this.options, d), "string" == typeof this.options.err.parent && (this.options.err.parent = new RegExp(this.options.err.parent)), this.options.container && (this.options.err.container = this.options.container, delete this.options.container), this.options.feedbackIcons && (this.options.icon = a.extend(!0, this.options.icon, this.options.feedbackIcons), delete this.options.feedbackIcons), this.options.group && (this.options.row.selector = this.options.group, delete this.options.group), this.options.submitButtons && (this.options.button.selector = this.options.submitButtons, delete this.options.submitButtons), FormValidation.I18n[this.options.locale] || (this.options.locale = a.fn.formValidation.DEFAULT_OPTIONS.locale), (this.options.declarative === !0 || "true" === this.options.declarative) && (this.options = a.extend(!0, this.options, {addOns: this._parseAddOnOptions()})), this.$hiddenButton = a("<button/>").attr("type", "submit").prependTo(this.$form).addClass("fv-hidden-submit").css({
        display: "none",
        width: 0,
        height: 0
      }), this.$form.on("click." + this._namespace, '[type="submit"]', function (c) {
        if (!c.isDefaultPrevented()) {
          var d = a(c.target), e = d.is('[type="submit"]') ? d.eq(0) : d.parent('[type="submit"]').eq(0);
          !b.options.button.selector || e.is(b.options.button.selector) || e.is(b.$hiddenButton) || b.$form.off("submit." + b._namespace).submit()
        }
      });
      for (var e in this.options.fields)this._initField(e);
      for (var f in this.options.addOns)"function" == typeof FormValidation.AddOn[f].init && FormValidation.AddOn[f].init(this, this.options.addOns[f]);
      this.$form.trigger(a.Event(this.options.events.formInit), {
        bv: this,
        fv: this,
        options: this.options
      }), this.options.onPreValidate && this.$form.on(this.options.events.formPreValidate, function (a) {
        FormValidation.Helper.call(b.options.onPreValidate, [a])
      }), this.options.onSuccess && this.$form.on(this.options.events.formSuccess, function (a) {
        FormValidation.Helper.call(b.options.onSuccess, [a])
      }), this.options.onError && this.$form.on(this.options.events.formError, function (a) {
        FormValidation.Helper.call(b.options.onError, [a])
      })
    }, _initField: function (b) {
      var c = this._namespace, d = a([]);
      switch (typeof b) {
        case"object":
          d = b, b = b.attr("data-" + c + "-field");
          break;
        case"string":
          d = this.getFieldElements(b), d.attr("data-" + c + "-field", b)
      }
      if (0 !== d.length && null !== this.options.fields[b] && null !== this.options.fields[b].validators) {
        var e, f, g = this.options.fields[b].validators;
        for (e in g)f = g[e].alias || e, FormValidation.Validator[f] || delete this.options.fields[b].validators[e];
        null === this.options.fields[b].enabled && (this.options.fields[b].enabled = !0);
        for (var h = this, i = d.length, j = d.attr("type"), k = 1 === i || "radio" === j || "checkbox" === j, l = this._getFieldTrigger(d.eq(0)), m = a.map(l, function (a) {
          return a + ".update." + c
        }).join(" "), n = 0; i > n; n++) {
          var o = d.eq(n), p = this.options.fields[b].row || this.options.row.selector, q = o.closest(p), r = "function" == typeof(this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, o, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container, s = r && "tooltip" !== r && "popover" !== r ? a(r) : this._getMessageContainer(o, p);
          r && "tooltip" !== r && "popover" !== r && s.addClass(this.options.err.clazz), s.find("." + this.options.err.clazz.split(" ").join(".") + "[data-" + c + "-validator][data-" + c + '-for="' + b + '"]').remove(), q.find("i[data-" + c + '-icon-for="' + b + '"]').remove(), o.off(m).on(m, function () {
            h.updateStatus(a(this), h.STATUS_NOT_VALIDATED)
          }), o.data(c + ".messages", s);
          for (e in g)o.data(c + ".result." + e, this.STATUS_NOT_VALIDATED), k && n !== i - 1 || a("<small/>").css("display", "none").addClass(this.options.err.clazz).attr("data-" + c + "-validator", e).attr("data-" + c + "-for", b).attr("data-" + c + "-result", this.STATUS_NOT_VALIDATED).html(this._getMessage(b, e)).appendTo(s), f = g[e].alias || e, "function" == typeof FormValidation.Validator[f].init && FormValidation.Validator[f].init(this, o, this.options.fields[b].validators[e], e);
          if (this.options.fields[b].icon !== !1 && "false" !== this.options.fields[b].icon && this.options.icon && this.options.icon.valid && this.options.icon.invalid && this.options.icon.validating && (!k || n === i - 1)) {
            q.addClass(this.options.row.feedback);
            var t = a("<i/>").css("display", "none").addClass(this.options.icon.feedback).attr("data-" + c + "-icon-for", b).insertAfter(o);
            (k ? d : o).data(c + ".icon", t), ("tooltip" === r || "popover" === r) && ((k ? d : o).on(this.options.events.fieldError, function () {
              q.addClass("fv-has-tooltip")
            }).on(this.options.events.fieldSuccess, function () {
              q.removeClass("fv-has-tooltip")
            }), o.off("focus.container." + c).on("focus.container." + c, function () {
              h._showTooltip(a(this), r)
            }).off("blur.container." + c).on("blur.container." + c, function () {
              h._hideTooltip(a(this), r)
            })), "string" == typeof this.options.fields[b].icon && "true" !== this.options.fields[b].icon ? t.appendTo(a(this.options.fields[b].icon)) : this._fixIcon(o, t)
          }
        }
        d.on(this.options.events.fieldSuccess, function (a, b) {
          var c = h.getOptions(b.field, null, "onSuccess");
          c && FormValidation.Helper.call(c, [a, b])
        }).on(this.options.events.fieldError, function (a, b) {
          var c = h.getOptions(b.field, null, "onError");
          c && FormValidation.Helper.call(c, [a, b])
        }).on(this.options.events.fieldStatus, function (a, b) {
          var c = h.getOptions(b.field, null, "onStatus");
          c && FormValidation.Helper.call(c, [a, b])
        }).on(this.options.events.validatorError, function (a, b) {
          var c = h.getOptions(b.field, b.validator, "onError");
          c && FormValidation.Helper.call(c, [a, b])
        }).on(this.options.events.validatorIgnored, function (a, b) {
          var c = h.getOptions(b.field, b.validator, "onIgnored");
          c && FormValidation.Helper.call(c, [a, b])
        }).on(this.options.events.validatorSuccess, function (a, b) {
          var c = h.getOptions(b.field, b.validator, "onSuccess");
          c && FormValidation.Helper.call(c, [a, b])
        }), this.onLiveChange(d, "live", function () {
          h._exceedThreshold(a(this)) && h.validateField(a(this))
        }), d.trigger(a.Event(this.options.events.fieldInit), {bv: this, fv: this, field: b, element: d})
      }
    }, _isExcluded: function (b) {
      var c = this._namespace, d = b.attr("data-" + c + "-excluded"), e = b.attr("data-" + c + "-field") || b.attr("name");
      switch (!0) {
        case!!e && this.options.fields && this.options.fields[e] && ("true" === this.options.fields[e].excluded || this.options.fields[e].excluded === !0):
        case"true" === d:
        case"" === d:
          return !0;
        case!!e && this.options.fields && this.options.fields[e] && ("false" === this.options.fields[e].excluded || this.options.fields[e].excluded === !1):
        case"false" === d:
          return !1;
        case!!e && this.options.fields && this.options.fields[e] && "function" == typeof this.options.fields[e].excluded:
          return this.options.fields[e].excluded.call(this, b, this);
        case!!e && this.options.fields && this.options.fields[e] && "string" == typeof this.options.fields[e].excluded:
        case d:
          return FormValidation.Helper.call(this.options.fields[e].excluded, [b, this]);
        default:
          if (this.options.excluded) {
            "string" == typeof this.options.excluded && (this.options.excluded = a.map(this.options.excluded.split(","), function (b) {
              return a.trim(b)
            }));
            for (var f = this.options.excluded.length, g = 0; f > g; g++)if ("string" == typeof this.options.excluded[g] && b.is(this.options.excluded[g]) || "function" == typeof this.options.excluded[g] && this.options.excluded[g].call(this, b, this) === !0)return !0
          }
          return !1
      }
    }, _getFieldTrigger: function (a) {
      var b = this._namespace, c = a.data(b + ".trigger");
      if (c)return c;
      var d = a.attr("type"), e = a.attr("data-" + b + "-field"), f = "radio" === d || "checkbox" === d || "file" === d || "SELECT" === a.get(0).tagName ? "change" : this._ieVersion >= 10 && a.attr("placeholder") ? "keyup" : this._changeEvent;
      return c = ((this.options.fields[e] ? this.options.fields[e].trigger : null) || this.options.trigger || f).split(" "), a.data(b + ".trigger", c), c
    }, _getMessage: function (a, b) {
      if (!this.options.fields[a] || !this.options.fields[a].validators)return "";
      var c = this.options.fields[a].validators, d = c[b] && c[b].alias ? c[b].alias : b;
      if (!FormValidation.Validator[d])return "";
      switch (!0) {
        case!!c[b].message:
          return c[b].message;
        case!!this.options.fields[a].message:
          return this.options.fields[a].message;
        case!!this.options.message:
          return this.options.message;
        case!!FormValidation.I18n[this.options.locale] && !!FormValidation.I18n[this.options.locale][d] && !!FormValidation.I18n[this.options.locale][d]["default"]:
          return FormValidation.I18n[this.options.locale][d]["default"];
        default:
          return this.DEFAULT_MESSAGE
      }
    }, _getMessageContainer: function (a, b) {
      if (!this.options.err.parent)throw new Error("The err.parent option is not defined");
      var c = a.parent();
      if (c.is(b))return c;
      var d = c.attr("class");
      return d && this.options.err.parent.test(d) ? c : this._getMessageContainer(c, b)
    }, _parseAddOnOptions: function () {
      var a = this._namespace, b = this.$form.attr("data-" + a + "-addons"), c = this.options.addOns || {};
      if (b) {
        b = b.replace(/\s/g, "").split(",");
        for (var d = 0; d < b.length; d++)c[b[d]] || (c[b[d]] = {})
      }
      var e, f, g, h;
      for (e in c)if (FormValidation.AddOn[e]) {
        if (f = FormValidation.AddOn[e].html5Attributes)for (g in f)h = this.$form.attr("data-" + a + "-addons-" + e.toLowerCase() + "-" + g.toLowerCase()), h && (c[e][f[g]] = h)
      } else delete c[e];
      return c
    }, _parseOptions: function (b) {
      var c, d, e, f, g, h, i, j, k, l = this._namespace, m = b.attr("name") || b.attr("data-" + l + "-field"), n = {}, o = new RegExp("^data-" + l + "-([a-z]+)-alias$"), p = a.extend({}, FormValidation.Validator);
      a.each(b.get(0).attributes, function (a, b) {
        b.value && o.test(b.name) && (d = b.name.split("-")[2], p[b.value] && (p[d] = p[b.value], p[d].alias = b.value))
      });
      for (d in p)if (c = p[d], e = "data-" + l + "-" + d.toLowerCase(), f = b.attr(e) + "", k = "function" == typeof c.enableByHtml5 ? c.enableByHtml5(b) : null, k && "false" !== f || k !== !0 && ("" === f || "true" === f || e === f.toLowerCase())) {
        c.html5Attributes = a.extend({}, {
          message: "message",
          onerror: "onError",
          onsuccess: "onSuccess",
          transformer: "transformer"
        }, c.html5Attributes), n[d] = a.extend({}, k === !0 ? {} : k, n[d]), c.alias && (n[d].alias = c.alias);
        for (j in c.html5Attributes)g = c.html5Attributes[j], h = "data-" + l + "-" + d.toLowerCase() + "-" + j, i = b.attr(h), i && ("true" === i || h === i.toLowerCase() ? i = !0 : "false" === i && (i = !1), n[d][g] = i)
      }
      var q = {
        autoFocus: b.attr("data-" + l + "-autofocus"),
        err: b.attr("data-" + l + "-err-container") || b.attr("data-" + l + "-container"),
        enabled: b.attr("data-" + l + "-enabled"),
        excluded: b.attr("data-" + l + "-excluded"),
        icon: b.attr("data-" + l + "-icon") || b.attr("data-" + l + "-feedbackicons") || (this.options.fields && this.options.fields[m] ? this.options.fields[m].feedbackIcons : null),
        message: b.attr("data-" + l + "-message"),
        onError: b.attr("data-" + l + "-onerror"),
        onStatus: b.attr("data-" + l + "-onstatus"),
        onSuccess: b.attr("data-" + l + "-onsuccess"),
        row: b.attr("data-" + l + "-row") || b.attr("data-" + l + "-group") || (this.options.fields && this.options.fields[m] ? this.options.fields[m].group : null),
        selector: b.attr("data-" + l + "-selector"),
        threshold: b.attr("data-" + l + "-threshold"),
        transformer: b.attr("data-" + l + "-transformer"),
        trigger: b.attr("data-" + l + "-trigger"),
        verbose: b.attr("data-" + l + "-verbose"),
        validators: n
      }, r = a.isEmptyObject(q), s = a.isEmptyObject(n);
      return !s || !r && this.options.fields && this.options.fields[m] ? q : null
    }, _submit: function () {
      var b = this.isValid();
      if (null !== b) {
        var c = b ? this.options.events.formSuccess : this.options.events.formError, d = a.Event(c);
        this.$form.trigger(d), this.$submitButton && (b ? this._onSuccess(d) : this._onError(d))
      }
    }, _onError: function (b) {
      if (!b.isDefaultPrevented()) {
        if ("submitted" === this.options.live) {
          this.options.live = "enabled";
          var c = this;
          for (var d in this.options.fields)!function (b) {
            var d = c.getFieldElements(b);
            d.length && c.onLiveChange(d, "live", function () {
              c._exceedThreshold(a(this)) && c.validateField(a(this))
            })
          }(d)
        }
        for (var e = this._namespace, f = 0; f < this.$invalidFields.length; f++) {
          var g = this.$invalidFields.eq(f), h = this.isOptionEnabled(g.attr("data-" + e + "-field"), "autoFocus");
          if (h) {
            g.focus();
            break
          }
        }
      }
    }, _onFieldValidated: function (b, c) {
      var d = this._namespace, e = b.attr("data-" + d + "-field"), f = this.options.fields[e].validators, g = {}, h = 0, i = {
        bv: this,
        fv: this,
        field: e,
        element: b,
        validator: c,
        result: b.data(d + ".response." + c)
      };
      if (c)switch (b.data(d + ".result." + c)) {
        case this.STATUS_INVALID:
          b.trigger(a.Event(this.options.events.validatorError), i);
          break;
        case this.STATUS_VALID:
          b.trigger(a.Event(this.options.events.validatorSuccess), i);
          break;
        case this.STATUS_IGNORED:
          b.trigger(a.Event(this.options.events.validatorIgnored), i)
      }
      g[this.STATUS_NOT_VALIDATED] = 0, g[this.STATUS_VALIDATING] = 0, g[this.STATUS_INVALID] = 0, g[this.STATUS_VALID] = 0, g[this.STATUS_IGNORED] = 0;
      for (var j in f)if (f[j].enabled !== !1) {
        h++;
        var k = b.data(d + ".result." + j);
        k && g[k]++
      }
      g[this.STATUS_VALID] + g[this.STATUS_IGNORED] === h ? (this.$invalidFields = this.$invalidFields.not(b), b.trigger(a.Event(this.options.events.fieldSuccess), i)) : (0 === g[this.STATUS_NOT_VALIDATED] || !this.isOptionEnabled(e, "verbose")) && 0 === g[this.STATUS_VALIDATING] && g[this.STATUS_INVALID] > 0 && (this.$invalidFields = this.$invalidFields.add(b), b.trigger(a.Event(this.options.events.fieldError), i))
    }, _onSuccess: function (a) {
      a.isDefaultPrevented() || this.disableSubmitButtons(!0).defaultSubmit()
    }, _fixIcon: function (a, b) {
    }, _createTooltip: function (a, b, c) {
    }, _destroyTooltip: function (a, b) {
    }, _hideTooltip: function (a, b) {
    }, _showTooltip: function (a, b) {
    }, defaultSubmit: function () {
      var b = this._namespace;
      this.$submitButton && a("<input/>").attr({
        type: "hidden",
        name: this.$submitButton.attr("name")
      }).attr("data-" + b + "-submit-hidden", "").val(this.$submitButton.val()).appendTo(this.$form), this.$form.off("submit." + b).submit()
    }, disableSubmitButtons: function (a) {
      return a ? "disabled" !== this.options.live && this.$form.find(this.options.button.selector).attr("disabled", "disabled").addClass(this.options.button.disabled) : this.$form.find(this.options.button.selector).removeAttr("disabled").removeClass(this.options.button.disabled), this
    }, getFieldElements: function (b) {
      if (!this._cacheFields[b])if (this.options.fields[b] && this.options.fields[b].selector) {
        var c = this.$form.find(this.options.fields[b].selector);
        this._cacheFields[b] = c.length ? c : a(this.options.fields[b].selector)
      } else this._cacheFields[b] = this.$form.find('[name="' + b + '"]');
      return this._cacheFields[b]
    }, getFieldValue: function (a, b) {
      var c, d = this._namespace;
      if ("string" == typeof a) {
        if (c = this.getFieldElements(a), 0 === c.length)return null
      } else c = a, a = c.attr("data-" + d + "-field");
      if (!a || !this.options.fields[a])return c.val();
      var e = (this.options.fields[a].validators && this.options.fields[a].validators[b] ? this.options.fields[a].validators[b].transformer : null) || this.options.fields[a].transformer;
      return e ? FormValidation.Helper.call(e, [c, b, this]) : c.val()
    }, getNamespace: function () {
      return this._namespace
    }, getOptions: function (a, b, c) {
      var d = this._namespace;
      if (!a)return c ? this.options[c] : this.options;
      if ("object" == typeof a && (a = a.attr("data-" + d + "-field")), !this.options.fields[a])return null;
      var e = this.options.fields[a];
      return b ? e.validators && e.validators[b] ? c ? e.validators[b][c] : e.validators[b] : null : c ? e[c] : e
    }, getStatus: function (a, b) {
      var c = this._namespace;
      switch (typeof a) {
        case"object":
          return a.data(c + ".result." + b);
        case"string":
        default:
          return this.getFieldElements(a).eq(0).data(c + ".result." + b)
      }
    }, isOptionEnabled: function (a, b) {
      return !this.options.fields[a] || "true" !== this.options.fields[a][b] && this.options.fields[a][b] !== !0 ? !this.options.fields[a] || "false" !== this.options.fields[a][b] && this.options.fields[a][b] !== !1 ? "true" === this.options[b] || this.options[b] === !0 : !1 : !0
    }, isValid: function () {
      for (var a in this.options.fields) {
        var b = this.isValidField(a);
        if (null === b)return null;
        if (b === !1)return !1
      }
      return !0
    }, isValidContainer: function (b) {
      var c = this, d = this._namespace, e = [], f = "string" == typeof b ? a(b) : b;
      if (0 === f.length)return !0;
      f.find("[data-" + d + "-field]").each(function () {
        var b = a(this);
        c._isExcluded(b) || e.push(b)
      });
      for (var g = e.length, h = 0; g > h; h++) {
        var i = e[h], j = i.attr("data-" + d + "-field"), k = i.data(d + ".messages").find("." + this.options.err.clazz.split(" ").join(".") + "[data-" + d + "-validator][data-" + d + '-for="' + j + '"]');
        if (!this.options.fields || !this.options.fields[j] || "false" !== this.options.fields[j].enabled && this.options.fields[j].enabled !== !1) {
          if (k.filter("[data-" + d + '-result="' + this.STATUS_INVALID + '"]').length > 0)return !1;
          if (k.filter("[data-" + d + '-result="' + this.STATUS_NOT_VALIDATED + '"]').length > 0 || k.filter("[data-" + d + '-result="' + this.STATUS_VALIDATING + '"]').length > 0)return null
        }
      }
      return !0
    }, isValidField: function (b) {
      var c = this._namespace, d = a([]);
      switch (typeof b) {
        case"object":
          d = b, b = b.attr("data-" + c + "-field");
          break;
        case"string":
          d = this.getFieldElements(b)
      }
      if (0 === d.length || !this.options.fields[b] || "false" === this.options.fields[b].enabled || this.options.fields[b].enabled === !1)return !0;
      for (var e, f, g, h = d.attr("type"), i = "radio" === h || "checkbox" === h ? 1 : d.length, j = 0; i > j; j++)if (e = d.eq(j), !this._isExcluded(e))for (f in this.options.fields[b].validators)if (this.options.fields[b].validators[f].enabled !== !1) {
        if (g = e.data(c + ".result." + f), g === this.STATUS_VALIDATING || g === this.STATUS_NOT_VALIDATED)return null;
        if (g === this.STATUS_INVALID)return !1
      }
      return !0
    }, offLiveChange: function (b, c) {
      if (null === b || 0 === b.length)return this;
      var d = this._namespace, e = this._getFieldTrigger(b.eq(0)), f = a.map(e, function (a) {
        return a + "." + c + "." + d
      }).join(" ");
      return b.off(f), this
    }, onLiveChange: function (b, c, d) {
      if (null === b || 0 === b.length)return this;
      var e = this._namespace, f = this._getFieldTrigger(b.eq(0)), g = a.map(f, function (a) {
        return a + "." + c + "." + e
      }).join(" ");
      switch (this.options.live) {
        case"submitted":
          break;
        case"disabled":
          b.off(g);
          break;
        case"enabled":
        default:
          b.off(g).on(g, function (a) {
            d.apply(this, arguments)
          })
      }
      return this
    }, updateMessage: function (b, c, d) {
      var e = this, f = this._namespace, g = a([]);
      switch (typeof b) {
        case"object":
          g = b, b = b.attr("data-" + f + "-field");
          break;
        case"string":
          g = this.getFieldElements(b)
      }
      return g.each(function () {
        a(this).data(f + ".messages").find("." + e.options.err.clazz + "[data-" + f + '-validator="' + c + '"][data-' + f + '-for="' + b + '"]').html(d)
      }), this
    }, updateStatus: function (b, c, d) {
      var e = this._namespace, f = a([]);
      switch (typeof b) {
        case"object":
          f = b, b = b.attr("data-" + e + "-field");
          break;
        case"string":
          f = this.getFieldElements(b)
      }
      if (!b || !this.options.fields[b])return this;
      c === this.STATUS_NOT_VALIDATED && (this._submitIfValid = !1);
      for (var g = this, h = f.attr("type"), i = this.options.fields[b].row || this.options.row.selector, j = "radio" === h || "checkbox" === h ? 1 : f.length, k = 0; j > k; k++) {
        var l = f.eq(k);
        if (!this._isExcluded(l)) {
          var m, n, o = l.closest(i), p = l.data(e + ".messages"), q = p.find("." + this.options.err.clazz.split(" ").join(".") + "[data-" + e + "-validator][data-" + e + '-for="' + b + '"]'), r = d ? q.filter("[data-" + e + '-validator="' + d + '"]') : q, s = l.data(e + ".icon"), t = "function" == typeof(this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, l, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container, u = null;
          if (d)l.data(e + ".result." + d, c); else for (var v in this.options.fields[b].validators)l.data(e + ".result." + v, c);
          switch (r.attr("data-" + e + "-result", c), c) {
            case this.STATUS_VALIDATING:
              u = null, this.disableSubmitButtons(!0), l.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), o.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), s && s.removeClass(this.options.icon.valid).removeClass(this.options.icon.invalid).addClass(this.options.icon.validating).show();
              break;
            case this.STATUS_INVALID:
              u = !1, this.disableSubmitButtons(!0), l.removeClass(this.options.control.valid).addClass(this.options.control.invalid), o.removeClass(this.options.row.valid).addClass(this.options.row.invalid), s && s.removeClass(this.options.icon.valid).removeClass(this.options.icon.validating).addClass(this.options.icon.invalid).show();
              break;
            case this.STATUS_IGNORED:
            case this.STATUS_VALID:
              m = q.filter("[data-" + e + '-result="' + this.STATUS_VALIDATING + '"]').length > 0, n = q.filter("[data-" + e + '-result="' + this.STATUS_NOT_VALIDATED + '"]').length > 0;
              var w = q.filter("[data-" + e + '-result="' + this.STATUS_IGNORED + '"]').length;
              u = m || n ? null : q.filter("[data-" + e + '-result="' + this.STATUS_VALID + '"]').length + w === q.length, l.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), u === !0 ? (this.disableSubmitButtons(this.isValid() === !1), c === this.STATUS_VALID && l.addClass(this.options.control.valid)) : u === !1 && (this.disableSubmitButtons(!0), c === this.STATUS_VALID && l.addClass(this.options.control.invalid)), s && (s.removeClass(this.options.icon.invalid).removeClass(this.options.icon.validating).removeClass(this.options.icon.valid), (c === this.STATUS_VALID || w !== q.length) && s.addClass(m ? this.options.icon.validating : null === u ? "" : u ? this.options.icon.valid : this.options.icon.invalid).show());
              var x = this.isValidContainer(o);
              null !== x && (o.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), (c === this.STATUS_VALID || w !== q.length) && o.addClass(x ? this.options.row.valid : this.options.row.invalid));
              break;
            case this.STATUS_NOT_VALIDATED:
            default:
              u = null, this.disableSubmitButtons(!1), l.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), o.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), s && s.removeClass(this.options.icon.valid).removeClass(this.options.icon.invalid).removeClass(this.options.icon.validating).hide()
          }
          !s || "tooltip" !== t && "popover" !== t ? c === this.STATUS_INVALID ? r.show() : r.hide() : u === !1 ? this._createTooltip(l, q.filter("[data-" + e + '-result="' + g.STATUS_INVALID + '"]').eq(0).html(), t) : this._destroyTooltip(l, t), l.trigger(a.Event(this.options.events.fieldStatus), {
            bv: this,
            fv: this,
            field: b,
            element: l,
            status: c
          }), this._onFieldValidated(l, d)
        }
      }
      return this
    }, validate: function () {
      if (a.isEmptyObject(this.options.fields))return this._submit(), this;
      this.$form.trigger(a.Event(this.options.events.formPreValidate)), this.disableSubmitButtons(!0), this._submitIfValid = !1;
      for (var b in this.options.fields)this.validateField(b);
      return this._submit(), this._submitIfValid = !0, this
    }, validateField: function (b) {
      var c = this._namespace, d = a([]);
      switch (typeof b) {
        case"object":
          d = b, b = b.attr("data-" + c + "-field");
          break;
        case"string":
          d = this.getFieldElements(b)
      }
      if (0 === d.length || !this.options.fields[b] || "false" === this.options.fields[b].enabled || this.options.fields[b].enabled === !1)return this;
      for (var e, f, g, h = this, i = d.attr("type"), j = "radio" === i || "checkbox" === i ? 1 : d.length, k = "radio" === i || "checkbox" === i, l = this.options.fields[b].validators, m = this.isOptionEnabled(b, "verbose"), n = 0; j > n; n++) {
        var o = d.eq(n);
        if (!this._isExcluded(o)) {
          var p = !1;
          for (e in l) {
            if (o.data(c + ".dfs." + e) && o.data(c + ".dfs." + e).reject(), p)break;
            var q = o.data(c + ".result." + e);
            if (q !== this.STATUS_VALID && q !== this.STATUS_INVALID)if (l[e].enabled !== !1)if (o.data(c + ".result." + e, this.STATUS_VALIDATING), f = l[e].alias || e, g = FormValidation.Validator[f].validate(this, o, l[e], e), "object" == typeof g && g.resolve)this.updateStatus(k ? b : o, this.STATUS_VALIDATING, e), o.data(c + ".dfs." + e, g), g.done(function (a, b, d) {
              a.removeData(c + ".dfs." + b).data(c + ".response." + b, d), d.message && h.updateMessage(a, b, d.message), h.updateStatus(k ? a.attr("data-" + c + "-field") : a, d.valid === !0 ? h.STATUS_VALID : d.valid === !1 ? h.STATUS_INVALID : h.STATUS_IGNORED, b), d.valid && h._submitIfValid === !0 ? h._submit() : d.valid !== !1 || m || (p = !0)
            }); else if ("object" == typeof g && void 0 !== g.valid) {
              if (o.data(c + ".response." + e, g), g.message && this.updateMessage(k ? b : o, e, g.message), this.updateStatus(k ? b : o, g.valid === !0 ? this.STATUS_VALID : g.valid === !1 ? this.STATUS_INVALID : this.STATUS_IGNORED, e), g.valid === !1 && !m)break
            } else if ("boolean" == typeof g) {
              if (o.data(c + ".response." + e, g), this.updateStatus(k ? b : o, g ? this.STATUS_VALID : this.STATUS_INVALID, e), !g && !m)break
            } else null === g && (o.data(c + ".response." + e, g), this.updateStatus(k ? b : o, this.STATUS_IGNORED, e)); else this.updateStatus(k ? b : o, this.STATUS_IGNORED, e); else this._onFieldValidated(o, e)
          }
        }
      }
      return this
    }, addField: function (b, c) {
      var d = this._namespace, e = a([]);
      switch (typeof b) {
        case"object":
          e = b, b = b.attr("data-" + d + "-field") || b.attr("name");
          break;
        case"string":
          delete this._cacheFields[b], e = this.getFieldElements(b)
      }
      e.attr("data-" + d + "-field", b);
      for (var f = e.attr("type"), g = "radio" === f || "checkbox" === f ? 1 : e.length, h = 0; g > h; h++) {
        var i = e.eq(h), j = this._parseOptions(i);
        j = null === j ? c : a.extend(!0, j, c), this.options.fields[b] = a.extend(!0, this.options.fields[b], j), this._cacheFields[b] = this._cacheFields[b] ? this._cacheFields[b].add(i) : i, this._initField("checkbox" === f || "radio" === f ? b : i)
      }
      return this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.fieldAdded), {
        field: b,
        element: e,
        options: this.options.fields[b]
      }), this
    }, destroy: function () {
      var a, b, c, d, e, f, g, h, i = this._namespace;
      for (b in this.options.fields)for (c = this.getFieldElements(b), a = 0; a < c.length; a++) {
        d = c.eq(a);
        for (e in this.options.fields[b].validators)d.data(i + ".dfs." + e) && d.data(i + ".dfs." + e).reject(), d.removeData(i + ".result." + e).removeData(i + ".response." + e).removeData(i + ".dfs." + e), h = this.options.fields[b].validators[e].alias || e, "function" == typeof FormValidation.Validator[h].destroy && FormValidation.Validator[h].destroy(this, d, this.options.fields[b].validators[e], e)
      }
      for (b in this.options.fields)for (c = this.getFieldElements(b), g = this.options.fields[b].row || this.options.row.selector, a = 0; a < c.length; a++) {
        d = c.eq(a), d.data(i + ".messages").find("." + this.options.err.clazz.split(" ").join(".") + "[data-" + i + "-validator][data-" + i + '-for="' + b + '"]').remove().end().end().removeData(i + ".messages").closest(g).removeClass(this.options.row.valid).removeClass(this.options.row.invalid).removeClass(this.options.row.feedback).end().off("." + i).removeAttr("data-" + i + "-field");
        var j = "function" == typeof(this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, d, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container;
        ("tooltip" === j || "popover" === j) && this._destroyTooltip(d, j), f = d.data(i + ".icon"), f && f.remove(), d.removeData(i + ".icon").removeData(i + ".trigger")
      }
      for (var k in this.options.addOns)"function" == typeof FormValidation.AddOn[k].destroy && FormValidation.AddOn[k].destroy(this, this.options.addOns[k]);
      this.disableSubmitButtons(!1), this.$hiddenButton.remove(), this.$form.removeClass(this.options.elementClass).off("." + i).removeData("bootstrapValidator").removeData("formValidation").find("[data-" + i + "-submit-hidden]").remove().end().find('[type="submit"]').off("click." + i)
    }, enableFieldValidators: function (a, b, c) {
      var d = this.options.fields[a].validators;
      if (c && d && d[c] && d[c].enabled !== b)this.options.fields[a].validators[c].enabled = b, this.updateStatus(a, this.STATUS_NOT_VALIDATED, c); else if (!c && this.options.fields[a].enabled !== b) {
        this.options.fields[a].enabled = b;
        for (var e in d)this.enableFieldValidators(a, b, e)
      }
      return this
    }, getDynamicOption: function (a, b) {
      var c = "string" == typeof a ? this.getFieldElements(a) : a, d = c.val();
      if ("function" == typeof b)return FormValidation.Helper.call(b, [d, this, c]);
      if ("string" == typeof b) {
        var e = this.getFieldElements(b);
        return e.length ? e.val() : FormValidation.Helper.call(b, [d, this, c]) || b
      }
      return null
    }, getForm: function () {
      return this.$form
    }, getInvalidFields: function () {
      return this.$invalidFields
    }, getLocale: function () {
      return this.options.locale
    }, getMessages: function (b, c) {
      var d = this, e = this._namespace, f = [], g = a([]);
      switch (!0) {
        case b && "object" == typeof b:
          g = b;
          break;
        case b && "string" == typeof b:
          var h = this.getFieldElements(b);
          if (h.length > 0) {
            var i = h.attr("type");
            g = "radio" === i || "checkbox" === i ? h.eq(0) : h
          }
          break;
        default:
          g = this.$invalidFields
      }
      var j = c ? "[data-" + e + '-validator="' + c + '"]' : "";
      return g.each(function () {
        f = f.concat(a(this).data(e + ".messages").find("." + d.options.err.clazz + "[data-" + e + '-for="' + a(this).attr("data-" + e + "-field") + '"][data-' + e + '-result="' + d.STATUS_INVALID + '"]' + j).map(function () {
          var b = a(this).attr("data-" + e + "-validator"), c = a(this).attr("data-" + e + "-for");
          return d.options.fields[c].validators[b].enabled === !1 ? "" : a(this).html()
        }).get())
      }), f
    }, getSubmitButton: function () {
      return this.$submitButton
    }, removeField: function (b) {
      var c = this._namespace, d = a([]);
      switch (typeof b) {
        case"object":
          d = b, b = b.attr("data-" + c + "-field") || b.attr("name"), d.attr("data-" + c + "-field", b);
          break;
        case"string":
          d = this.getFieldElements(b)
      }
      if (0 === d.length)return this;
      for (var e = d.attr("type"), f = "radio" === e || "checkbox" === e ? 1 : d.length, g = 0; f > g; g++) {
        var h = d.eq(g);
        this.$invalidFields = this.$invalidFields.not(h), this._cacheFields[b] = this._cacheFields[b].not(h)
      }
      return this._cacheFields[b] && 0 !== this._cacheFields[b].length || delete this.options.fields[b], ("checkbox" === e || "radio" === e) && this._initField(b), this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.fieldRemoved), {
        field: b,
        element: d
      }), this
    }, resetField: function (b, c) {
      var d = this._namespace, e = a([]);
      switch (typeof b) {
        case"object":
          e = b, b = b.attr("data-" + d + "-field");
          break;
        case"string":
          e = this.getFieldElements(b)
      }
      var f = e.length;
      if (this.options.fields[b])for (var g = 0; f > g; g++)for (var h in this.options.fields[b].validators)e.eq(g).removeData(d + ".dfs." + h);
      if (c) {
        var i = e.attr("type");
        "radio" === i || "checkbox" === i ? e.prop("checked", !1).removeAttr("selected") : e.val("")
      }
      return this.updateStatus(b, this.STATUS_NOT_VALIDATED), this
    }, resetForm: function (b) {
      for (var c in this.options.fields)this.resetField(c, b);
      return this.$invalidFields = a([]), this.$submitButton = null, this.disableSubmitButtons(!1), this
    }, revalidateField: function (a) {
      return this.updateStatus(a, this.STATUS_NOT_VALIDATED).validateField(a), this
    }, setLocale: function (b) {
      return this.options.locale = b, this.$form.trigger(a.Event(this.options.events.localeChanged), {
        locale: b,
        bv: this,
        fv: this
      }), this
    }, updateOption: function (a, b, c, d) {
      var e = this._namespace;
      return "object" == typeof a && (a = a.attr("data-" + e + "-field")), this.options.fields[a] && this.options.fields[a].validators[b] && (this.options.fields[a].validators[b][c] = d, this.updateStatus(a, this.STATUS_NOT_VALIDATED, b)), this
    }, validateContainer: function (b) {
      var c = this, d = this._namespace, e = [], f = "string" == typeof b ? a(b) : b;
      if (0 === f.length)return this;
      f.find("[data-" + d + "-field]").each(function () {
        var b = a(this);
        c._isExcluded(b) || e.push(b)
      });
      for (var g = e.length, h = 0; g > h; h++)this.validateField(e[h]);
      return this
    }
  }, a.fn.formValidation = function (b) {
    var c = arguments;
    return this.each(function () {
      var d = a(this), e = d.data("formValidation"), f = "object" == typeof b && b;
      if (!e) {
        var g = (f.framework || d.attr("data-fv-framework") || "bootstrap").toLowerCase(), h = g.substr(0, 1).toUpperCase() + g.substr(1);
        if ("undefined" == typeof FormValidation.Framework[h])throw new Error("The class FormValidation.Framework." + h + " is not implemented");
        e = new FormValidation.Framework[h](this, f), d.addClass("fv-form-" + g).data("formValidation", e)
      }
      "string" == typeof b && e[b].apply(e, Array.prototype.slice.call(c, 1))
    })
  }, a.fn.formValidation.Constructor = FormValidation.Base, a.fn.formValidation.DEFAULT_MESSAGE = "This value is not valid", a.fn.formValidation.DEFAULT_OPTIONS = {
    autoFocus: !0,
    declarative: !0,
    elementClass: "fv-form",
    events: {
      formInit: "init.form.fv",
      formPreValidate: "prevalidate.form.fv",
      formError: "err.form.fv",
      formSuccess: "success.form.fv",
      fieldAdded: "added.field.fv",
      fieldRemoved: "removed.field.fv",
      fieldInit: "init.field.fv",
      fieldError: "err.field.fv",
      fieldSuccess: "success.field.fv",
      fieldStatus: "status.field.fv",
      localeChanged: "changed.locale.fv",
      validatorError: "err.validator.fv",
      validatorSuccess: "success.validator.fv",
      validatorIgnored: "ignored.validator.fv"
    },
    excluded: [":disabled", ":hidden", ":not(:visible)"],
    fields: null,
    live: "enabled",
    locale: "en_US",
    message: null,
    threshold: null,
    verbose: !0,
    button: {selector: '[type="submit"]:not([formnovalidate])', disabled: ""},
    control: {valid: "", invalid: ""},
    err: {clazz: "", container: null, parent: null},
    icon: {valid: null, invalid: null, validating: null, feedback: ""},
    row: {selector: null, valid: "", invalid: "", feedback: ""}
  }
}(jQuery), function (a) {
  FormValidation.Helper = {
    call: function (a, b) {
      if ("function" == typeof a)return a.apply(this, b);
      if ("string" == typeof a) {
        "()" === a.substring(a.length - 2) && (a = a.substring(0, a.length - 2));
        for (var c = a.split("."), d = c.pop(), e = window, f = 0; f < c.length; f++)e = e[c[f]];
        return "undefined" == typeof e[d] ? null : e[d].apply(this, b)
      }
    }, date: function (a, b, c, d) {
      if (isNaN(a) || isNaN(b) || isNaN(c))return !1;
      if (c.length > 2 || b.length > 2 || a.length > 4)return !1;
      if (c = parseInt(c, 10), b = parseInt(b, 10), a = parseInt(a, 10), 1e3 > a || a > 9999 || 0 >= b || b > 12)return !1;
      var e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if ((a % 400 === 0 || a % 100 !== 0 && a % 4 === 0) && (e[1] = 29), 0 >= c || c > e[b - 1])return !1;
      if (d === !0) {
        var f = new Date, g = f.getFullYear(), h = f.getMonth(), i = f.getDate();
        return g > a || a === g && h > b - 1 || a === g && b - 1 === h && i > c
      }
      return !0
    }, format: function (b, c) {
      a.isArray(c) || (c = [c]);
      for (var d in c)b = b.replace("%s", c[d]);
      return b
    }, luhn: function (a) {
      for (var b = a.length, c = 0, d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]], e = 0; b--;)e += d[c][parseInt(a.charAt(b), 10)], c ^= 1;
      return e % 10 === 0 && e > 0
    }, mod11And10: function (a) {
      for (var b = 5, c = a.length, d = 0; c > d; d++)b = (2 * (b || 10) % 11 + parseInt(a.charAt(d), 10)) % 10;
      return 1 === b
    }, mod37And36: function (a, b) {
      b = b || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (var c = b.length, d = a.length, e = Math.floor(c / 2), f = 0; d > f; f++)e = (2 * (e || c) % (c + 1) + b.indexOf(a.charAt(f))) % c;
      return 1 === e
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {base64: {"default": "Please enter a valid base 64 encoded"}}}), FormValidation.Validator.base64 = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      between: {
        "default": "Please enter a value between %s and %s",
        notInclusive: "Please enter a value between %s and %s strictly"
      }
    }
  }), FormValidation.Validator.between = {
    html5Attributes: {
      message: "message",
      min: "min",
      max: "max",
      inclusive: "inclusive"
    }, enableByHtml5: function (a) {
      return "range" === a.attr("type") ? {min: a.attr("min"), max: a.attr("max")} : !1
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      f = this._format(f);
      var g = b.getLocale(), h = a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min), i = a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max), j = this._format(h), k = this._format(i);
      return d.inclusive === !0 || void 0 === d.inclusive ? {
        valid: a.isNumeric(f) && parseFloat(f) >= j && parseFloat(f) <= k,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].between["default"], [h, i])
      } : {
        valid: a.isNumeric(f) && parseFloat(f) > j && parseFloat(f) < k,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].between.notInclusive, [h, i])
      }
    }, _format: function (a) {
      return (a + "").replace(",", ".")
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {bic: {"default": "Please enter a valid BIC number"}}}), FormValidation.Validator.bic = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : /^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$/.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.Validator.blank = {
    validate: function (a, b, c, d) {
      return !0
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {callback: {"default": "Please enter a valid value"}}}), FormValidation.Validator.callback = {
    html5Attributes: {
      message: "message",
      callback: "callback"
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e), g = new a.Deferred, h = {valid: !0};
      if (d.callback) {
        var i = FormValidation.Helper.call(d.callback, [f, b, c]);
        h = "boolean" == typeof i || null === i ? {valid: i} : i
      }
      return g.resolve(c, e, h), g
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      choice: {
        "default": "Please enter a valid value",
        less: "Please choose %s options at minimum",
        more: "Please choose %s options at maximum",
        between: "Please choose %s - %s options"
      }
    }
  }), FormValidation.Validator.choice = {
    html5Attributes: {message: "message", min: "min", max: "max"},
    validate: function (b, c, d, e) {
      var f = b.getLocale(), g = b.getNamespace(), h = c.is("select") ? b.getFieldElements(c.attr("data-" + g + "-field")).find("option").filter(":selected").length : b.getFieldElements(c.attr("data-" + g + "-field")).filter(":checked").length, i = d.min ? a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min) : null, j = d.max ? a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max) : null, k = !0, l = d.message || FormValidation.I18n[f].choice["default"];
      switch ((i && h < parseInt(i, 10) || j && h > parseInt(j, 10)) && (k = !1), !0) {
        case!!i && !!j:
          l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.between, [parseInt(i, 10), parseInt(j, 10)]);
          break;
        case!!i:
          l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.less, parseInt(i, 10));
          break;
        case!!j:
          l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.more, parseInt(j, 10))
      }
      return {valid: k, message: l}
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {color: {"default": "Please enter a valid color"}}}), FormValidation.Validator.color = {
    html5Attributes: {
      message: "message",
      type: "type"
    },
    enableByHtml5: function (a) {
      return "color" === a.attr("type")
    },
    SUPPORTED_TYPES: ["hex", "rgb", "rgba", "hsl", "hsla", "keyword"],
    KEYWORD_COLORS: ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      if (this.enableByHtml5(c))return /^#[0-9A-F]{6}$/i.test(f);
      var g = d.type || this.SUPPORTED_TYPES;
      a.isArray(g) || (g = g.replace(/s/g, "").split(","));
      for (var h, i, j = !1, k = 0; k < g.length; k++)if (i = g[k], h = "_" + i.toLowerCase(), j = j || this[h](f))return !0;
      return !1
    },
    _hex: function (a) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)
    },
    _hsl: function (a) {
      return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(a)
    },
    _hsla: function (a) {
      return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(a)
    },
    _keyword: function (b) {
      return a.inArray(b, this.KEYWORD_COLORS) >= 0
    },
    _rgb: function (a) {
      var b = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/, c = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
      return b.test(a) || c.test(a)
    },
    _rgba: function (a) {
      var b = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/, c = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
      return b.test(a) || c.test(a)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {creditCard: {"default": "Please enter a valid credit card number"}}}), FormValidation.Validator.creditCard = {
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      if (/[^0-9-\s]+/.test(f))return !1;
      if (f = f.replace(/\D/g, ""), !FormValidation.Helper.luhn(f))return !1;
      var g, h, i = {
        AMERICAN_EXPRESS: {length: [15], prefix: ["34", "37"]},
        DINERS_CLUB: {length: [14], prefix: ["300", "301", "302", "303", "304", "305", "36"]},
        DINERS_CLUB_US: {length: [16], prefix: ["54", "55"]},
        DISCOVER: {
          length: [16],
          prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
        },
        JCB: {length: [16], prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]},
        LASER: {length: [16, 17, 18, 19], prefix: ["6304", "6706", "6771", "6709"]},
        MAESTRO: {
          length: [12, 13, 14, 15, 16, 17, 18, 19],
          prefix: ["5018", "5020", "5038", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
        },
        MASTERCARD: {length: [16], prefix: ["51", "52", "53", "54", "55"]},
        SOLO: {length: [16, 18, 19], prefix: ["6334", "6767"]},
        UNIONPAY: {
          length: [16, 17, 18, 19],
          prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
        },
        VISA: {length: [16], prefix: ["4"]}
      };
      for (g in i)for (h in i[g].prefix)if (f.substr(0, i[g].prefix[h].length) === i[g].prefix[h] && -1 !== a.inArray(f.length, i[g].length))return {
        valid: !0,
        type: g
      };
      return !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {cusip: {"default": "Please enter a valid CUSIP number"}}}), FormValidation.Validator.cusip = {
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      if (f = f.toUpperCase(), !/^[0-9A-Z]{9}$/.test(f))return !1;
      for (var g = a.map(f.split(""), function (a) {
        var b = a.charCodeAt(0);
        return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a
      }), h = g.length, i = 0, j = 0; h - 1 > j; j++) {
        var k = parseInt(g[j], 10);
        j % 2 !== 0 && (k *= 2), k > 9 && (k -= 9), i += k
      }
      return i = (10 - i % 10) % 10, i === parseInt(g[h - 1], 10)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {cvv: {"default": "Please enter a valid CVV number"}}}), FormValidation.Validator.cvv = {
    html5Attributes: {
      message: "message",
      ccfield: "creditCardField"
    }, init: function (a, b, c, d) {
      if (c.creditCardField) {
        var e = a.getFieldElements(c.creditCardField);
        a.onLiveChange(e, "live_" + d, function () {
          var c = a.getStatus(b, d);
          c !== a.STATUS_NOT_VALIDATED && a.revalidateField(b)
        })
      }
    }, destroy: function (a, b, c, d) {
      if (c.creditCardField) {
        var e = a.getFieldElements(c.creditCardField);
        a.offLiveChange(e, "live_" + d)
      }
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      if (!/^[0-9]{3,4}$/.test(f))return !1;
      if (!d.creditCardField)return !0;
      var g = b.getFieldElements(d.creditCardField).val();
      if ("" === g)return !0;
      g = g.replace(/\D/g, "");
      var h, i, j = {
        AMERICAN_EXPRESS: {length: [15], prefix: ["34", "37"]},
        DINERS_CLUB: {length: [14], prefix: ["300", "301", "302", "303", "304", "305", "36"]},
        DINERS_CLUB_US: {length: [16], prefix: ["54", "55"]},
        DISCOVER: {
          length: [16],
          prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
        },
        JCB: {length: [16], prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]},
        LASER: {length: [16, 17, 18, 19], prefix: ["6304", "6706", "6771", "6709"]},
        MAESTRO: {
          length: [12, 13, 14, 15, 16, 17, 18, 19],
          prefix: ["5018", "5020", "5038", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
        },
        MASTERCARD: {length: [16], prefix: ["51", "52", "53", "54", "55"]},
        SOLO: {length: [16, 18, 19], prefix: ["6334", "6767"]},
        UNIONPAY: {
          length: [16, 17, 18, 19],
          prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
        },
        VISA: {length: [16], prefix: ["4"]}
      }, k = null;
      for (h in j)for (i in j[h].prefix)if (g.substr(0, j[h].prefix[i].length) === j[h].prefix[i] && -1 !== a.inArray(g.length, j[h].length)) {
        k = h;
        break
      }
      return null === k ? !1 : "AMERICAN_EXPRESS" === k ? 4 === f.length : 3 === f.length
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      date: {
        "default": "Please enter a valid date",
        min: "Please enter a date after %s",
        max: "Please enter a date before %s",
        range: "Please enter a date in the range %s - %s"
      }
    }
  }), FormValidation.Validator.date = {
    html5Attributes: {
      message: "message",
      format: "format",
      min: "min",
      max: "max",
      separator: "separator"
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      d.format = d.format || "MM/DD/YYYY", "date" === c.attr("type") && (d.format = "YYYY-MM-DD");
      var g = b.getLocale(), h = d.message || FormValidation.I18n[g].date["default"], i = d.format.split(" "), j = i[0], k = i.length > 1 ? i[1] : null, l = i.length > 2 ? i[2] : null, m = f.split(" "), n = m[0], o = m.length > 1 ? m[1] : null;
      if (i.length !== m.length)return {valid: !1, message: h};
      var p = d.separator;
      if (p || (p = -1 !== n.indexOf("/") ? "/" : -1 !== n.indexOf("-") ? "-" : -1 !== n.indexOf(".") ? "." : null), null === p || -1 === n.indexOf(p))return {
        valid: !1,
        message: h
      };
      if (n = n.split(p), j = j.split(p), n.length !== j.length)return {valid: !1, message: h};
      var q = n[a.inArray("YYYY", j)], r = n[a.inArray("MM", j)], s = n[a.inArray("DD", j)];
      if (!q || !r || !s || 4 !== q.length)return {valid: !1, message: h};
      var t = null, u = null, v = null;
      if (k) {
        if (k = k.split(":"), o = o.split(":"), k.length !== o.length)return {valid: !1, message: h};
        if (u = o.length > 0 ? o[0] : null, t = o.length > 1 ? o[1] : null, v = o.length > 2 ? o[2] : null, "" === u || "" === t || "" === v)return {
          valid: !1,
          message: h
        };
        if (v) {
          if (isNaN(v) || v.length > 2)return {valid: !1, message: h};
          if (v = parseInt(v, 10), 0 > v || v > 60)return {valid: !1, message: h}
        }
        if (u) {
          if (isNaN(u) || u.length > 2)return {valid: !1, message: h};
          if (u = parseInt(u, 10), 0 > u || u >= 24 || l && u > 12)return {valid: !1, message: h}
        }
        if (t) {
          if (isNaN(t) || t.length > 2)return {valid: !1, message: h};
          if (t = parseInt(t, 10), 0 > t || t > 59)return {valid: !1, message: h}
        }
      }
      var w = FormValidation.Helper.date(q, r, s), x = null, y = null, z = d.min, A = d.max;
      switch (z && (isNaN(Date.parse(z)) && (z = b.getDynamicOption(c, z)), x = z instanceof Date ? z : this._parseDate(z, j, p), z = z instanceof Date ? this._formatDate(z, d.format) : z), A && (isNaN(Date.parse(A)) && (A = b.getDynamicOption(c, A)), y = A instanceof Date ? A : this._parseDate(A, j, p), A = A instanceof Date ? this._formatDate(A, d.format) : A), n = new Date(q, r - 1, s, u, t, v), !0) {
        case z && !A && w:
          w = n.getTime() >= x.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.min, z);
          break;
        case A && !z && w:
          w = n.getTime() <= y.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.max, A);
          break;
        case A && z && w:
          w = n.getTime() <= y.getTime() && n.getTime() >= x.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.range, [z, A])
      }
      return {valid: w, date: n, message: h}
    }, _parseDate: function (b, c, d) {
      var e = 0, f = 0, g = 0, h = b.split(" "), i = h[0], j = h.length > 1 ? h[1] : null;
      i = i.split(d);
      var k = i[a.inArray("YYYY", c)], l = i[a.inArray("MM", c)], m = i[a.inArray("DD", c)];
      return j && (j = j.split(":"), f = j.length > 0 ? j[0] : null, e = j.length > 1 ? j[1] : null, g = j.length > 2 ? j[2] : null), new Date(k, l - 1, m, f, e, g)
    }, _formatDate: function (a, b) {
      b = b.replace(/Y/g, "y").replace(/M/g, "m").replace(/D/g, "d").replace(/:m/g, ":M").replace(/:mm/g, ":MM").replace(/:S/, ":s").replace(/:SS/, ":ss");
      var c = {
        d: function (a) {
          return a.getDate()
        }, dd: function (a) {
          var b = a.getDate();
          return 10 > b ? "0" + b : b
        }, m: function (a) {
          return a.getMonth() + 1
        }, mm: function (a) {
          var b = a.getMonth() + 1;
          return 10 > b ? "0" + b : b
        }, yy: function (a) {
          return ("" + a.getFullYear()).substr(2)
        }, yyyy: function (a) {
          return a.getFullYear()
        }, h: function (a) {
          return a.getHours() % 12 || 12
        }, hh: function (a) {
          var b = a.getHours() % 12 || 12;
          return 10 > b ? "0" + b : b
        }, H: function (a) {
          return a.getHours()
        }, HH: function (a) {
          var b = a.getHours();
          return 10 > b ? "0" + b : b
        }, M: function (a) {
          return a.getMinutes()
        }, MM: function (a) {
          var b = a.getMinutes();
          return 10 > b ? "0" + b : b
        }, s: function (a) {
          return a.getSeconds()
        }, ss: function (a) {
          var b = a.getSeconds();
          return 10 > b ? "0" + b : b
        }
      };
      return b.replace(/d{1,4}|m{1,4}|yy(?:yy)?|([HhMs])\1?|"[^"]*"|'[^']*'/g, function (b) {
        return c[b] ? c[b](a) : b.slice(1, b.length - 1)
      })
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {different: {"default": "Please enter a different value"}}}), FormValidation.Validator.different = {
    html5Attributes: {
      message: "message",
      field: "field"
    }, init: function (a, b, c, d) {
      for (var e = c.field.split(","), f = 0; f < e.length; f++) {
        var g = a.getFieldElements(e[f]);
        a.onLiveChange(g, "live_" + d, function () {
          var c = a.getStatus(b, d);
          c !== a.STATUS_NOT_VALIDATED && a.revalidateField(b)
        })
      }
    }, destroy: function (a, b, c, d) {
      for (var e = c.field.split(","), f = 0; f < e.length; f++) {
        var g = a.getFieldElements(e[f]);
        a.offLiveChange(g, "live_" + d)
      }
    }, validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      for (var f = c.field.split(","), g = !0, h = 0; h < f.length; h++) {
        var i = a.getFieldElements(f[h]);
        if (null != i && 0 !== i.length) {
          var j = a.getFieldValue(i, d);
          e === j ? g = !1 : "" !== j && a.updateStatus(i, a.STATUS_VALID, d)
        }
      }
      return g
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {digits: {"default": "Please enter only digits"}}}), FormValidation.Validator.digits = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : /^\d+$/.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {ean: {"default": "Please enter a valid EAN number"}}}), FormValidation.Validator.ean = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      if (!/^(\d{8}|\d{12}|\d{13})$/.test(e))return !1;
      for (var f = e.length, g = 0, h = 8 === f ? [3, 1] : [1, 3], i = 0; f - 1 > i; i++)g += parseInt(e.charAt(i), 10) * h[i % 2];
      return g = (10 - g % 10) % 10, g + "" === e.charAt(f - 1)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {ein: {"default": "Please enter a valid EIN number"}}}), FormValidation.Validator.ein = {
    CAMPUS: {
      ANDOVER: ["10", "12"],
      ATLANTA: ["60", "67"],
      AUSTIN: ["50", "53"],
      BROOKHAVEN: ["01", "02", "03", "04", "05", "06", "11", "13", "14", "16", "21", "22", "23", "25", "34", "51", "52", "54", "55", "56", "57", "58", "59", "65"],
      CINCINNATI: ["30", "32", "35", "36", "37", "38", "61"],
      FRESNO: ["15", "24"],
      KANSAS_CITY: ["40", "44"],
      MEMPHIS: ["94", "95"],
      OGDEN: ["80", "90"],
      PHILADELPHIA: ["33", "39", "41", "42", "43", "46", "48", "62", "63", "64", "66", "68", "71", "72", "73", "74", "75", "76", "77", "81", "82", "83", "84", "85", "86", "87", "88", "91", "92", "93", "98", "99"],
      INTERNET: ["20", "26", "27", "45", "46"],
      SMALL_BUSINESS_ADMINISTRATION: ["31"]
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      if (!/^[0-9]{2}-?[0-9]{7}$/.test(f))return !1;
      var g = f.substr(0, 2) + "";
      for (var h in this.CAMPUS)if (-1 !== a.inArray(g, this.CAMPUS[h]))return {valid: !0, campus: h};
      return !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {emailAddress: {"default": "Please enter a valid email address"}}}), FormValidation.Validator.emailAddress = {
    html5Attributes: {
      message: "message",
      multiple: "multiple",
      separator: "separator"
    }, enableByHtml5: function (a) {
      return "email" === a.attr("type")
    }, validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, g = c.multiple === !0 || "true" === c.multiple;
      if (g) {
        for (var h = c.separator || /[,;]/, i = this._splitEmailAddresses(e, h), j = 0; j < i.length; j++)if (!f.test(i[j]))return !1;
        return !0
      }
      return f.test(e)
    }, _splitEmailAddresses: function (a, b) {
      for (var c = a.split(/"/), d = c.length, e = [], f = "", g = 0; d > g; g++)if (g % 2 === 0) {
        var h = c[g].split(b), i = h.length;
        if (1 === i)f += h[0]; else {
          e.push(f + h[0]);
          for (var j = 1; i - 1 > j; j++)e.push(h[j]);
          f = h[i - 1]
        }
      } else f += '"' + c[g], d - 1 > g && (f += '"');
      return e.push(f), e
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {file: {"default": "Please choose a valid file"}}}), FormValidation.Validator.file = {
    html5Attributes: {
      extension: "extension",
      maxfiles: "maxFiles",
      minfiles: "minFiles",
      maxsize: "maxSize",
      minsize: "minSize",
      maxtotalsize: "maxTotalSize",
      mintotalsize: "minTotalSize",
      message: "message",
      type: "type"
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      var g, h = d.extension ? d.extension.toLowerCase().split(",") : null, i = d.type ? d.type.toLowerCase().split(",") : null, j = window.File && window.FileList && window.FileReader;
      if (j) {
        var k = c.get(0).files, l = k.length, m = 0;
        if (d.maxFiles && l > parseInt(d.maxFiles, 10) || d.minFiles && l < parseInt(d.minFiles, 10))return !1;
        for (var n = 0; l > n; n++)if (m += k[n].size, g = k[n].name.substr(k[n].name.lastIndexOf(".") + 1), d.minSize && k[n].size < parseInt(d.minSize, 10) || d.maxSize && k[n].size > parseInt(d.maxSize, 10) || h && -1 === a.inArray(g.toLowerCase(), h) || k[n].type && i && -1 === a.inArray(k[n].type.toLowerCase(), i))return !1;
        if (d.maxTotalSize && m > parseInt(d.maxTotalSize, 10) || d.minTotalSize && m < parseInt(d.minTotalSize, 10))return !1
      } else if (g = f.substr(f.lastIndexOf(".") + 1), h && -1 === a.inArray(g.toLowerCase(), h))return !1;
      return !0
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      greaterThan: {
        "default": "Please enter a value greater than or equal to %s",
        notInclusive: "Please enter a value greater than %s"
      }
    }
  }), FormValidation.Validator.greaterThan = {
    html5Attributes: {
      message: "message",
      value: "value",
      inclusive: "inclusive"
    }, enableByHtml5: function (a) {
      var b = a.attr("type"), c = a.attr("min");
      return c && "date" !== b ? {value: c} : !1
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      f = this._format(f);
      var g = b.getLocale(), h = a.isNumeric(d.value) ? d.value : b.getDynamicOption(c, d.value), i = this._format(h);
      return d.inclusive === !0 || void 0 === d.inclusive ? {
        valid: a.isNumeric(f) && parseFloat(f) >= i,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].greaterThan["default"], h)
      } : {
        valid: a.isNumeric(f) && parseFloat(f) > i,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].greaterThan.notInclusive, h)
      }
    }, _format: function (a) {
      return (a + "").replace(",", ".")
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {grid: {"default": "Please enter a valid GRId number"}}}), FormValidation.Validator.grid = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : (e = e.toUpperCase(), /^[GRID:]*([0-9A-Z]{2})[-\s]*([0-9A-Z]{5})[-\s]*([0-9A-Z]{10})[-\s]*([0-9A-Z]{1})$/g.test(e) ? (e = e.replace(/\s/g, "").replace(/-/g, ""), "GRID:" === e.substr(0, 5) && (e = e.substr(5)), FormValidation.Helper.mod37And36(e)) : !1)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {hex: {"default": "Please enter a valid hexadecimal number"}}}), FormValidation.Validator.hex = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : /^[0-9a-fA-F]+$/.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      iban: {
        "default": "Please enter a valid IBAN number",
        country: "Please enter a valid IBAN number in %s",
        countries: {
          AD: "Andorra",
          AE: "United Arab Emirates",
          AL: "Albania",
          AO: "Angola",
          AT: "Austria",
          AZ: "Azerbaijan",
          BA: "Bosnia and Herzegovina",
          BE: "Belgium",
          BF: "Burkina Faso",
          BG: "Bulgaria",
          BH: "Bahrain",
          BI: "Burundi",
          BJ: "Benin",
          BR: "Brazil",
          CH: "Switzerland",
          CI: "Ivory Coast",
          CM: "Cameroon",
          CR: "Costa Rica",
          CV: "Cape Verde",
          CY: "Cyprus",
          CZ: "Czech Republic",
          DE: "Germany",
          DK: "Denmark",
          DO: "Dominican Republic",
          DZ: "Algeria",
          EE: "Estonia",
          ES: "Spain",
          FI: "Finland",
          FO: "Faroe Islands",
          FR: "France",
          GB: "United Kingdom",
          GE: "Georgia",
          GI: "Gibraltar",
          GL: "Greenland",
          GR: "Greece",
          GT: "Guatemala",
          HR: "Croatia",
          HU: "Hungary",
          IE: "Ireland",
          IL: "Israel",
          IR: "Iran",
          IS: "Iceland",
          IT: "Italy",
          JO: "Jordan",
          KW: "Kuwait",
          KZ: "Kazakhstan",
          LB: "Lebanon",
          LI: "Liechtenstein",
          LT: "Lithuania",
          LU: "Luxembourg",
          LV: "Latvia",
          MC: "Monaco",
          MD: "Moldova",
          ME: "Montenegro",
          MG: "Madagascar",
          MK: "Macedonia",
          ML: "Mali",
          MR: "Mauritania",
          MT: "Malta",
          MU: "Mauritius",
          MZ: "Mozambique",
          NL: "Netherlands",
          NO: "Norway",
          PK: "Pakistan",
          PL: "Poland",
          PS: "Palestine",
          PT: "Portugal",
          QA: "Qatar",
          RO: "Romania",
          RS: "Serbia",
          SA: "Saudi Arabia",
          SE: "Sweden",
          SI: "Slovenia",
          SK: "Slovakia",
          SM: "San Marino",
          SN: "Senegal",
          TL: "East Timor",
          TN: "Tunisia",
          TR: "Turkey",
          VG: "Virgin Islands, British",
          XK: "Republic of Kosovo"
        }
      }
    }
  }), FormValidation.Validator.iban = {
    html5Attributes: {message: "message", country: "country", sepa: "sepa"},
    REGEX: {
      AD: "AD[0-9]{2}[0-9]{4}[0-9]{4}[A-Z0-9]{12}",
      AE: "AE[0-9]{2}[0-9]{3}[0-9]{16}",
      AL: "AL[0-9]{2}[0-9]{8}[A-Z0-9]{16}",
      AO: "AO[0-9]{2}[0-9]{21}",
      AT: "AT[0-9]{2}[0-9]{5}[0-9]{11}",
      AZ: "AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}",
      BA: "BA[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{8}[0-9]{2}",
      BE: "BE[0-9]{2}[0-9]{3}[0-9]{7}[0-9]{2}",
      BF: "BF[0-9]{2}[0-9]{23}",
      BG: "BG[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{2}[A-Z0-9]{8}",
      BH: "BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}",
      BI: "BI[0-9]{2}[0-9]{12}",
      BJ: "BJ[0-9]{2}[A-Z]{1}[0-9]{23}",
      BR: "BR[0-9]{2}[0-9]{8}[0-9]{5}[0-9]{10}[A-Z][A-Z0-9]",
      CH: "CH[0-9]{2}[0-9]{5}[A-Z0-9]{12}",
      CI: "CI[0-9]{2}[A-Z]{1}[0-9]{23}",
      CM: "CM[0-9]{2}[0-9]{23}",
      CR: "CR[0-9]{2}[0-9]{3}[0-9]{14}",
      CV: "CV[0-9]{2}[0-9]{21}",
      CY: "CY[0-9]{2}[0-9]{3}[0-9]{5}[A-Z0-9]{16}",
      CZ: "CZ[0-9]{2}[0-9]{20}",
      DE: "DE[0-9]{2}[0-9]{8}[0-9]{10}",
      DK: "DK[0-9]{2}[0-9]{14}",
      DO: "DO[0-9]{2}[A-Z0-9]{4}[0-9]{20}",
      DZ: "DZ[0-9]{2}[0-9]{20}",
      EE: "EE[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{11}[0-9]{1}",
      ES: "ES[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{1}[0-9]{1}[0-9]{10}",
      FI: "FI[0-9]{2}[0-9]{6}[0-9]{7}[0-9]{1}",
      FO: "FO[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}",
      FR: "FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}",
      GB: "GB[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}",
      GE: "GE[0-9]{2}[A-Z]{2}[0-9]{16}",
      GI: "GI[0-9]{2}[A-Z]{4}[A-Z0-9]{15}",
      GL: "GL[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}",
      GR: "GR[0-9]{2}[0-9]{3}[0-9]{4}[A-Z0-9]{16}",
      GT: "GT[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{20}",
      HR: "HR[0-9]{2}[0-9]{7}[0-9]{10}",
      HU: "HU[0-9]{2}[0-9]{3}[0-9]{4}[0-9]{1}[0-9]{15}[0-9]{1}",
      IE: "IE[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}",
      IL: "IL[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{13}",
      IR: "IR[0-9]{2}[0-9]{22}",
      IS: "IS[0-9]{2}[0-9]{4}[0-9]{2}[0-9]{6}[0-9]{10}",
      IT: "IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}",
      JO: "JO[0-9]{2}[A-Z]{4}[0-9]{4}[0]{8}[A-Z0-9]{10}",
      KW: "KW[0-9]{2}[A-Z]{4}[0-9]{22}",
      KZ: "KZ[0-9]{2}[0-9]{3}[A-Z0-9]{13}",
      LB: "LB[0-9]{2}[0-9]{4}[A-Z0-9]{20}",
      LI: "LI[0-9]{2}[0-9]{5}[A-Z0-9]{12}",
      LT: "LT[0-9]{2}[0-9]{5}[0-9]{11}",
      LU: "LU[0-9]{2}[0-9]{3}[A-Z0-9]{13}",
      LV: "LV[0-9]{2}[A-Z]{4}[A-Z0-9]{13}",
      MC: "MC[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}",
      MD: "MD[0-9]{2}[A-Z0-9]{20}",
      ME: "ME[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
      MG: "MG[0-9]{2}[0-9]{23}",
      MK: "MK[0-9]{2}[0-9]{3}[A-Z0-9]{10}[0-9]{2}",
      ML: "ML[0-9]{2}[A-Z]{1}[0-9]{23}",
      MR: "MR13[0-9]{5}[0-9]{5}[0-9]{11}[0-9]{2}",
      MT: "MT[0-9]{2}[A-Z]{4}[0-9]{5}[A-Z0-9]{18}",
      MU: "MU[0-9]{2}[A-Z]{4}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}[A-Z]{3}",
      MZ: "MZ[0-9]{2}[0-9]{21}",
      NL: "NL[0-9]{2}[A-Z]{4}[0-9]{10}",
      NO: "NO[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{1}",
      PK: "PK[0-9]{2}[A-Z]{4}[A-Z0-9]{16}",
      PL: "PL[0-9]{2}[0-9]{8}[0-9]{16}",
      PS: "PS[0-9]{2}[A-Z]{4}[A-Z0-9]{21}",
      PT: "PT[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{11}[0-9]{2}",
      QA: "QA[0-9]{2}[A-Z]{4}[A-Z0-9]{21}",
      RO: "RO[0-9]{2}[A-Z]{4}[A-Z0-9]{16}",
      RS: "RS[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
      SA: "SA[0-9]{2}[0-9]{2}[A-Z0-9]{18}",
      SE: "SE[0-9]{2}[0-9]{3}[0-9]{16}[0-9]{1}",
      SI: "SI[0-9]{2}[0-9]{5}[0-9]{8}[0-9]{2}",
      SK: "SK[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}",
      SM: "SM[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}",
      SN: "SN[0-9]{2}[A-Z]{1}[0-9]{23}",
      TL: "TL38[0-9]{3}[0-9]{14}[0-9]{2}",
      TN: "TN59[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
      TR: "TR[0-9]{2}[0-9]{5}[A-Z0-9]{1}[A-Z0-9]{16}",
      VG: "VG[0-9]{2}[A-Z]{4}[0-9]{16}",
      XK: "XK[0-9]{2}[0-9]{4}[0-9]{10}[0-9]{2}"
    },
    SEPA_COUNTRIES: ["AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GI", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK", "SM"],
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      f = f.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      var g = d.country;
      g ? "string" == typeof g && this.REGEX[g] || (g = b.getDynamicOption(c, g)) : g = f.substr(0, 2);
      var h = b.getLocale();
      if (!this.REGEX[g])return !1;
      if (void 0 !== typeof d.sepa) {
        var i = -1 !== a.inArray(g, this.SEPA_COUNTRIES);
        if (("true" === d.sepa || d.sepa === !0) && !i || ("false" === d.sepa || d.sepa === !1) && i)return !1
      }
      if (!new RegExp("^" + this.REGEX[g] + "$").test(f))return {
        valid: !1,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[h].iban.country, FormValidation.I18n[h].iban.countries[g])
      };
      f = f.substr(4) + f.substr(0, 4), f = a.map(f.split(""), function (a) {
        var b = a.charCodeAt(0);
        return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a
      }), f = f.join("");
      for (var j = parseInt(f.substr(0, 1), 10), k = f.length, l = 1; k > l; ++l)j = (10 * j + parseInt(f.substr(l, 1), 10)) % 97;
      return {
        valid: 1 === j,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[h].iban.country, FormValidation.I18n[h].iban.countries[g])
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      id: {
        "default": "Please enter a valid identification number",
        country: "Please enter a valid identification number in %s",
        countries: {
          BA: "Bosnia and Herzegovina",
          BG: "Bulgaria",
          BR: "Brazil",
          CH: "Switzerland",
          CL: "Chile",
          CN: "China",
          CZ: "Czech Republic",
          DK: "Denmark",
          EE: "Estonia",
          ES: "Spain",
          FI: "Finland",
          HR: "Croatia",
          IE: "Ireland",
          IS: "Iceland",
          LT: "Lithuania",
          LV: "Latvia",
          ME: "Montenegro",
          MK: "Macedonia",
          NL: "Netherlands",
          PL: "Poland",
          RO: "Romania",
          RS: "Serbia",
          SE: "Sweden",
          SI: "Slovenia",
          SK: "Slovakia",
          SM: "San Marino",
          TH: "Thailand",
          ZA: "South Africa"
        }
      }
    }
  }), FormValidation.Validator.id = {
    html5Attributes: {message: "message", country: "country"},
    COUNTRY_CODES: ["BA", "BG", "BR", "CH", "CL", "CN", "CZ", "DK", "EE", "ES", "FI", "HR", "IE", "IS", "LT", "LV", "ME", "MK", "NL", "PL", "RO", "RS", "SE", "SI", "SK", "SM", "TH", "ZA"],
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      var g = b.getLocale(), h = d.country;
      if (h ? ("string" != typeof h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)) : h = f.substr(0, 2), -1 === a.inArray(h, this.COUNTRY_CODES))return !0;
      var i = ["_", h.toLowerCase()].join(""), j = this[i](f);
      return j = j === !0 || j === !1 ? {valid: j} : j, j.message = FormValidation.Helper.format(d.message || FormValidation.I18n[g].id.country, FormValidation.I18n[g].id.countries[h.toUpperCase()]), j
    },
    _validateJMBG: function (a, b) {
      if (!/^\d{13}$/.test(a))return !1;
      var c = parseInt(a.substr(0, 2), 10), d = parseInt(a.substr(2, 2), 10), e = (parseInt(a.substr(4, 3), 10), parseInt(a.substr(7, 2), 10)), f = parseInt(a.substr(12, 1), 10);
      if (c > 31 || d > 12)return !1;
      for (var g = 0, h = 0; 6 > h; h++)g += (7 - h) * (parseInt(a.charAt(h), 10) + parseInt(a.charAt(h + 6), 10));
      if (g = 11 - g % 11, (10 === g || 11 === g) && (g = 0), g !== f)return !1;
      switch (b.toUpperCase()) {
        case"BA":
          return e >= 10 && 19 >= e;
        case"MK":
          return e >= 41 && 49 >= e;
        case"ME":
          return e >= 20 && 29 >= e;
        case"RS":
          return e >= 70 && 99 >= e;
        case"SI":
          return e >= 50 && 59 >= e;
        default:
          return !0
      }
    },
    _ba: function (a) {
      return this._validateJMBG(a, "BA")
    },
    _mk: function (a) {
      return this._validateJMBG(a, "MK")
    },
    _me: function (a) {
      return this._validateJMBG(a, "ME")
    },
    _rs: function (a) {
      return this._validateJMBG(a, "RS")
    },
    _si: function (a) {
      return this._validateJMBG(a, "SI")
    },
    _bg: function (a) {
      if (!/^\d{10}$/.test(a) && !/^\d{6}\s\d{3}\s\d{1}$/.test(a))return !1;
      a = a.replace(/\s/g, "");
      var b = parseInt(a.substr(0, 2), 10) + 1900, c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10);
      if (c > 40 ? (b += 100, c -= 40) : c > 20 && (b -= 100, c -= 20), !FormValidation.Helper.date(b, c, d))return !1;
      for (var e = 0, f = [2, 4, 8, 5, 10, 9, 7, 3, 6], g = 0; 9 > g; g++)e += parseInt(a.charAt(g), 10) * f[g];
      return e = e % 11 % 10, e + "" === a.substr(9, 1)
    },
    _br: function (a) {
      if (a = a.replace(/\D/g, ""), !/^\d{11}$/.test(a) || /^1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}|0{11}$/.test(a))return !1;
      for (var b = 0, c = 0; 9 > c; c++)b += (10 - c) * parseInt(a.charAt(c), 10);
      if (b = 11 - b % 11, (10 === b || 11 === b) && (b = 0), b + "" !== a.charAt(9))return !1;
      var d = 0;
      for (c = 0; 10 > c; c++)d += (11 - c) * parseInt(a.charAt(c), 10);
      return d = 11 - d % 11, (10 === d || 11 === d) && (d = 0), d + "" === a.charAt(10)
    },
    _ch: function (a) {
      if (!/^756[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{2}$/.test(a))return !1;
      a = a.replace(/\D/g, "").substr(3);
      for (var b = a.length, c = 0, d = 8 === b ? [3, 1] : [1, 3], e = 0; b - 1 > e; e++)c += parseInt(a.charAt(e), 10) * d[e % 2];
      return c = 10 - c % 10, c + "" === a.charAt(b - 1)
    },
    _cl: function (a) {
      if (!/^\d{7,8}[-]{0,1}[0-9K]$/i.test(a))return !1;
      for (a = a.replace(/\-/g, ""); a.length < 9;)a = "0" + a;
      for (var b = 0, c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b = 11 - b % 11, 11 === b ? b = 0 : 10 === b && (b = "K"), b + "" === a.charAt(8).toUpperCase()
    },
    _cn: function (b) {
      if (b = b.trim(), !/^\d{15}$/.test(b) && !/^\d{17}[\dXx]{1}$/.test(b))return !1;
      var c = {
        11: {0: [0], 1: [[0, 9], [11, 17]], 2: [0, 28, 29]},
        12: {0: [0], 1: [[0, 16]], 2: [0, 21, 23, 25]},
        13: {
          0: [0],
          1: [[0, 5], 7, 8, 21, [23, 33], [81, 85]],
          2: [[0, 5], [7, 9], [23, 25], 27, 29, 30, 81, 83],
          3: [[0, 4], [21, 24]],
          4: [[0, 4], 6, 21, [23, 35], 81],
          5: [[0, 3], [21, 35], 81, 82],
          6: [[0, 4], [21, 38], [81, 84]],
          7: [[0, 3], 5, 6, [21, 33]],
          8: [[0, 4], [21, 28]],
          9: [[0, 3], [21, 30], [81, 84]],
          10: [[0, 3], [22, 26], 28, 81, 82],
          11: [[0, 2], [21, 28], 81, 82]
        },
        14: {
          0: [0],
          1: [0, 1, [5, 10], [21, 23], 81],
          2: [[0, 3], 11, 12, [21, 27]],
          3: [[0, 3], 11, 21, 22],
          4: [[0, 2], 11, 21, [23, 31], 81],
          5: [[0, 2], 21, 22, 24, 25, 81],
          6: [[0, 3], [21, 24]],
          7: [[0, 2], [21, 29], 81],
          8: [[0, 2], [21, 30], 81, 82],
          9: [[0, 2], [21, 32], 81],
          10: [[0, 2], [21, 34], 81, 82],
          11: [[0, 2], [21, 30], 81, 82],
          23: [[0, 3], 22, 23, [25, 30], 32, 33]
        },
        15: {
          0: [0],
          1: [[0, 5], [21, 25]],
          2: [[0, 7], [21, 23]],
          3: [[0, 4]],
          4: [[0, 4], [21, 26], [28, 30]],
          5: [[0, 2], [21, 26], 81],
          6: [[0, 2], [21, 27]],
          7: [[0, 3], [21, 27], [81, 85]],
          8: [[0, 2], [21, 26]],
          9: [[0, 2], [21, 29], 81],
          22: [[0, 2], [21, 24]],
          25: [[0, 2], [22, 31]],
          26: [[0, 2], [24, 27], [29, 32], 34],
          28: [0, 1, [22, 27]],
          29: [0, [21, 23]]
        },
        21: {
          0: [0],
          1: [[0, 6], [11, 14], [22, 24], 81],
          2: [[0, 4], [11, 13], 24, [81, 83]],
          3: [[0, 4], 11, 21, 23, 81],
          4: [[0, 4], 11, [21, 23]],
          5: [[0, 5], 21, 22],
          6: [[0, 4], 24, 81, 82],
          7: [[0, 3], 11, 26, 27, 81, 82],
          8: [[0, 4], 11, 81, 82],
          9: [[0, 5], 11, 21, 22],
          10: [[0, 5], 11, 21, 81],
          11: [[0, 3], 21, 22],
          12: [[0, 2], 4, 21, 23, 24, 81, 82],
          13: [[0, 3], 21, 22, 24, 81, 82],
          14: [[0, 4], 21, 22, 81]
        },
        22: {
          0: [0],
          1: [[0, 6], 12, 22, [81, 83]],
          2: [[0, 4], 11, 21, [81, 84]],
          3: [[0, 3], 22, 23, 81, 82],
          4: [[0, 3], 21, 22],
          5: [[0, 3], 21, 23, 24, 81, 82],
          6: [[0, 2], 4, 5, [21, 23], 25, 81],
          7: [[0, 2], [21, 24], 81],
          8: [[0, 2], 21, 22, 81, 82],
          24: [[0, 6], 24, 26]
        },
        23: {
          0: [0],
          1: [[0, 12], 21, [23, 29], [81, 84]],
          2: [[0, 8], 21, [23, 25], 27, [29, 31], 81],
          3: [[0, 7], 21, 81, 82],
          4: [[0, 7], 21, 22],
          5: [[0, 3], 5, 6, [21, 24]],
          6: [[0, 6], [21, 24]],
          7: [[0, 16], 22, 81],
          8: [[0, 5], 11, 22, 26, 28, 33, 81, 82],
          9: [[0, 4], 21],
          10: [[0, 5], 24, 25, 81, [83, 85]],
          11: [[0, 2], 21, 23, 24, 81, 82],
          12: [[0, 2], [21, 26], [81, 83]],
          27: [[0, 4], [21, 23]]
        },
        31: {0: [0], 1: [0, 1, [3, 10], [12, 20]], 2: [0, 30]},
        32: {
          0: [0],
          1: [[0, 7], 11, [13, 18], 24, 25],
          2: [[0, 6], 11, 81, 82],
          3: [[0, 5], 11, 12, [21, 24], 81, 82],
          4: [[0, 2], 4, 5, 11, 12, 81, 82],
          5: [[0, 9], [81, 85]],
          6: [[0, 2], 11, 12, 21, 23, [81, 84]],
          7: [0, 1, 3, 5, 6, [21, 24]],
          8: [[0, 4], 11, 26, [29, 31]],
          9: [[0, 3], [21, 25], 28, 81, 82],
          10: [[0, 3], 11, 12, 23, 81, 84, 88],
          11: [[0, 2], 11, 12, [81, 83]],
          12: [[0, 4], [81, 84]],
          13: [[0, 2], 11, [21, 24]]
        },
        33: {
          0: [0],
          1: [[0, 6], [8, 10], 22, 27, 82, 83, 85],
          2: [0, 1, [3, 6], 11, 12, 25, 26, [81, 83]],
          3: [[0, 4], 22, 24, [26, 29], 81, 82],
          4: [[0, 2], 11, 21, 24, [81, 83]],
          5: [[0, 3], [21, 23]],
          6: [[0, 2], 21, 24, [81, 83]],
          7: [[0, 3], 23, 26, 27, [81, 84]],
          8: [[0, 3], 22, 24, 25, 81],
          9: [[0, 3], 21, 22],
          10: [[0, 4], [21, 24], 81, 82],
          11: [[0, 2], [21, 27], 81]
        },
        34: {
          0: [0],
          1: [[0, 4], 11, [21, 24], 81],
          2: [[0, 4], 7, 8, [21, 23], 25],
          3: [[0, 4], 11, [21, 23]],
          4: [[0, 6], 21],
          5: [[0, 4], 6, [21, 23]],
          6: [[0, 4], 21],
          7: [[0, 3], 11, 21],
          8: [[0, 3], 11, [22, 28], 81],
          10: [[0, 4], [21, 24]],
          11: [[0, 3], 22, [24, 26], 81, 82],
          12: [[0, 4], 21, 22, 25, 26, 82],
          13: [[0, 2], [21, 24]],
          14: [[0, 2], [21, 24]],
          15: [[0, 3], [21, 25]],
          16: [[0, 2], [21, 23]],
          17: [[0, 2], [21, 23]],
          18: [[0, 2], [21, 25], 81]
        },
        35: {
          0: [0],
          1: [[0, 5], 11, [21, 25], 28, 81, 82],
          2: [[0, 6], [11, 13]],
          3: [[0, 5], 22],
          4: [[0, 3], 21, [23, 30], 81],
          5: [[0, 5], 21, [24, 27], [81, 83]],
          6: [[0, 3], [22, 29], 81],
          7: [[0, 2], [21, 25], [81, 84]],
          8: [[0, 2], [21, 25], 81],
          9: [[0, 2], [21, 26], 81, 82]
        },
        36: {
          0: [0],
          1: [[0, 5], 11, [21, 24]],
          2: [[0, 3], 22, 81],
          3: [[0, 2], 13, [21, 23]],
          4: [[0, 3], 21, [23, 30], 81, 82],
          5: [[0, 2], 21],
          6: [[0, 2], 22, 81],
          7: [[0, 2], [21, 35], 81, 82],
          8: [[0, 3], [21, 30], 81],
          9: [[0, 2], [21, 26], [81, 83]],
          10: [[0, 2], [21, 30]],
          11: [[0, 2], [21, 30], 81]
        },
        37: {
          0: [0],
          1: [[0, 5], 12, 13, [24, 26], 81],
          2: [[0, 3], 5, [11, 14], [81, 85]],
          3: [[0, 6], [21, 23]],
          4: [[0, 6], 81],
          5: [[0, 3], [21, 23]],
          6: [[0, 2], [11, 13], 34, [81, 87]],
          7: [[0, 5], 24, 25, [81, 86]],
          8: [[0, 2], 11, [26, 32], [81, 83]],
          9: [[0, 3], 11, 21, 23, 82, 83],
          10: [[0, 2], [81, 83]],
          11: [[0, 3], 21, 22],
          12: [[0, 3]],
          13: [[0, 2], 11, 12, [21, 29]],
          14: [[0, 2], [21, 28], 81, 82],
          15: [[0, 2], [21, 26], 81],
          16: [[0, 2], [21, 26]],
          17: [[0, 2], [21, 28]]
        },
        41: {
          0: [0],
          1: [[0, 6], 8, 22, [81, 85]],
          2: [[0, 5], 11, [21, 25]],
          3: [[0, 7], 11, [22, 29], 81],
          4: [[0, 4], 11, [21, 23], 25, 81, 82],
          5: [[0, 3], 5, 6, 22, 23, 26, 27, 81],
          6: [[0, 3], 11, 21, 22],
          7: [[0, 4], 11, 21, [24, 28], 81, 82],
          8: [[0, 4], 11, [21, 23], 25, [81, 83]],
          9: [[0, 2], 22, 23, [26, 28]],
          10: [[0, 2], [23, 25], 81, 82],
          11: [[0, 4], [21, 23]],
          12: [[0, 2], 21, 22, 24, 81, 82],
          13: [[0, 3], [21, 30], 81],
          14: [[0, 3], [21, 26], 81],
          15: [[0, 3], [21, 28]],
          16: [[0, 2], [21, 28], 81],
          17: [[0, 2], [21, 29]],
          90: [0, 1]
        },
        42: {
          0: [0],
          1: [[0, 7], [11, 17]],
          2: [[0, 5], 22, 81],
          3: [[0, 3], [21, 25], 81],
          5: [[0, 6], [25, 29], [81, 83]],
          6: [[0, 2], 6, 7, [24, 26], [82, 84]],
          7: [[0, 4]],
          8: [[0, 2], 4, 21, 22, 81],
          9: [[0, 2], [21, 23], 81, 82, 84],
          10: [[0, 3], [22, 24], 81, 83, 87],
          11: [[0, 2], [21, 27], 81, 82],
          12: [[0, 2], [21, 24], 81],
          13: [[0, 3], 21, 81],
          28: [[0, 2], 22, 23, [25, 28]],
          90: [0, [4, 6], 21]
        },
        43: {
          0: [0],
          1: [[0, 5], 11, 12, 21, 22, 24, 81],
          2: [[0, 4], 11, 21, [23, 25], 81],
          3: [[0, 2], 4, 21, 81, 82],
          4: [0, 1, [5, 8], 12, [21, 24], 26, 81, 82],
          5: [[0, 3], 11, [21, 25], [27, 29], 81],
          6: [[0, 3], 11, 21, 23, 24, 26, 81, 82],
          7: [[0, 3], [21, 26], 81],
          8: [[0, 2], 11, 21, 22],
          9: [[0, 3], [21, 23], 81],
          10: [[0, 3], [21, 28], 81],
          11: [[0, 3], [21, 29]],
          12: [[0, 2], [21, 30], 81],
          13: [[0, 2], 21, 22, 81, 82],
          31: [0, 1, [22, 27], 30]
        },
        44: {
          0: [0],
          1: [[0, 7], [11, 16], 83, 84],
          2: [[0, 5], 21, 22, 24, 29, 32, 33, 81, 82],
          3: [0, 1, [3, 8]],
          4: [[0, 4]],
          5: [0, 1, [6, 15], 23, 82, 83],
          6: [0, 1, [4, 8]],
          7: [0, 1, [3, 5], 81, [83, 85]],
          8: [[0, 4], 11, 23, 25, [81, 83]],
          9: [[0, 3], 23, [81, 83]],
          12: [[0, 3], [23, 26], 83, 84],
          13: [[0, 3], [22, 24], 81],
          14: [[0, 2], [21, 24], 26, 27, 81],
          15: [[0, 2], 21, 23, 81],
          16: [[0, 2], [21, 25]],
          17: [[0, 2], 21, 23, 81],
          18: [[0, 3], 21, 23, [25, 27], 81, 82],
          19: [0],
          20: [0],
          51: [[0, 3], 21, 22],
          52: [[0, 3], 21, 22, 24, 81],
          53: [[0, 2], [21, 23], 81]
        },
        45: {
          0: [0],
          1: [[0, 9], [21, 27]],
          2: [[0, 5], [21, 26]],
          3: [[0, 5], 11, 12, [21, 32]],
          4: [0, 1, [3, 6], 11, [21, 23], 81],
          5: [[0, 3], 12, 21],
          6: [[0, 3], 21, 81],
          7: [[0, 3], 21, 22],
          8: [[0, 4], 21, 81],
          9: [[0, 3], [21, 24], 81],
          10: [[0, 2], [21, 31]],
          11: [[0, 2], [21, 23]],
          12: [[0, 2], [21, 29], 81],
          13: [[0, 2], [21, 24], 81],
          14: [[0, 2], [21, 25], 81]
        },
        46: {0: [0], 1: [0, 1, [5, 8]], 2: [0, 1], 3: [0, [21, 23]], 90: [[0, 3], [5, 7], [21, 39]]},
        50: {0: [0], 1: [[0, 19]], 2: [0, [22, 38], [40, 43]], 3: [0, [81, 84]]},
        51: {
          0: [0],
          1: [0, 1, [4, 8], [12, 15], [21, 24], 29, 31, 32, [81, 84]],
          3: [[0, 4], 11, 21, 22],
          4: [[0, 3], 11, 21, 22],
          5: [[0, 4], 21, 22, 24, 25],
          6: [0, 1, 3, 23, 26, [81, 83]],
          7: [0, 1, 3, 4, [22, 27], 81],
          8: [[0, 2], 11, 12, [21, 24]],
          9: [[0, 4], [21, 23]],
          10: [[0, 2], 11, 24, 25, 28],
          11: [[0, 2], [11, 13], 23, 24, 26, 29, 32, 33, 81],
          13: [[0, 4], [21, 25], 81],
          14: [[0, 2], [21, 25]],
          15: [[0, 3], [21, 29]],
          16: [[0, 3], [21, 23], 81],
          17: [[0, 3], [21, 25], 81],
          18: [[0, 3], [21, 27]],
          19: [[0, 3], [21, 23]],
          20: [[0, 2], 21, 22, 81],
          32: [0, [21, 33]],
          33: [0, [21, 38]],
          34: [0, 1, [22, 37]]
        },
        52: {
          0: [0],
          1: [[0, 3], [11, 15], [21, 23], 81],
          2: [0, 1, 3, 21, 22],
          3: [[0, 3], [21, 30], 81, 82],
          4: [[0, 2], [21, 25]],
          5: [[0, 2], [21, 27]],
          6: [[0, 3], [21, 28]],
          22: [0, 1, [22, 30]],
          23: [0, 1, [22, 28]],
          24: [0, 1, [22, 28]],
          26: [0, 1, [22, 36]],
          27: [[0, 2], 22, 23, [25, 32]]
        },
        53: {
          0: [0],
          1: [[0, 3], [11, 14], 21, 22, [24, 29], 81],
          3: [[0, 2], [21, 26], 28, 81],
          4: [[0, 2], [21, 28]],
          5: [[0, 2], [21, 24]],
          6: [[0, 2], [21, 30]],
          7: [[0, 2], [21, 24]],
          8: [[0, 2], [21, 29]],
          9: [[0, 2], [21, 27]],
          23: [0, 1, [22, 29], 31],
          25: [[0, 4], [22, 32]],
          26: [0, 1, [21, 28]],
          27: [0, 1, [22, 30]],
          28: [0, 1, 22, 23],
          29: [0, 1, [22, 32]],
          31: [0, 2, 3, [22, 24]],
          34: [0, [21, 23]],
          33: [0, 21, [23, 25]],
          35: [0, [21, 28]]
        },
        54: {
          0: [0],
          1: [[0, 2], [21, 27]],
          21: [0, [21, 29], 32, 33],
          22: [0, [21, 29], [31, 33]],
          23: [0, 1, [22, 38]],
          24: [0, [21, 31]],
          25: [0, [21, 27]],
          26: [0, [21, 27]]
        },
        61: {
          0: [0],
          1: [[0, 4], [11, 16], 22, [24, 26]],
          2: [[0, 4], 22],
          3: [[0, 4], [21, 24], [26, 31]],
          4: [[0, 4], [22, 31], 81],
          5: [[0, 2], [21, 28], 81, 82],
          6: [[0, 2], [21, 32]],
          7: [[0, 2], [21, 30]],
          8: [[0, 2], [21, 31]],
          9: [[0, 2], [21, 29]],
          10: [[0, 2], [21, 26]]
        },
        62: {
          0: [0],
          1: [[0, 5], 11, [21, 23]],
          2: [0, 1],
          3: [[0, 2], 21],
          4: [[0, 3], [21, 23]],
          5: [[0, 3], [21, 25]],
          6: [[0, 2], [21, 23]],
          7: [[0, 2], [21, 25]],
          8: [[0, 2], [21, 26]],
          9: [[0, 2], [21, 24], 81, 82],
          10: [[0, 2], [21, 27]],
          11: [[0, 2], [21, 26]],
          12: [[0, 2], [21, 28]],
          24: [0, 21, [24, 29]],
          26: [0, 21, [23, 30]],
          29: [0, 1, [21, 27]],
          30: [0, 1, [21, 27]]
        },
        63: {
          0: [0],
          1: [[0, 5], [21, 23]],
          2: [0, 2, [21, 25]],
          21: [0, [21, 23], [26, 28]],
          22: [0, [21, 24]],
          23: [0, [21, 24]],
          25: [0, [21, 25]],
          26: [0, [21, 26]],
          27: [0, 1, [21, 26]],
          28: [[0, 2], [21, 23]]
        },
        64: {
          0: [0],
          1: [0, 1, [4, 6], 21, 22, 81],
          2: [[0, 3], 5, [21, 23]],
          3: [[0, 3], [21, 24], 81],
          4: [[0, 2], [21, 25]],
          5: [[0, 2], 21, 22]
        },
        65: {
          0: [0],
          1: [[0, 9], 21],
          2: [[0, 5]],
          21: [0, 1, 22, 23],
          22: [0, 1, 22, 23],
          23: [[0, 3], [23, 25], 27, 28],
          28: [0, 1, [22, 29]],
          29: [0, 1, [22, 29]],
          30: [0, 1, [22, 24]],
          31: [0, 1, [21, 31]],
          32: [0, 1, [21, 27]],
          40: [0, 2, 3, [21, 28]],
          42: [[0, 2], 21, [23, 26]],
          43: [0, 1, [21, 26]],
          90: [[0, 4]],
          27: [[0, 2], 22, 23]
        },
        71: {0: [0]},
        81: {0: [0]},
        82: {0: [0]}
      }, d = parseInt(b.substr(0, 2), 10), e = parseInt(b.substr(2, 2), 10), f = parseInt(b.substr(4, 2), 10);
      if (!c[d] || !c[d][e])return !1;
      for (var g = !1, h = c[d][e], i = 0; i < h.length; i++)if (a.isArray(h[i]) && h[i][0] <= f && f <= h[i][1] || !a.isArray(h[i]) && f === h[i]) {
        g = !0;
        break
      }
      if (!g)return !1;
      var j;
      j = 18 === b.length ? b.substr(6, 8) : "19" + b.substr(6, 6);
      var k = parseInt(j.substr(0, 4), 10), l = parseInt(j.substr(4, 2), 10), m = parseInt(j.substr(6, 2), 10);
      if (!FormValidation.Helper.date(k, l, m))return !1;
      if (18 === b.length) {
        var n = 0, o = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        for (i = 0; 17 > i; i++)n += parseInt(b.charAt(i), 10) * o[i];
        n = (12 - n % 11) % 11;
        var p = "X" !== b.charAt(17).toUpperCase() ? parseInt(b.charAt(17), 10) : 10;
        return p === n
      }
      return !0
    },
    _cz: function (a) {
      if (!/^\d{9,10}$/.test(a))return !1;
      var b = 1900 + parseInt(a.substr(0, 2), 10), c = parseInt(a.substr(2, 2), 10) % 50 % 20, d = parseInt(a.substr(4, 2), 10);
      if (9 === a.length) {
        if (b >= 1980 && (b -= 100), b > 1953)return !1
      } else 1954 > b && (b += 100);
      if (!FormValidation.Helper.date(b, c, d))return !1;
      if (10 === a.length) {
        var e = parseInt(a.substr(0, 9), 10) % 11;
        return 1985 > b && (e %= 10), e + "" === a.substr(9, 1)
      }
      return !0
    },
    _dk: function (a) {
      if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(a))return !1;
      a = a.replace(/-/g, "");
      var b = parseInt(a.substr(0, 2), 10), c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10);
      switch (!0) {
        case-1 !== "5678".indexOf(a.charAt(6)) && d >= 58:
          d += 1800;
          break;
        case-1 !== "0123".indexOf(a.charAt(6)):
        case-1 !== "49".indexOf(a.charAt(6)) && d >= 37:
          d += 1900;
          break;
        default:
          d += 2e3
      }
      return FormValidation.Helper.date(d, c, b)
    },
    _ee: function (a) {
      return this._lt(a)
    },
    _es: function (a) {
      var b = /^[0-9]{8}[-]{0,1}[A-HJ-NP-TV-Z]$/.test(a), c = /^[XYZ][-]{0,1}[0-9]{7}[-]{0,1}[A-HJ-NP-TV-Z]$/.test(a), d = /^[A-HNPQS][-]{0,1}[0-9]{7}[-]{0,1}[0-9A-J]$/.test(a);
      if (!b && !c && !d)return !1;
      a = a.replace(/-/g, "");
      var e, f, g = !0;
      if (b || c) {
        f = "DNI";
        var h = "XYZ".indexOf(a.charAt(0));
        return -1 !== h && (a = h + a.substr(1) + "", f = "NIE"), e = parseInt(a.substr(0, 8), 10), e = "TRWAGMYFPDXBNJZSQVHLCKE"[e % 23], {
          valid: e === a.substr(8, 1),
          type: f
        }
      }
      e = a.substr(1, 7), f = "CIF";
      for (var i = a[0], j = a.substr(-1), k = 0, l = 0; l < e.length; l++)if (l % 2 !== 0)k += parseInt(e[l], 10); else {
        var m = "" + 2 * parseInt(e[l], 10);
        k += parseInt(m[0], 10), 2 === m.length && (k += parseInt(m[1], 10))
      }
      var n = k - 10 * Math.floor(k / 10);
      return 0 !== n && (n = 10 - n), g = -1 !== "KQS".indexOf(i) ? j === "JABCDEFGHI"[n] : -1 !== "ABEH".indexOf(i) ? j === "" + n : j === "" + n || j === "JABCDEFGHI"[n], {
        valid: g,
        type: f
      }
    },
    _fi: function (a) {
      if (!/^[0-9]{6}[-+A][0-9]{3}[0-9ABCDEFHJKLMNPRSTUVWXY]$/.test(a))return !1;
      var b = parseInt(a.substr(0, 2), 10), c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10), e = {
        "+": 1800,
        "-": 1900,
        A: 2e3
      };
      if (d = e[a.charAt(6)] + d, !FormValidation.Helper.date(d, c, b))return !1;
      var f = parseInt(a.substr(7, 3), 10);
      if (2 > f)return !1;
      var g = a.substr(0, 6) + a.substr(7, 3) + "";
      return g = parseInt(g, 10), "0123456789ABCDEFHJKLMNPRSTUVWXY".charAt(g % 31) === a.charAt(10)
    },
    _hr: function (a) {
      return /^[0-9]{11}$/.test(a) ? FormValidation.Helper.mod11And10(a) : !1
    },
    _ie: function (a) {
      if (!/^\d{7}[A-W][AHWTX]?$/.test(a))return !1;
      var b = function (a) {
        for (; a.length < 7;)a = "0" + a;
        for (var b = "WABCDEFGHIJKLMNOPQRSTUV", c = 0, d = 0; 7 > d; d++)c += parseInt(a.charAt(d), 10) * (8 - d);
        return c += 9 * b.indexOf(a.substr(7)), b[c % 23]
      };
      return 9 !== a.length || "A" !== a.charAt(8) && "H" !== a.charAt(8) ? a.charAt(7) === b(a.substr(0, 7)) : a.charAt(7) === b(a.substr(0, 7) + a.substr(8) + "")
    },
    _is: function (a) {
      if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(a))return !1;
      a = a.replace(/-/g, "");
      var b = parseInt(a.substr(0, 2), 10), c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10), e = parseInt(a.charAt(9), 10);
      if (d = 9 === e ? 1900 + d : 100 * (20 + e) + d, !FormValidation.Helper.date(d, c, b, !0))return !1;
      for (var f = 0, g = [3, 2, 7, 6, 5, 4, 3, 2], h = 0; 8 > h; h++)f += parseInt(a.charAt(h), 10) * g[h];
      return f = 11 - f % 11, f + "" === a.charAt(8)
    },
    _lt: function (a) {
      if (!/^[0-9]{11}$/.test(a))return !1;
      var b = parseInt(a.charAt(0), 10), c = parseInt(a.substr(1, 2), 10), d = parseInt(a.substr(3, 2), 10), e = parseInt(a.substr(5, 2), 10), f = b % 2 === 0 ? 17 + b / 2 : 17 + (b + 1) / 2;
      if (c = 100 * f + c, !FormValidation.Helper.date(c, d, e, !0))return !1;
      for (var g = 0, h = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1], i = 0; 10 > i; i++)g += parseInt(a.charAt(i), 10) * h[i];
      if (g %= 11, 10 !== g)return g + "" === a.charAt(10);
      for (g = 0, h = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3], i = 0; 10 > i; i++)g += parseInt(a.charAt(i), 10) * h[i];
      return g %= 11, 10 === g && (g = 0), g + "" === a.charAt(10)
    },
    _lv: function (a) {
      if (!/^[0-9]{6}[-]{0,1}[0-9]{5}$/.test(a))return !1;
      a = a.replace(/\D/g, "");
      var b = parseInt(a.substr(0, 2), 10), c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10);
      if (d = d + 1800 + 100 * parseInt(a.charAt(6), 10), !FormValidation.Helper.date(d, c, b, !0))return !1;
      for (var e = 0, f = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], g = 0; 10 > g; g++)e += parseInt(a.charAt(g), 10) * f[g];
      return e = (e + 1) % 11 % 10, e + "" === a.charAt(10)
    },
    _nl: function (a) {
      if (a.length < 8)return !1;
      if (8 === a.length && (a = "0" + a), !/^[0-9]{4}[.]{0,1}[0-9]{2}[.]{0,1}[0-9]{3}$/.test(a))return !1;
      if (a = a.replace(/\./g, ""), 0 === parseInt(a, 10))return !1;
      for (var b = 0, c = a.length, d = 0; c - 1 > d; d++)b += (9 - d) * parseInt(a.charAt(d), 10);
      return b %= 11, 10 === b && (b = 0), b + "" === a.charAt(c - 1)
    },
    _pl: function (a) {
      if (!/^[0-9]{11}$/.test(a))return !1;
      for (var b = 0, c = a.length, d = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 7], e = 0; c - 1 > e; e++)b += d[e] * parseInt(a.charAt(e), 10);
      return b %= 10, 0 === b && (b = 10), b = 10 - b, b + "" === a.charAt(c - 1)
    },
    _ro: function (a) {
      if (!/^[0-9]{13}$/.test(a))return !1;
      var b = parseInt(a.charAt(0), 10);
      if (0 === b || 7 === b || 8 === b)return !1;
      var c = parseInt(a.substr(1, 2), 10), d = parseInt(a.substr(3, 2), 10), e = parseInt(a.substr(5, 2), 10), f = {
        1: 1900,
        2: 1900,
        3: 1800,
        4: 1800,
        5: 2e3,
        6: 2e3
      };
      if (e > 31 && d > 12)return !1;
      if (9 !== b && (c = f[b + ""] + c, !FormValidation.Helper.date(c, d, e)))return !1;
      for (var g = 0, h = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9], i = a.length, j = 0; i - 1 > j; j++)g += parseInt(a.charAt(j), 10) * h[j];
      return g %= 11, 10 === g && (g = 1), g + "" === a.charAt(i - 1)
    },
    _se: function (a) {
      if (!/^[0-9]{10}$/.test(a) && !/^[0-9]{6}[-|+][0-9]{4}$/.test(a))return !1;
      a = a.replace(/[^0-9]/g, "");
      var b = parseInt(a.substr(0, 2), 10) + 1900, c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10);
      return FormValidation.Helper.date(b, c, d) ? FormValidation.Helper.luhn(a) : !1
    },
    _sk: function (a) {
      return this._cz(a)
    },
    _sm: function (a) {
      return /^\d{5}$/.test(a)
    },
    _th: function (a) {
      if (13 !== a.length)return !1;
      for (var b = 0, c = 0; 12 > c; c++)b += parseInt(a.charAt(c), 10) * (13 - c);
      return (11 - b % 11) % 10 === parseInt(a.charAt(12), 10)
    },
    _za: function (a) {
      if (!/^[0-9]{10}[0|1][8|9][0-9]$/.test(a))return !1;
      var b = parseInt(a.substr(0, 2), 10), c = (new Date).getFullYear() % 100, d = parseInt(a.substr(2, 2), 10), e = parseInt(a.substr(4, 2), 10);
      return b = b >= c ? b + 1900 : b + 2e3, FormValidation.Helper.date(b, d, e) ? FormValidation.Helper.luhn(a) : !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {identical: {"default": "Please enter the same value"}}}), FormValidation.Validator.identical = {
    html5Attributes: {
      message: "message",
      field: "field"
    }, init: function (a, b, c, d) {
      var e = a.getFieldElements(c.field);
      a.onLiveChange(e, "live_" + d, function () {
        var c = a.getStatus(b, d);
        c !== a.STATUS_NOT_VALIDATED && a.revalidateField(b)
      })
    }, destroy: function (a, b, c, d) {
      var e = a.getFieldElements(c.field);
      a.offLiveChange(e, "live_" + d)
    }, validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d), f = a.getFieldElements(c.field);
      if (null === f || 0 === f.length)return !0;
      var g = a.getFieldValue(f, d);
      return e === g ? (a.updateStatus(f, a.STATUS_VALID, d), !0) : !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {imei: {"default": "Please enter a valid IMEI number"}}}), FormValidation.Validator.imei = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      switch (!0) {
        case/^\d{15}$/.test(e):
        case/^\d{2}-\d{6}-\d{6}-\d{1}$/.test(e):
        case/^\d{2}\s\d{6}\s\d{6}\s\d{1}$/.test(e):
          return e = e.replace(/[^0-9]/g, ""), FormValidation.Helper.luhn(e);
        case/^\d{14}$/.test(e):
        case/^\d{16}$/.test(e):
        case/^\d{2}-\d{6}-\d{6}(|-\d{2})$/.test(e):
        case/^\d{2}\s\d{6}\s\d{6}(|\s\d{2})$/.test(e):
          return !0;
        default:
          return !1
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {imo: {"default": "Please enter a valid IMO number"}}}), FormValidation.Validator.imo = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      if (!/^IMO \d{7}$/i.test(e))return !1;
      for (var f = 0, g = e.replace(/^.*(\d{7})$/, "$1"), h = 6; h >= 1; h--)f += g.slice(6 - h, -h) * (h + 1);
      return f % 10 === parseInt(g.charAt(6), 10)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {integer: {"default": "Please enter a valid number"}}}), FormValidation.Validator.integer = {
    html5Attributes: {
      message: "message",
      thousandsseparator: "thousandsSeparator",
      decimalseparator: "decimalSeparator"
    }, enableByHtml5: function (a) {
      return "number" === a.attr("type") && (void 0 === a.attr("step") || a.attr("step") % 1 === 0)
    }, validate: function (a, b, c, d) {
      if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0)return !1;
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = c.decimalSeparator || ".", g = c.thousandsSeparator || "";
      f = "." === f ? "\\." : f, g = "." === g ? "\\." : g;
      var h = new RegExp("^-?[0-9]{1,3}(" + g + "[0-9]{3})*(" + f + "[0-9]+)?$"), i = new RegExp(g, "g");
      return h.test(e) ? (g && (e = e.replace(i, "")), f && (e = e.replace(f, ".")), isNaN(e) || !isFinite(e) ? !1 : (e = parseFloat(e), Math.floor(e) === e)) : !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      ip: {
        "default": "Please enter a valid IP address",
        ipv4: "Please enter a valid IPv4 address",
        ipv6: "Please enter a valid IPv6 address"
      }
    }
  }), FormValidation.Validator.ip = {
    html5Attributes: {message: "message", ipv4: "ipv4", ipv6: "ipv6"},
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      d = a.extend({}, {ipv4: !0, ipv6: !0}, d);
      var g, h = b.getLocale(), i = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, j = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/, k = !1;
      switch (!0) {
        case d.ipv4 && !d.ipv6:
          k = i.test(f), g = d.message || FormValidation.I18n[h].ip.ipv4;
          break;
        case!d.ipv4 && d.ipv6:
          k = j.test(f), g = d.message || FormValidation.I18n[h].ip.ipv6;
          break;
        case d.ipv4 && d.ipv6:
        default:
          k = i.test(f) || j.test(f), g = d.message || FormValidation.I18n[h].ip["default"]
      }
      return {valid: k, message: g}
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {isbn: {"default": "Please enter a valid ISBN number"}}}), FormValidation.Validator.isbn = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f;
      switch (!0) {
        case/^\d{9}[\dX]$/.test(e):
        case 13 === e.length && /^(\d+)-(\d+)-(\d+)-([\dX])$/.test(e):
        case 13 === e.length && /^(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(e):
          f = "ISBN10";
          break;
        case/^(978|979)\d{9}[\dX]$/.test(e):
        case 17 === e.length && /^(978|979)-(\d+)-(\d+)-(\d+)-([\dX])$/.test(e):
        case 17 === e.length && /^(978|979)\s(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(e):
          f = "ISBN13";
          break;
        default:
          return !1
      }
      e = e.replace(/[^0-9X]/gi, "");
      var g, h, i = e.split(""), j = i.length, k = 0;
      switch (f) {
        case"ISBN10":
          for (k = 0, g = 0; j - 1 > g; g++)k += parseInt(i[g], 10) * (10 - g);
          return h = 11 - k % 11, 11 === h ? h = 0 : 10 === h && (h = "X"), {type: f, valid: h + "" === i[j - 1]};
        case"ISBN13":
          for (k = 0, g = 0; j - 1 > g; g++)k += g % 2 === 0 ? parseInt(i[g], 10) : 3 * parseInt(i[g], 10);
          return h = 10 - k % 10, 10 === h && (h = "0"), {type: f, valid: h + "" === i[j - 1]};
        default:
          return !1
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {isin: {"default": "Please enter a valid ISIN number"}}}), FormValidation.Validator.isin = {
    COUNTRY_CODES: "AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW",
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      e = e.toUpperCase();
      var f = new RegExp("^(" + this.COUNTRY_CODES + ")[0-9A-Z]{10}$");
      if (!f.test(e))return !1;
      for (var g = "", h = e.length, i = 0; h - 1 > i; i++) {
        var j = e.charCodeAt(i);
        g += j > 57 ? (j - 55).toString() : e.charAt(i)
      }
      var k = "", l = g.length, m = l % 2 !== 0 ? 0 : 1;
      for (i = 0; l > i; i++)k += parseInt(g[i], 10) * (i % 2 === m ? 2 : 1) + "";
      var n = 0;
      for (i = 0; i < k.length; i++)n += parseInt(k.charAt(i), 10);
      return n = (10 - n % 10) % 10, n + "" === e.charAt(h - 1)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {ismn: {"default": "Please enter a valid ISMN number"}}}), FormValidation.Validator.ismn = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f;
      switch (!0) {
        case/^M\d{9}$/.test(e):
        case/^M-\d{4}-\d{4}-\d{1}$/.test(e):
        case/^M\s\d{4}\s\d{4}\s\d{1}$/.test(e):
          f = "ISMN10";
          break;
        case/^9790\d{9}$/.test(e):
        case/^979-0-\d{4}-\d{4}-\d{1}$/.test(e):
        case/^979\s0\s\d{4}\s\d{4}\s\d{1}$/.test(e):
          f = "ISMN13";
          break;
        default:
          return !1
      }
      "ISMN10" === f && (e = "9790" + e.substr(1)), e = e.replace(/[^0-9]/gi, "");
      for (var g = e.length, h = 0, i = [1, 3], j = 0; g - 1 > j; j++)h += parseInt(e.charAt(j), 10) * i[j % 2];
      return h = 10 - h % 10, {type: f, valid: h + "" === e.charAt(g - 1)}
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {issn: {"default": "Please enter a valid ISSN number"}}}), FormValidation.Validator.issn = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      if (!/^\d{4}\-\d{3}[\dX]$/.test(e))return !1;
      e = e.replace(/[^0-9X]/gi, "");
      var f = e.split(""), g = f.length, h = 0;
      "X" === f[7] && (f[7] = 10);
      for (var i = 0; g > i; i++)h += parseInt(f[i], 10) * (8 - i);
      return h % 11 === 0
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      lessThan: {
        "default": "Please enter a value less than or equal to %s",
        notInclusive: "Please enter a value less than %s"
      }
    }
  }), FormValidation.Validator.lessThan = {
    html5Attributes: {
      message: "message",
      value: "value",
      inclusive: "inclusive"
    }, enableByHtml5: function (a) {
      var b = a.attr("type"), c = a.attr("max");
      return c && "date" !== b ? {value: c} : !1
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      f = this._format(f);
      var g = b.getLocale(), h = a.isNumeric(d.value) ? d.value : b.getDynamicOption(c, d.value), i = this._format(h);
      return d.inclusive === !0 || void 0 === d.inclusive ? {
        valid: a.isNumeric(f) && parseFloat(f) <= i,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].lessThan["default"], h)
      } : {
        valid: a.isNumeric(f) && parseFloat(f) < i,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].lessThan.notInclusive, h)
      }
    }, _format: function (a) {
      return (a + "").replace(",", ".")
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {mac: {"default": "Please enter a valid MAC address"}}}), FormValidation.Validator.mac = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {meid: {"default": "Please enter a valid MEID number"}}}), FormValidation.Validator.meid = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      switch (!0) {
        case/^[0-9A-F]{15}$/i.test(e):
        case/^[0-9A-F]{2}[- ][0-9A-F]{6}[- ][0-9A-F]{6}[- ][0-9A-F]$/i.test(e):
        case/^\d{19}$/.test(e):
        case/^\d{5}[- ]\d{5}[- ]\d{4}[- ]\d{4}[- ]\d$/.test(e):
          var f = e.charAt(e.length - 1);
          if (e = e.replace(/[- ]/g, ""), e.match(/^\d*$/i))return FormValidation.Helper.luhn(e);
          e = e.slice(0, -1);
          for (var g = "", h = 1; 13 >= h; h += 2)g += (2 * parseInt(e.charAt(h), 16)).toString(16);
          var i = 0;
          for (h = 0; h < g.length; h++)i += parseInt(g.charAt(h), 16);
          return i % 10 === 0 ? "0" === f : f === (2 * (10 * Math.floor((i + 10) / 10) - i)).toString(16);
        case/^[0-9A-F]{14}$/i.test(e):
        case/^[0-9A-F]{2}[- ][0-9A-F]{6}[- ][0-9A-F]{6}$/i.test(e):
        case/^\d{18}$/.test(e):
        case/^\d{5}[- ]\d{5}[- ]\d{4}[- ]\d{4}$/.test(e):
          return !0;
        default:
          return !1
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {notEmpty: {"default": "Please enter a value"}}}), FormValidation.Validator.notEmpty = {
    enableByHtml5: function (a) {
      var b = a.attr("required") + "";
      return "required" === b || "true" === b
    }, validate: function (b, c, d, e) {
      var f = c.attr("type");
      if ("radio" === f || "checkbox" === f) {
        var g = b.getNamespace();
        return b.getFieldElements(c.attr("data-" + g + "-field")).filter(":checked").length > 0
      }
      if ("number" === f && c.get(0).validity && c.get(0).validity.badInput === !0)return !0;
      var h = b.getFieldValue(c, e);
      return "" !== a.trim(h)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {numeric: {"default": "Please enter a valid float number"}}}), FormValidation.Validator.numeric = {
    html5Attributes: {
      message: "message",
      separator: "separator",
      thousandsseparator: "thousandsSeparator",
      decimalseparator: "decimalSeparator"
    }, enableByHtml5: function (a) {
      return "number" === a.attr("type") && void 0 !== a.attr("step") && a.attr("step") % 1 !== 0
    }, validate: function (a, b, c, d) {
      if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0)return !1;
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = c.separator || c.decimalSeparator || ".", g = c.thousandsSeparator || "";
      f = "." === f ? "\\." : f, g = "." === g ? "\\." : g;
      var h = new RegExp("^-?[0-9]{1,3}(" + g + "[0-9]{3})*(" + f + "[0-9]+)?$"), i = new RegExp(g, "g");
      return h.test(e) ? (g && (e = e.replace(i, "")), f && (e = e.replace(f, ".")), !isNaN(parseFloat(e)) && isFinite(e)) : !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      phone: {
        "default": "Please enter a valid phone number",
        country: "Please enter a valid phone number in %s",
        countries: {
          AE: "United Arab Emirates",
          BG: "Bulgaria",
          BR: "Brazil",
          CN: "China",
          CZ: "Czech Republic",
          DE: "Germany",
          DK: "Denmark",
          ES: "Spain",
          FR: "France",
          GB: "United Kingdom",
          IN: "India",
          MA: "Morocco",
          NL: "Netherlands",
          PK: "Pakistan",
          RO: "Romania",
          RU: "Russia",
          SK: "Slovakia",
          TH: "Thailand",
          US: "USA",
          VE: "Venezuela"
        }
      }
    }
  }), FormValidation.Validator.phone = {
    html5Attributes: {message: "message", country: "country"},
    COUNTRY_CODES: ["AE", "BG", "BR", "CN", "CZ", "DE", "DK", "ES", "FR", "GB", "IN", "MA", "NL", "PK", "RO", "RU", "SK", "TH", "US", "VE"],
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      var g = b.getLocale(), h = d.country;
      if (("string" != typeof h || -1 === a.inArray(h, this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)), !h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES))return !0;
      var i = !0;
      switch (h.toUpperCase()) {
        case"AE":
          f = a.trim(f), i = /^(((\+|00)?971[\s\.-]?(\(0\)[\s\.-]?)?|0)(\(5(0|2|5|6)\)|5(0|2|5|6)|2|3|4|6|7|9)|60)([\s\.-]?[0-9]){7}$/.test(f);
          break;
        case"BG":
          f = f.replace(/\+|\s|-|\/|\(|\)/gi, ""), i = /^(0|359|00)(((700|900)[0-9]{5}|((800)[0-9]{5}|(800)[0-9]{4}))|(87|88|89)([0-9]{7})|((2[0-9]{7})|(([3-9][0-9])(([0-9]{6})|([0-9]{5})))))$/.test(f);
          break;
        case"BR":
          f = a.trim(f), i = /^(([\d]{4}[-.\s]{1}[\d]{2,3}[-.\s]{1}[\d]{2}[-.\s]{1}[\d]{2})|([\d]{4}[-.\s]{1}[\d]{3}[-.\s]{1}[\d]{4})|((\(?\+?[0-9]{2}\)?\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}))$/.test(f);
          break;
        case"CN":
          f = a.trim(f), i = /^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/.test(f);
          break;
        case"CZ":
          i = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(f);
          break;
        case"DE":
          f = a.trim(f), i = /^(((((((00|\+)49[ \-/]?)|0)[1-9][0-9]{1,4})[ \-/]?)|((((00|\+)49\()|\(0)[1-9][0-9]{1,4}\)[ \-/]?))[0-9]{1,7}([ \-/]?[0-9]{1,5})?)$/.test(f);
          break;
        case"DK":
          f = a.trim(f), i = /^(\+45|0045|\(45\))?\s?[2-9](\s?\d){7}$/.test(f);
          break;
        case"ES":
          f = a.trim(f), i = /^(?:(?:(?:\+|00)34\D?))?(?:5|6|7|8|9)(?:\d\D?){8}$/.test(f);
          break;
        case"FR":
          f = a.trim(f), i = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/.test(f);
          break;
        case"GB":
          f = a.trim(f), i = /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/.test(f);
          break;
        case"IN":
          f = a.trim(f), i = /((\+?)((0[ -]+)*|(91 )*)(\d{12}|\d{10}))|\d{5}([- ]*)\d{6}/.test(f);
          break;
        case"MA":
          f = a.trim(f), i = /^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/.test(f);
          break;
        case"NL":
          f = a.trim(f), i = /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/gm.test(f);
          break;
        case"PK":
          f = a.trim(f), i = /^0?3[0-9]{2}[0-9]{7}$/.test(f);
          break;
        case"RO":
          i = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/g.test(f);
          break;
        case"RU":
          i = /^((8|\+7|007)[\-\.\/ ]?)?([\(\/\.]?\d{3}[\)\/\.]?[\-\.\/ ]?)?[\d\-\.\/ ]{7,10}$/g.test(f);
          break;
        case"SK":
          i = /^(((00)([- ]?)|\+)(421)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(f);
          break;
        case"TH":
          i = /^0\(?([6|8-9]{2})*-([0-9]{3})*-([0-9]{4})$/.test(f);
          break;
        case"VE":
          f = a.trim(f), i = /^0(?:2(?:12|4[0-9]|5[1-9]|6[0-9]|7[0-8]|8[1-35-8]|9[1-5]|3[45789])|4(?:1[246]|2[46]))\d{7}$/.test(f);
          break;
        case"US":
        default:
          i = /^(?:(1\-?)|(\+1 ?))?\(?(\d{3})[\)\-\.]?(\d{3})[\-\.]?(\d{4})$/.test(f)
      }
      return {
        valid: i,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].phone.country, FormValidation.I18n[g].phone.countries[h])
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {promise: {"default": "Please enter a valid value"}}}), FormValidation.Validator.promise = {
    html5Attributes: {
      message: "message",
      promise: "promise"
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e), g = new a.Deferred, h = FormValidation.Helper.call(d.promise, [f, b, c]);
      return h.done(function (a) {
        g.resolve(c, e, a)
      }).fail(function (a) {
        a = a || {}, a.valid = !1, g.resolve(c, e, a)
      }), g
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {regexp: {"default": "Please enter a value matching the pattern"}}}), FormValidation.Validator.regexp = {
    html5Attributes: {
      message: "message",
      regexp: "regexp"
    }, enableByHtml5: function (a) {
      var b = a.attr("pattern");
      return b ? {regexp: b} : !1
    }, validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = "string" == typeof c.regexp ? new RegExp(c.regexp) : c.regexp;
      return f.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {remote: {"default": "Please enter a valid value"}}}), FormValidation.Validator.remote = {
    html5Attributes: {
      crossdomain: "crossDomain",
      data: "data",
      datatype: "dataType",
      delay: "delay",
      message: "message",
      name: "name",
      type: "type",
      url: "url",
      validkey: "validKey"
    }, destroy: function (a, b, c, d) {
      var e = a.getNamespace(), f = b.data(e + "." + d + ".timer");
      f && (clearTimeout(f), b.removeData(e + "." + d + ".timer"))
    }, validate: function (b, c, d, e) {
      function f() {
        var b = a.ajax(n);
        return b.success(function (a) {
          a.valid = a[m] === !0 || "true" === a[m] ? !0 : a[m] === !1 || "false" === a[m] ? !1 : null, i.resolve(c, e, a)
        }).error(function (a) {
          i.resolve(c, e, {valid: !1})
        }), i.fail(function () {
          b.abort()
        }), i
      }

      var g = b.getNamespace(), h = b.getFieldValue(c, e), i = new a.Deferred;
      if ("" === h)return i.resolve(c, e, {valid: !0}), i;
      var j = c.attr("data-" + g + "-field"), k = d.data || {}, l = d.url, m = d.validKey || "valid";
      "function" == typeof k && (k = k.call(this, b, c, h)), "string" == typeof k && (k = JSON.parse(k)), "function" == typeof l && (l = l.call(this, b, c, h)), k[d.name || j] = h;
      var n = {data: k, dataType: d.dataType || "json", headers: d.headers || {}, type: d.type || "GET", url: l};
      return null !== d.crossDomain && (n.crossDomain = d.crossDomain === !0 || "true" === d.crossDomain), d.delay ? (c.data(g + "." + e + ".timer") && clearTimeout(c.data(g + "." + e + ".timer")), c.data(g + "." + e + ".timer", setTimeout(f, d.delay)), i) : f()
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {rtn: {"default": "Please enter a valid RTN number"}}}), FormValidation.Validator.rtn = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      if (!/^\d{9}$/.test(e))return !1;
      for (var f = 0, g = 0; g < e.length; g += 3)f += 3 * parseInt(e.charAt(g), 10) + 7 * parseInt(e.charAt(g + 1), 10) + parseInt(e.charAt(g + 2), 10);
      return 0 !== f && f % 10 === 0
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {sedol: {"default": "Please enter a valid SEDOL number"}}}), FormValidation.Validator.sedol = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      if (e = e.toUpperCase(), !/^[0-9A-Z]{7}$/.test(e))return !1;
      for (var f = 0, g = [1, 3, 1, 7, 3, 9, 1], h = e.length, i = 0; h - 1 > i; i++)f += g[i] * parseInt(e.charAt(i), 36);
      return f = (10 - f % 10) % 10, f + "" === e.charAt(h - 1)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {siren: {"default": "Please enter a valid SIREN number"}}}), FormValidation.Validator.siren = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      return "" === e ? !0 : /^\d{9}$/.test(e) ? FormValidation.Helper.luhn(e) : !1
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {siret: {"default": "Please enter a valid SIRET number"}}}), FormValidation.Validator.siret = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      for (var f, g = 0, h = e.length, i = 0; h > i; i++)f = parseInt(e.charAt(i), 10), i % 2 === 0 && (f = 2 * f, f > 9 && (f -= 9)), g += f;
      return g % 10 === 0
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {step: {"default": "Please enter a valid step of %s"}}}), FormValidation.Validator.step = {
    html5Attributes: {
      message: "message",
      base: "baseValue",
      step: "step"
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      if (d = a.extend({}, {baseValue: 0, step: 1}, d), f = parseFloat(f), !a.isNumeric(f))return !1;
      var g = function (a, b) {
        var c = Math.pow(10, b);
        a *= c;
        var d = a > 0 | -(0 > a), e = a % 1 === .5 * d;
        return e ? (Math.floor(a) + (d > 0)) / c : Math.round(a) / c
      }, h = function (a, b) {
        if (0 === b)return 1;
        var c = (a + "").split("."), d = (b + "").split("."), e = (1 === c.length ? 0 : c[1].length) + (1 === d.length ? 0 : d[1].length);
        return g(a - b * Math.floor(a / b), e)
      }, i = b.getLocale(), j = h(f - d.baseValue, d.step);
      return {
        valid: 0 === j || j === d.step,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[i].step["default"], [d.step])
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      stringCase: {
        "default": "Please enter only lowercase characters",
        upper: "Please enter only uppercase characters"
      }
    }
  }), FormValidation.Validator.stringCase = {
    html5Attributes: {message: "message", "case": "case"},
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = a.getLocale(), g = (c["case"] || "lower").toLowerCase();
      return {
        valid: "upper" === g ? e === e.toUpperCase() : e === e.toLowerCase(),
        message: c.message || ("upper" === g ? FormValidation.I18n[f].stringCase.upper : FormValidation.I18n[f].stringCase["default"])
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      stringLength: {
        "default": "Please enter a value with valid length",
        less: "Please enter less than %s characters",
        more: "Please enter more than %s characters",
        between: "Please enter value between %s and %s characters long"
      }
    }
  }), FormValidation.Validator.stringLength = {
    html5Attributes: {
      message: "message",
      min: "min",
      max: "max",
      trim: "trim",
      utf8bytes: "utf8Bytes"
    }, enableByHtml5: function (b) {
      var c = {}, d = b.attr("maxlength"), e = b.attr("minlength");
      return d && (c.max = parseInt(d, 10)), e && (c.min = parseInt(e, 10)), a.isEmptyObject(c) ? !1 : c
    }, validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ((d.trim === !0 || "true" === d.trim) && (f = a.trim(f)), "" === f)return !0;
      var g = b.getLocale(), h = a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min), i = a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max), j = function (a) {
        for (var b = a.length, c = a.length - 1; c >= 0; c--) {
          var d = a.charCodeAt(c);
          d > 127 && 2047 >= d ? b++ : d > 2047 && 65535 >= d && (b += 2), d >= 56320 && 57343 >= d && c--
        }
        return b
      }, k = d.utf8Bytes ? j(f) : f.length, l = !0, m = d.message || FormValidation.I18n[g].stringLength["default"];
      switch ((h && k < parseInt(h, 10) || i && k > parseInt(i, 10)) && (l = !1), !0) {
        case!!h && !!i:
          m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.between, [parseInt(h, 10), parseInt(i, 10)]);
          break;
        case!!h:
          m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.more, parseInt(h, 10) - 1);
          break;
        case!!i:
          m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.less, parseInt(i, 10) + 1)
      }
      return {valid: l, message: m}
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {uri: {"default": "Please enter a valid URI"}}}), FormValidation.Validator.uri = {
    html5Attributes: {
      message: "message",
      allowlocal: "allowLocal",
      allowemptyprotocol: "allowEmptyProtocol",
      protocol: "protocol"
    }, enableByHtml5: function (a) {
      return "url" === a.attr("type")
    }, validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = c.allowLocal === !0 || "true" === c.allowLocal, g = c.allowEmptyProtocol === !0 || "true" === c.allowEmptyProtocol, h = (c.protocol || "http, https, ftp").split(",").join("|").replace(/\s/g, ""), i = new RegExp("^(?:(?:" + h + ")://)" + (g ? "?" : "") + "(?:\\S+(?::\\S*)?@)?(?:" + (f ? "" : "(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})") + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9])*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + (f ? "?" : "") + ")(?::\\d{2,5})?(?:/[^\\s]*)?$", "i");
      return i.test(e)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      uuid: {
        "default": "Please enter a valid UUID number",
        version: "Please enter a valid UUID version %s number"
      }
    }
  }), FormValidation.Validator.uuid = {
    html5Attributes: {message: "message", version: "version"},
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      var f = a.getLocale(), g = {
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
      }, h = c.version ? c.version + "" : "all";
      return {
        valid: null === g[h] ? !0 : g[h].test(e),
        message: c.version ? FormValidation.Helper.format(c.message || FormValidation.I18n[f].uuid.version, c.version) : c.message || FormValidation.I18n[f].uuid["default"]
      }
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      vat: {
        "default": "Please enter a valid VAT number",
        country: "Please enter a valid VAT number in %s",
        countries: {
          AT: "Austria",
          BE: "Belgium",
          BG: "Bulgaria",
          BR: "Brazil",
          CH: "Switzerland",
          CY: "Cyprus",
          CZ: "Czech Republic",
          DE: "Germany",
          DK: "Denmark",
          EE: "Estonia",
          ES: "Spain",
          FI: "Finland",
          FR: "France",
          GB: "United Kingdom",
          GR: "Greek",
          EL: "Greek",
          HU: "Hungary",
          HR: "Croatia",
          IE: "Ireland",
          IS: "Iceland",
          IT: "Italy",
          LT: "Lithuania",
          LU: "Luxembourg",
          LV: "Latvia",
          MT: "Malta",
          NL: "Netherlands",
          NO: "Norway",
          PL: "Poland",
          PT: "Portugal",
          RO: "Romania",
          RU: "Russia",
          RS: "Serbia",
          SE: "Sweden",
          SI: "Slovenia",
          SK: "Slovakia",
          VE: "Venezuela",
          ZA: "South Africa"
        }
      }
    }
  }), FormValidation.Validator.vat = {
    html5Attributes: {message: "message", country: "country"},
    COUNTRY_CODES: ["AT", "BE", "BG", "BR", "CH", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "RU", "RS", "SE", "SK", "SI", "VE", "ZA"],
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f)return !0;
      var g = b.getLocale(), h = d.country;
      if (h ? ("string" != typeof h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)) : h = f.substr(0, 2), -1 === a.inArray(h, this.COUNTRY_CODES))return !0;
      var i = ["_", h.toLowerCase()].join(""), j = this[i](f);
      return j = j === !0 || j === !1 ? {valid: j} : j, j.message = FormValidation.Helper.format(d.message || FormValidation.I18n[g].vat.country, FormValidation.I18n[g].vat.countries[h.toUpperCase()]), j
    },
    _at: function (a) {
      if (/^ATU[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^U[0-9]{8}$/.test(a))return !1;
      a = a.substr(1);
      for (var b = 0, c = [1, 2, 1, 2, 1, 2, 1], d = 0, e = 0; 7 > e; e++)d = parseInt(a.charAt(e), 10) * c[e], d > 9 && (d = Math.floor(d / 10) + d % 10), b += d;
      return b = 10 - (b + 4) % 10, 10 === b && (b = 0), b + "" === a.substr(7, 1)
    },
    _be: function (a) {
      if (/^BE[0]{0,1}[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0]{0,1}[0-9]{9}$/.test(a))return !1;
      if (9 === a.length && (a = "0" + a), "0" === a.substr(1, 1))return !1;
      var b = parseInt(a.substr(0, 8), 10) + parseInt(a.substr(8, 2), 10);
      return b % 97 === 0
    },
    _bg: function (a) {
      if (/^BG[0-9]{9,10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9,10}$/.test(a))return !1;
      var b = 0, c = 0;
      if (9 === a.length) {
        for (c = 0; 8 > c; c++)b += parseInt(a.charAt(c), 10) * (c + 1);
        if (b %= 11, 10 === b)for (b = 0, c = 0; 8 > c; c++)b += parseInt(a.charAt(c), 10) * (c + 3);
        return b %= 10, b + "" === a.substr(8)
      }
      if (10 === a.length) {
        var d = function (a) {
          var b = parseInt(a.substr(0, 2), 10) + 1900, c = parseInt(a.substr(2, 2), 10), d = parseInt(a.substr(4, 2), 10);
          if (c > 40 ? (b += 100, c -= 40) : c > 20 && (b -= 100, c -= 20), !FormValidation.Helper.date(b, c, d))return !1;
          for (var e = 0, f = [2, 4, 8, 5, 10, 9, 7, 3, 6], g = 0; 9 > g; g++)e += parseInt(a.charAt(g), 10) * f[g];
          return e = e % 11 % 10, e + "" === a.substr(9, 1)
        }, e = function (a) {
          for (var b = 0, c = [21, 19, 17, 13, 11, 9, 7, 3, 1], d = 0; 9 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
          return b %= 10, b + "" === a.substr(9, 1)
        }, f = function (a) {
          for (var b = 0, c = [4, 3, 2, 7, 6, 5, 4, 3, 2], d = 0; 9 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
          return b = 11 - b % 11, 10 === b ? !1 : (11 === b && (b = 0), b + "" === a.substr(9, 1))
        };
        return d(a) || e(a) || f(a)
      }
      return !1
    },
    _br: function (a) {
      if ("" === a)return !0;
      var b = a.replace(/[^\d]+/g, "");
      if ("" === b || 14 !== b.length)return !1;
      if ("00000000000000" === b || "11111111111111" === b || "22222222222222" === b || "33333333333333" === b || "44444444444444" === b || "55555555555555" === b || "66666666666666" === b || "77777777777777" === b || "88888888888888" === b || "99999999999999" === b)return !1;
      for (var c = b.length - 2, d = b.substring(0, c), e = b.substring(c), f = 0, g = c - 7, h = c; h >= 1; h--)f += parseInt(d.charAt(c - h), 10) * g--, 2 > g && (g = 9);
      var i = 2 > f % 11 ? 0 : 11 - f % 11;
      if (i !== parseInt(e.charAt(0), 10))return !1;
      for (c += 1, d = b.substring(0, c), f = 0, g = c - 7, h = c; h >= 1; h--)f += parseInt(d.charAt(c - h), 10) * g--, 2 > g && (g = 9);
      return i = 2 > f % 11 ? 0 : 11 - f % 11, i === parseInt(e.charAt(1), 10)
    },
    _ch: function (a) {
      if (/^CHE[0-9]{9}(MWST)?$/.test(a) && (a = a.substr(2)), !/^E[0-9]{9}(MWST)?$/.test(a))return !1;
      a = a.substr(1);
      for (var b = 0, c = [5, 4, 3, 2, 7, 6, 5, 4], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b = 11 - b % 11, 10 === b ? !1 : (11 === b && (b = 0), b + "" === a.substr(8, 1))
    },
    _cy: function (a) {
      if (/^CY[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a) && (a = a.substr(2)), !/^[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a))return !1;
      if ("12" === a.substr(0, 2))return !1;
      for (var b = 0, c = {0: 1, 1: 0, 2: 5, 3: 7, 4: 9, 5: 13, 6: 15, 7: 17, 8: 19, 9: 21}, d = 0; 8 > d; d++) {
        var e = parseInt(a.charAt(d), 10);
        d % 2 === 0 && (e = c[e + ""]), b += e
      }
      return b = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[b % 26], b + "" === a.substr(8, 1)
    },
    _cz: function (a) {
      if (/^CZ[0-9]{8,10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8,10}$/.test(a))return !1;
      var b = 0, c = 0;
      if (8 === a.length) {
        if (a.charAt(0) + "" == "9")return !1;
        for (b = 0, c = 0; 7 > c; c++)b += parseInt(a.charAt(c), 10) * (8 - c);
        return b = 11 - b % 11, 10 === b && (b = 0), 11 === b && (b = 1), b + "" === a.substr(7, 1)
      }
      if (9 === a.length && a.charAt(0) + "" == "6") {
        for (b = 0, c = 0; 7 > c; c++)b += parseInt(a.charAt(c + 1), 10) * (8 - c);
        return b = 11 - b % 11, 10 === b && (b = 0), 11 === b && (b = 1), b = [8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 10][b - 1], b + "" === a.substr(8, 1)
      }
      if (9 === a.length || 10 === a.length) {
        var d = 1900 + parseInt(a.substr(0, 2), 10), e = parseInt(a.substr(2, 2), 10) % 50 % 20, f = parseInt(a.substr(4, 2), 10);
        if (9 === a.length) {
          if (d >= 1980 && (d -= 100), d > 1953)return !1
        } else 1954 > d && (d += 100);
        if (!FormValidation.Helper.date(d, e, f))return !1;
        if (10 === a.length) {
          var g = parseInt(a.substr(0, 9), 10) % 11;
          return 1985 > d && (g %= 10), g + "" === a.substr(9, 1)
        }
        return !0
      }
      return !1
    },
    _de: function (a) {
      return /^DE[0-9]{9}$/.test(a) && (a = a.substr(2)), /^[0-9]{9}$/.test(a) ? FormValidation.Helper.mod11And10(a) : !1
    },
    _dk: function (a) {
      if (/^DK[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))return !1;
      for (var b = 0, c = [2, 7, 6, 5, 4, 3, 2, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b % 11 === 0
    },
    _ee: function (a) {
      if (/^EE[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))return !1;
      for (var b = 0, c = [3, 7, 1, 3, 7, 1, 3, 7, 1], d = 0; 9 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b % 10 === 0
    },
    _es: function (a) {
      if (/^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a) && (a = a.substr(2)), !/^[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a))return !1;
      var b = function (a) {
        var b = parseInt(a.substr(0, 8), 10);
        return b = "TRWAGMYFPDXBNJZSQVHLCKE"[b % 23], b + "" === a.substr(8, 1)
      }, c = function (a) {
        var b = ["XYZ".indexOf(a.charAt(0)), a.substr(1)].join("");
        return b = parseInt(b, 10), b = "TRWAGMYFPDXBNJZSQVHLCKE"[b % 23], b + "" === a.substr(8, 1)
      }, d = function (a) {
        var b, c = a.charAt(0);
        if (-1 !== "KLM".indexOf(c))return b = parseInt(a.substr(1, 8), 10), b = "TRWAGMYFPDXBNJZSQVHLCKE"[b % 23], b + "" === a.substr(8, 1);
        if (-1 !== "ABCDEFGHJNPQRSUVW".indexOf(c)) {
          for (var d = 0, e = [2, 1, 2, 1, 2, 1, 2], f = 0, g = 0; 7 > g; g++)f = parseInt(a.charAt(g + 1), 10) * e[g], f > 9 && (f = Math.floor(f / 10) + f % 10), d += f;
          return d = 10 - d % 10, 10 === d && (d = 0), d + "" === a.substr(8, 1) || "JABCDEFGHI"[d] === a.substr(8, 1)
        }
        return !1
      }, e = a.charAt(0);
      return /^[0-9]$/.test(e) ? {valid: b(a), type: "DNI"} : /^[XYZ]$/.test(e) ? {
        valid: c(a),
        type: "NIE"
      } : {valid: d(a), type: "CIF"}
    },
    _fi: function (a) {
      if (/^FI[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))return !1;
      for (var b = 0, c = [7, 9, 10, 5, 8, 4, 2, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b % 11 === 0
    },
    _fr: function (a) {
      if (/^FR[0-9A-Z]{2}[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9A-Z]{2}[0-9]{9}$/.test(a))return !1;
      if (!FormValidation.Helper.luhn(a.substr(2)))return !1;
      if (/^[0-9]{2}$/.test(a.substr(0, 2)))return a.substr(0, 2) === parseInt(a.substr(2) + "12", 10) % 97 + "";
      var b, c = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
      return b = /^[0-9]{1}$/.test(a.charAt(0)) ? 24 * c.indexOf(a.charAt(0)) + c.indexOf(a.charAt(1)) - 10 : 34 * c.indexOf(a.charAt(0)) + c.indexOf(a.charAt(1)) - 100, (parseInt(a.substr(2), 10) + 1 + Math.floor(b / 11)) % 11 === b % 11
    },
    _gb: function (a) {
      if ((/^GB[0-9]{9}$/.test(a) || /^GB[0-9]{12}$/.test(a) || /^GBGD[0-9]{3}$/.test(a) || /^GBHA[0-9]{3}$/.test(a) || /^GB(GD|HA)8888[0-9]{5}$/.test(a)) && (a = a.substr(2)), !(/^[0-9]{9}$/.test(a) || /^[0-9]{12}$/.test(a) || /^GD[0-9]{3}$/.test(a) || /^HA[0-9]{3}$/.test(a) || /^(GD|HA)8888[0-9]{5}$/.test(a)))return !1;
      var b = a.length;
      if (5 === b) {
        var c = a.substr(0, 2), d = parseInt(a.substr(2), 10);
        return "GD" === c && 500 > d || "HA" === c && d >= 500
      }
      if (11 === b && ("GD8888" === a.substr(0, 6) || "HA8888" === a.substr(0, 6)))return "GD" === a.substr(0, 2) && parseInt(a.substr(6, 3), 10) >= 500 || "HA" === a.substr(0, 2) && parseInt(a.substr(6, 3), 10) < 500 ? !1 : parseInt(a.substr(6, 3), 10) % 97 === parseInt(a.substr(9, 2), 10);
      if (9 === b || 12 === b) {
        for (var e = 0, f = [8, 7, 6, 5, 4, 3, 2, 10, 1], g = 0; 9 > g; g++)e += parseInt(a.charAt(g), 10) * f[g];
        return e %= 97, parseInt(a.substr(0, 3), 10) >= 100 ? 0 === e || 42 === e || 55 === e : 0 === e
      }
      return !0
    },
    _gr: function (a) {
      if (/^(GR|EL)[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))return !1;
      8 === a.length && (a = "0" + a);
      for (var b = 0, c = [256, 128, 64, 32, 16, 8, 4, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b = b % 11 % 10, b + "" === a.substr(8, 1)
    },
    _el: function (a) {
      return this._gr(a)
    },
    _hu: function (a) {
      if (/^HU[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))return !1;
      for (var b = 0, c = [9, 7, 3, 1, 9, 7, 3, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b % 10 === 0
    },
    _hr: function (a) {
      return /^HR[0-9]{11}$/.test(a) && (a = a.substr(2)), /^[0-9]{11}$/.test(a) ? FormValidation.Helper.mod11And10(a) : !1
    },
    _ie: function (a) {
      if (/^IE[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a) && (a = a.substr(2)), !/^[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a))return !1;
      var b = function (a) {
        for (; a.length < 7;)a = "0" + a;
        for (var b = "WABCDEFGHIJKLMNOPQRSTUV", c = 0, d = 0; 7 > d; d++)c += parseInt(a.charAt(d), 10) * (8 - d);
        return c += 9 * b.indexOf(a.substr(7)), b[c % 23]
      };
      return /^[0-9]+$/.test(a.substr(0, 7)) ? a.charAt(7) === b(a.substr(0, 7) + a.substr(8) + "") : -1 !== "ABCDEFGHIJKLMNOPQRSTUVWXYZ+*".indexOf(a.charAt(1)) ? a.charAt(7) === b(a.substr(2, 5) + a.substr(0, 1) + "") : !0
    },
    _is: function (a) {
      return /^IS[0-9]{5,6}$/.test(a) && (a = a.substr(2)), /^[0-9]{5,6}$/.test(a)
    },
    _it: function (a) {
      if (/^IT[0-9]{11}$/.test(a) && (a = a.substr(2)), !/^[0-9]{11}$/.test(a))return !1;
      if (0 === parseInt(a.substr(0, 7), 10))return !1;
      var b = parseInt(a.substr(7, 3), 10);
      return 1 > b || b > 201 && 999 !== b && 888 !== b ? !1 : FormValidation.Helper.luhn(a)
    },
    _lt: function (a) {
      if (/^LT([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a) && (a = a.substr(2)), !/^([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a))return !1;
      var b, c = a.length, d = 0;
      for (b = 0; c - 1 > b; b++)d += parseInt(a.charAt(b), 10) * (1 + b % 9);
      var e = d % 11;
      if (10 === e)for (d = 0, b = 0; c - 1 > b; b++)d += parseInt(a.charAt(b), 10) * (1 + (b + 2) % 9);
      return e = e % 11 % 10, e + "" === a.charAt(c - 1)
    },
    _lu: function (a) {
      return /^LU[0-9]{8}$/.test(a) && (a = a.substr(2)), /^[0-9]{8}$/.test(a) ? parseInt(a.substr(0, 6), 10) % 89 + "" === a.substr(6, 2) : !1
    },
    _lv: function (a) {
      if (/^LV[0-9]{11}$/.test(a) && (a = a.substr(2)), !/^[0-9]{11}$/.test(a))return !1;
      var b, c = parseInt(a.charAt(0), 10), d = 0, e = [], f = a.length;
      if (c > 3) {
        for (d = 0, e = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1], b = 0; f > b; b++)d += parseInt(a.charAt(b), 10) * e[b];
        return d %= 11, 3 === d
      }
      var g = parseInt(a.substr(0, 2), 10), h = parseInt(a.substr(2, 2), 10), i = parseInt(a.substr(4, 2), 10);
      if (i = i + 1800 + 100 * parseInt(a.charAt(6), 10), !FormValidation.Helper.date(i, h, g))return !1;
      for (d = 0, e = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], b = 0; f - 1 > b; b++)d += parseInt(a.charAt(b), 10) * e[b];
      return d = (d + 1) % 11 % 10, d + "" === a.charAt(f - 1)
    },
    _mt: function (a) {
      if (/^MT[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))return !1;
      for (var b = 0, c = [3, 4, 6, 7, 8, 9, 10, 1], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b % 37 === 0
    },
    _nl: function (a) {
      if (/^NL[0-9]{9}B[0-9]{2}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}B[0-9]{2}$/.test(a))return !1;
      for (var b = 0, c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b %= 11, b > 9 && (b = 0), b + "" === a.substr(8, 1)
    },
    _no: function (a) {
      if (/^NO[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))return !1;
      for (var b = 0, c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b = 11 - b % 11, 11 === b && (b = 0), b + "" === a.substr(8, 1)
    },
    _pl: function (a) {
      if (/^PL[0-9]{10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{10}$/.test(a))return !1;
      for (var b = 0, c = [6, 5, 7, 2, 3, 4, 5, 6, 7, -1], d = 0; 10 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b % 11 === 0
    },
    _pt: function (a) {
      if (/^PT[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))return !1;
      for (var b = 0, c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)b += parseInt(a.charAt(d), 10) * c[d];
      return b = 11 - b % 11, b > 9 && (b = 0), b + "" === a.substr(8, 1)
    },
    _ro: function (a) {
      if (/^RO[1-9][0-9]{1,9}$/.test(a) && (a = a.substr(2)), !/^[1-9][0-9]{1,9}$/.test(a))return !1;
      for (var b = a.length, c = [7, 5, 3, 2, 1, 7, 5, 3, 2].slice(10 - b), d = 0, e = 0; b - 1 > e; e++)d += parseInt(a.charAt(e), 10) * c[e];
      return d = 10 * d % 11 % 10, d + "" === a.substr(b - 1, 1)
    },
    _ru: function (a) {
      if (/^RU([0-9]{10}|[0-9]{12})$/.test(a) && (a = a.substr(2)), !/^([0-9]{10}|[0-9]{12})$/.test(a))return !1;
      var b = 0;
      if (10 === a.length) {
        var c = 0, d = [2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
        for (b = 0; 10 > b; b++)c += parseInt(a.charAt(b), 10) * d[b];
        return c %= 11, c > 9 && (c %= 10), c + "" === a.substr(9, 1)
      }
      if (12 === a.length) {
        var e = 0, f = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0], g = 0, h = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
        for (b = 0; 11 > b; b++)e += parseInt(a.charAt(b), 10) * f[b], g += parseInt(a.charAt(b), 10) * h[b];
        return e %= 11, e > 9 && (e %= 10), g %= 11, g > 9 && (g %= 10), e + "" === a.substr(10, 1) && g + "" === a.substr(11, 1)
      }
      return !1
    },
    _rs: function (a) {
      if (/^RS[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))return !1;
      for (var b = 10, c = 0, d = 0; 8 > d; d++)c = (parseInt(a.charAt(d), 10) + b) % 10, 0 === c && (c = 10), b = 2 * c % 11;
      return (b + parseInt(a.substr(8, 1), 10)) % 10 === 1
    },
    _se: function (a) {
      return /^SE[0-9]{10}01$/.test(a) && (a = a.substr(2)), /^[0-9]{10}01$/.test(a) ? (a = a.substr(0, 10), FormValidation.Helper.luhn(a)) : !1
    },
    _si: function (a) {
      var b = a.match(/^(SI)?([1-9][0-9]{7})$/);
      if (!b)return !1;
      b[1] && (a = a.substr(2));
      for (var c = 0, d = [8, 7, 6, 5, 4, 3, 2], e = 0; 7 > e; e++)c += parseInt(a.charAt(e), 10) * d[e];
      return c = 11 - c % 11, 10 === c && (c = 0), c + "" === a.substr(7, 1)
    },
    _sk: function (a) {
      return /^SK[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) && (a = a.substr(2)), /^[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) ? parseInt(a, 10) % 11 === 0 : !1
    },
    _ve: function (a) {
      if (/^VE[VEJPG][0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[VEJPG][0-9]{9}$/.test(a))return !1;
      for (var b = {
        V: 4,
        E: 8,
        J: 12,
        P: 16,
        G: 20
      }, c = b[a.charAt(0)], d = [3, 2, 7, 6, 5, 4, 3, 2], e = 0; 8 > e; e++)c += parseInt(a.charAt(e + 1), 10) * d[e];
      return c = 11 - c % 11, (11 === c || 10 === c) && (c = 0), c + "" === a.substr(9, 1)
    },
    _za: function (a) {
      return /^ZA4[0-9]{9}$/.test(a) && (a = a.substr(2)), /^4[0-9]{9}$/.test(a)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {en_US: {vin: {"default": "Please enter a valid VIN number"}}}), FormValidation.Validator.vin = {
    validate: function (a, b, c, d) {
      var e = a.getFieldValue(b, d);
      if ("" === e)return !0;
      if (!/^[a-hj-npr-z0-9]{8}[0-9xX][a-hj-npr-z0-9]{8}$/i.test(e))return !1;
      e = e.toUpperCase();
      for (var f = {
        A: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5,
        F: 6,
        G: 7,
        H: 8,
        J: 1,
        K: 2,
        L: 3,
        M: 4,
        N: 5,
        P: 7,
        R: 9,
        S: 2,
        T: 3,
        U: 4,
        V: 5,
        W: 6,
        X: 7,
        Y: 8,
        Z: 9,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        0: 0
      }, g = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], h = 0, i = e.length, j = 0; i > j; j++)h += f[e.charAt(j) + ""] * g[j];
      var k = h % 11;
      return 10 === k && (k = "X"), k + "" === e.charAt(8)
    }
  }
}(jQuery), function (a) {
  FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
    en_US: {
      zipCode: {
        "default": "Please enter a valid postal code",
        country: "Please enter a valid postal code in %s",
        countries: {
          AT: "Austria",
          BG: "Bulgaria",
          BR: "Brazil",
          CA: "Canada",
          CH: "Switzerland",
          CZ: "Czech Republic",
          DE: "Germany",
          DK: "Denmark",
          ES: "Spain",
          FR: "France",
          GB: "United Kingdom",
          IE: "Ireland",
          IN: "India",
          IT: "Italy",
          MA: "Morocco",
          NL: "Netherlands",
          PL: "Poland",
          PT: "Portugal",
          RO: "Romania",
          RU: "Russia",
          SE: "Sweden",
          SG: "Singapore",
          SK: "Slovakia",
          US: "USA"
        }
      }
    }
  }), FormValidation.Validator.zipCode = {
    html5Attributes: {message: "message", country: "country"},
    COUNTRY_CODES: ["AT", "BG", "BR", "CA", "CH", "CZ", "DE", "DK", "ES", "FR", "GB", "IE", "IN", "IT", "MA", "NL", "PL", "PT", "RO", "RU", "SE", "SG", "SK", "US"],
    validate: function (b, c, d, e) {
      var f = b.getFieldValue(c, e);
      if ("" === f || !d.country)return !0;
      var g = b.getLocale(), h = d.country;
      if (("string" != typeof h || -1 === a.inArray(h, this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)), !h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES))return !0;
      var i = !1;
      switch (h = h.toUpperCase()) {
        case"AT":
          i = /^([1-9]{1})(\d{3})$/.test(f);
          break;
        case"BG":
          i = /^([1-9]{1}[0-9]{3})$/.test(a.trim(f));
          break;
        case"BR":
          i = /^(\d{2})([\.]?)(\d{3})([\-]?)(\d{3})$/.test(f);
          break;
        case"CA":
          i = /^(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|X|Y){1}[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}\s?[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}[0-9]{1}$/i.test(f);
          break;
        case"CH":
          i = /^([1-9]{1})(\d{3})$/.test(f);
          break;
        case"CZ":
          i = /^(\d{3})([ ]?)(\d{2})$/.test(f);
          break;
        case"DE":
          i = /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/.test(f);
          break;
        case"DK":
          i = /^(DK(-|\s)?)?\d{4}$/i.test(f);
          break;
        case"ES":
          i = /^(?:0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/.test(f);
          break;
        case"FR":
          i = /^[0-9]{5}$/i.test(f);
          break;
        case"GB":
          i = this._gb(f);
          break;
        case"IN":
          i = /^\d{3}\s?\d{3}$/.test(f);
          break;
        case"IE":
          i = /^(D6W|[ACDEFHKNPRTVWXY]\d{2})\s[0-9ACDEFHKNPRTVWXY]{4}$/.test(f);
          break;
        case"IT":
          i = /^(I-|IT-)?\d{5}$/i.test(f);
          break;
        case"MA":
          i = /^[1-9][0-9]{4}$/i.test(f);
          break;
        case"NL":
          i = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(f);
          break;
        case"PL":
          i = /^[0-9]{2}\-[0-9]{3}$/.test(f);
          break;
        case"PT":
          i = /^[1-9]\d{3}-\d{3}$/.test(f);
          break;
        case"RO":
          i = /^(0[1-8]{1}|[1-9]{1}[0-5]{1})?[0-9]{4}$/i.test(f);
          break;
        case"RU":
          i = /^[0-9]{6}$/i.test(f);
          break;
        case"SE":
          i = /^(S-)?\d{3}\s?\d{2}$/i.test(f);
          break;
        case"SG":
          i = /^([0][1-9]|[1-6][0-9]|[7]([0-3]|[5-9])|[8][0-2])(\d{4})$/i.test(f);
          break;
        case"SK":
          i = /^(\d{3})([ ]?)(\d{2})$/.test(f);
          break;
        case"US":
        default:
          i = /^\d{4,5}([\-]?\d{4})?$/.test(f)
      }
      return {
        valid: i,
        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].zipCode.country, FormValidation.I18n[g].zipCode.countries[h])
      }
    },
    _gb: function (a) {
      for (var b = "[ABCDEFGHIJKLMNOPRSTUWYZ]", c = "[ABCDEFGHKLMNOPQRSTUVWXY]", d = "[ABCDEFGHJKPMNRSTUVWXY]", e = "[ABEHMNPRVWXY]", f = "[ABDEFGHJLNPQRSTUWXYZ]", g = [new RegExp("^(" + b + "{1}" + c + "?[0-9]{1,2})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}[0-9]{1}" + d + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}" + c + "{1}?[0-9]{1}" + e + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(BF1)(\\s*)([0-6]{1}[ABDEFGHJLNPQRST]{1}[ABDEFGHJLNPQRSTUWZYZ]{1})$", "i"), /^(GIR)(\s*)(0AA)$/i, /^(BFPO)(\s*)([0-9]{1,4})$/i, /^(BFPO)(\s*)(c\/o\s*[0-9]{1,3})$/i, /^([A-Z]{4})(\s*)(1ZZ)$/i, /^(AI-2640)$/i], h = 0; h < g.length; h++)if (g[h].test(a))return !0;
      return !1
    }
  }
}(jQuery);;/**/
/*!
 * FormValidation (http://formvalidation.io)
 * The best jQuery plugin to validate form fields. Support Bootstrap, Foundation, Pure, SemanticUI, UIKit and custom frameworks
 *
 * @version     v0.7.1-dev, built on 2015-08-01 5:22:39 PM
 * @author      https://twitter.com/formvalidation
 * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
!function(a){FormValidation.Framework.Bootstrap=function(b,c,d){c=a.extend(!0,{button:{selector:'[type="submit"]:not([formnovalidate])',disabled:"disabled"},err:{clazz:"help-block",parent:"^(.*)col-(xs|sm|md|lg)-(offset-){0,1}[0-9]+(.*)$"},icon:{valid:null,invalid:null,validating:null,feedback:"form-control-feedback"},row:{selector:".form-group",valid:"has-success",invalid:"has-error",feedback:"has-feedback"}},c),FormValidation.Base.apply(this,[b,c,d])},FormValidation.Framework.Bootstrap.prototype=a.extend({},FormValidation.Base.prototype,{_fixIcon:function(a,b){var c=this._namespace,d=a.attr("type"),e=a.attr("data-"+c+"-field"),f=this.options.fields[e].row||this.options.row.selector,g=a.closest(f);if("checkbox"===d||"radio"===d){var h=a.parent();h.hasClass(d)?b.insertAfter(h):h.parent().hasClass(d)&&b.insertAfter(h.parent())}0===g.find("label").length&&b.addClass("fv-icon-no-label"),0!==g.find(".input-group").length&&b.addClass("fv-bootstrap-icon-input-group").insertAfter(g.find(".input-group").eq(0))},_createTooltip:function(a,b,c){var d=this._namespace,e=a.data(d+".icon");if(e)switch(c){case"popover":e.css({cursor:"pointer","pointer-events":"auto"}).popover("destroy").popover({container:"body",content:b,html:!0,placement:"auto top",trigger:"hover click"});break;case"tooltip":default:e.css({cursor:"pointer","pointer-events":"auto"}).tooltip("destroy").tooltip({container:"body",html:!0,placement:"auto top",title:b})}},_destroyTooltip:function(a,b){var c=this._namespace,d=a.data(c+".icon");if(d)switch(b){case"popover":d.css({cursor:"","pointer-events":"none"}).popover("destroy");break;case"tooltip":default:d.css({cursor:"","pointer-events":"none"}).tooltip("destroy")}},_hideTooltip:function(a,b){var c=this._namespace,d=a.data(c+".icon");if(d)switch(b){case"popover":d.popover("hide");break;case"tooltip":default:d.tooltip("hide")}},_showTooltip:function(a,b){var c=this._namespace,d=a.data(c+".icon");if(d)switch(b){case"popover":d.popover("show");break;case"tooltip":default:d.tooltip("show")}}}),a.fn.bootstrapValidator=function(b){var c=arguments;return this.each(function(){var d=a(this),e=d.data("formValidation")||d.data("bootstrapValidator"),f="object"==typeof b&&b;e||(e=new FormValidation.Framework.Bootstrap(this,a.extend({},{events:{formInit:"init.form.bv",formPreValidate:"prevalidate.form.bv",formError:"error.form.bv",formSuccess:"success.form.bv",fieldAdded:"added.field.bv",fieldRemoved:"removed.field.bv",fieldInit:"init.field.bv",fieldError:"error.field.bv",fieldSuccess:"success.field.bv",fieldStatus:"status.field.bv",localeChanged:"changed.locale.bv",validatorError:"error.validator.bv",validatorSuccess:"success.validator.bv"}},f),"bv"),d.addClass("fv-form-bootstrap").data("formValidation",e).data("bootstrapValidator",e)),"string"==typeof b&&e[b].apply(e,Array.prototype.slice.call(c,1))})},a.fn.bootstrapValidator.Constructor=FormValidation.Framework.Bootstrap}(jQuery);;/**/
