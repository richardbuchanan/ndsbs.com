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
});