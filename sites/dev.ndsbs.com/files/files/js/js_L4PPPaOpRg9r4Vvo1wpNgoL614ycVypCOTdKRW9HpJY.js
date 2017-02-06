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

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

  /**
   * A progressbar object. Initialized with the given id. Must be inserted into
   * the DOM afterwards through progressBar.element.
   *
   * method is the function which will perform the HTTP request to get the
   * progress bar state. Either "GET" or "POST".
   *
   * e.g. pb = new progressBar('myProgressBar');
   *      some_element.appendChild(pb.element);
   */
  Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
    var pb = this;
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;

    // The WAI-ARIA setting aria-live="polite" will announce changes after users
    // have completed their current activity and not interrupt the screen reader.
    this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
    this.element.html('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 0">0%<span class="message"></span></div>');
  };

  /**
   * Set the percentage and status message for the progressbar.
   */
  Drupal.progressBar.prototype.setProgress = function (percentage, message) {
    if (percentage >= 0 && percentage <= 100) {
      $('div.progress-bar', this.element).css('width', percentage + '%');
      $('div.progress-bar', this.element).attr('aria-valuenow', percentage);
      $('div.progress-bar', this.element).html(percentage + '%');
    }
    $('div.progress-message', this.element).html(message);
    if (this.updateCallback) {
      this.updateCallback(percentage, message, this);
    }
  };

  /**
   * Start monitoring progress via Ajax.
   */
  Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
    this.delay = delay;
    this.uri = uri;
    this.sendPing();
  };

  /**
   * Stop monitoring progress via Ajax.
   */
  Drupal.progressBar.prototype.stopMonitoring = function () {
    clearTimeout(this.timer);
    // This allows monitoring to be stopped from within the callback.
    this.uri = null;
  };

  /**
   * Request progress data from server.
   */
  Drupal.progressBar.prototype.sendPing = function () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.uri) {
      var pb = this;
      // When doing a post request, you need non-null data. Otherwise a
      // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
      $.ajax({
        type: this.method,
        url: this.uri,
        data: '',
        dataType: 'json',
        success: function (progress) {
          // Display errors.
          if (progress.status == 0) {
            pb.displayError(progress.data);
            return;
          }
          // Update display.
          pb.setProgress(progress.percentage, progress.message);
          // Schedule next timer.
          pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
        },
        error: function (xmlhttp) {
          pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
        }
      });
    }
  };

  /**
   * Display errors on the page.
   */
  Drupal.progressBar.prototype.displayError = function (string) {
    var error = $('<div class="messages error"></div>').html(string);
    $(this.element).before(error).hide();

    if (this.errorCallback) {
      this.errorCallback(this);
    }
  };

})(jQuery);
;
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
/**
 * @file
 * Provides JavaScript additions to the managed file field type.
 *
 * This file provides progress bar support (if available), popup windows for
 * file previews, and disabling of other file fields during Ajax uploads (which
 * prevents separate file fields from accidentally uploading files).
 */

(function ($) {

/**
 * Attach behaviors to managed file element upload fields.
 */
Drupal.behaviors.fileValidateAutoAttach = {
  attach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        var extensions = settings.file.elements[selector];
        $(selector, context).bind('change', {extensions: extensions}, Drupal.file.validateExtension);
      });
    }
  },
  detach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        $(selector, context).unbind('change', Drupal.file.validateExtension);
      });
    }
  }
};

/**
 * Attach behaviors to the file upload and remove buttons.
 */
Drupal.behaviors.fileButtons = {
  attach: function (context) {
    $('input.form-submit', context).bind('mousedown', Drupal.file.disableFields);
    $('div.form-managed-file input.form-submit', context).bind('mousedown', Drupal.file.progressBar);
  },
  detach: function (context) {
    $('input.form-submit', context).unbind('mousedown', Drupal.file.disableFields);
    $('div.form-managed-file input.form-submit', context).unbind('mousedown', Drupal.file.progressBar);
  }
};

/**
 * Attach behaviors to links within managed file elements.
 */
Drupal.behaviors.filePreviewLinks = {
  attach: function (context) {
    $('div.form-managed-file .file a, .file-widget .file a', context).bind('click',Drupal.file.openInNewWindow);
  },
  detach: function (context){
    $('div.form-managed-file .file a, .file-widget .file a', context).unbind('click', Drupal.file.openInNewWindow);
  }
};

/**
 * File upload utility functions.
 */
Drupal.file = Drupal.file || {
  /**
   * Client-side file input validation of file extensions.
   */
  validateExtension: function (event) {
    // Remove any previous errors.
    $('.file-upload-js-error').remove();

    // Add client side validation for the input[type=file].
    var extensionPattern = event.data.extensions.replace(/,\s*/g, '|');
    if (extensionPattern.length > 1 && this.value.length > 0) {
      var acceptableMatch = new RegExp('\\.(' + extensionPattern + ')$', 'gi');
      if (!acceptableMatch.test(this.value)) {
        var error = Drupal.t("The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.", {
          // According to the specifications of HTML5, a file upload control
          // should not reveal the real local path to the file that a user
          // has selected. Some web browsers implement this restriction by
          // replacing the local path with "C:\fakepath\", which can cause
          // confusion by leaving the user thinking perhaps Drupal could not
          // find the file because it messed up the file path. To avoid this
          // confusion, therefore, we strip out the bogus fakepath string.
          '%filename': this.value.replace('C:\\fakepath\\', ''),
          '%extensions': extensionPattern.replace(/\|/g, ', ')
        });
        $(this).closest('div.form-managed-file').prepend('<div class="messages error file-upload-js-error" aria-live="polite">' + error + '</div>');
        this.value = '';
        return false;
      }
    }
  },
  /**
   * Prevent file uploads when using buttons not intended to upload.
   */
  disableFields: function (event){
    var clickedButton = this;

    // Only disable upload fields for Ajax buttons.
    if (!$(clickedButton).hasClass('ajax-processed')) {
      return;
    }

    // Check if we're working with an "Upload" button.
    var $enabledFields = [];
    if ($(this).closest('div.form-managed-file').length > 0) {
      $enabledFields = $(this).closest('div.form-managed-file').find('input.form-file');
    }

    // Temporarily disable upload fields other than the one we're currently
    // working with. Filter out fields that are already disabled so that they
    // do not get enabled when we re-enable these fields at the end of behavior
    // processing. Re-enable in a setTimeout set to a relatively short amount
    // of time (1 second). All the other mousedown handlers (like Drupal's Ajax
    // behaviors) are excuted before any timeout functions are called, so we
    // don't have to worry about the fields being re-enabled too soon.
    // @todo If the previous sentence is true, why not set the timeout to 0?
    var $fieldsToTemporarilyDisable = $('div.form-managed-file input.form-file').not($enabledFields).not(':disabled');
    $fieldsToTemporarilyDisable.attr('disabled', 'disabled');
    setTimeout(function (){
      $fieldsToTemporarilyDisable.attr('disabled', false);
    }, 1000);
  },
  /**
   * Add progress bar support if possible.
   */
  progressBar: function (event) {
    var clickedButton = this;
    var $progressId = $(clickedButton).closest('div.form-managed-file').find('input.file-progress');
    if ($progressId.length) {
      var originalName = $progressId.attr('name');

      // Replace the name with the required identifier.
      $progressId.attr('name', originalName.match(/APC_UPLOAD_PROGRESS|UPLOAD_IDENTIFIER/)[0]);

      // Restore the original name after the upload begins.
      setTimeout(function () {
        $progressId.attr('name', originalName);
      }, 1000);
    }
    // Show the progress bar if the upload takes longer than half a second.
    setTimeout(function () {
      $(clickedButton).closest('div.form-managed-file').find('div.ajax-progress-bar').slideDown();
    }, 500);
  },
  /**
   * Open links to files within forms in a new window.
   */
  openInNewWindow: function (event) {
    $(this).attr('target', '_blank');
    window.open(this.href, 'filePreview', 'toolbar=0,scrollbars=1,location=1,statusbar=1,menubar=0,resizable=1,width=500,height=550');
    return false;
  }
};

})(jQuery);
;
