
// Our global is FB_JS, not "FB" to avoid conflict with Facebook's JS SDK.
FB_JS = function(){};
// Client-side session info from cookie.
FB_JS.session = {};
FB_JS.fbu = null;

FB_JS.reloadParams = {}; // Pass data to drupal when reloading
FB_JS.fb_token_invalid = false; // Semaphore see tokenInvalidHandler.

// Semaphores prevent us from processing events more than once.
FB_JS.semaphores = {};

/**
 * Drupal behaviors hook.
 *
 * Called when page is loaded, or content added via javascript.
 */
(function ($) {
  Drupal.behaviors.fb = {
    attach : function(context, settings) {
      // In some cases the page contains elements to be shown only after new permissions are granted.  See new token handler.
      jQuery('.fb_has_permission', context).hide();
      jQuery('.fb_needs_permission', context).show();

      // Code in this clause is once per page.
      $('body:not(.fb_processed)', context).each(function() {
        $(this).addClass('fb_processed');

        // JQuery pseudo-events we are interested in.
        jQuery(document).bind('fb_new_token', FB_JS.newTokenHandler);
        jQuery(document).bind('fb_token_invalid', FB_JS.tokenInvalidHandler);

        // Session may have our tokens.
        var sess_cookie = jQuery.cookie('fb_js_session');
        if (sess_cookie) {
          FB_JS.session = jQuery.parseJSON(sess_cookie);
        }

        if (Drupal.settings.fb.client_id) {
          var app_settings = FB_JS.getAppSettings(Drupal.settings.fb.client_id);
          if (app_settings.access_token === 0) {
            // Server thinks this user is logged out.  Let's make sure our javascript session agrees.
            if (FB_JS.session[Drupal.settings.fb.client_id]) {
              delete FB_JS.session[Drupal.settings.fb.client_id];
              FB_JS.setCookie('fb_js_session', JSON.stringify(FB_JS.session));
            }
          }
          else if (app_settings.access_token) {
            // Server thinks user is logged in.  Make sure javascript thinks the same.
            FB_JS.session[Drupal.settings.fb.client_id] = {
              access_token: app_settings.access_token,
              client_id: Drupal.settings.fb.client_id
            };
          }
        }

        // If hash contains access_token=..., it is part of facebook's client-side authentication protocol.
        var hash = window.location.hash;
        if (hash) {

          // Parse access_token and, sometimes, expires_in.
          var vars = FB_JS.parseVars(hash.slice(1)); // Slice off '#'

          if (vars.access_token) {
            // Calling graph() confirms token is valid.
            // @todo: implement graph batch and get both 'me' and 'app'.
            // @todo: avoid repeating this call when page is refreshed.
            FB_JS.graphBatch(['me', 'app'], {
              data: {access_token: vars.access_token},
              success: function(gdata) {
                //debugger;
                // Compile data for fb_new_token event.  Must be object not array for trigger().
                var data = {};
                //data.app = gdata['app'];
                //data.me = gdata['me'];
                jQuery.extend(data, gdata); // app and me
                data.context = context;
                jQuery.extend(data, vars); // access_token and expires_in
                jQuery.event.trigger('fb_new_token', data);
              },
              error: function(edata) {
                if (!edata) {
                  // edata is null when a plugin blocks access to facebook.com.
                  console.warn('Unable to query facebook graph.  Blocked by browser plugin?');
                  // Possibly the token is valid, and we can let the server know about it.
                  var data = {};
                  jQuery.extend(data, vars); // access_token and expires_in
                  jQuery.event.trigger('fb_new_token', data);
                }
                else {
                  console.warn('Access token not valid (' + vars.access_token + '). ' + edata.error.message);
                }
                jQuery.event.trigger('fb_devel', edata);
              }
            });
          }
        }
        else {
          // Test the current session token.  This detects if a user has logged out of facebook.
          // TODO: control whether this test runs on every page.  Better to test less frequently.
          if (FB_JS.session[Drupal.settings.fb.client_id]) {
            token = FB_JS.session[Drupal.settings.fb.client_id].access_token;
            if (token && token != 'null') { // @todo figure out how 'null' gets in there!
              FB_JS.graph({
                path: 'me',
                data: {access_token: token},
                success: function (gdata) {
                  //debugger;
                },
                error: function(edata) {
                  debugger;
                  // We don't actually need to act here. FB_JS.graph will handle an invalid token.
                }
              });
            }
          }
        }

        // Trigger an event, so third parties may act after we've sorted our settings and token.
        jQuery.event.trigger('fb_js_init', Drupal.settings.fb); // Not to be confused with fb_init event.
      }); // End once per page clause.

      // Page elements may change depending on whether user is currently connected.
      FB_JS.doGraphReplace(context);
      FB_JS.doReplace(context);
      FB_JS.doShowHide(context);

    }
  };

})(jQuery);


/**
 * Convenient way to to test whether user is currently connected.
 */
FB_JS.connected = function(client_id) {
  client_id = client_id || Drupal.settings.fb.client_id;
  if (FB_JS.session[client_id] && FB_JS.session[client_id].access_token) {
    return true;
  }
  return false;
}

/**
 * Calculate the connect status and show/hide portions of the page.
 *
 * TODO: enhance this to cover apps other than primary.
 */
FB_JS.doShowHide = function(context) {
  if (Drupal.settings.fb.client_id) {
    if (FB_JS.session[Drupal.settings.fb.client_id]) {
      jQuery('.fb_not_connected', context).hide();
      jQuery('.fb_connected', context).show();
      jQuery('input.fb_connect_required', context).attr('disabled', false).show();
    }
    else {
      jQuery('.fb_not_connected', context).show();
      jQuery('.fb_connected', context).hide();
      jQuery('input.fb_connect_required', context).attr('disabled', true).show();
    }
  }
};

/**
 * Where markup has data-fbu attributes, we replace with data learned from facebook graph.*/
FB_JS.doGraphReplace = function(context) {
  // First all the things we need to query.
  var fbus = [];
  var added = {};

  jQuery('[data-fbu]').each(function() {
    var fbu = jQuery(this).attr('data-fbu');
    if (added.hasOwnProperty(fbu)) {
      // Already added.
    }
    else {
      fbus.push(fbu);
      added[fbu] = 1;
    }
  });

  // Here, we would like to do a batch get of all fbus.
  // But batch requires an access token we may not have.
  // TODO: use batch when user token is known.

  for (var i = 0; i < fbus.length; i++) {
    var fbu = fbus[i];
    // Call graph for each user we need to know about.
    // A single call to graph does not require a token, unlike batch.
    // May return less data than a query with a token, but will return a name in most cases.
    FB_JS.graph({
      path: fbu,
      success: function(gdata) {
        if (gdata.name) {
          jQuery(".username[data-fbu='" + gdata.id + "']").html(gdata.name);
        }
      },
      error: function(edata) {
        debugger;
      }
    });
  }
  return; // batch code below not yet working.

  var fba = Drupal.settings.fb.client_id;

  FB_JS.graphBatch(fbus, {
    data: {
      // TODO access token
    },
    success : function(gdata) {
      debugger;
    },
    error : function(edata) {
      debugger;
    }
  });
};


FB_JS.doReplace = function(context) {
  if (Drupal.settings.fb.client_id) {
    var fba = Drupal.settings.fb.client_id;
    if (FB_JS.session[fba]) {
      if (!FB_JS.session[fba].fbu && FB_JS.session[fba].access_token) {
        // Get graph data for current user, then re-run doReplace.
        FB_JS.graph({
          path: 'me',
          data: {
            access_token : FB_JS.session[fba].access_token
          },
          success: function(gdata) {
            FB_JS.session[fba].name = gdata.name
            FB_JS.session[fba].fbu = gdata.id;
            FB_JS.setCookie('fb_js_session', JSON.stringify(FB_JS.session));
            FB_JS.doReplace(context);
          }
        });
      }
      else {
        // Erase previous substitutions, if any.
        jQuery('.fb_replace_processed', context).remove();

        // TODO: we only handle the primary app here.  Should inspect markup for data-fba attribute.

        // Substitute our tokens.
        jQuery('.fb_replace', context).each(function(i, e) {
          var markup = jQuery(this).html();
          var replaced = markup.replace(/(![a-z]+)/g, function(s, key) {
            return FB_JS.session[fba][key.slice(1)] || s;
          });

          // Because markup may be broken prior to replacement, it may be commented out with <!--- ... --->
          replaced = replaced.replace(/<!---([^-])/g, '$1').replace(/([^-])--->/g, '$1');

          // Append the replacement after the original.  Leave original in place in case of future replacements.
          jQuery(this).after(jQuery(this).clone().removeClass('fb_replace').addClass('fb_replace_processed').html(replaced)).hide();
        });
        jQuery('.fb_replace_processed', context).show();
      }
    }
  }
};


FB_JS.graph = function(options_in) {
  // Smart default access token only if not passed in.
  var options = options_in;
  if (Drupal.settings.fb.client_id && FB_JS.session[Drupal.settings.fb.client_id]) {
    var default_token = FB_JS.session[Drupal.settings.fb.client_id].access_token;

    // Insert access token, if it is not passed in to us.
    options = jQuery.extend(true, {
      data: {access_token: default_token}
    }, options_in);
  }

  //@todo implement local cache, avoid multiple queries to 'me'

  if (options.data && options.data.access_token == 'null') { // debug
    // Trying to track this down.
    debugger;
    options.data.access_token = 0;
  }

  jQuery.ajax({
    url: 'https://graph.facebook.com/' + options.path,
    data: options.data,
    type: options.type,
    dataType: 'json',
    success: function(gdata, textStatus, XMLHttpRequest) {
      // TODO: parse response
      options.success(gdata);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Unexpected error (i.e. ajax did not return json-encoded data).
      var headers = jqXHR.getAllResponseHeaders(); // debug info.
      var responseText = jqXHR.responseText; // debug info.
      var edata = jQuery.parseJSON(responseText);

      // Error callback.
      if (options.error) {
        options.error(edata);
      }

      if (!edata) {
        // Probably a browser plugin has prevented us from accessing facebook graph.
        console.warn('Unable to query facebook graph.  Blocked by browser plugin?');
      }
      // if edata.error.code == 190, token has expired and should be removed from session.  Possible page reload.
      else if (edata.error.code == 190) {
        // invalid token handler will update session and notify drupal.
        jQuery.event.trigger('fb_token_invalid', options.data);
      }
    }
  });
};

FB_JS.fql = function(q, options0) {
  var options = jQuery.extend(true, {
    path: 'fql',
    data: {q: q}
  }, options0);

  FB_JS.graph(options);
};

/**
 * Helper for simplest type of batch graph operation.  An array of GET requests.
 * Results are extracted into an array indexed by graph path.
 */
FB_JS.graphBatch = function(paths, options) {
  var batch = [];
  var i = 0;
  for (var index in paths) {
    batch[i++] = {method:'GET', relative_url:paths[index]};
  }
  var data = options.data; // Typically only access token.

  data.batch = JSON.stringify(batch);

  // Use graph(), as it handles expired tokens and data parsing.
  FB_JS.graph({
    path: '',
    data: data,
    type: 'POST', // Always POST for batch.
    success: function(gdata) {
      // Parse encoded batch responses.
      var results = [];
      for (var index in gdata) {
        if (gdata[index].code == 200) {
          results[paths[index]] = jQuery.parseJSON(gdata[index].body);
        }
      }
      if (options.success) {
        options.success(results, gdata);
      }
    },
    error: function(edata) {
      if (options.error) {
        options.error(edata);
      }
    }
  });
};

/**
 * Returns ours settings specific to a particular app, by fba (a.k.a. client_id).
 */
FB_JS.getAppSettings = function(fba) {
  var key = 'fb_app_' + fba; // Same as used in fb_init().
  var settings = Drupal.settings[key];

  // Access token should be 0 (never null), but this is here just in case.
  if (settings.access_token == 'null') {
    settings.access_token = 0;
  }

  // Ensure all expected values are present.
  return jQuery.extend({
    scope: '',
    access_token: 0,
  }, settings);
}

/**
 * Send user to facebook's client auth dialog.  Useful as the onclick attribute of a link.
 */
FB_JS.clientAuth = function(fba, scope) {
  if (!fba) {
    fba = Drupal.settings.fb.client_id;
  }
  var settings = FB_JS.getAppSettings(fba);
  scope = settings.scope.concat(scope);
  if (fba && settings.client_auth_url) {
    window.top.location = settings.client_auth_url + '&scope=' + scope.join(',');
  }
  return false;
};


// Helper to pass events via AJAX.
// A list of javascript functions to be evaluated is returned.
FB_JS.ajaxEvent = function(event_type, request_data) {

  // Avoid nested calls.
  if (typeof(FB_JS.semaphores[event_type]) != 'undefined' &&
      FB_JS.semaphores[event_type]) {
    // I believe it safe to skip this event.  Or, would it be better to pause and handle it later???
    return;
  }
  else {
    FB_JS.semaphores[event_type] = true;
  }


  if (Drupal.settings.fb.ajax_event_url) {

    if (typeof(FB_SDK) != 'undefined' && FB_SDK.status == 'connected') {
      // FB_SDK comes from fb_sdk.js.
      request_data.signed_request = FB_SDK.authResponse.signedRequest;
      request_data.status = FB_SDK.status;
    }
    if (typeof(FB) != 'undefined') {
      // global FB comes from facebook JS SDK.
      request_data.access_token = FB.getAccessToken();
    }

    request_data.client_id = Drupal.settings.fb.client_id;

    //request_data.XDEBUG_SESSION_START=1; // debug

    jQuery.ajax({
      url: Drupal.settings.fb.ajax_event_url + '/' + event_type,
      data : request_data,
      type: 'POST',
      dataType: 'json',
      success: function(js_array, textStatus, XMLHttpRequest) {
        if (js_array.length > 0) {
          var progress = jQuery('<div class="fb-progress ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
          jQuery('.fb').after(progress);
          for (var i = 0; i < js_array.length; i++) {
            eval(js_array[i]);
          }
          jQuery('.fb-progress').remove();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Unexpected error (i.e. ajax did not return json-encoded data).
        var headers = jqXHR.getAllResponseHeaders(); // debug info.
        var responseText = jqXHR.responseText; // debug info.
        debugger;
        // @TODO: handle error, but how?
      },
      complete: function() {
        FB_JS.semaphores[event_type] = false;
      }
    });
  }
};


//// jQuery pseudo-event handlers

FB_JS.newTokenHandler = function(e, data) {
  console.log(data);

  var fba = null;
  var sessionData = {
    access_token : data.access_token
  };
  // Usually we will get app and me from graph if, token is valid.  However some browser plugins prevent it.
  if (typeof(data.app) != 'undefined' && typeof(data.me) != 'undefined') {
    var fba = data.app.id;
    sessionData.fba = fba;
    sessionData.client_id = fba;
    app_name = data.app.name;
    fbu = data.me.id;

    FB_JS.session[fba] = sessionData;
    var cookie_val = JSON.stringify(FB_JS.session);
    FB_JS.setCookie('fb_js_session', cookie_val);
  }

  // Send ajax event even if we could not validate token.  Possibly the server is able to.
  FB_JS.ajaxEvent('fb_new_token', sessionData);

  if (fba) {
    // Sometimes new token adds permissions, in which case we should show those portions of the page that require permission.
    // This is reached even when user skips an optional permission.  @todo: find a way to prevent that!
    jQuery('.fb_has_permission').show();
    jQuery('.fb_needs_permission').hide();

    // Page elements may change depending on whether user is currently connected.
    FB_JS.doGraphReplace();
    FB_JS.doReplace();
    FB_JS.doShowHide();
  }

};

FB_JS.tokenInvalidHandler = function(e, data) {
  for (var key in FB_JS.session) {
    if (FB_JS.session.hasOwnProperty(key)) {
      var obj = FB_JS.session[key];
      if (obj.access_token == data.access_token) {
        delete FB_JS.session[key];
        FB_JS.setCookie('fb_js_session', JSON.stringify(FB_JS.session));
        FB_JS.doReplace();
        FB_JS.doShowHide();
      }
    }
  }
  // Let Drupal know the token is bad.
  if (data.access_token) {
    FB_JS.ajaxEvent('token_invalid', {invalid_token: data.access_token});
  }
};

//// misc helper functions

/**
 * Helper parses URL params.
 *
 * http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
 */
FB_JS.parseVars = function(href) {
  var vars = [], hash;
  var hashes = href.slice(href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }
  return vars;
};

FB_JS.setCookie = function(key, value) {
  // TODO make this smart enough to use different domain or path for canvas page, page tabs.
  jQuery.cookie(key, value, {path: Drupal.settings.basePath});
};


/**
 * Reload the current page, whether on canvas page or facebook connect.
 *
 */
FB_JS.reload = function(destination) {

  // Avoid infinite reloads.  Esp on canvas pages when third-party cookies disabled.
  if (Drupal.settings.fb.fb_reloading) {
    jQuery.event.trigger('fb_devel', destination); // Debug. JS and PHP SDKs are not in sync.
    return;
  }

  // Determine where to send user.
  if (typeof(destination) != 'undefined' && destination) {
    // Use destination passed in.
  }
  else if (typeof(Drupal.settings.fb.reload_url) != 'undefined') {
    destination = Drupal.settings.fb.reload_url;
  }
  else {
    destination = window.location.href;
  }

  // Ignore hash when reloading
  if (destination.indexOf('#') > 0) {
    // Ignore #access_token=... portion of URL.
    destination = destination.slice(0, destination.indexOf('#'));
  }


  // Split and parse destination
  var path;
  if (destination.indexOf('?') == -1) {
    vars = [];
    path = destination;
  }
  else {
    vars = FB_JS.parseVars(destination);
    path = destination.substr(0, destination.indexOf('?'));
  }

  // Passing this helps us avoid infinite loop.
  FB_JS.reloadParams.fb_reloading = true;

  // Canvas pages will not get POST vars, so include them in the URL.
  if (Drupal.settings.fb.page_type == 'canvas') {
    for (var key in FB_JS.reloadParams) {
      vars.push(key + '=' + FB_JS.reloadParams[key]);
    }
  }

  // Why does this not work???
  destination = FB_JS.isEmpty(vars) ? path : (path + '?' + vars.join('&'));

  if (Drupal.settings.fb.reload_url_fragment) {
    destination = destination + "#" + Drupal.settings.fb.reload_url_fragment;
  }

  // Feedback that entire page may be reloading.
  // @TODO improve the appearance of this, make it customizable.
  // This unweildy set of tags should make a progress bar in any Drupal site.
  var fbMarkup = jQuery('.fb_connected,.fb_not_connected').wrap('<div class="progress" />').wrap('<div class="bar" />').wrap('<div class="filled" />');
  if (fbMarkup.length) {
    fbMarkup.hide(); // Hides FBML, leaves progress bar.
  }
  else {
    // If no markup changed, throw a progress bar at the top of the page.
    jQuery('body').prepend('<div id="fb_js_pb" class="progress"><div class="bar"><div class="filled"></div></div></div>');
  }

  // Use POST to get past any caching on the server.
  // reloadParams includes signed_request.
  if (Drupal.settings.fb.fbu && Drupal.settings.fb.test_login_status) {
    // The login status test might break all future calls to FB.  So we do it only immediately before reload.
    FB_JS.testGetLoginStatus(function() {
      FB_JS.postToURL(destination, FB_JS.reloadParams);
    });
  }
  else if (!FB_JS.isEmpty(FB_JS.reloadParams)) {
    FB_JS.postToURL(destination, FB_JS.reloadParams);
  }
  else {
    window.top.location = destination; // Uses GET, returns cached pages.
  }

};

/**
 * Send the browser to a URL.
 * Similar to setting window.top.location, but via POST instead of GET.
 * POST will get through Drupal cache or external cache (i.e. Varnish)
 */
FB_JS.postToURL = function(path, params, method) {
  method = method || "post"; // Set method to post by default, if not specified.

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  form.setAttribute("target", '_top'); // important for canvas pages

  for(var key in params) {
    if(params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

// Quick test whether object contains anything.
FB_JS.isEmpty = function(ob) {
  for(var i in ob){
    return false;
  }
  return true;
}

// Drupal should provide a helper like this.
FB_JS.baseUrl = function() {
  //return location.protocol + '//' + location.host + Drupal.settings.basePath;
  return 'http:' + '//' + location.host + Drupal.settings.basePath;
}
;
(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};
Drupal.admin.hashes = Drupal.admin.hashes || {};

/**
 * Core behavior for Administration menu.
 *
 * Test whether there is an administration menu is in the output and execute all
 * registered behaviors.
 */
Drupal.behaviors.adminMenu = {
  attach: function (context, settings) {
    // Initialize settings.
    settings.admin_menu = $.extend({
      suppress: false,
      margin_top: false,
      position_fixed: false,
      tweak_modules: false,
      tweak_permissions: false,
      tweak_tabs: false,
      destination: '',
      basePath: settings.basePath,
      hash: 0,
      replacements: {}
    }, settings.admin_menu || {});
    // Check whether administration menu should be suppressed.
    if (settings.admin_menu.suppress) {
      return;
    }
    var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
    // Client-side caching; if administration menu is not in the output, it is
    // fetched from the server and cached in the browser.
    if (!$adminMenu.length && settings.admin_menu.hash) {
      Drupal.admin.getCache(settings.admin_menu.hash, function (response) {
          if (typeof response == 'string' && response.length > 0) {
            $('body', context).append(response);
          }
          var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
          // Apply our behaviors.
          Drupal.admin.attachBehaviors(context, settings, $adminMenu);
          // Allow resize event handlers to recalculate sizes/positions.
          $(window).triggerHandler('resize');
      });
    }
    // If the menu is in the output already, this means there is a new version.
    else {
      // Apply our behaviors.
      Drupal.admin.attachBehaviors(context, settings, $adminMenu);
    }
  }
};

/**
 * Collapse fieldsets on Modules page.
 */
Drupal.behaviors.adminMenuCollapseModules = {
  attach: function (context, settings) {
    if (settings.admin_menu.tweak_modules) {
      $('#system-modules fieldset:not(.collapsed)', context).addClass('collapsed');
    }
  }
};

/**
 * Collapse modules on Permissions page.
 */
Drupal.behaviors.adminMenuCollapsePermissions = {
  attach: function (context, settings) {
    if (settings.admin_menu.tweak_permissions) {
      // Freeze width of first column to prevent jumping.
      $('#permissions th:first', context).css({ width: $('#permissions th:first', context).width() });
      // Attach click handler.
      $modules = $('#permissions tr:has(td.module)', context).once('admin-menu-tweak-permissions', function () {
        var $module = $(this);
        $module.bind('click.admin-menu', function () {
          // @todo Replace with .nextUntil() in jQuery 1.4.
          $module.nextAll().each(function () {
            var $row = $(this);
            if ($row.is(':has(td.module)')) {
              return false;
            }
            $row.toggleClass('element-hidden');
          });
        });
      });
      // Collapse all but the targeted permission rows set.
      if (window.location.hash.length) {
        $modules = $modules.not(':has(' + window.location.hash + ')');
      }
      $modules.trigger('click.admin-menu');
    }
  }
};

/**
 * Apply margin to page.
 *
 * Note that directly applying marginTop does not work in IE. To prevent
 * flickering/jumping page content with client-side caching, this is a regular
 * Drupal behavior.
 */
Drupal.behaviors.adminMenuMarginTop = {
  attach: function (context, settings) {
    if (!settings.admin_menu.suppress && settings.admin_menu.margin_top) {
      $('body:not(.admin-menu)', context).addClass('admin-menu');
    }
  }
};

/**
 * Retrieve content from client-side cache.
 *
 * @param hash
 *   The md5 hash of the content to retrieve.
 * @param onSuccess
 *   A callback function invoked when the cache request was successful.
 */
Drupal.admin.getCache = function (hash, onSuccess) {
  if (Drupal.admin.hashes.hash !== undefined) {
    return Drupal.admin.hashes.hash;
  }
  $.ajax({
    cache: true,
    type: 'GET',
    dataType: 'text', // Prevent auto-evaluation of response.
    global: false, // Do not trigger global AJAX events.
    url: Drupal.settings.admin_menu.basePath.replace(/admin_menu/, 'js/admin_menu/cache/' + hash),
    success: onSuccess,
    complete: function (XMLHttpRequest, status) {
      Drupal.admin.hashes.hash = status;
    }
  });
};

/**
 * TableHeader callback to determine top viewport offset.
 *
 * @see toolbar.js
 */
Drupal.admin.height = function() {
  var $adminMenu = $('#admin-menu');
  var height = $adminMenu.outerHeight();
  // In IE, Shadow filter adds some extra height, so we need to remove it from
  // the returned height.
  if ($adminMenu.css('filter') && $adminMenu.css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
    height -= $adminMenu.get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

/**
 * @defgroup admin_behaviors Administration behaviors.
 * @{
 */

/**
 * Attach administrative behaviors.
 */
Drupal.admin.attachBehaviors = function (context, settings, $adminMenu) {
  if ($adminMenu.length) {
    $adminMenu.addClass('admin-menu-processed');
    $.each(Drupal.admin.behaviors, function() {
      this(context, settings, $adminMenu);
    });
  }
};

/**
 * Apply 'position: fixed'.
 */
Drupal.admin.behaviors.positionFixed = function (context, settings, $adminMenu) {
  if (settings.admin_menu.position_fixed) {
    $adminMenu.addClass('admin-menu-position-fixed');
    $adminMenu.css('position', 'fixed');
  }
};

/**
 * Move page tabs into administration menu.
 */
Drupal.admin.behaviors.pageTabs = function (context, settings, $adminMenu) {
  if (settings.admin_menu.tweak_tabs) {
    var $tabs = $(context).find('ul.tabs.primary');
    $adminMenu.find('#admin-menu-wrapper > ul').eq(1)
      .append($tabs.find('li').addClass('admin-menu-tab'));
    $(context).find('ul.tabs.secondary')
      .appendTo('#admin-menu-wrapper > ul > li.admin-menu-tab.active')
      .removeClass('secondary');
    $tabs.remove();
  }
};

/**
 * Perform dynamic replacements in cached menu.
 */
Drupal.admin.behaviors.replacements = function (context, settings, $adminMenu) {
  for (var item in settings.admin_menu.replacements) {
    $(item, $adminMenu).html(settings.admin_menu.replacements[item]);
  }
};

/**
 * Inject destination query strings for current page.
 */
Drupal.admin.behaviors.destination = function (context, settings, $adminMenu) {
  if (settings.admin_menu.destination) {
    $('a.admin-menu-destination', $adminMenu).each(function() {
      this.search += (!this.search.length ? '?' : '&') + Drupal.settings.admin_menu.destination;
    });
  }
};

/**
 * Apply JavaScript-based hovering behaviors.
 *
 * @todo This has to run last.  If another script registers additional behaviors
 *   it will not run last.
 */
Drupal.admin.behaviors.hover = function (context, settings, $adminMenu) {
  // Delayed mouseout.
  $('li.expandable', $adminMenu).hover(
    function () {
      // Stop the timer.
      clearTimeout(this.sfTimer);
      // Display child lists.
      $('> ul', this)
        .css({left: 'auto', display: 'block'})
        // Immediately hide nephew lists.
        .parent().siblings('li').children('ul').css({left: '-999em', display: 'none'});
    },
    function () {
      // Start the timer.
      var uls = $('> ul', this);
      this.sfTimer = setTimeout(function () {
        uls.css({left: '-999em', display: 'none'});
      }, 400);
    }
  );
};

/**
 * Apply the search bar functionality.
 */
Drupal.admin.behaviors.search = function (context, settings, $adminMenu) {
  // @todo Add a HTML ID.
  var $input = $('input.admin-menu-search', $adminMenu);
  // Initialize the current search needle.
  var needle = $input.val();
  // Cache of all links that can be matched in the menu.
  var links;
  // Minimum search needle length.
  var needleMinLength = 2;
  // Append the results container.
  var $results = $('<div />').insertAfter($input);

  /**
   * Executes the search upon user input.
   */
  function keyupHandler() {
    var matches, $html, value = $(this).val();
    // Only proceed if the search needle has changed.
    if (value !== needle) {
      needle = value;
      // Initialize the cache of menu links upon first search.
      if (!links && needle.length >= needleMinLength) {
        // @todo Limit to links in dropdown menus; i.e., skip menu additions.
        links = buildSearchIndex($adminMenu.find('li:not(.admin-menu-action, .admin-menu-action li) > a'));
      }
      // Empty results container when deleting search text.
      if (needle.length < needleMinLength) {
        $results.empty();
      }
      // Only search if the needle is long enough.
      if (needle.length >= needleMinLength && links) {
        matches = findMatches(needle, links);
        // Build the list in a detached DOM node.
        $html = buildResultsList(matches);
        // Display results.
        $results.empty().append($html);
      }
    }
  }

  /**
   * Builds the search index.
   */
  function buildSearchIndex($links) {
    return $links
      .map(function () {
        var text = (this.textContent || this.innerText);
        // Skip menu entries that do not contain any text (e.g., the icon).
        if (typeof text === 'undefined') {
          return;
        }
        return {
          text: text,
          textMatch: text.toLowerCase(),
          element: this
        };
      });
  }

  /**
   * Searches the index for a given needle and returns matching entries.
   */
  function findMatches(needle, links) {
    var needleMatch = needle.toLowerCase();
    // Select matching links from the cache.
    return $.grep(links, function (link) {
      return link.textMatch.indexOf(needleMatch) !== -1;
    });
  }

  /**
   * Builds the search result list in a detached DOM node.
   */
  function buildResultsList(matches) {
    var $html = $('<ul class="dropdown admin-menu-search-results" />');
    $.each(matches, function () {
      var result = this.text;
      var $element = $(this.element);

      // Check whether there is a top-level category that can be prepended.
      var $category = $element.closest('#admin-menu-wrapper > ul > li');
      var categoryText = $category.find('> a').text()
      if ($category.length && categoryText) {
        result = categoryText + ': ' + result;
      }

      var $result = $('<li><a href="' + $element.attr('href') + '">' + result + '</a></li>');
      $result.data('original-link', $(this.element).parent());
      $html.append($result);
    });
    return $html;
  }

  /**
   * Highlights selected result.
   */
  function resultsHandler(e) {
    var $this = $(this);
    var show = e.type === 'mouseenter' || e.type === 'focusin';
    $this.trigger(show ? 'showPath' : 'hidePath', [this]);
  }

  /**
   * Closes the search results and clears the search input.
   */
  function resultsClickHandler(e, link) {
    var $original = $(this).data('original-link');
    $original.trigger('mouseleave');
    $input.val('').trigger('keyup');
  }

  /**
   * Shows the link in the menu that corresponds to a search result.
   */
  function highlightPathHandler(e, link) {
    if (link) {
      var $original = $(link).data('original-link');
      var show = e.type === 'showPath';
      // Toggle an additional CSS class to visually highlight the matching link.
      // @todo Consider using same visual appearance as regular hover.
      $original.toggleClass('highlight', show);
      $original.trigger(show ? 'mouseenter' : 'mouseleave');
    }
  }

  // Attach showPath/hidePath handler to search result entries.
  $results.delegate('li', 'mouseenter mouseleave focus blur', resultsHandler);
  // Hide the result list after a link has been clicked, useful for overlay.
  $results.delegate('li', 'click', resultsClickHandler);
  // Attach hover/active highlight behavior to search result entries.
  $adminMenu.delegate('.admin-menu-search-results li', 'showPath hidePath', highlightPathHandler);
  // Attach the search input event handler.
  $input.bind('keyup search', keyupHandler);
};

/**
 * @} End of "defgroup admin_behaviors".
 */

})(jQuery);
;
