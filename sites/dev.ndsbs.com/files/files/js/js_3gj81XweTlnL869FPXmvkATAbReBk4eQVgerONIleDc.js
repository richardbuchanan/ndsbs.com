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
