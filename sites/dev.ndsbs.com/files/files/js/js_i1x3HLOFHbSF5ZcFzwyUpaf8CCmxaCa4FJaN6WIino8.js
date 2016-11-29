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
