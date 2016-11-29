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

;
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
  9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};b.jMaskGlobals=b.jMaskGlobals||{};p=b.jMaskGlobals=b.extend(!0,{},p,b.jMaskGlobals);p.dataMask&&b.applyDataMask();setInterval(function(){b.jMaskGlobals.watchDataMask&&b.applyDataMask()},p.watchInterval)});;
(function ($) {

  Drupal.behaviors.captcha = {
    attach: function (context) {

      // Turn off autocompletion for the CAPTCHA response field.
      // We do it here with Javascript (instead of directly in the markup)
      // because this autocomplete attribute is not standard and
      // it would break (X)HTML compliance.
      $("#edit-captcha-response").attr("autocomplete", "off");

    }
  };

  Drupal.behaviors.captchaAdmin = {
    attach: function (context) {
      // Add onclick handler to checkbox for adding a CAPTCHA description
      // so that the textfields for the CAPTCHA description are hidden
      // when no description should be added.
      // @todo: div.form-item-captcha-description depends on theming, maybe
      // it's better to add our own wrapper with id (instead of a class).
      $("#edit-captcha-add-captcha-description").click(function() {
        if ($("#edit-captcha-add-captcha-description").is(":checked")) {
          // Show the CAPTCHA description textfield(s).
          $("div.form-item-captcha-description").show('slow');
        }
        else {
          // Hide the CAPTCHA description textfield(s).
          $("div.form-item-captcha-description").hide('slow');
        }
      });
      // Hide the CAPTCHA description textfields if option is disabled on page load.
      if (!$("#edit-captcha-add-captcha-description").is(":checked")) {
        $("div.form-item-captcha-description").hide();
      }
    }

  };

})(jQuery);
;
(function ($) {

/**
 * Attach handlers to evaluate the strength of any password fields and to check
 * that its confirmation is correct.
 */
Drupal.behaviors.password = {
  attach: function (context, settings) {
    var translate = settings.password;
    $('input.password-field', context).once('password', function () {
      var passwordInput = $(this);
      var innerWrapper = $(this).parent();
      var outerWrapper = $(this).parent().parent();

      // Add identifying class to password element parent.
      innerWrapper.addClass('password-parent');

      // Add the password confirmation layer.
      $('input.password-confirm', outerWrapper).parent().prepend('<div class="password-confirm">' + translate['confirmTitle'] + ' <span></span></div>').addClass('confirm-parent');
      var confirmInput = $('input.password-confirm', outerWrapper);
      var confirmResult = $('div.password-confirm', outerWrapper);
      var confirmChild = $('span', confirmResult);

      // Add the description box.
      var passwordMeter = '<div class="password-strength"><div class="password-strength-text" aria-live="assertive"></div><div class="password-strength-title">' + translate['strengthTitle'] + '</div><div class="password-indicator"><div class="indicator"></div></div></div>';
      $(confirmInput).parent().after('<div class="password-suggestions description"></div>');
      $(innerWrapper).prepend(passwordMeter);
      var passwordDescription = $('div.password-suggestions', outerWrapper).hide();

      // Check the password strength.
      var passwordCheck = function () {

        // Evaluate the password strength.
        var result = Drupal.evaluatePasswordStrength(passwordInput.val(), settings.password);

        // Update the suggestions for how to improve the password.
        if (passwordDescription.html() != result.message) {
          passwordDescription.html(result.message);
        }

        // Only show the description box if there is a weakness in the password.
        if (result.strength == 100) {
          passwordDescription.hide();
        }
        else {
          passwordDescription.show();
        }

        // Adjust the length of the strength indicator.
        var resultClass = result.indicatorText.toLowerCase();
        $(innerWrapper).find('.indicator').css('width', result.strength + '%');
        $(innerWrapper).find('.indicator').attr('class', 'indicator');
        $(innerWrapper).find('.indicator').addClass(resultClass);

        // Update the strength indication text.
        $(innerWrapper).find('.password-strength-text').html(result.indicatorText);

        passwordCheckMatch();
      };

      // Check that password and confirmation inputs match.
      var passwordCheckMatch = function () {

        if (confirmInput.val()) {
          var success = passwordInput.val() === confirmInput.val();

          // Show the confirm result.
          confirmResult.css({ visibility: 'visible' });

          // Remove the previous styling if any exists.
          if (this.confirmClass) {
            confirmChild.removeClass(this.confirmClass);
          }

          // Fill in the success message and set the class accordingly.
          var confirmClass = success ? 'ok' : 'error';
          confirmChild.html(translate['confirm' + (success ? 'Success' : 'Failure')]).addClass(confirmClass);
          this.confirmClass = confirmClass;
        }
        else {
          confirmResult.css({ visibility: 'hidden' });
        }
      };

      // Monitor keyup and blur events.
      // Blur must be used because a mouse paste does not trigger keyup.
      passwordInput.keyup(passwordCheck).focus(passwordCheck).blur(passwordCheck);
      confirmInput.keyup(passwordCheckMatch).blur(passwordCheckMatch);
    });
  }
};

/**
 * Evaluate the strength of a user's password.
 *
 * Returns the estimated strength and the relevant output message.
 */
Drupal.evaluatePasswordStrength = function (password, translate) {
  var weaknesses = 0, strength = 100, msg = [];

  var hasLowercase = /[a-z]+/.test(password);
  var hasUppercase = /[A-Z]+/.test(password);
  var hasNumbers = /[0-9]+/.test(password);
  var hasPunctuation = /[^a-zA-Z0-9]+/.test(password);

  // If there is a username edit box on the page, compare password to that, otherwise
  // use value from the database.
  var usernameBox = $('input.username');
  var username = (usernameBox.length > 0) ? usernameBox.val() : translate.username;

  // Lose 5 points for every character less than 6, plus a 30 point penalty.
  if (password.length < 6) {
    msg.push(translate.tooShort);
    strength -= ((6 - password.length) * 5) + 30;
  }

  // Count weaknesses.
  if (!hasLowercase) {
    msg.push(translate.addLowerCase);
    weaknesses++;
  }
  if (!hasUppercase) {
    msg.push(translate.addUpperCase);
    weaknesses++;
  }
  if (!hasNumbers) {
    msg.push(translate.addNumbers);
    weaknesses++;
  }
  if (!hasPunctuation) {
    msg.push(translate.addPunctuation);
    weaknesses++;
  }

  // Apply penalty for each weakness (balanced against length penalty).
  switch (weaknesses) {
    case 1:
      strength -= 12.5;
      break;

    case 2:
      strength -= 25;
      break;

    case 3:
      strength -= 40;
      break;

    case 4:
      strength -= 40;
      break;
  }

  // Check if password is the same as the username.
  if (password !== '' && password.toLowerCase() === username.toLowerCase()) {
    msg.push(translate.sameAsUsername);
    // Passwords the same as username are always very weak.
    strength = 5;
  }

  // Based on the strength, work out what text should be shown by the password strength meter.
  if (strength < 60) {
    indicatorText = translate.weak;
  } else if (strength < 70) {
    indicatorText = translate.fair;
  } else if (strength < 80) {
    indicatorText = translate.good;
  } else if (strength <= 100) {
    indicatorText = translate.strong;
  }

  // Assemble the final message.
  msg = translate.hasWeaknesses + '<ul><li>' + msg.join('</li><li>') + '</li></ul>';
  return { strength: strength, message: msg, indicatorText: indicatorText };

};

/**
 * Field instance settings screen: force the 'Display on registration form'
 * checkbox checked whenever 'Required' is checked.
 */
Drupal.behaviors.fieldUserRegistration = {
  attach: function (context, settings) {
    var $checkbox = $('form#field-ui-field-edit-form input#edit-instance-settings-user-register-form');

    if ($checkbox.length) {
      $('input#edit-instance-required', context).once('user-register-form-checkbox', function () {
        $(this).bind('change', function (e) {
          if ($(this).attr('checked')) {
            $checkbox.attr('checked', true);
          }
        });
      });

    }
  }
};

})(jQuery);
;
/**
 * This script is based on the javascript code of Roman Feldblum
 * (web.developer@programmer.net)
 *
 * Original script: http://javascript.internet.com/forms/format-phone-number.html
 * Original script is revised by Eralper Yilmaz (http://www.eralper.com)
 *
 * Revised script: http://www.kodyaz.com/articles/javascript-phone-format-phone-number-format.aspx
 * Format : "(123) 456-7890"
 */

var zChar = [' ', '(', ')', '-', '.'];
var maxphonelength = 14;
var phonevalue1;
var phonevalue2;
var cursorposition;

function ParseForNumber1(object){
  phonevalue1 = ParseChar(object.value, zChar);
}

function ParseForNumber2(object){
  phonevalue2 = ParseChar(object.value, zChar);
}

function backspacerUP(object,e) {
  if(e){
    e = e
  } else {
    e = window.event
  }
  if(e.which){
    var keycode = e.which
  } else {
    var keycode = e.keyCode
  }

  ParseForNumber1(object);

  if(keycode >= 48){
    ValidatePhone(object)
  }
}

function backspacerDOWN(object,e) {
  if(e){
    e = e
  } else {
    e = window.event
  }
  if(e.which){
    var keycode = e.which
  } else {
    var keycode = e.keyCode
  }
  ParseForNumber2(object)
}

function GetCursorPosition(){

  var t1 = phonevalue1;
  var t2 = phonevalue2;
  var bool = false;
  for (i=0; i<t1.length; i++)
  {
    if (t1.substring(i,1) != t2.substring(i,1)) {
      if(!bool) {
        cursorposition=i;
        window.status=cursorposition;
        bool=true
      }
    }
  }
}

function ValidatePhone(object){

  var p = phonevalue1;

  p = p.replace(/[^\d]*/gi,"");

  if (p.length < 3) {
    object.value=p
  } else if(p.length==3){
    pp=p;
    d4=p.indexOf('(');
    d5=p.indexOf(')');
    if(d4==-1){
      pp="("+pp;
    }
    if(d5==-1){
      pp=pp+")";
    }
    object.value = pp;
  } else if(p.length>3 && p.length < 7){
    p ="(" + p;
    l30=p.length;
    p30=p.substring(0,4);
    p30=p30+") ";

    p31=p.substring(4,l30);
    pp=p30+p31;

    object.value = pp;

  } else if(p.length >= 7){
    p ="(" + p;
    l30=p.length;
    p30=p.substring(0,4);
    p30=p30+") ";

    p31=p.substring(4,l30);
    pp=p30+p31;

    l40 = pp.length;
    p40 = pp.substring(0,9);
    p40 = p40 + "-";

    p41 = pp.substring(9,l40);
    ppp = p40 + p41;

    object.value = ppp.substring(0, maxphonelength);
  }

  GetCursorPosition();

  if(cursorposition >= 0){
    if (cursorposition == 0) {
      cursorposition = 2
    } else if (cursorposition <= 2) {
      cursorposition = cursorposition + 1
    } else if (cursorposition <= 4) {
      cursorposition = cursorposition + 3
    } else if (cursorposition == 5) {
      cursorposition = cursorposition + 3
    } else if (cursorposition == 6) {
      cursorposition = cursorposition + 3
    } else if (cursorposition == 7) {
      cursorposition = cursorposition + 4
    } else if (cursorposition == 8) {
      cursorposition = cursorposition + 4;
      e1=object.value.indexOf(')');
      e2=object.value.indexOf('-');
      if (e1>-1 && e2>-1){
        if (e2-e1 == 4) {
          cursorposition = cursorposition - 1
        }
      }
    } else if (cursorposition == 9) {
      cursorposition = cursorposition + 4
    } else if (cursorposition < 11) {
      cursorposition = cursorposition + 3
    } else if (cursorposition == 11) {
      cursorposition = cursorposition + 1
    } else if (cursorposition == 12) {
      cursorposition = cursorposition + 1
    } else if (cursorposition >= 13) {
      cursorposition = cursorposition
    }
  }

}

function ParseChar(sStr, sChar)
{

  if (sChar.length == null)
  {
    zChar = new Array(sChar);
  }
  else zChar = sChar;

  for (i=0; i<zChar.length; i++)
  {
    sNewStr = "";

    var iStart = 0;
    var iEnd = sStr.indexOf(sChar[i]);

    while (iEnd != -1)
    {
      sNewStr += sStr.substring(iStart, iEnd);
      iStart = iEnd + 1;
      iEnd = sStr.indexOf(sChar[i], iStart);
    }
    sNewStr += sStr.substring(sStr.lastIndexOf(sChar[i]) + 1, sStr.length);

    sStr = sNewStr;
  }

  return sNewStr;
}

jQuery(document).ready(function ($) {
  $('#user-profile-form').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      'field_phone[und][0][value]': {
        row: '.form-item-field-phone-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your phone number.'
          },
          stringLength: {
            min: '14',
            max: '14',
            message: 'Please enter all digits of your telephone number.'
          }
        }
      },
      'field_second_phone[und][0][value]': {
        enabled: false
      }
    }
  });

  document.getElementById('edit-field-phone-und-0-value').addEventListener('blur', function (e) {
    var x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
    e.target.value = '(' + x[1] + ') ' + x[2] + '-' + x[3];
    $(this).parent('.form-item').removeClass('has-error').addClass('has-success');
    $(this).next('.form-control-feedback').removeClass('glyphicon-remove').addClass('glyphicon-ok');
    $(this).siblings('[data-fv-result="INVALID"]').hide();
  });
});;
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
;
jQuery(document).ready(function ($) {
  var year = $('#edit-field-year-und');

  //$('#edit-field-gender-und').find('[value="_none"]').attr('value', '').text('- Select your gender -');
  $('#edit-field-month-und').find('[value="_none"]').attr('value', '').text('- Month -');
  $('#edit-field-dobdate-und').find('[value="_none"]').attr('value', '').text('- Day -');
  year.find('[value="_none"]').attr('value', '').text('- Year -');
  $('#edit-field-state-und').find('[value="_none"]').attr('value', '').text('- State -');
  $('#edit-field-zip-und-0-value').attr('maxlength', '5');

  //$('#edit-field-middle-name-und-0-value').val('Middle Name');
  $('#edit-field-first-name-und-0-value').attr('value', '');
  $('#edit-field-last-name-und-0-value').attr('value', '');
  $('#edit-field-state-und-0-value').attr('value', '');

  //  Date of birth calculation called
  year.unbind('change').bind("change", function () {
    var date_user = $('#edit-field-dobdate-und').val();
    var month_user = $('#edit-field-month-und').val();
    var year_user = $('#edit-field-year-und').val();
    var user_age = getAge(month_user + '/' + date_user + '/' + year_user);

    if ((date_user && month_user && year_user) && user_age > 0) {
      $('#user-dob').show().html('Your are ' + user_age + ' years old.');
    }
    else {
      $('#user-dob').hide();
    }
  });

  $('#edit-submit').attr('disabled', 'disabled').after('<small class="help-block edit-submit-help" style="display: none; clear: both;">WARNING: You must agree to the Terms of Use to continue.</small>');
  //$('#edit-submit').attr('disabled', 'disabled').after('<br><br><p class="help-block edit-submit-help" style="display: none;">WARNING: You must agree to the Terms of Use to continue.</p>');
  $('[value="I do not agree with NDSBS Terms of Use"]').prop('checked', true);
  $('.edit-submit-help').show();
  var required = $('.required');

  // Terms of use acceptance.
  $('.field-name-field-terms-of-use .radio input[name="field_terms_of_use[und]"]').click(function() {
    if ($(this).attr('value') == 'I agree with NDSBS Terms of Use') {
      required.each(function() {
        if ($(this).val()) {
          $('.edit-submit-help').hide();
          $('#edit-submit').removeAttr('disabled');
        }
      });
    }
    else {
      $('.edit-submit-help').show();
      $('#edit-submit').attr('disabled', '');
    }
  });

  // Reason for assessment.
  var checkedOne = false;
  var checkedTwo = false;
  var checkedThree = false;

  $('#edit-field-reason-for-assessment-und-0').change(function() {
    checkedOne = this.checked ? true : false;
    forCourts(checkedOne, checkedTwo, checkedThree);
  });
  $('#edit-field-reason-for-assessment-und-1').change(function() {
    checkedTwo = this.checked ? true : false;
    forCourts(checkedOne, checkedTwo, checkedThree);
  });
  $('#edit-field-reason-for-assessment-und-2').change(function() {
    checkedThree = this.checked ? true : false;
    forCourts(checkedOne, checkedTwo, checkedThree);
  });

  // Enable for courts.
  function forCourts(first, second, third) {
    var forCourts = $('.field-name-field-for-courts');
    if (first || second || third) {
      forCourts.show();
    }
    else {
      forCourts.hide();
    }
  }

  // Form validation.
  $('#user-register-form').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      'field_first_name[und][0][value]': {
        row: '.form-item-field-first-name-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your first name.'
          }
        }
      },
      'field_last_name[und][0][value]': {
        row: '.form-item-field-last-name-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your last name.'
          }
        }
      },
      'mail': {
        validators: {
          notEmpty: {
            message: 'Please enter your email address.'
          },
          emailAddress: {
            message: 'Please enter a valid email address.'
          }
        }
      },
      'conf_mail': {
        validators: {
          notEmpty: {
            message: 'Please confirm your email address.'
          },
          emailAddress: {
            message: 'Please enter a valid email address.'
          }
        }
      },
      'pass[pass1]': {
        enabled: false
      },
      'pass[pass2]': {
        enabled: false
      },
      'field_month[und]': {
        row: '.form-item-field-month-und',
        validators: {
          notEmpty: {
            message: 'Select a month.'
          }
        }
      },
      'field_dobdate[und]': {
        row: '.form-item-field-dobdate-und',
        validators: {
          notEmpty: {
            message: 'Select a day.'
          }
        }
      },
      'field_year[und]': {
        row: '.form-item-field-year-und',
        validators: {
          notEmpty: {
            message: 'Select a year.'
          }
        }
      },
      'field_address[und][0][value]': {
        row: '.form-item-field-address-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your street.'
          }
        }
      },
      'field_city[und][0][value]': {
        row: '.form-item-field-city-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your city.'
          }
        }
      },
      'field_state[und]': {
        row: '.form-item-field-state-und',
        validators: {
          notEmpty: {
            message: 'Please select your state.'
          }
        }
      },
      'field_zip[und][0][value]': {
        row: '.form-item-field-zip-und-0-value',
        validators: {
          notEmpty: {
            message: 'Please enter your zip code.'
          },
          stringLength: {
            min: '5',
            max: '5',
            message: 'Please enter a valid zip code.'
          },
          integer: {
            message: 'A zip code can only contain numbers.',
            thousandsSeparator: '',
            decimalSeparator: ''
          }
        }
      },
      'field_referred_by[und]': {
        enabled: false
      },
      'field_reason_for_assessment[und][0]': {
        enabled: false
      },
      'field_reason_for_assessment[und][1]': {
        enabled: false
      },
      'field_reason_for_assessment[und][2]': {
        enabled: false
      },
      'field_reason_for_assessment[und][3]': {
        enabled: false
      },
      'field_reason_for_assessment[und][4]': {
        enabled: false
      },
      'field_reason_for_assessment[und][5]': {
        enabled: false
      },
      'field_reason_for_assessment[und][6]': {
        enabled: false
      },
      'field_phone[und][0][value]': {
        enabled: false
      },
      'field_second_phone[und][0][value]': {
        enabled: false
      }
    }
  });
});


//  Function defined to calculate the age of the Client
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
