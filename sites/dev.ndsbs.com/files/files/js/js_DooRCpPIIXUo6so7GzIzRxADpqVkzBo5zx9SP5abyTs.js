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
// ┌─────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.0 - JavaScript Vector Library                             │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
// │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
// └─────────────────────────────────────────────────────────────────────┘ \\

// ┌──────────────────────────────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.3.0 - JavaScript Events Library                                                │ \\
// ├──────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)          │ \\
// │ Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license. │ \\
// └──────────────────────────────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.3.0",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        wildcard = "*",
        fun = function () {},
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
    
        eve = function (name, scope) {
            var e = events,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                f = false,
                l,
                indexed = [],
                queue = {},
                out = [],
                errors = [];
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            return out;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                return out;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        return out;
                    }
                }
            }
            return out.length ? out : null;
        };
    
    eve.listeners = function (name) {
        var names = name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    
    
    eve.on = function (name, f) {
        var names = name.split(separator),
            e = events;
        for (var i = 0, ii = names.length; i < ii; i++) {
            e = e.n;
            !e[names[i]] && (e[names[i]] = {n: {}});
            e = e[names[i]];
        }
        e.f = e.f || [];
        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
            return fun;
        }
        e.f.push(f);
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    
    eve.stop = function () {
        stop = 1;
    };
    
    eve.nt = function (subname) {
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event);
        }
        return current_event;
    };
    
    eve.unbind = function (name, f) {
        var names = name.split(separator),
            e,
            key,
            splice,
            cur = [events];
        for (var i = 0, ii = names.length; i < ii; i++) {
            for (var j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                            e.f.splice(i, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (i = 0, ii = funcs.length; i < ii; i++) if (funcs[i] == f) {
                            funcs.splice(i, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
    };
    
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    (typeof module != "undefined" && module.exports) ? (module.exports = eve) : (glob.eve = eve);
})(this);

// ┌─────────────────────────────────────────────────────────────────────┐ \\
// │ "Raphaël 2.0" - JavaScript Vector Library                           │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
// │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
// └─────────────────────────────────────────────────────────────────────┘ \\
(function () {
    
    function R(first) {
        if (R.is(first, "function")) {
            return loaded ? first() : eve.on("DOMload", first);
        } else if (R.is(first, array)) {
            var a = first,
                cnv = R._engine.create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set(),
                i = 0,
                ii = a.length,
                j;
            for (; i < ii; i++) {
                j = a[i] || {};
                elements[has](j.type) && res.push(cnv[j.type]().attr(j));
            }
            return res;
        } else {
            var args = Array.prototype.slice.call(arguments, 0);
            if (R.is(args[args.length - 1], "function")) {
                var f = args.pop();
                return loaded ? f.call(R._engine.create[apply](R, args)) : eve.on("DOMload", function () {
                    f.call(R._engine.create[apply](R, args));
                });
            } else {
                return R._engine.create[apply](R, arguments);
            }
        }
    }
    R.version = "2.0.0";
    R.eve = eve;
    var loaded,
        separator = /[, ]+/,
        elements = {circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1},
        formatrg = /\{(\d+)\}/g,
        proto = "prototype",
        has = "hasOwnProperty",
        g = {
            doc: document,
            win: window
        },
        oldRaphael = {
            was: Object.prototype[has].call(g.win, "Raphael"),
            is: g.win.Raphael
        },
        Paper = function () {
            
            this.customAttributes = {};
        },
        paperproto,
        appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in g.doc,
        E = "",
        S = " ",
        Str = String,
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel".split(S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        lowerCase = Str.prototype.toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        abs = math.abs,
        pow = math.pow,
        PI = math.PI,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object.prototype.toString,
        paper = {},
        push = "push",
        ISURL = R._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1},
        bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        upperCase = Str.prototype.toUpperCase,
        availableAttrs = R._availableAttrs = {
            "arrow-end": "none",
            "arrow-start": "none",
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            opacity: 1,
            path: "M0,0",
            r: 0,
            rx: 0,
            ry: 0,
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            transform: "",
            width: 0,
            x: 0,
            y: 0
        },
        availableAnimAttrs = R._availableAnimAttrs = {
            blur: nu,
            "clip-rect": "csv",
            cx: nu,
            cy: nu,
            fill: "colour",
            "fill-opacity": nu,
            "font-size": nu,
            height: nu,
            opacity: nu,
            path: "path",
            r: nu,
            rx: nu,
            ry: nu,
            stroke: "colour",
            "stroke-opacity": nu,
            "stroke-width": nu,
            transform: "transform",
            width: nu,
            x: nu,
            y: nu
        },
        commaSpaces = /\s*,\s*/,
        hsrg = {hs: 1, rg: 1},
        p2s = /,?([achlmqrstvxz]),?/gi,
        pathCommand = /([achlmrqstvz])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?\s*,?\s*)+)/ig,
        tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)\s*,?\s*/ig,
        radial_gradient = R._radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        eldata = {},
        sortByKey = function (a, b) {
            return a.key - b.key;
        },
        sortByNumber = function (a, b) {
            return toFloat(a) - toFloat(b);
        },
        fun = function () {},
        pipe = function (x) {
            return x;
        },
        rectPath = R._rectPath = function (x, y, w, h, r) {
            if (r) {
                return [["M", x + r, y], ["l", w - r * 2, 0], ["a", r, r, 0, 0, 1, r, r], ["l", 0, h - r * 2], ["a", r, r, 0, 0, 1, -r, r], ["l", r * 2 - w, 0], ["a", r, r, 0, 0, 1, -r, -r], ["l", 0, r * 2 - h], ["a", r, r, 0, 0, 1, r, -r], ["z"]];
            }
            return [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
        },
        ellipsePath = function (x, y, rx, ry) {
            if (ry == null) {
                ry = rx;
            }
            return [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
        },
        getPath = R._getPath = {
            path: function (el) {
                return el.attr("path");
            },
            circle: function (el) {
                var a = el.attrs;
                return ellipsePath(a.cx, a.cy, a.r);
            },
            ellipse: function (el) {
                var a = el.attrs;
                return ellipsePath(a.cx, a.cy, a.rx, a.ry);
            },
            rect: function (el) {
                var a = el.attrs;
                return rectPath(a.x, a.y, a.width, a.height, a.r);
            },
            image: function (el) {
                var a = el.attrs;
                return rectPath(a.x, a.y, a.width, a.height);
            },
            text: function (el) {
                var bbox = el._getBBox();
                return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
            }
        },
        mapPath = R.mapPath = function (path, matrix) {
            if (!matrix) {
                return path;
            }
            var x, y, i, j, pathi;
            path = path2curve(path);
            for (i = 0, ii = path.length; i < ii; i++) {
                pathi = path[i];
                for (j = 1, jj = pathi.length; j < jj; j += 2) {
                    x = matrix.x(pathi[j], pathi[j + 1]);
                    y = matrix.y(pathi[j], pathi[j + 1]);
                    pathi[j] = x;
                    pathi[j + 1] = y;
                }
            }
            return path;
        };

    R._g = g;
    
    R.type = (g.win.SVGAngle || g.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = g.doc.createElement("div"),
            b;
        d.innerHTML = '<v:shape adj="1"/>';
        b = d.firstChild;
        b.style.behavior = "url(#default#VML)";
        if (!(b && typeof b.adj == "object")) {
            return (R.type = E);
        }
        d = null;
    }
    
    
    R.svg = !(R.vml = R.type == "VML");
    R._Paper = Paper;
    
    R.fn = paperproto = Paper.prototype = R.prototype;
    R._id = 0;
    R._oid = 0;
    
    R.is = function (o, type) {
        type = lowerCase.call(type);
        if (type == "finite") {
            return !isnan[has](+o);
        }
        if (type == "array") {
            return o instanceof Array;
        }
        return  (type == "null" && o === null) ||
                (type == typeof o) ||
                (type == "object" && o === Object(o)) ||
                (type == "array" && Array.isArray && Array.isArray(o)) ||
                objectToString.call(o).slice(8, -1).toLowerCase() == type;
    };
    
    R.angle = function (x1, y1, x2, y2, x3, y3) {
        if (x3 == null) {
            var x = x1 - x2,
                y = y1 - y2;
            if (!x && !y) {
                return 0;
            }
            return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
        } else {
            return R.angle(x1, y1, x3, y3) - R.angle(x2, y2, x3, y3);
        }
    };
    
    R.rad = function (deg) {
        return deg % 360 * PI / 180;
    };
    
    R.deg = function (rad) {
        return rad * 180 / PI % 360;
    };
    
    R.snapTo = function (values, value, tolerance) {
        tolerance = R.is(tolerance, "finite") ? tolerance : 10;
        if (R.is(values, array)) {
            var i = values.length;
            while (i--) if (abs(values[i] - value) <= tolerance) {
                return values[i];
            }
        } else {
            values = +values;
            var rem = value % values;
            if (rem < tolerance) {
                return value - rem;
            }
            if (rem > values - tolerance) {
                return value - rem + values;
            }
        }
        return value;
    };
    
    
    var createUUID = R.createUUID = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c) {
        var r = math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });

    
    R.setWindow = function (newwin) {
        eve("setWindow", R, g.win, newwin);
        g.win = newwin;
        g.doc = g.win.document;
        if (initWin) {
            initWin(g.win);
        }
    };
    var toHex = function (color) {
        if (R.vml) {
            // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
            var trim = /^\s+|\s+$/g;
            var bod;
            try {
                var docum = new ActiveXObject("htmlfile");
                docum.write("<body>");
                docum.close();
                bod = docum.body;
            } catch(e) {
                bod = createPopup().document.body;
            }
            var range = bod.createTextRange();
            toHex = cacher(function (color) {
                try {
                    bod.style.color = Str(color).replace(trim, E);
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value.toString(16)).slice(-6);
                } catch(e) {
                    return "none";
                }
            });
        } else {
            var i = g.doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            g.doc.body.appendChild(i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return g.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    },
    hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    },
    hsltoString = function () {
        return "hsl(" + [this.h, this.s, this.l] + ")";
    },
    rgbtoString = function () {
        return this.hex;
    },
    prepareRGB = function (r, g, b) {
        if (g == null && R.is(r, "object") && "r" in r && "g" in r && "b" in r) {
            b = r.b;
            g = r.g;
            r = r.r;
        }
        if (g == null && R.is(r, string)) {
            var clr = R.getRGB(r);
            r = clr.r;
            g = clr.g;
            b = clr.b;
        }
        if (r > 1 || g > 1 || b > 1) {
            r /= 255;
            g /= 255;
            b /= 255;
        }
        
        return [r, g, b];
    },
    packageRGB = function (r, g, b, o) {
        r *= 255;
        g *= 255;
        b *= 255;
        var rgb = {
            r: r,
            g: g,
            b: b,
            hex: R.rgb(r, g, b),
            toString: rgbtoString
        };
        R.is(o, "finite") && (rgb.opacity = o);
        return rgb;
    };
    
    
    R.color = function (clr) {
        var rgb;
        if (R.is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
            rgb = R.hsb2rgb(clr);
            clr.r = rgb.r;
            clr.g = rgb.g;
            clr.b = rgb.b;
            clr.hex = rgb.hex;
        } else if (R.is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
            rgb = R.hsl2rgb(clr);
            clr.r = rgb.r;
            clr.g = rgb.g;
            clr.b = rgb.b;
            clr.hex = rgb.hex;
        } else {
            if (R.is(clr, "string")) {
                clr = R.getRGB(clr);
            }
            if (R.is(clr, "object") && "r" in clr && "g" in clr && "b" in clr) {
                rgb = R.rgb2hsl(clr);
                clr.h = rgb.h;
                clr.s = rgb.s;
                clr.l = rgb.l;
                rgb = R.rgb2hsb(clr);
                clr.v = rgb.b;
            } else {
                clr = {hex: "none"};
                crl.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
            }
        }
        clr.toString = rgbtoString;
        return clr;
    };
    
    R.hsb2rgb = function (h, s, v, o) {
        if (this.is(h, "object") && "h" in h && "s" in h && "b" in h) {
            v = h.b;
            s = h.s;
            h = h.h;
            o = h.o;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = v * s;
        X = C * (1 - abs(h % 2 - 1));
        R = G = B = v - C;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return packageRGB(R, G, B, o);
    };
    
    R.hsl2rgb = function (h, s, l, o) {
        if (this.is(h, "object") && "h" in h && "s" in h && "l" in h) {
            l = h.l;
            s = h.s;
            h = h.h;
        }
        if (h > 1 || s > 1 || l > 1) {
            h /= 360;
            s /= 100;
            l /= 100;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = 2 * s * (l < .5 ? l : 1 - l);
        X = C * (1 - abs(h % 2 - 1));
        R = G = B = l - C / 2;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return packageRGB(R, G, B, o);
    };
    
    R.rgb2hsb = function (r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];

        var H, S, V, C;
        V = mmax(r, g, b);
        C = V - mmin(r, g, b);
        H = (C == 0 ? null :
             V == r ? (g - b) / C :
             V == g ? (b - r) / C + 2 :
                      (r - g) / C + 4
            );
        H = ((H + 360) % 6) * 60 / 360;
        S = C == 0 ? 0 : C / V;
        return {h: H, s: S, b: V, toString: hsbtoString};
    };
    
    R.rgb2hsl = function (r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];

        var H, S, L, M, m, C;
        M = mmax(r, g, b);
        m = mmin(r, g, b);
        C = M - m;
        H = (C == 0 ? null :
             M == r ? (g - b) / C :
             M == g ? (b - r) / C + 2 :
                      (r - g) / C + 4);
        H = ((H + 360) % 6) * 60 / 360;
        L = (M + m) / 2;
        S = (C == 0 ? 0 :
             L < .5 ? C / (2 * L) :
                      C / (2 - 2 * L));
        return {h: H, s: S, l: L, toString: hsltoString};
    };
    R._path2string = function () {
        return this.join(",").replace(p2s, "$1");
    };
    function repush(array, item) {
        for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
            return array.push(array.splice(i, 1)[0]);
        }
    }
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array.prototype.slice.call(arguments, 0),
                args = arg.join("\u2400"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache[has](args)) {
                repush(count, args);
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count.length >= 1e3 && delete cache[count.shift()];
            count.push(args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }

    var preload = R._preload = function (src, f) {
        var img = g.doc.createElement("img");
        img.style.cssText = "position:absolute;left:-9999em;top-9999em";
        img.onload = function () {
            f.call(this);
            this.onload = null;
            g.doc.body.removeChild(this);
        };
        img.onerror = function () {
            g.doc.body.removeChild(this);
        };
        g.doc.body.appendChild(img);
        img.src = src;
    };
    
    function clrToString() {
        return this.hex;
    }

    
    R.getRGB = cacher(function (colour) {
        if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: clrToString};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none", toString: clrToString};
        }
        !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res,
            red,
            green,
            blue,
            opacity,
            t,
            values,
            rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                values = rgb[4].split(commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            }
            if (rgb[5]) {
                values = rgb[5].split(commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsb2rgb(red, green, blue, opacity);
            }
            if (rgb[6]) {
                values = rgb[6].split(commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsl2rgb(red, green, blue, opacity);
            }
            rgb = {r: red, g: green, b: blue, toString: clrToString};
            rgb.hex = "#" + (16777216 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
            R.is(opacity, "finite") && (rgb.opacity = opacity);
            return rgb;
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: clrToString};
    }, R);
    
    R.hsb = cacher(function (h, s, b) {
        return R.hsb2rgb(h, s, b).hex;
    });
    
    R.hsl = cacher(function (h, s, l) {
        return R.hsl2rgb(h, s, l).hex;
    });
    
    R.rgb = cacher(function (r, g, b) {
        return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
    });
    
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
        }
        return rgb.hex;
    };
    
    R.getColor.reset = function () {
        delete this.start;
    };

    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp) {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 > i; i += 2) {
            var p = [{x: +crp[i],     y: +crp[i + 1]},
                     {x: +crp[i],     y: +crp[i + 1]},
                     {x: +crp[i + 2], y: +crp[i + 3]},
                     {x: +crp[i + 4], y: +crp[i + 5]}];
            if (iLen - 4 == i) {
                p[0] = {x: +crp[i - 2], y: +crp[i - 1]};
                p[3] = p[2];
            } else if (i) {
                p[0] = {x: +crp[i - 2], y: +crp[i - 1]};
            }
            d.push(["C",
                (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                (p[1].x + 6 * p[2].x - p[3].x) / 6,
                (p[1].y + 6*p[2].y - p[3].y) / 6,
                p[2].x,
                p[2].y
            ]);
        }

        return d;
    }
    
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data.length) {
            Str(pathString).replace(pathCommand, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                if (name == "m" && params.length > 2) {
                    data.push([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                if (name == "r") {
                    data.push([b][concat](params));
                } else while (params.length >= paramCounts[name]) {
                    data.push([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data.toString = R._path2string;
        return data;
    });
    
    R.parseTransformString = cacher(function (TString) {
        if (!TString) {
            return null;
        }
        var paramCounts = {r: 3, s: 4, t: 2, m: 6},
            data = [];
        if (R.is(TString, array) && R.is(TString[0], array)) { // rough assumption
            data = pathClone(TString);
        }
        if (!data.length) {
            Str(TString).replace(tCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                data.push([name][concat](params));
            });
        }
        data.toString = R._path2string;
        return data;
    });
    
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            t13 = pow(t1, 3),
            t12 = pow(t1, 2),
            t2 = t * t,
            t3 = t2 * t,
            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
            ax = t1 * p1x + t * c1x,
            ay = t1 * p1y + t * c1y,
            cx = t1 * c2x + t * p2x,
            cy = t1 * c2y + t * p2y,
            alpha = (90 - math.atan2(mx - nx, my - ny) * 180 / PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {x: mx, y: my},
            n: {x: nx, y: ny},
            start: {x: ax, y: ay},
            end: {x: cx, y: cy},
            alpha: alpha
        };
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0, 
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path.length; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }, null, function (o) {
        return {
            x: o.x,
            y: o.y,
            width: o.width,
            height: o.height
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray.length; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i].length; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res.toString = R._path2string;
            return res;
        },
        pathToRelative = R._pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res.push(["M", x, y]);
            }
            for (var i = start, ii = pathArray.length; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa.length; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i].length;
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = R._pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            if (!pathArray || !pathArray.length) {
                return [["M", 0, 0]];
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
                res.push(r = []);
                pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "R":
                            var dots = [x, y][concat](pa.slice(1));
                            for (var j = 2, jj = dots.length; j < jj; j++) {
                                dots[j] = +dots[j] + x;
                                dots[++j] = +dots[j] + y;
                            }
                            res.pop();
                            res = res[concat](catmullRom2bezier(dots));
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (j = 1, jj = pa.length; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else if (pa[0] == "R") {
                    dots = [x, y][concat](pa.slice(1));
                    res.pop();
                    res = res[concat](catmullRom2bezier(dots));
                    r = ["R"][concat](pa.slice(-2));
                } else {
                    for (var k = 0, kk = pa.length; k < kk; k++) {
                        r[k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = r[r.length - 2];
                        my = r[r.length - 1];
                    default:
                        x = r[r.length - 2];
                        y = r[r.length - 1];
                }
            }
            res.toString = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(9));

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res).join().split(",");
                var newres = [];
                for (var i = 0, ii = res.length; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        },
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x.push(dot.x);
                y.push(dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x.push(dot.x);
                y.push(dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x.push(dot.x);
                y.push(dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x.push(dot.x);
                y.push(dot.y);
            }
            return {
                min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
            };
        }),
        path2curve = R._path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny][concat](path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i].length > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi.length) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p.length, p2 && p2.length || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p.length, p2 && p2.length || 0);
                    }
                };
            for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg.length,
                    seg2len = p2 && seg2.length;
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = R._parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient.length; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots.push(dot);
            }
            for (i = 1, ii = dots.length - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        tear = R._tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        },
        tofront = R._tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        },
        toback = R._toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        },
        insertafter = R._insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        },
        insertbefore = R._insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        },
        removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        },
        extractTransform = R._extractTransform = function (el, tstr) {
            if (tstr == null) {
                return el._.transform;
            }
            tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E);
            var tdata = R.parseTransformString(tstr),
                deg = 0,
                dx = 0,
                dy = 0,
                sx = 1,
                sy = 1,
                _ = el._,
                m = new Matrix;
            _.transform = tdata || [];
            if (tdata) {
                for (var i = 0, ii = tdata.length; i < ii; i++) {
                    var t = tdata[i],
                        tlen = t.length,
                        bb;
                    t[0] = Str(t[0]).toLowerCase();
                    if (t[0] == "t" && tlen == 3) {
                        m.translate(t[1], t[2]);
                    } else if (t[0] == "r") {
                        if (tlen == 2) {
                            bb = bb || el.getBBox(1);
                            m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                            deg += t[1];
                        } else if (tlen == 4) {
                            m.rotate(t[1], t[2], t[3]);
                            deg += t[1];
                        }
                    } else if (t[0] == "s") {
                        if (tlen == 2 || tlen == 3) {
                            bb = bb || el.getBBox(1);
                            m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                            sx *= t[1];
                            sy *= t[tlen - 1];
                        } else if (tlen == 5) {
                            m.scale(t[1], t[2], t[3], t[4]);
                            sx *= t[1];
                            sy *= t[2];
                        }
                    } else if (t[0] == "m" && tlen == 7) {
                        m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                    }
                    _.dirtyT = 1;
                    el.matrix = m;
                }
            }

            el.matrix = m;

            _.sx = sx;
            _.sy = sy;
            _.deg = deg;
            _.dx = dx = m.e;
            _.dy = dy = m.f;

            if (sx == 1 && sy == 1 && !deg && _.bbox) {
                _.bbox.x += +dx;
                _.bbox.y += +dy;
            } else {
                _.dirtyT = 1;
            }
        },
        getEmpty = function (item) {
            switch (item[0]) {
                case "t": return ["t", 0, 0];
                case "m": return ["m", 1, 0, 0, 1, 0, 0];
                case "r": if (item.length == 4) {
                    return ["r", 0, item[2], item[3]];
                } else {
                    return ["r", 0];
                }
                case "s": if (item.length == 5) {
                    return ["s", 1, 1, item[3], item[4]];
                } else if (item.length == 3) {
                    return ["s", 1, 1];
                } else {
                    return ["s", 1];
                }
            }
        },
        equaliseTransform = R._equaliseTransform = function (t1, t2) {
            t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
            t1 = R.parseTransformString(t1) || [];
            t2 = R.parseTransformString(t2) || [];
            var maxlength = mmax(t1.length, t2.length),
                from = [],
                to = [],
                i = 0, j, jj,
                tt1, tt2;
            for (; i < maxlength; i++) {
                tt1 = t1[i] || getEmpty(t2[i]);
                tt2 = t2[i] || getEmpty(tt1);
                if ((tt1[0] != tt2[0]) ||
                    (tt1[0] == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3])) ||
                    (tt1[0] == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4]))
                    ) {
                    return;
                }
                from[i] = [];
                to[i] = [];
                for (j = 0, jj = mmax(tt1.length, tt2.length); j < jj; j++) {
                    j in tt1 && (from[i][j] = tt1[j]);
                    j in tt2 && (to[i][j] = tt2[j]);
                }
            }
            return {
                from: from,
                to: to
            };
        };
    R._getContainer = function (x, y, w, h) {
        var container;
        container = h == null && !R.is(x, "object") ? g.doc.getElementById(x) : x;
        if (container == null) {
            return;
        }
        if (container.tagName) {
            if (y == null) {
                return {
                    container: container,
                    width: container.style.pixelWidth || container.offsetWidth,
                    height: container.style.pixelHeight || container.offsetHeight
                };
            } else {
                return {
                    container: container,
                    width: y,
                    height: w
                };
            }
        }
        return {
            container: 1,
            x: x,
            y: y,
            width: w,
            height: h
        };
    };
    
    R.pathToRelative = pathToRelative;
    R._engine = {};
    
    R.path2curve = path2curve;
    
    R.matrix = function (a, b, c, d, e, f) {
        return new Matrix(a, b, c, d, e, f);
    };
    function Matrix(a, b, c, d, e, f) {
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
    (function (matrixproto) {
        
        matrixproto.add = function (a, b, c, d, e, f) {
            var out = [[], [], []],
                m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
                matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
                x, y, z, res;

            if (a && a instanceof Matrix) {
                matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
            }

            for (x = 0; x < 3; x++) {
                for (y = 0; y < 3; y++) {
                    res = 0;
                    for (z = 0; z < 3; z++) {
                        res += m[x][z] * matrix[z][y];
                    }
                    out[x][y] = res;
                }
            }
            this.a = out[0][0];
            this.b = out[1][0];
            this.c = out[0][1];
            this.d = out[1][1];
            this.e = out[0][2];
            this.f = out[1][2];
        };
        
        matrixproto.invert = function () {
            var me = this,
                x = me.a * me.d - me.b * me.c;
            return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
        };
        
        matrixproto.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
        };
        
        matrixproto.translate = function (x, y) {
            this.add(1, 0, 0, 1, x, y);
        };
        
        matrixproto.scale = function (x, y, cx, cy) {
            y == null && (y = x);
            (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
            this.add(x, 0, 0, y, 0, 0);
            (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
        };
        
        matrixproto.rotate = function (a, x, y) {
            a = R.rad(a);
            x = x || 0;
            y = y || 0;
            var cos = +math.cos(a).toFixed(9),
                sin = +math.sin(a).toFixed(9);
            this.add(cos, sin, -sin, cos, x, y);
            this.add(1, 0, 0, 1, -x, -y);
        };
        
        matrixproto.x = function (x, y) {
            return x * this.a + y * this.c + this.e;
        };
        
        matrixproto.y = function (x, y) {
            return x * this.b + y * this.d + this.f;
        };
        matrixproto.get = function (i) {
            return +this[Str.fromCharCode(97 + i)].toFixed(4);
        };
        matrixproto.toString = function () {
            return R.svg ?
                "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" :
                [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join();
        };
        matrixproto.toFilter = function () {
            return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) +
                ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) +
                ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
        };
        matrixproto.offset = function () {
            return [this.e.toFixed(4), this.f.toFixed(4)];
        };
        function norm(a) {
            return a[0] * a[0] + a[1] * a[1];
        }
        function normalize(a) {
            var mag = math.sqrt(norm(a));
            a[0] && (a[0] /= mag);
            a[1] && (a[1] /= mag);
        }
        
        matrixproto.split = function () {
            var out = {};
            // translation
            out.dx = this.e;
            out.dy = this.f;

            // scale and shear
            var row = [[this.a, this.c], [this.b, this.d]];
            out.scalex = math.sqrt(norm(row[0]));
            normalize(row[0]);

            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
            row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

            out.scaley = math.sqrt(norm(row[1]));
            normalize(row[1]);
            out.shear /= out.scaley;

            // rotation
            var sin = -row[0][1],
                cos = row[1][1];
            if (cos < 0) {
                out.rotate = R.deg(math.acos(cos));
                if (sin < 0) {
                    out.rotate = 360 - out.rotate;
                }
            } else {
                out.rotate = R.deg(math.asin(sin));
            }

            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
            return out;
        };
        
        matrixproto.toTransformString = function () {
            var s = this.split();
            if (s.isSimple) {
                return "t" + [s.dx, s.dy] + "s" + [s.scalex, s.scaley, 0, 0] + "r" + [s.rotate, 0, 0];
            } else {
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
            }
        };
    })(Matrix.prototype);

    // WebKit rendering bug workaround method
    var version = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    if ((navigator.vendor == "Apple Computer, Inc.") && (version && version[1] < 4 || navigator.platform.slice(0, 2) == "iP") ||
        (navigator.vendor == "Google Inc." && version && version[1] < 8)) {
        
        paperproto.safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
            setTimeout(function () {rect.remove();});
        };
    } else {
        paperproto.safari = fun;
    }
 
    var preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = (function () {
        if (g.doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
                    f = function (e) {
                        var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                            scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                            x = e.clientX + scrollX,
                            y = e.clientY + scrollY;
                    if (supportsTouch && touchMap[has](type)) {
                        for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                            if (e.targetTouches[i].target == obj) {
                                var olde = e;
                                e = e.targetTouches[i];
                                e.originalEvent = olde;
                                e.preventDefault = preventTouch;
                                e.stopPropagation = stopTouch;
                                break;
                            }
                        }
                    }
                    return fn.call(element, e, x, y);
                };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (g.doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || g.win.event;
                    var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                        scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                        x = e.clientX + scrollX,
                        y = e.clientY + scrollY;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e, x, y);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })(),
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
            scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            var node = dragi.el.node,
                o,
                next = node.nextSibling,
                parent = node.parentNode,
                display = node.style.display;
            g.win.opera && parent.removeChild(node);
            node.style.display = "none";
            o = dragi.el.paper.getElementByPoint(x, y);
            node.style.display = display;
            g.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
            o && eve("drag.over." + dragi.el.id, dragi.el, o);
            x += scrollX;
            y += scrollY;
            eve("drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    },
    dragUp = function (e) {
        R.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            eve("drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
        }
        drag = [];
    },
    
    elproto = R.el = {};
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    for (var i = events.length; i--;) {
        (function (eventName) {
            R[eventName] = elproto[eventName] = function (fn, scope) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || g.doc, eventName, fn, scope || this)});
                }
                return this;
            };
            R["un" + eventName] = elproto["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events.length;
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    
    
    elproto.data = function (key, value) {
        var data = eldata[this.id] = eldata[this.id] || {};
        if (arguments.length == 1) {
            if (R.is(key, "object")) {
                for (var i in key) if (key[has](i)) {
                    this.data(i, key[i]);
                }
                return this;
            }
            eve("data.get." + this.id, this, data[key], key);
            return data[key];
        }
        data[key] = value;
        eve("data.set." + this.id, this, value, key);
        return this;
    };
    
    elproto.removeData = function (key) {
        if (key == null) {
            eldata[this.id] = {};
        } else {
            eldata[this.id] && delete eldata[this.id][key];
        }
        return this;
    };
    
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        function start(e) {
            (e.originalEvent || e).preventDefault();
            var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft;
            this._drag.x = e.clientX + scrollX;
            this._drag.y = e.clientY + scrollY;
            this._drag.id = e.identifier;
            !drag.length && R.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: this, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
            onstart && eve.on("drag.start." + this.id, onstart);
            onmove && eve.on("drag.move." + this.id, onmove);
            onend && eve.on("drag.end." + this.id, onend);
            eve("drag.start." + this.id, start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
        }
        this._drag = {};
        this.mousedown(start);
        return this;
    };
    
    elproto.onDragOver = function (f) {
        f ? eve.on("drag.over." + this.id, f) : eve.unbind("drag.over." + this.id);
    };
    
    elproto.undrag = function () {
        var i = drag.length;
        while (i--) if (drag[i].el == this) {
            R.unmousedown(drag[i].start);
            drag.splice(i++, 1);
            eve.unbind("drag.*." + this.id);
        }
        !drag.length && R.unmousemove(dragMove).unmouseup(dragUp);
    };
    
    paperproto.circle = function (x, y, r) {
        var out = R._engine.circle(this, x || 0, y || 0, r || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.rect = function (x, y, w, h, r) {
        var out = R._engine.rect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.ellipse = function (x, y, rx, ry) {
        var out = R._engine.ellipse(this, x || 0, y || 0, rx || 0, ry || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        var out = R._engine.path(R.format[apply](R, arguments), this);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.image = function (src, x, y, w, h) {
        var out = R._engine.image(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.text = function (x, y, text) {
        var out = R._engine.text(this, x || 0, y || 0, Str(text));
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.set = function (itemsArray) {
        !R.is(itemsArray, "array") && (itemsArray = Array.prototype.splice.call(arguments, 0, arguments.length));
        var out = new Set(itemsArray);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    
    paperproto.setStart = function (set) {
        this.__set__ = set || this.set();
    };
    
    paperproto.setFinish = function (set) {
        var out = this.__set__;
        delete this.__set__;
        return out;
    };
    
    paperproto.setSize = function (width, height) {
        return R._engine.setSize.call(this, width, height);
    };
    
    paperproto.setViewBox = function (x, y, w, h, fit) {
        return R._engine.setViewBox.call(this, x, y, w, h, fit);
    };
    
    
    paperproto.top = paperproto.bottom = null;
    
    paperproto.raphael = R;
    var getOffset = function (elem) {
        var box = elem.getBoundingClientRect(),
            doc = elem.ownerDocument,
            body = doc.body,
            docElem = doc.documentElement,
            clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
            top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
            left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
        return {
            y: top,
            x: left
        };
    };
    
    paperproto.getElementByPoint = function (x, y) {
        var paper = this,
            svg = paper.canvas,
            target = g.doc.elementFromPoint(x, y);
        if (g.win.opera && target.tagName == "svg") {
            var so = getOffset(svg),
                sr = svg.createSVGRect();
            sr.x = x - so.x;
            sr.y = y - so.y;
            sr.width = sr.height = 1;
            var hits = svg.getIntersectionList(sr, null);
            if (hits.length) {
                target = hits[hits.length - 1];
            }
        }
        if (!target) {
            return null;
        }
        while (target.parentNode && target != svg.parentNode && !target.raphael) {
            target = target.parentNode;
        }
        target == paper.canvas.parentNode && (target = svg);
        target = target && target.raphael ? paper.getById(target.raphaelid) : null;
        return target;
    };
    
    paperproto.getById = function (id) {
        var bot = this.bottom;
        while (bot) {
            if (bot.id == id) {
                return bot;
            }
            bot = bot.next;
        }
        return null;
    };
    
    paperproto.forEach = function (callback, thisArg) {
        var bot = this.bottom;
        while (bot) {
            if (callback.call(thisArg, bot) === false) {
                return this;
            }
            bot = bot.next;
        }
        return this;
    };
    function x_y() {
        return this.x + S + this.y;
    }
    function x_y_w_h() {
        return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
    }
    
    elproto.getBBox = function (isWithoutTransform) {
        if (this.removed) {
            return {};
        }
        var _ = this._;
        if (isWithoutTransform) {
            if (_.dirty || !_.bboxwt) {
                this.realPath = getPath[this.type](this);
                _.bboxwt = pathDimensions(this.realPath);
                _.bboxwt.toString = x_y_w_h;
                _.dirty = 0;
            }
            return _.bboxwt;
        }
        if (_.dirty || _.dirtyT || !_.bbox) {
            if (_.dirty || !this.realPath) {
                _.bboxwt = 0;
                this.realPath = getPath[this.type](this);
            }
            _.bbox = pathDimensions(mapPath(this.realPath, this.matrix));
            _.bbox.toString = x_y_w_h;
            _.dirty = _.dirtyT = 0;
        }
        return _.bbox;
    };
    
    elproto.clone = function () {
        if (this.removed) {
            return null;
        }
        return this.paper[this.type]().attr(this.attr());
    };
    
    elproto.glow = function (glow) {
        if (this.type == "text") {
            return null;
        }
        glow = glow || {};
        var s = {
            width: (glow.width || 10) + (+this.attr("stroke-width") || 1),
            fill: glow.fill || false,
            opacity: glow.opacity || .5,
            offsetx: glow.offsetx || 0,
            offsety: glow.offsety || 0,
            color: glow.color || "#000"
        },
            c = s.width / 2,
            r = this.paper,
            out = r.set(),
            path = this.realPath || getPath[this.type](this);
        path = this.matrix ? mapPath(path, this.matrix) : path;
        for (var i = 1; i < c + 1; i++) {
            out.push(r.path(path).attr({
                stroke: s.color,
                fill: s.fill ? s.color : "none",
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "stroke-width": +(s.width / c * i).toFixed(3),
                opacity: +(s.opacity / c).toFixed(3)
            }));
        }
        return out.insertBefore(this).translate(s.offsetx, s.offsety);
    };
    var curveslengths = {},
    getPointAtSegmentLength = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            precision = 100,
            name = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y].join(),
            cache = curveslengths[name],
            old, dot;
        !cache && (curveslengths[name] = cache = {data: []});
        cache.timer && clearTimeout(cache.timer);
        cache.timer = setTimeout(function () {delete curveslengths[name];}, 2e3);
        if (length != null && !cache.precision) {
            var total = getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
            cache.precision = ~~total * 10;
            cache.data = [];
        }
        precision = cache.precision || precision;
        for (var i = 0; i < precision + 1; i++) {
            if (cache.data[i * precision]) {
                dot = cache.data[i * precision];
            } else {
                dot = R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i / precision);
                cache.data[i * precision] = dot;
            }
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (length != null && len >= length) {
                return dot;
            }
            old = dot;
        }
        if (length == null) {
            return len;
        }
    },
    getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C" + point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = ["M" + point.x, point.y + "C" + point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {x: point.x, y: point.y, alpha: point.alpha};
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
            point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
            return point;
        };
    };
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    
    R.getTotalLength = getTotalLength;
    
    R.getPointAtLength = getPointAtLength;
    
    R.getSubpath = function (path, from, to) {
        if (this.getTotalLength(path) - to < 1e-6) {
            return getSubpathsAtLength(path, from).end;
        }
        var a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    
    elproto.getTotalLength = function () {
        if (this.type != "path") {return;}
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    
    elproto.getPointAtLength = function (length) {
        if (this.type != "path") {return;}
        return getPointAtLength(this.attrs.path, length);
    };
    
    elproto.getSubpath = function (from, to) {
        if (this.type != "path") {return;}
        return R.getSubpath(this.attrs.path, from, to);
    };
    
    var ef = R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 1.7);
        },
        ">": function (n) {
            return pow(n, .48);
        },
        "<>": function (n) {
            var q = .48 - n / 1.04,
                Q = math.sqrt(.1734 + q * q),
                x = Q - q,
                X = pow(abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                y = -Q - q,
                Y = pow(abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                t = X + Y + .5;
            return (1 - t) * 3 * t * t + t * t * t;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == !!n) {
                return n;
            }
            return pow(2, -10 * n) * math.sin((n - .075) * (2 * PI) / .3) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };
    ef.easeIn = ef["ease-in"] = ef["<"];
    ef.easeOut = ef["ease-out"] = ef[">"];
    ef.easeInOut = ef["ease-in-out"] = ef["<>"];
    ef["back-in"] = ef.backIn;
    ef["back-out"] = ef.backOut;

    var animationElements = [],
        requestAnimFrame = window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.oRequestAnimationFrame      ||
                           window.msRequestAnimationFrame     ||
                           function (callback) {
                               setTimeout(callback, 16);
                           },
        animation = function () {
            var Now = +new Date,
                l = 0;
            for (; l < animationElements.length; l++) {
                var e = animationElements[l];
                if (e.el.removed || e.paused) {
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    that = e.el,
                    set = {},
                    now;
                if (e.initstatus) {
                    time = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * ms;
                    e.status = e.initstatus;
                    delete e.initstatus;
                    e.stop && animationElements.splice(l--, 1);
                } else {
                    e.status = (e.prev + (e.percent - e.prev) * (time / ms)) / e.anim.top;
                }
                if (time < 0) {
                    continue;
                }
                if (time < ms) {
                    var pos = easing(time / ms);
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                            case nu:
                                now = +from[attr] + pos * ms * diff[attr];
                                break;
                            case "colour":
                                now = "rgb(" + [
                                    upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                    upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                    upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                ].join(",") + ")";
                                break;
                            case "path":
                                now = [];
                                for (var i = 0, ii = from[attr].length; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                        now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                    now[i] = now[i].join(S);
                                }
                                now = now.join(S);
                                break;
                            case "transform":
                                if (diff[attr].real) {
                                    now = [];
                                    for (i = 0, ii = from[attr].length; i < ii; i++) {
                                        now[i] = [from[attr][i][0]];
                                        for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                            now[i][j] = from[attr][i][j] + pos * ms * diff[attr][i][j];
                                        }
                                    }
                                } else {
                                    var get = function (i) {
                                        return +from[attr][i] + pos * ms * diff[attr][i];
                                    };
                                    // now = [["r", get(2), 0, 0], ["t", get(3), get(4)], ["s", get(0), get(1), 0, 0]];
                                    now = [["m", get(0), get(1), get(2), get(3), get(4), get(5)]];
                                }
                                break;
                            case "csv":
                                if (attr == "clip-rect") {
                                    now = [];
                                    i = 4;
                                    while (i--) {
                                        now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                    }
                                }
                                break;
                            default:
                                var from2 = [].concat(from[attr]);
                                now = [];
                                i = that.paper.customAttributes[attr].length;
                                while (i--) {
                                    now[i] = +from2[i] + pos * ms * diff[attr][i];
                                }
                                break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    (function (id, that, anim) {
                        setTimeout(function () {
                            eve("anim.frame." + id, that, anim);
                        });
                    })(that.id, that, e.anim);
                } else {
                    (function(f, el, a) {
                        setTimeout(function() {
                            eve("anim.frame." + el.id, el, a);
                            eve("anim.finish." + el.id, el, a);
                            R.is(f, "function") && f.call(el);
                        });
                    })(e.callback, that, e.anim);
                    that.attr(to);
                    animationElements.splice(l--, 1);
                    if (e.repeat > 1 && !e.next) {
                        runAnimation(e.anim, e.el, e.anim.percents[0], null, e.totalOrigin, e.repeat - 1);
                    }
                    if (e.next && !e.stop) {
                        runAnimation(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat);
                    }
                }
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements.length && requestAnimFrame(animation);
        },
        upto255 = function (color) {
            return color > 255 ? 255 : color < 0 ? 0 : color;
        };
    
    elproto.animateWith = function (element, anim, params, ms, easing, callback) {
        var a = params ? R.animation(params, ms, easing, callback) : anim;
            status = element.status(anim);
        return this.animate(a).status(a, status * anim.ms / a.ms);
    };
    function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
        var cx = 3 * p1x,
            bx = 3 * (p2x - p1x) - cx,
            ax = 1 - cx - bx,
            cy = 3 * p1y,
            by = 3 * (p2y - p1y) - cy,
            ay = 1 - cy - by;
        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }
        function solve(x, epsilon) {
            var t = solveCurveX(x, epsilon);
            return ((ay * t + by) * t + cy) * t;
        }
        function solveCurveX(x, epsilon) {
            var t0, t1, t2, x2, d2, i;
            for(t2 = x, i = 0; i < 8; i++) {
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < epsilon) {
                    return t2;
                }
                d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                if (abs(d2) < 1e-6) {
                    break;
                }
                t2 = t2 - x2 / d2;
            }
            t0 = 0;
            t1 = 1;
            t2 = x;
            if (t2 < t0) {
                return t0;
            }
            if (t2 > t1) {
                return t1;
            }
            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (abs(x2 - x) < epsilon) {
                    return t2;
                }
                if (x > x2) {
                    t0 = t2;
                } else {
                    t1 = t2;
                }
                t2 = (t1 - t0) / 2 + t0;
            }
            return t2;
        }
        return solve(t, 1 / (200 * duration));
    }
    elproto.onAnimation = function (f) {
        f ? eve.on("anim.frame." + this.id, f) : eve.unbind("anim.frame." + this.id);
        return this;
    };
    function Animation(anim, ms) {
        var percents = [],
            newAnim = {};
        this.ms = ms;
        this.times = 1;
        if (anim) {
            for (var attr in anim) if (anim[has](attr)) {
                newAnim[toFloat(attr)] = anim[attr];
                percents.push(toFloat(attr));
            }
            percents.sort(sortByNumber);
        }
        this.anim = newAnim;
        this.top = percents[percents.length - 1];
        this.percents = percents;
    }
    
    Animation.prototype.delay = function (delay) {
        var a = new Animation(this.anim, this.ms);
        a.times = this.times;
        a.del = +delay || 0;
        return a;
    };
    
    Animation.prototype.repeat = function (times) { 
        var a = new Animation(this.anim, this.ms);
        a.del = this.del;
        a.times = math.floor(mmax(times, 0)) || 1;
        return a;
    };
    function runAnimation(anim, element, percent, status, totalOrigin, times) {
        percent = toFloat(percent);
        var params,
            isInAnim,
            isInAnimSet,
            percents = [],
            next,
            prev,
            timestamp,
            ms = anim.ms,
            from = {},
            to = {},
            diff = {};
        if (status) {
            for (i = 0, ii = animationElements.length; i < ii; i++) {
                var e = animationElements[i];
                if (e.el.id == element.id && e.anim == anim) {
                    if (e.percent != percent) {
                        animationElements.splice(i, 1);
                        isInAnimSet = 1;
                    } else {
                        isInAnim = e;
                    }
                    element.attr(e.totalOrigin);
                    break;
                }
            }
        } else {
            status = +to; // NaN
        }
        for (var i = 0, ii = anim.percents.length; i < ii; i++) {
            if (anim.percents[i] == percent || anim.percents[i] > status * anim.top) {
                percent = anim.percents[i];
                prev = anim.percents[i - 1] || 0;
                ms = ms / anim.top * (percent - prev);
                next = anim.percents[i + 1];
                params = anim.anim[percent];
                break;
            } else if (status) {
                element.attr(anim.anim[anim.percents[i]]);
            }
        }
        if (!params) {
            return;
        }
        if (!isInAnim) {
            for (attr in params) if (params[has](attr)) {
                if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
                    from[attr] = element.attr(attr);
                    (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                    to[attr] = params[attr];
                    switch (availableAnimAttrs[attr]) {
                        case nu:
                            diff[attr] = (to[attr] - from[attr]) / ms;
                            break;
                        case "colour":
                            from[attr] = R.getRGB(from[attr]);
                            var toColour = R.getRGB(to[attr]);
                            diff[attr] = {
                                r: (toColour.r - from[attr].r) / ms,
                                g: (toColour.g - from[attr].g) / ms,
                                b: (toColour.b - from[attr].b) / ms
                            };
                            break;
                        case "path":
                            var pathes = path2curve(from[attr], to[attr]),
                                toPath = pathes[1];
                            from[attr] = pathes[0];
                            diff[attr] = [];
                            for (i = 0, ii = from[attr].length; i < ii; i++) {
                                diff[attr][i] = [0];
                                for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                    diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                                }
                            }
                            break;
                        case "transform":
                            var _ = element._,
                                eq = equaliseTransform(_[attr], to[attr]);
                            if (eq) {
                                from[attr] = eq.from;
                                to[attr] = eq.to;
                                diff[attr] = [];
                                diff[attr].real = true;
                                for (i = 0, ii = from[attr].length; i < ii; i++) {
                                    diff[attr][i] = [from[attr][i][0]];
                                    for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                        diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
                                    }
                                }
                            } else {
                                var m = (element.matrix || new Matrix),
                                    to2 = {
                                        _: {transform: _.transform},
                                        getBBox: function () {
                                            return element.getBBox(1);
                                        }
                                    };
                                from[attr] = [
                                    m.a,
                                    m.b,
                                    m.c,
                                    m.d,
                                    m.e,
                                    m.f
                                ];
                                extractTransform(to2, to[attr]);
                                to[attr] = to2._.transform;
                                diff[attr] = [
                                    (to2.matrix.a - m.a) / ms,
                                    (to2.matrix.b - m.b) / ms,
                                    (to2.matrix.c - m.c) / ms,
                                    (to2.matrix.d - m.d) / ms,
                                    (to2.matrix.e - m.e) / ms,
                                    (to2.matrix.e - m.f) / ms
                                ];
                                // from[attr] = [_.sx, _.sy, _.deg, _.dx, _.dy];
                                // var to2 = {_:{}, getBBox: function () { return element.getBBox(); }};
                                // extractTransform(to2, to[attr]);
                                // diff[attr] = [
                                //     (to2._.sx - _.sx) / ms,
                                //     (to2._.sy - _.sy) / ms,
                                //     (to2._.deg - _.deg) / ms,
                                //     (to2._.dx - _.dx) / ms,
                                //     (to2._.dy - _.dy) / ms
                                // ];
                            }
                            break;
                        case "csv":
                            var values = Str(params[attr]).split(separator),
                                from2 = Str(from[attr]).split(separator);
                            if (attr == "clip-rect") {
                                from[attr] = from2;
                                diff[attr] = [];
                                i = from2.length;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            }
                            to[attr] = values;
                            break;
                        default:
                            values = [].concat(params[attr]);
                            from2 = [].concat(from[attr]);
                            diff[attr] = [];
                            i = element.paper.customAttributes[attr].length;
                            while (i--) {
                                diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
                            }
                            break;
                    }
                }
            }
            var easing = params.easing,
                easyeasy = R.easing_formulas[easing];
            if (!easyeasy) {
                easyeasy = Str(easing).match(bezierrg);
                if (easyeasy && easyeasy.length == 5) {
                    var curve = easyeasy;
                    easyeasy = function (t) {
                        return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
                    };
                } else {
                    easyeasy = pipe;
                }
            }
            timestamp = params.start || anim.start || +new Date;
            e = {
                anim: anim,
                percent: percent,
                timestamp: timestamp,
                start: timestamp + (anim.del || 0),
                status: 0,
                initstatus: status || 0,
                stop: false,
                ms: ms,
                easing: easyeasy,
                from: from,
                diff: diff,
                to: to,
                el: element,
                callback: params.callback,
                prev: prev,
                next: next,
                repeat: times || anim.times,
                origin: element.attr(),
                totalOrigin: totalOrigin
            };
            animationElements.push(e);
            if (status && !isInAnim && !isInAnimSet) {
                e.stop = true;
                e.start = new Date - ms * status;
                if (animationElements.length == 1) {
                    return animation();
                }
            }
            if (isInAnimSet) {
                e.start = new Date - e.ms * status;
            }
            animationElements.length == 1 && requestAnimFrame(animation);
        } else {
            isInAnim.initstatus = status;
            isInAnim.start = new Date - isInAnim.ms * status;
        }
        eve("anim.start." + element.id, element, anim);
    }
    
    R.animation = function (params, ms, easing, callback) {
        if (params instanceof Animation) {
            return params;
        }
        if (R.is(easing, "function") || !easing) {
            callback = callback || easing || null;
            easing = null;
        }
        params = Object(params);
        ms = +ms || 0;
        var p = {},
            json,
            attr;
        for (attr in params) if (params[has](attr) && toFloat(attr) != attr && toFloat(attr) + "%" != attr) {
            json = true;
            p[attr] = params[attr];
        }
        if (!json) {
            return new Animation(params, ms);
        } else {
            easing && (p.easing = easing);
            callback && (p.callback = callback);
            return new Animation({100: p}, ms);
        }
    };
    
    elproto.animate = function (params, ms, easing, callback) {
        var element = this;
        if (element.removed) {
            callback && callback.call(element);
            return element;
        }
        var anim = params instanceof Animation ? params : R.animation(params, ms, easing, callback);
        runAnimation(anim, element, anim.percents[0], null, element.attr());
        return element;
    };
    
    elproto.setTime = function (anim, value) {
        if (anim && value != null) {
            this.status(anim, mmin(value, anim.ms) / anim.ms);
        }
        return this;
    };
    
    elproto.status = function (anim, value) {
        var out = [],
            i = 0,
            len,
            e;
        if (value != null) {
            runAnimation(anim, this, -1, mmin(value, 1));
            return this;
        } else {
            len = animationElements.length;
            for (; i < len; i++) {
                e = animationElements[i];
                if (e.el.id == this.id && (!anim || e.anim == anim)) {
                    if (anim) {
                        return e.status;
                    }
                    out.push({
                        anim: e.anim,
                        status: e.status
                    });
                }
            }
            if (anim) {
                return 0;
            }
            return out;
        }
    };
    
    elproto.pause = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if (eve("anim.pause." + this.id, this, animationElements[i].anim) !== false) {
                animationElements[i].paused = true;
            }
        }
        return this;
    };
    
    elproto.resume = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            var e = animationElements[i];
            if (eve("anim.resume." + this.id, this, e.anim) !== false) {
                delete e.paused;
                this.status(e.anim, e.status);
            }
        }
        return this;
    };
    
    elproto.stop = function (anim) {
        for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if (eve("anim.stop." + this.id, this, animationElements[i].anim) !== false) {
                animationElements.splice(i--, 1);
            }
        }
        return this;
    };
    elproto.toString = function () {
        return "Rapha\xebl\u2019s object";
    };

    // Set
    var Set = function (items) {
        this.items = [];
        this.length = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (items[i] && (items[i].constructor == elproto.constructor || items[i].constructor == Set)) {
                    this[this.items.length] = this.items[this.items.length] = items[i];
                    this.length++;
                }
            }
        }
    },
    setproto = Set.prototype;
    
    setproto.push = function () {
        var item,
            len;
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == elproto.constructor || item.constructor == Set)) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    
    setproto.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    
    setproto.forEach = function (callback, thisArg) {
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            if (callback.call(thisArg, this.items[i]) === false) {
                return this;
            }
        }
        return this;
    };
    for (var method in elproto) if (elproto[has](method)) {
        setproto[method] = (function (methodname) {
            return function () {
                var arg = arguments;
                return this.forEach(function (el) {
                    el[methodname][apply](el, arg);
                });
            };
        })(method);
    }
    setproto.attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name.length; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items.length; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    
    setproto.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    
    setproto.splice = function (index, count, insertion) {
        index = index < 0 ? mmax(this.length + index, 0) : index;
        count = mmax(0, mmin(this.length - index, count));
        var tail = [],
            todel = [],
            args = [],
            i;
        for (i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (i = 0; i < count; i++) {
            todel.push(this[index + i]);
        }
        for (; i < this.length - index; i++) {
            tail.push(this[index + i]);
        }
        var arglen = args.length;
        for (i = 0; i < arglen + tail.length; i++) {
            this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
        }
        i = this.items.length = this.length -= count - arglen;
        while (this[i]) {
            delete this[i++];
        }
        return new Set(todel);
    };
    
    setproto.exclude = function (el) {
        for (var i = 0, ii = this.length, found; i < ii; i++) if (found || this[i] == el) {
            this[i] = this[i + 1];
            found = 1;
        }
        if (found) {
            this.length--;
            delete this[i];
            return true;
        }
    };
    setproto.animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items.length,
            i = len,
            item,
            set = this,
            collector;
        if (!len) {
            return this;
        }
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        var anim = R.animation(params, ms, easing, collector);
        item = this.items[--i].animate(anim);
        while (i--) {
            this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, anim);
        }
        return this;
    };
    setproto.insertAfter = function (el) {
        var i = this.items.length;
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    setproto.getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            w.push(box.x + box.width);
            h.push(box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    setproto.clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            s.push(this.items[i].clone());
        }
        return s;
    };
    setproto.toString = function () {
        return "Rapha\xebl\u2018s set";
    };

    
    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family].push(fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d.replace(/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    
    paperproto.getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family.replace(/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font.length; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    
    paperproto.print = function (x, y, string, font, size, origin, letter_spacing) {
        origin = origin || "middle"; // baseline|middle
        letter_spacing = mmax(mmin(letter_spacing || 0, 1), -1);
        var out = this.set(),
            letters = Str(string).split(E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox.split(separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters.length; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + (font.w * letter_spacing) : 0;
                curr && curr.d && out.push(this.path(curr.d).attr({
                    fill: "#000",
                    stroke: "none",
                    transform: [["t", shift * scale, 0]]
                }));
            }
            out.transform(["...s", scale, scale, top, height, "t", (x - top) / scale, (y - height) / scale]);
        }
        return out;
    };

    
    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args.length - 1 && (token = token.replace(formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    
    R.fullfill = (function () {
        var tokenRegex = /\{([^\}]+)\}/g,
            objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
            replacer = function (all, key, obj) {
                var res = obj;
                key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                    name = name || quotedName;
                    if (res) {
                        if (name in res) {
                            res = res[name];
                        }
                        typeof res == "function" && isFunc && (res = res());
                    }
                });
                res = (res == null || res == obj ? all : res) + "";
                return res;
            };
        return function (str, obj) {
            return String(str).replace(tokenRegex, function (all, key) {
                return replacer(all, key, obj);
            });
        };
    })();
    
    R.ninja = function () {
        oldRaphael.was ? (g.win.Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    
    R.st = setproto;
    // Firefox <3.6 fix: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
    (function (doc, loaded, f) {
        if (doc.readyState == null && doc.addEventListener){
            doc.addEventListener(loaded, f = function () {
                doc.removeEventListener(loaded, f, false);
                doc.readyState = "complete";
            }, false);
            doc.readyState = "loading";
        }
        function isLoaded() {
            (/in/).test(doc.readyState) ? setTimeout(isLoaded, 9) : R.eve("DOMload");
        }
        isLoaded();
    })(document, "DOMContentLoaded");

    oldRaphael.was ? (g.win.Raphael = R) : (Raphael = R);
    
    eve.on("DOMload", function () {
        loaded = true;
    });
})();

// ┌─────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2 - JavaScript Vector Library                               │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ SVG Module                                                          │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
// │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
// └─────────────────────────────────────────────────────────────────────┘ \\
window.Raphael.svg && function (R) {
    var has = "hasOwnProperty",
        Str = String,
        toFloat = parseFloat,
        toInt = parseInt,
        math = Math,
        mmax = math.max,
        abs = math.abs,
        pow = math.pow,
        separator = /[, ]+/,
        eve = R.eve,
        E = "",
        S = " ";
    var xlink = "http://www.w3.org/1999/xlink",
        markers = {
            block: "M5,0 0,2.5 5,5z",
            classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
            diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
            open: "M6,1 1,3.5 6,6",
            oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
        },
        markerCounter = {};
    R.toString = function () {
        return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
    };
    var $ = function (el, attr) {
        if (attr) {
            if (typeof el == "string") {
                el = $(el);
            }
            for (var key in attr) if (attr[has](key)) {
                if (key.substring(0, 6) == "xlink:") {
                    el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
                } else {
                    el.setAttribute(key, Str(attr[key]));
                }
            }
        } else {
            el = R._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
            el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        }
        return el;
    },
    gradients = {},
    rgGrad = /^url\(#(.*)\)$/,
    removeGradientFill = function (node, paper) {
        var oid = node.getAttribute("fill");
        oid = oid && oid.match(rgGrad);
        if (oid && !--gradients[oid[1]]) {
            delete gradients[oid[1]];
            paper.defs.removeChild(R._g.doc.getElementById(oid[1]));
        }
    },
    addGradientFill = function (element, gradient) {
        var type = "linear",
            id = element.id + gradient,
            fx = .5, fy = .5,
            o = element.node,
            SVG = element.paper,
            s = o.style,
            el = R._g.doc.getElementById(id);
        if (!el) {
            gradient = Str(gradient).replace(R._radial_gradient, function (all, _fx, _fy) {
                type = "radial";
                if (_fx && _fy) {
                    fx = toFloat(_fx);
                    fy = toFloat(_fy);
                    var dir = ((fy > .5) * 2 - 1);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                        (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                        fy != .5 &&
                        (fy = fy.toFixed(5) - 1e-5 * dir);
                }
                return E;
            });
            gradient = gradient.split(/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
                var vector = [0, 0, math.cos(R.rad(angle)), math.sin(R.rad(angle))],
                    max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
                vector[2] *= max;
                vector[3] *= max;
                if (vector[2] < 0) {
                    vector[0] = -vector[2];
                    vector[2] = 0;
                }
                if (vector[3] < 0) {
                    vector[1] = -vector[3];
                    vector[3] = 0;
                }
            }
            var dots = R._parseDots(gradient);
            if (!dots) {
                return null;
            }
            if (element.gradient) {
                SVG.defs.removeChild(element.gradient);
                delete element.gradient;
            }

            id = id.replace(/[\(\)\s,\xb0#]/g, "-");
            el = $(type + "Gradient", {id: id});
            element.gradient = el;
            $(el, type == "radial" ? {
                fx: fx,
                fy: fy
            } : {
                x1: vector[0],
                y1: vector[1],
                x2: vector[2],
                y2: vector[3],
                gradientTransform: element.matrix.invert()
            });
            SVG.defs.appendChild(el);
            for (var i = 0, ii = dots.length; i < ii; i++) {
                el.appendChild($("stop", {
                    offset: dots[i].offset ? dots[i].offset : i ? "100%" : "0%",
                    "stop-color": dots[i].color || "#fff"
                }));
            }
        }
        $(o, {
            fill: "url(#" + id + ")",
            opacity: 1,
            "fill-opacity": 1
        });
        s.fill = E;
        s.opacity = 1;
        s.fillOpacity = 1;
        return 1;
    },
    updatePosition = function (o) {
        var bbox = o.getBBox(1);
        $(o.pattern, {patternTransform: o.matrix.invert() + " translate(" + bbox.x + "," + bbox.y + ")"});
    },
    addArrow = function (o, value, isEnd) {
        if (o.type == "path") {
            var values = Str(value).toLowerCase().split("-"),
                p = o.paper,
                se = isEnd ? "end" : "start",
                node = o.node,
                attrs = o.attrs,
                stroke = attrs["stroke-width"],
                i = values.length,
                type = "classic",
                from,
                to,
                dx,
                refX,
                attr,
                w = 3,
                h = 3,
                t = 5;
            while (i--) {
                switch (values[i]) {
                    case "block":
                    case "classic":
                    case "oval":
                    case "diamond":
                    case "open":
                    case "none":
                        type = values[i];
                        break;
                    case "wide": h = 5; break;
                    case "narrow": h = 2; break;
                    case "long": w = 5; break;
                    case "short": w = 2; break;
                }
            }
            if (type == "open") {
                w += 2;
                h += 2;
                t += 2;
                dx = 1;
                refX = isEnd ? 4 : 1;
                attr = {
                    fill: "none",
                    stroke: attrs.stroke
                };
            } else {
                refX = dx = w / 2;
                attr = {
                    fill: attrs.stroke,
                    stroke: "none"
                };
            }
            if (o._.arrows) {
                if (isEnd) {
                    o._.arrows.endPath && markerCounter[o._.arrows.endPath]--;
                    o._.arrows.endMarker && markerCounter[o._.arrows.endMarker]--;
                } else {
                    o._.arrows.startPath && markerCounter[o._.arrows.startPath]--;
                    o._.arrows.startMarker && markerCounter[o._.arrows.startMarker]--;
                }
            } else {
                o._.arrows = {};
            }
            if (type != "none") {
                var pathId = "raphael-marker-" + type,
                    markerId = "raphael-marker-" + se + type + w + h;
                if (!R._g.doc.getElementById(pathId)) {
                    p.defs.appendChild($($("path"), {
                        "stroke-linecap": "round",
                        d: markers[type],
                        id: pathId
                    }));
                    markerCounter[pathId] = 1;
                } else {
                    markerCounter[pathId]++;
                }
                var marker = R._g.doc.getElementById(markerId),
                    use;
                if (!marker) {
                    marker = $($("marker"), {
                        id: markerId,
                        markerHeight: h,
                        markerWidth: w,
                        orient: "auto",
                        refX: refX,
                        refY: h / 2
                    });
                    use = $($("use"), {
                        "xlink:href": "#" + pathId,
                        transform: (isEnd ? " rotate(180 " + w / 2 + " " + h / 2 + ") " : S) + "scale(" + w / t + "," + h / t + ")",
                        "stroke-width": 1 / ((w / t + h / t) / 2)
                    });
                    marker.appendChild(use);
                    p.defs.appendChild(marker);
                    markerCounter[markerId] = 1;
                } else {
                    markerCounter[markerId]++;
                    use = marker.getElementsByTagName("use")[0];
                }
                $(use, attr);
                var delta = dx * (type != "diamond" && type != "oval");
                if (isEnd) {
                    from = o._.arrows.startdx * stroke || 0;
                    to = R.getTotalLength(attrs.path) - delta * stroke;
                } else {
                    from = delta * stroke;
                    to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                }
                attr = {};
                attr["marker-" + se] = "url(#" + markerId + ")";
                if (to || from) {
                    attr.d = Raphael.getSubpath(attrs.path, from, to);
                }
                $(node, attr);
                o._.arrows[se + "Path"] = pathId;
                o._.arrows[se + "Marker"] = markerId;
                o._.arrows[se + "dx"] = delta;
                o._.arrows[se + "Type"] = type;
                o._.arrows[se + "String"] = value;
            } else {
                if (isEnd) {
                    from = o._.arrows.startdx * stroke || 0;
                    to = R.getTotalLength(attrs.path) - from;
                } else {
                    from = 0;
                    to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                }
                o._.arrows[se + "Path"] && $(node, {d: Raphael.getSubpath(attrs.path, from, to)});
                delete o._.arrows[se + "Path"];
                delete o._.arrows[se + "Marker"];
                delete o._.arrows[se + "dx"];
                delete o._.arrows[se + "Type"];
                delete o._.arrows[se + "String"];
            }
            for (attr in markerCounter) if (markerCounter[has](attr) && !markerCounter[attr]) {
                var item = R._g.doc.getElementById(attr);
                item && item.parentNode.removeChild(item);
            }
        }
    },
    dasharray = {
        "": [0],
        "none": [0],
        "-": [3, 1],
        ".": [1, 1],
        "-.": [3, 1, 1, 1],
        "-..": [3, 1, 1, 1, 1, 1],
        ". ": [1, 3],
        "- ": [4, 3],
        "--": [8, 3],
        "- .": [4, 3, 1, 3],
        "--.": [8, 3, 1, 3],
        "--..": [8, 3, 1, 3, 1, 3]
    },
    addDashes = function (o, value, params) {
        value = dasharray[Str(value).toLowerCase()];
        if (value) {
            var width = o.attrs["stroke-width"] || "1",
                butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                dashes = [],
                i = value.length;
            while (i--) {
                dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
            }
            $(o.node, {"stroke-dasharray": dashes.join(",")});
        }
    },
    setFillAndStroke = function (o, params) {
        var node = o.node,
            attrs = o.attrs,
            vis = node.style.visibility;
        node.style.visibility = "hidden";
        for (var att in params) {
            if (params[has](att)) {
                if (!R._availableAttrs[has](att)) {
                    continue;
                }
                var value = params[att];
                attrs[att] = value;
                switch (att) {
                    case "blur":
                        o.blur(value);
                        break;
                    case "href":
                    case "title":
                    case "target":
                        var pn = node.parentNode;
                        if (pn.tagName.toLowerCase() != "a") {
                            var hl = $("a");
                            pn.insertBefore(hl, node);
                            hl.appendChild(node);
                            pn = hl;
                        }
                        if (att == "target" && value == "blank") {
                            pn.setAttributeNS(xlink, "show", "new");
                        } else {
                            pn.setAttributeNS(xlink, att, value);
                        }
                        break;
                    case "cursor":
                        node.style.cursor = value;
                        break;
                    case "transform":
                        o.transform(value);
                        break;
                    case "arrow-start":
                        addArrow(o, value);
                        break;
                    case "arrow-end":
                        addArrow(o, value, 1);
                        break;
                    case "clip-rect":
                        var rect = Str(value).split(separator);
                        if (rect.length == 4) {
                            o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                            var el = $("clipPath"),
                                rc = $("rect");
                            el.id = R.createUUID();
                            $(rc, {
                                x: rect[0],
                                y: rect[1],
                                width: rect[2],
                                height: rect[3]
                            });
                            el.appendChild(rc);
                            o.paper.defs.appendChild(el);
                            $(node, {"clip-path": "url(#" + el.id + ")"});
                            o.clip = rc;
                        }
                        if (!value) {
                            var clip = R._g.doc.getElementById(node.getAttribute("clip-path").replace(/(^url\(#|\)$)/g, E));
                            clip && clip.parentNode.removeChild(clip);
                            $(node, {"clip-path": E});
                            delete o.clip;
                        }
                    break;
                    case "path":
                        if (o.type == "path") {
                            $(node, {d: value ? attrs.path = R._pathToAbsolute(value) : "M0,0"});
                            o._.dirty = 1;
                            if (o._.arrows) {
                                "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                                "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                            }
                        }
                        break;
                    case "width":
                        node.setAttribute(att, value);
                        o._.dirty = 1;
                        if (attrs.fx) {
                            att = "x";
                            value = attrs.x;
                        } else {
                            break;
                        }
                    case "x":
                        if (attrs.fx) {
                            value = -attrs.x - (attrs.width || 0);
                        }
                    case "rx":
                        if (att == "rx" && o.type == "rect") {
                            break;
                        }
                    case "cx":
                        node.setAttribute(att, value);
                        o.pattern && updatePosition(o);
                        o._.dirty = 1;
                        break;
                    case "height":
                        node.setAttribute(att, value);
                        o._.dirty = 1;
                        if (attrs.fy) {
                            att = "y";
                            value = attrs.y;
                        } else {
                            break;
                        }
                    case "y":
                        if (attrs.fy) {
                            value = -attrs.y - (attrs.height || 0);
                        }
                    case "ry":
                        if (att == "ry" && o.type == "rect") {
                            break;
                        }
                    case "cy":
                        node.setAttribute(att, value);
                        o.pattern && updatePosition(o);
                        o._.dirty = 1;
                        break;
                    case "r":
                        if (o.type == "rect") {
                            $(node, {rx: value, ry: value});
                        } else {
                            node.setAttribute(att, value);
                        }
                        o._.dirty = 1;
                        break;
                    case "src":
                        if (o.type == "image") {
                            node.setAttributeNS(xlink, "href", value);
                        }
                        break;
                    case "stroke-width":
                        if (o._.sx != 1 || o._.sy != 1) {
                            value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
                        }
                        if (o.paper._vbSize) {
                            value *= o.paper._vbSize;
                        }
                        node.setAttribute(att, value);
                        if (attrs["stroke-dasharray"]) {
                            addDashes(o, attrs["stroke-dasharray"], params);
                        }
                        if (o._.arrows) {
                            "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                            "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                        }
                        break;
                    case "stroke-dasharray":
                        addDashes(o, value, params);
                        break;
                    case "fill":
                        var isURL = Str(value).match(R._ISURL);
                        if (isURL) {
                            el = $("pattern");
                            var ig = $("image");
                            el.id = R.createUUID();
                            $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                            $(ig, {x: 0, y: 0, "xlink:href": isURL[1]});
                            el.appendChild(ig);

                            (function (el) {
                                R._preload(isURL[1], function () {
                                    var w = this.offsetWidth,
                                        h = this.offsetHeight;
                                    $(el, {width: w, height: h});
                                    $(ig, {width: w, height: h});
                                    o.paper.safari();
                                });
                            })(el);
                            o.paper.defs.appendChild(el);
                            node.style.fill = "url(#" + el.id + ")";
                            $(node, {fill: "url(#" + el.id + ")"});
                            o.pattern = el;
                            o.pattern && updatePosition(o);
                            break;
                        }
                        var clr = R.getRGB(value);
                        if (!clr.error) {
                            delete params.gradient;
                            delete attrs.gradient;
                            !R.is(attrs.opacity, "undefined") &&
                                R.is(params.opacity, "undefined") &&
                                $(node, {opacity: attrs.opacity});
                            !R.is(attrs["fill-opacity"], "undefined") &&
                                R.is(params["fill-opacity"], "undefined") &&
                                $(node, {"fill-opacity": attrs["fill-opacity"]});
                        } else if ((o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value)) {
                            if ("opacity" in attrs || "fill-opacity" in attrs) {
                                var gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
                                if (gradient) {
                                    var stops = gradient.getElementsByTagName("stop");
                                    $(stops[stops.length - 1], {"stop-opacity": ("opacity" in attrs ? attrs.opacity : 1) * ("fill-opacity" in attrs ? attrs["fill-opacity"] : 1)});
                                }
                            }
                            attrs.gradient = value;
                            attrs.fill = "none";
                            break;
                        }
                        clr[has]("opacity") && $(node, {"fill-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                    case "stroke":
                        clr = R.getRGB(value);
                        node.setAttribute(att, clr.hex);
                        att == "stroke" && clr[has]("opacity") && $(node, {"stroke-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                        if (att == "stroke" && o._.arrows) {
                            "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                            "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                        }
                        break;
                    case "gradient":
                        (o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value);
                        break;
                    case "opacity":
                        if (attrs.gradient && !attrs[has]("stroke-opacity")) {
                            $(node, {"stroke-opacity": value > 1 ? value / 100 : value});
                        }
                        // fall
                    case "fill-opacity":
                        if (attrs.gradient) {
                            gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
                            if (gradient) {
                                stops = gradient.getElementsByTagName("stop");
                                $(stops[stops.length - 1], {"stop-opacity": value});
                            }
                            break;
                        }
                    default:
                        att == "font-size" && (value = toInt(value, 10) + "px");
                        var cssrule = att.replace(/(\-.)/g, function (w) {
                            return w.substring(1).toUpperCase();
                        });
                        node.style[cssrule] = value;
                        o._.dirty = 1;
                        node.setAttribute(att, value);
                        break;
                }
            }
        }

        tuneText(o, params);
        node.style.visibility = vis;
    },
    leading = 1.2,
    tuneText = function (el, params) {
        if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
            return;
        }
        var a = el.attrs,
            node = el.node,
            fontSize = node.firstChild ? toInt(R._g.doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;

        if (params[has]("text")) {
            a.text = params.text;
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            var texts = Str(params.text).split("\n"),
                tspans = [],
                tspan;
            for (var i = 0, ii = texts.length; i < ii; i++) {
                tspan = $("tspan");
                i && $(tspan, {dy: fontSize * leading, x: a.x});
                tspan.appendChild(R._g.doc.createTextNode(texts[i]));
                node.appendChild(tspan);
                tspans[i] = tspan;
            }
        } else {
            tspans = node.getElementsByTagName("tspan");
            for (i = 0, ii = tspans.length; i < ii; i++) if (i) {
                $(tspans[i], {dy: fontSize * leading, x: a.x});
            } else {
                $(tspans[0], {dy: 0});
            }
        }
        $(node, {x: a.x, y: a.y});
        el._.dirty = 1;
        var bb = el._getBBox(),
            dif = a.y - (bb.y + bb.height / 2);
        dif && R.is(dif, "finite") && $(tspans[0], {dy: dif});
    },
    Element = function (node, svg) {
        var X = 0,
            Y = 0;
        
        this[0] = this.node = node;
        
        node.raphael = true;
        
        this.id = R._oid++;
        node.raphaelid = this.id;
        this.matrix = R.matrix();
        this.realPath = null;
        
        this.paper = svg;
        this.attrs = this.attrs || {};
        this._ = {
            transform: [],
            sx: 1,
            sy: 1,
            deg: 0,
            dx: 0,
            dy: 0,
            dirty: 1
        };
        !svg.bottom && (svg.bottom = this);
        
        this.prev = svg.top;
        svg.top && (svg.top.next = this);
        svg.top = this;
        
        this.next = null;
    },
    elproto = R.el;

    Element.prototype = elproto;
    elproto.constructor = Element;

    R._engine.path = function (pathString, SVG) {
        var el = $("path");
        SVG.canvas && SVG.canvas.appendChild(el);
        var p = new Element(el, SVG);
        p.type = "path";
        setFillAndStroke(p, {
            fill: "none",
            stroke: "#000",
            path: pathString
        });
        return p;
    };
    
    elproto.rotate = function (deg, cx, cy) {
        if (this.removed) {
            return this;
        }
        deg = Str(deg).split(separator);
        if (deg.length - 1) {
            cx = toFloat(deg[1]);
            cy = toFloat(deg[2]);
        }
        deg = toFloat(deg[0]);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
            cx = bbox.x + bbox.width / 2;
            cy = bbox.y + bbox.height / 2;
        }
        this.transform(this._.transform.concat([["r", deg, cx, cy]]));
        return this;
    };
    
    elproto.scale = function (sx, sy, cx, cy) {
        if (this.removed) {
            return this;
        }
        sx = Str(sx).split(separator);
        if (sx.length - 1) {
            sy = toFloat(sx[1]);
            cx = toFloat(sx[2]);
            cy = toFloat(sx[3]);
        }
        sx = toFloat(sx[0]);
        (sy == null) && (sy = sx);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
        }
        cx = cx == null ? bbox.x + bbox.width / 2 : cx;
        cy = cy == null ? bbox.y + bbox.height / 2 : cy;
        this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
        return this;
    };
    
    elproto.translate = function (dx, dy) {
        if (this.removed) {
            return this;
        }
        dx = Str(dx).split(separator);
        if (dx.length - 1) {
            dy = toFloat(dx[1]);
        }
        dx = toFloat(dx[0]) || 0;
        dy = +dy || 0;
        this.transform(this._.transform.concat([["t", dx, dy]]));
        return this;
    };
    
    elproto.transform = function (tstr) {
        var _ = this._;
        if (tstr == null) {
            return _.transform;
        }
        R._extractTransform(this, tstr);

        this.clip && $(this.clip, {transform: this.matrix.invert()});
        this.pattern && updatePosition(this);
        this.node && $(this.node, {transform: this.matrix});
    
        if (_.sx != 1 || _.sy != 1) {
            var sw = this.attrs[has]("stroke-width") ? this.attrs["stroke-width"] : 1;
            this.attr({"stroke-width": sw});
        }

        return this;
    };
    
    elproto.hide = function () {
        !this.removed && this.paper.safari(this.node.style.display = "none");
        return this;
    };
    
    elproto.show = function () {
        !this.removed && this.paper.safari(this.node.style.display = "");
        return this;
    };
    
    elproto.remove = function () {
        if (this.removed) {
            return;
        }
        eve.unbind("*.*." + this.id);
        R._tear(this, this.paper);
        this.node.parentNode.removeChild(this.node);
        for (var i in this) {
            delete this[i];
        }
        this.removed = true;
    };
    elproto._getBBox = function () {
        if (this.node.style.display == "none") {
            this.show();
            var hide = true;
        }
        var bbox = {};
        try {
            bbox = this.node.getBBox();
        } catch(e) {
            // Firefox 3.0.x plays badly here
        } finally {
            bbox = bbox || {};
        }
        hide && this.hide();
        return bbox;
    };
    
    elproto.attr = function (name, value) {
        if (this.removed) {
            return this;
        }
        if (name == null) {
            var res = {};
            for (var a in this.attrs) if (this.attrs[has](a)) {
                res[a] = this.attrs[a];
            }
            res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
            res.transform = this._.transform;
            return res;
        }
        if (value == null && R.is(name, "string")) {
            if (name == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                return this.attrs.gradient;
            }
            if (name == "transform") {
                return this._.transform;
            }
            var names = name.split(separator),
                out = {};
            for (var i = 0, ii = names.length; i < ii; i++) {
                name = names[i];
                if (name in this.attrs) {
                    out[name] = this.attrs[name];
                } else if (R.is(this.paper.customAttributes[name], "function")) {
                    out[name] = this.paper.customAttributes[name].def;
                } else {
                    out[name] = R._availableAttrs[name];
                }
            }
            return ii - 1 ? out : out[names[0]];
        }
        if (value == null && R.is(name, "array")) {
            out = {};
            for (i = 0, ii = name.length; i < ii; i++) {
                out[name[i]] = this.attr(name[i]);
            }
            return out;
        }
        if (value != null) {
            var params = {};
            params[name] = value;
        } else if (name != null && R.is(name, "object")) {
            params = name;
        }
        for (var key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
            var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
            this.attrs[key] = params[key];
            for (var subkey in par) if (par[has](subkey)) {
                params[subkey] = par[subkey];
            }
        }
        setFillAndStroke(this, params);
        return this;
    };
    
    elproto.toFront = function () {
        if (this.removed) {
            return this;
        }
        this.node.parentNode.appendChild(this.node);
        var svg = this.paper;
        svg.top != this && R._tofront(this, svg);
        return this;
    };
    
    elproto.toBack = function () {
        if (this.removed) {
            return this;
        }
        if (this.node.parentNode.firstChild != this.node) {
            this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
            R._toback(this, this.paper);
            var svg = this.paper;
        }
        return this;
    };
    
    elproto.insertAfter = function (element) {
        if (this.removed) {
            return this;
        }
        var node = element.node || element[element.length - 1].node;
        if (node.nextSibling) {
            node.parentNode.insertBefore(this.node, node.nextSibling);
        } else {
            node.parentNode.appendChild(this.node);
        }
        R._insertafter(this, element, this.paper);
        return this;
    };
    
    elproto.insertBefore = function (element) {
        if (this.removed) {
            return this;
        }
        var node = element.node || element[0].node;
        node.parentNode.insertBefore(this.node, node);
        R._insertbefore(this, element, this.paper);
        return this;
    };
    elproto.blur = function (size) {
        // Experimental. No Safari support. Use it on your own risk.
        var t = this;
        if (+size !== 0) {
            var fltr = $("filter"),
                blur = $("feGaussianBlur");
            t.attrs.blur = size;
            fltr.id = R.createUUID();
            $(blur, {stdDeviation: +size || 1.5});
            fltr.appendChild(blur);
            t.paper.defs.appendChild(fltr);
            t._blur = fltr;
            $(t.node, {filter: "url(#" + fltr.id + ")"});
        } else {
            if (t._blur) {
                t._blur.parentNode.removeChild(t._blur);
                delete t._blur;
                delete t.attrs.blur;
            }
            t.node.removeAttribute("filter");
        }
    };
    R._engine.circle = function (svg, x, y, r) {
        var el = $("circle");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
        res.type = "circle";
        $(el, res.attrs);
        return res;
    };
    R._engine.rect = function (svg, x, y, w, h, r) {
        var el = $("rect");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
        res.type = "rect";
        $(el, res.attrs);
        return res;
    };
    R._engine.ellipse = function (svg, x, y, rx, ry) {
        var el = $("ellipse");
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
        res.type = "ellipse";
        $(el, res.attrs);
        return res;
    };
    R._engine.image = function (svg, src, x, y, w, h) {
        var el = $("image");
        $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
        el.setAttributeNS(xlink, "href", src);
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {x: x, y: y, width: w, height: h, src: src};
        res.type = "image";
        return res;
    };
    R._engine.text = function (svg, x, y, text) {
        var el = $("text");
        // $(el, {x: x, y: y, "text-anchor": "middle"});
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            "text-anchor": "middle",
            text: text,
            font: R._availableAttrs.font,
            stroke: "none",
            fill: "#000"
        };
        res.type = "text";
        setFillAndStroke(res, res.attrs);
        return res;
    };
    R._engine.setSize = function (width, height) {
        this.width = width || this.width;
        this.height = height || this.height;
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        if (this._viewBox) {
            this.setViewBox.apply(this, this._viewBox);
        }
        return this;
    };
    R._engine.create = function () {
        var con = R._getContainer.apply(0, arguments),
            container = con && con.container,
            x = con.x,
            y = con.y,
            width = con.width,
            height = con.height;
        if (!container) {
            throw new Error("SVG container not found.");
        }
        var cnvs = $("svg"),
            css = "overflow:hidden;",
            isFloating;
        x = x || 0;
        y = y || 0;
        width = width || 512;
        height = height || 342;
        $(cnvs, {
            height: height,
            version: 1.1,
            width: width,
            xmlns: "http://www.w3.org/2000/svg"
        });
        if (container == 1) {
            cnvs.style.cssText = css + "position:absolute;left:" + x + "px;top:" + y + "px";
            R._g.doc.body.appendChild(cnvs);
            isFloating = 1;
        } else {
            cnvs.style.cssText = css + "position:relative";
            if (container.firstChild) {
                container.insertBefore(cnvs, container.firstChild);
            } else {
                container.appendChild(cnvs);
            }
        }
        container = new R._Paper;
        container.width = width;
        container.height = height;
        container.canvas = cnvs;
        // plugins.call(container, container, R.fn);
        container.clear();
        container._left = container._top = 0;
        isFloating && (container.renderfix = function () {});
        container.renderfix();
        return container;
    };
    R._engine.setViewBox = function (x, y, w, h, fit) {
        eve("setViewBox", this, this._viewBox, [x, y, w, h, fit]);
        var size = mmax(w / this.width, h / this.height),
            top = this.top,
            aspectRatio = fit ? "meet" : "xMinYMin",
            vb,
            sw;
        if (x == null) {
            if (this._vbSize) {
                size = 1;
            }
            delete this._vbSize;
            vb = "0 0 " + this.width + S + this.height;
        } else {
            this._vbSize = size;
            vb = x + S + y + S + w + S + h;
        }
        $(this.canvas, {
            viewBox: vb,
            preserveAspectRatio: aspectRatio
        });
        while (size && top) {
            sw = "stroke-width" in top.attrs ? top.attrs["stroke-width"] : 1;
            top.attr({"stroke-width": sw});
            top._.dirty = 1;
            top._.dirtyT = 1;
            top = top.prev;
        }
        this._viewBox = [x, y, w, h, !!fit];
        return this;
    };
    
    R.prototype.renderfix = function () {
        var cnvs = this.canvas,
            s = cnvs.style,
            pos = cnvs.getScreenCTM() || cnvs.createSVGMatrix(),
            left = -pos.e % 1,
            top = -pos.f % 1;
        if (left || top) {
            if (left) {
                this._left = (this._left + left) % 1;
                s.left = this._left + "px";
            }
            if (top) {
                this._top = (this._top + top) % 1;
                s.top = this._top + "px";
            }
        }
    };
    
    R.prototype.clear = function () {
        R.eve("clear", this);
        var c = this.canvas;
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        this.bottom = this.top = null;
        (this.desc = $("desc")).appendChild(R._g.doc.createTextNode("Created with Rapha\xebl " + R.version));
        c.appendChild(this.desc);
        c.appendChild(this.defs = $("defs"));
    };
    
    R.prototype.remove = function () {
        eve("remove", this);
        this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
        for (var i in this) {
            this[i] = removed(i);
        }
    };
    var setproto = R.st;
    for (var method in elproto) if (elproto[has](method) && !setproto[has](method)) {
        setproto[method] = (function (methodname) {
            return function () {
                var arg = arguments;
                return this.forEach(function (el) {
                    el[methodname].apply(el, arg);
                });
            };
        })(method);
    }
}(window.Raphael);

// ┌─────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2 - JavaScript Vector Library                               │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ VML Module                                                          │ \\
// ├─────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
// │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
// └─────────────────────────────────────────────────────────────────────┘ \\
window.Raphael.vml && function (R) {
    var has = "hasOwnProperty",
        Str = String,
        toFloat = parseFloat,
        math = Math,
        round = math.round,
        mmax = math.max,
        mmin = math.min,
        abs = math.abs,
        fillString = "fill",
        separator = /[, ]+/,
        eve = R.eve,
        ms = " progid:DXImageTransform.Microsoft",
        S = " ",
        E = "",
        map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
        bites = /([clmz]),?([^clmz]*)/gi,
        blurregexp = / progid:\S+Blur\([^\)]+\)/g,
        val = /-?[^,\s-]+/g,
        cssDot = "position:absolute;left:0;top:0;width:1px;height:1px",
        zoom = 21600,
        pathTypes = {path: 1, rect: 1, image: 1},
        ovalTypes = {circle: 1, ellipse: 1},
        path2vml = function (path) {
            var total =  /[ahqstv]/ig,
                command = R._pathToAbsolute;
            Str(path).match(total) && (command = R._path2curve);
            total = /[clmz]/g;
            if (command == R._pathToAbsolute && !Str(path).match(total)) {
                var res = Str(path).replace(bites, function (all, command, args) {
                    var vals = [],
                        isMove = command.toLowerCase() == "m",
                        res = map[command];
                    args.replace(val, function (value) {
                        if (isMove && vals.length == 2) {
                            res += vals + map[command == "m" ? "l" : "L"];
                            vals = [];
                        }
                        vals.push(round(value * zoom));
                    });
                    return res + vals;
                });
                return res;
            }
            var pa = command(path), p, r;
            res = [];
            for (var i = 0, ii = pa.length; i < ii; i++) {
                p = pa[i];
                r = pa[i][0].toLowerCase();
                r == "z" && (r = "x");
                for (var j = 1, jj = p.length; j < jj; j++) {
                    r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                }
                res.push(r);
            }
            return res.join(S);
        },
        compensation = function (deg, dx, dy) {
            var m = R.matrix();
            m.rotate(-deg, .5, .5);
            return {
                dx: m.x(dx, dy),
                dy: m.y(dx, dy)
            };
        },
        setCoords = function (p, sx, sy, dx, dy, deg) {
            var _ = p._,
                m = p.matrix,
                fillpos = _.fillpos,
                o = p.node,
                s = o.style,
                y = 1,
                flip = "",
                dxdy,
                kx = zoom / sx,
                ky = zoom / sy;
            s.visibility = "hidden";
            if (!sx || !sy) {
                return;
            }
            o.coordsize = abs(kx) + S + abs(ky);
            s.rotation = deg * (sx * sy < 0 ? -1 : 1);
            if (deg) {
                var c = compensation(deg, dx, dy);
                dx = c.dx;
                dy = c.dy;
            }
            sx < 0 && (flip += "x");
            sy < 0 && (flip += " y") && (y = -1);
            s.flip = flip;
            o.coordorigin = (dx * -kx) + S + (dy * -ky);
            if (fillpos || _.fillsize) {
                var fill = o.getElementsByTagName(fillString);
                fill = fill && fill[0];
                o.removeChild(fill);
                if (fillpos) {
                    c = compensation(deg, m.x(fillpos[0], fillpos[1]), m.y(fillpos[0], fillpos[1]));
                    fill.position = c.dx * y + S + c.dy * y;
                }
                if (_.fillsize) {
                    fill.size = _.fillsize[0] * abs(sx) + S + _.fillsize[1] * abs(sy);
                }
                o.appendChild(fill);
            }
            s.visibility = "visible";
        };
    R.toString = function () {
        return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
    };
    addArrow = function (o, value, isEnd) {
        var values = Str(value).toLowerCase().split("-"),
            se = isEnd ? "end" : "start",
            i = values.length,
            type = "classic",
            w = "medium",
            h = "medium";
        while (i--) {
            switch (values[i]) {
                case "block":
                case "classic":
                case "oval":
                case "diamond":
                case "open":
                case "none":
                    type = values[i];
                    break;
                case "wide":
                case "narrow": h = values[i]; break;
                case "long":
                case "short": w = values[i]; break;
            }
        }
        var stroke = o.node.getElementsByTagName("stroke")[0];
        stroke[se + "arrow"] = type;
        stroke[se + "arrowlength"] = w;
        stroke[se + "arrowwidth"] = h;
    };
    setFillAndStroke = function (o, params) {
        // o.paper.canvas.style.display = "none";
        o.attrs = o.attrs || {};
        var node = o.node,
            a = o.attrs,
            s = node.style,
            xy,
            newpath = pathTypes[o.type] && (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.cx != a.cx || params.cy != a.cy || params.rx != a.rx || params.ry != a.ry || params.r != a.r),
            isOval = ovalTypes[o.type] && (a.cx != params.cx || a.cy != params.cy || a.r != params.r || a.rx != params.rx || a.ry != params.ry),
            res = o;


        for (var par in params) if (params[has](par)) {
            a[par] = params[par];
        }
        if (newpath) {
            a.path = R._getPath[o.type](o);
            o._.dirty = 1;
        }
        params.href && (node.href = params.href);
        params.title && (node.title = params.title);
        params.target && (node.target = params.target);
        params.cursor && (s.cursor = params.cursor);
        "blur" in params && o.blur(params.blur);
        if (params.path && o.type == "path" || newpath) {
            node.path = path2vml(~Str(a.path).toLowerCase().indexOf("r") ? R._pathToAbsolute(a.path) : a.path);
            if (o.type == "image") {
                o._.fillpos = [a.x, a.y];
                o._.fillsize = [a.width, a.height];
                setCoords(o, 1, 1, 0, 0, 0);
            }
        }
        "transform" in params && o.transform(params.transform);
        if (isOval) {
            var cx = +a.cx,
                cy = +a.cy,
                rx = +a.rx || +a.r || 0,
                ry = +a.ry || +a.r || 0;
            node.path = R.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", round((cx - rx) * zoom), round((cy - ry) * zoom), round((cx + rx) * zoom), round((cy + ry) * zoom), round(cx * zoom));
        }
        if ("clip-rect" in params) {
            var rect = Str(params["clip-rect"]).split(separator);
            if (rect.length == 4) {
                rect[2] = +rect[2] + (+rect[0]);
                rect[3] = +rect[3] + (+rect[1]);
                var div = node.clipRect || R._g.doc.createElement("div"),
                    dstyle = div.style;
                dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                if (!node.clipRect) {
                    dstyle.position = "absolute";
                    dstyle.top = 0;
                    dstyle.left = 0;
                    dstyle.width = o.paper.width + "px";
                    dstyle.height = o.paper.height + "px";
                    node.parentNode.insertBefore(div, node);
                    div.appendChild(node);
                    node.clipRect = div;
                }
            }
            if (!params["clip-rect"]) {
                node.clipRect && (node.clipRect.style.clip = E);
            }
        }
        if (o.textpath) {
            var textpathStyle = o.textpath.style;
            params.font && (textpathStyle.font = params.font);
            params["font-family"] && (textpathStyle.fontFamily = '"' + params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, E) + '"');
            params["font-size"] && (textpathStyle.fontSize = params["font-size"]);
            params["font-weight"] && (textpathStyle.fontWeight = params["font-weight"]);
            params["font-style"] && (textpathStyle.fontStyle = params["font-style"]);
        }
        if ("arrow-start" in params) {
            addArrow(res, params["arrow-start"]);
        }
        if ("arrow-end" in params) {
            addArrow(res, params["arrow-end"], 1);
        }
        if (params.opacity != null || 
            params["stroke-width"] != null ||
            params.fill != null ||
            params.src != null ||
            params.stroke != null ||
            params["stroke-width"] != null ||
            params["stroke-opacity"] != null ||
            params["fill-opacity"] != null ||
            params["stroke-dasharray"] != null ||
            params["stroke-miterlimit"] != null ||
            params["stroke-linejoin"] != null ||
            params["stroke-linecap"] != null) {
            var fill = node.getElementsByTagName(fillString),
                newfill = false;
            fill = fill && fill[0];
            !fill && (newfill = fill = createNode(fillString));
            if (o.type == "image" && params.src) {
                fill.src = params.src;
            }
            params.fill && (fill.on = true);
            if (fill.on == null || params.fill == "none" || params.fill === null) {
                fill.on = false;
            }
            if (fill.on && params.fill) {
                var isURL = Str(params.fill).match(R._ISURL);
                if (isURL) {
                    fill.parentNode == node && node.removeChild(fill);
                    fill.rotate = true;
                    fill.src = isURL[1];
                    fill.type = "tile";
                    var bbox = o.getBBox(1);
                    fill.position = bbox.x + S + bbox.y;
                    o._.fillpos = [bbox.x, bbox.y];

                    R._preload(isURL[1], function () {
                        o._.fillsize = [this.offsetWidth, this.offsetHeight];
                    });
                } else {
                    fill.color = R.getRGB(params.fill).hex;
                    fill.src = E;
                    fill.type = "solid";
                    if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill, fill)) {
                        a.fill = "none";
                        a.gradient = params.fill;
                        fill.rotate = false;
                    }
                }
            }
            if ("fill-opacity" in params || "opacity" in params) {
                var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                opacity = mmin(mmax(opacity, 0), 1);
                fill.opacity = opacity;
                if (fill.src) {
                    fill.color = "none";
                }
            }
            node.appendChild(fill);
            var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
            newstroke = false;
            !stroke && (newstroke = stroke = createNode("stroke"));
            if ((params.stroke && params.stroke != "none") ||
                params["stroke-width"] ||
                params["stroke-opacity"] != null ||
                params["stroke-dasharray"] ||
                params["stroke-miterlimit"] ||
                params["stroke-linejoin"] ||
                params["stroke-linecap"]) {
                stroke.on = true;
            }
            (params.stroke == "none" || params.stroke === null || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
            var strokeColor = R.getRGB(params.stroke);
            stroke.on && params.stroke && (stroke.color = strokeColor.hex);
            opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
            var width = (toFloat(params["stroke-width"]) || 1) * .75;
            opacity = mmin(mmax(opacity, 0), 1);
            params["stroke-width"] == null && (width = a["stroke-width"]);
            params["stroke-width"] && (stroke.weight = width);
            width && width < 1 && (opacity *= width) && (stroke.weight = 1);
            stroke.opacity = opacity;
        
            params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
            stroke.miterlimit = params["stroke-miterlimit"] || 8;
            params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
            if (params["stroke-dasharray"]) {
                var dasharray = {
                    "-": "shortdash",
                    ".": "shortdot",
                    "-.": "shortdashdot",
                    "-..": "shortdashdotdot",
                    ". ": "dot",
                    "- ": "dash",
                    "--": "longdash",
                    "- .": "dashdot",
                    "--.": "longdashdot",
                    "--..": "longdashdotdot"
                };
                stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
            }
            newstroke && node.appendChild(stroke);
        }
        if (res.type == "text") {
            res.paper.canvas.style.display = E;
            var span = res.paper.span,
                m = 100,
                fontSize = a.font && a.font.match(/\d+(?:\.\d*)?(?=px)/);
            s = span.style;
            a.font && (s.font = a.font);
            a["font-family"] && (s.fontFamily = a["font-family"]);
            a["font-weight"] && (s.fontWeight = a["font-weight"]);
            a["font-style"] && (s.fontStyle = a["font-style"]);
            fontSize = toFloat(fontSize ? fontSize[0] : a["font-size"]);
            s.fontSize = fontSize * m + "px";
            res.textpath.string && (span.innerHTML = Str(res.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
            var brect = span.getBoundingClientRect();
            res.W = a.w = (brect.right - brect.left) / m;
            res.H = a.h = (brect.bottom - brect.top) / m;
            // res.paper.canvas.style.display = "none";
            res.X = a.x;
            res.Y = a.y + res.H / 2;

            ("x" in params || "y" in params) && (res.path.v = R.format("m{0},{1}l{2},{1}", round(a.x * zoom), round(a.y * zoom), round(a.x * zoom) + 1));
            var dirtyattrs = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
            for (var d = 0, dd = dirtyattrs.length; d < dd; d++) if (dirtyattrs[d] in params) {
                res._.dirty = 1;
                break;
            }
        
            // text-anchor emulation
            switch (a["text-anchor"]) {
                case "start":
                    res.textpath.style["v-text-align"] = "left";
                    res.bbx = res.W / 2;
                break;
                case "end":
                    res.textpath.style["v-text-align"] = "right";
                    res.bbx = -res.W / 2;
                break;
                default:
                    res.textpath.style["v-text-align"] = "center";
                    res.bbx = 0;
                break;
            }
            res.textpath.style["v-text-kern"] = true;
        }
        // res.paper.canvas.style.display = E;
    };
    addGradientFill = function (o, gradient, fill) {
        o.attrs = o.attrs || {};
        var attrs = o.attrs,
            opacity,
            oindex,
            type = "linear",
            fxfy = ".5 .5";
        o.attrs.gradient = gradient;
        gradient = Str(gradient).replace(R._radial_gradient, function (all, fx, fy) {
            type = "radial";
            if (fx && fy) {
                fx = toFloat(fx);
                fy = toFloat(fy);
                pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                fxfy = fx + S + fy;
            }
            return E;
        });
        gradient = gradient.split(/\s*\-\s*/);
        if (type == "linear") {
            var angle = gradient.shift();
            angle = -toFloat(angle);
            if (isNaN(angle)) {
                return null;
            }
        }
        var dots = R._parseDots(gradient);
        if (!dots) {
            return null;
        }
        o = o.shape || o.node;
        if (dots.length) {
            o.removeChild(fill);
            fill.on = true;
            fill.method = "none";
            fill.color = dots[0].color;
            fill.color2 = dots[dots.length - 1].color;
            var clrs = [];
            for (var i = 0, ii = dots.length; i < ii; i++) {
                dots[i].offset && clrs.push(dots[i].offset + S + dots[i].color);
            }
            fill.colors = clrs.length ? clrs.join() : "0% " + fill.color;
            if (type == "radial") {
                fill.type = "gradientTitle";
                fill.focus = "100%";
                fill.focussize = "0 0";
                fill.focusposition = fxfy;
                fill.angle = 0;
            } else {
                // fill.rotate= true;
                fill.type = "gradient";
                fill.angle = (270 - angle) % 360;
            }
            o.appendChild(fill);
        }
        return 1;
    };
    Element = function (node, vml) {
        this[0] = this.node = node;
        node.raphael = true;
        this.id = R._oid++;
        node.raphaelid = this.id;
        this.X = 0;
        this.Y = 0;
        this.attrs = {};
        this.paper = vml;
        this.matrix = R.matrix();
        this._ = {
            transform: [],
            sx: 1,
            sy: 1,
            dx: 0,
            dy: 0,
            deg: 0,
            dirty: 1,
            dirtyT: 1
        };
        !vml.bottom && (vml.bottom = this);
        this.prev = vml.top;
        vml.top && (vml.top.next = this);
        vml.top = this;
        this.next = null;
    };
    var elproto = R.el;

    Element.prototype = elproto;
    elproto.constructor = Element;
    elproto.transform = function (tstr) {
        if (tstr == null) {
            return this._.transform;
        }
        var vbs = this.paper._viewBoxShift,
            vbt = vbs ? "s" + [vbs.scale, vbs.scale] + "-1-1t" + [vbs.dx, vbs.dy] : E,
            oldt;
        if (vbs) {
            oldt = tstr = Str(tstr).replace(/\.{3}|\u2026/g, this._.transform || E);
        }
        R._extractTransform(this, vbt + tstr);
        var matrix = this.matrix.clone(),
            skew = this.skew,
            o = this.node,
            split,
            isGrad = ~Str(this.attrs.fill).indexOf("-"),
            isPatt = !Str(this.attrs.fill).indexOf("url(");
        matrix.translate(-.5, -.5);
        if (isPatt || isGrad || this.type == "image") {
            skew.matrix = "1 0 0 1";
            skew.offset = "0 0";
            split = matrix.split();
            if ((isGrad && split.noRotation) || !split.isSimple) {
                o.style.filter = matrix.toFilter();
                var bb = this.getBBox(),
                    bbt = this.getBBox(1),
                    dx = bb.x - bbt.x,
                    dy = bb.y - bbt.y;
                o.coordorigin = (dx * -zoom) + S + (dy * -zoom);
                setCoords(this, 1, 1, dx, dy, 0);
            } else {
                o.style.filter = E;
                setCoords(this, split.scalex, split.scaley, split.dx, split.dy, split.rotate);
            }
        } else {
            o.style.filter = E;
            skew.matrix = Str(matrix);
            skew.offset = matrix.offset();
        }
        oldt && (this._.transform = oldt);
        return this;
    };
    elproto.rotate = function (deg, cx, cy) {
        if (this.removed) {
            return this;
        }
        if (deg == null) {
            return;
        }
        deg = Str(deg).split(separator);
        if (deg.length - 1) {
            cx = toFloat(deg[1]);
            cy = toFloat(deg[2]);
        }
        deg = toFloat(deg[0]);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
            cx = bbox.x + bbox.width / 2;
            cy = bbox.y + bbox.height / 2;
        }
        this._.dirtyT = 1;
        this.transform(this._.transform.concat([["r", deg, cx, cy]]));
        return this;
    };
    elproto.translate = function (dx, dy) {
        if (this.removed) {
            return this;
        }
        dx = Str(dx).split(separator);
        if (dx.length - 1) {
            dy = toFloat(dx[1]);
        }
        dx = toFloat(dx[0]) || 0;
        dy = +dy || 0;
        if (this._.bbox) {
            this._.bbox.x += dx;
            this._.bbox.y += dy;
        }
        this.transform(this._.transform.concat([["t", dx, dy]]));
        return this;
    };
    elproto.scale = function (sx, sy, cx, cy) {
        if (this.removed) {
            return this;
        }
        sx = Str(sx).split(separator);
        if (sx.length - 1) {
            sy = toFloat(sx[1]);
            cx = toFloat(sx[2]);
            cy = toFloat(sx[3]);
            isNaN(cx) && (cx = null);
            isNaN(cy) && (cy = null);
        }
        sx = toFloat(sx[0]);
        (sy == null) && (sy = sx);
        (cy == null) && (cx = cy);
        if (cx == null || cy == null) {
            var bbox = this.getBBox(1);
        }
        cx = cx == null ? bbox.x + bbox.width / 2 : cx;
        cy = cy == null ? bbox.y + bbox.height / 2 : cy;
    
        this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
        this._.dirtyT = 1;
        return this;
    };
    elproto.hide = function () {
        !this.removed && (this.node.style.display = "none");
        return this;
    };
    elproto.show = function () {
        !this.removed && (this.node.style.display = E);
        return this;
    };
    elproto._getBBox = function () {
        if (this.removed) {
            return {};
        }
        if (this.type == "text") {
            return {
                x: this.X + (this.bbx || 0) - this.W / 2,
                y: this.Y - this.H,
                width: this.W,
                height: this.H
            };
        } else {
            return pathDimensions(this.attrs.path);
        }
    };
    elproto.remove = function () {
        if (this.removed) {
            return;
        }
        R.eve.unbind("*.*." + this.id);
        R._tear(this, this.paper);
        this.node.parentNode.removeChild(this.node);
        this.shape && this.shape.parentNode.removeChild(this.shape);
        for (var i in this) {
            delete this[i];
        }
        this.removed = true;
    };
    elproto.attr = function (name, value) {
        if (this.removed) {
            return this;
        }
        if (name == null) {
            var res = {};
            for (var a in this.attrs) if (this.attrs[has](a)) {
                res[a] = this.attrs[a];
            }
            res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
            res.transform = this._.transform;
            return res;
        }
        if (value == null && R.is(name, "string")) {
            if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                return this.attrs.gradient;
            }
            var names = name.split(separator),
                out = {};
            for (var i = 0, ii = names.length; i < ii; i++) {
                name = names[i];
                if (name in this.attrs) {
                    out[name] = this.attrs[name];
                } else if (R.is(this.paper.customAttributes[name], "function")) {
                    out[name] = this.paper.customAttributes[name].def;
                } else {
                    out[name] = R._availableAttrs[name];
                }
            }
            return ii - 1 ? out : out[names[0]];
        }
        if (this.attrs && value == null && R.is(name, "array")) {
            out = {};
            for (i = 0, ii = name.length; i < ii; i++) {
                out[name[i]] = this.attr(name[i]);
            }
            return out;
        }
        var params;
        if (value != null) {
            params = {};
            params[name] = value;
        }
        value == null && R.is(name, "object") && (params = name);
        for (var key in params) {
            R.eve("attr." + key + "." + this.id, this, params[key]);
        }
        if (params) {
            for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                var par = this.paper.customAttributes[key].apply(this, [][concat](params[key]));
                this.attrs[key] = params[key];
                for (var subkey in par) if (par[has](subkey)) {
                    params[subkey] = par[subkey];
                }
            }
            // this.paper.canvas.style.display = "none";
            if (params.text && this.type == "text") {
                this.textpath.string = params.text;
            }
            setFillAndStroke(this, params);
            // this.paper.canvas.style.display = E;
        }
        return this;
    };
    elproto.toFront = function () {
        !this.removed && this.node.parentNode.appendChild(this.node);
        this.paper && this.paper.top != this && R._tofront(this, this.paper);
        return this;
    };
    elproto.toBack = function () {
        if (this.removed) {
            return this;
        }
        if (this.node.parentNode.firstChild != this.node) {
            this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
            R._toback(this, this.paper);
        }
        return this;
    };
    elproto.insertAfter = function (element) {
        if (this.removed) {
            return this;
        }
        if (element.constructor == R.st.constructor) {
            element = element[element.length - 1];
        }
        if (element.node.nextSibling) {
            element.node.parentNode.insertBefore(this.node, element.node.nextSibling);
        } else {
            element.node.parentNode.appendChild(this.node);
        }
        R._insertafter(this, element, this.paper);
        return this;
    };
    elproto.insertBefore = function (element) {
        if (this.removed) {
            return this;
        }
        if (element.constructor == R.st.constructor) {
            element = element[0];
        }
        element.node.parentNode.insertBefore(this.node, element.node);
        R._insertbefore(this, element, this.paper);
        return this;
    };
    elproto.blur = function (size) {
        var s = this.node.runtimeStyle,
            f = s.filter;
        f = f.replace(blurregexp, E);
        if (+size !== 0) {
            this.attrs.blur = size;
            s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
            s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
        } else {
            s.filter = f;
            s.margin = 0;
            delete this.attrs.blur;
        }
    };

    R._engine.path = function (pathString, vml) {
        var el = createNode("shape");
        el.style.cssText = cssDot;
        el.coordsize = zoom + S + zoom;
        el.coordorigin = vml.coordorigin;
        var p = new Element(el, vml),
            attr = {fill: "none", stroke: "#000"};
        pathString && (attr.path = pathString);
        p.type = "path";
        p.path = [];
        p.Path = E;
        setFillAndStroke(p, attr);
        vml.canvas.appendChild(el);
        var skew = createNode("skew");
        skew.on = true;
        el.appendChild(skew);
        p.skew = skew;
        p.transform(E);
        return p;
    };
    R._engine.rect = function (vml, x, y, w, h, r) {
        var path = R._rectPath(x, y, w, h, r),
            res = vml.path(path),
            a = res.attrs;
        res.X = a.x = x;
        res.Y = a.y = y;
        res.W = a.width = w;
        res.H = a.height = h;
        a.r = r;
        a.path = path;
        res.type = "rect";
        return res;
    };
    R._engine.ellipse = function (vml, x, y, rx, ry) {
        var res = vml.path(),
            a = res.attrs;
        res.X = x - rx;
        res.Y = y - ry;
        res.W = rx * 2;
        res.H = ry * 2;
        res.type = "ellipse";
        setFillAndStroke(res, {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry
        });
        return res;
    };
    R._engine.circle = function (vml, x, y, r) {
        var res = vml.path(),
            a = res.attrs;
        res.X = x - r;
        res.Y = y - r;
        res.W = res.H = r * 2;
        res.type = "circle";
        setFillAndStroke(res, {
            cx: x,
            cy: y,
            r: r
        });
        return res;
    };
    R._engine.image = function (vml, src, x, y, w, h) {
        var path = R._rectPath(x, y, w, h),
            res = vml.path(path).attr({stroke: "none"}),
            a = res.attrs,
            node = res.node,
            fill = node.getElementsByTagName(fillString)[0];
        a.src = src;
        res.X = a.x = x;
        res.Y = a.y = y;
        res.W = a.width = w;
        res.H = a.height = h;
        a.path = path;
        res.type = "image";
        fill.parentNode == node && node.removeChild(fill);
        fill.rotate = true;
        fill.src = src;
        fill.type = "tile";
        res._.fillpos = [x, y];
        res._.fillsize = [w, h];
        node.appendChild(fill);
        setCoords(res, 1, 1, 0, 0, 0);
        return res;
    };
    R._engine.text = function (vml, x, y, text) {
        var el = createNode("shape"),
            path = createNode("path"),
            o = createNode("textpath");
        x = x || 0;
        y = y || 0;
        text = text || "";
        path.v = R.format("m{0},{1}l{2},{1}", round(x * zoom), round(y * zoom), round(x * zoom) + 1);
        path.textpathok = true;
        o.string = Str(text);
        o.on = true;
        el.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px";
        el.coordsize = zoom + S + zoom;
        el.coordorigin = "0 0";
        var p = new Element(el, vml),
            attr = {
                fill: "#000",
                stroke: "none",
                font: R._availableAttrs.font,
                text: text
            };
        p.shape = el;
        p.path = path;
        p.textpath = o;
        p.type = "text";
        p.attrs.text = Str(text);
        p.attrs.x = x;
        p.attrs.y = y;
        p.attrs.w = 1;
        p.attrs.h = 1;
        setFillAndStroke(p, attr);
        el.appendChild(o);
        el.appendChild(path);
        vml.canvas.appendChild(el);
        var skew = createNode("skew");
        skew.on = true;
        el.appendChild(skew);
        p.skew = skew;
        p.transform(E);
        return p;
    };
    R._engine.setSize = function (width, height) {
        var cs = this.canvas.style;
        this.width = width;
        this.height = height;
        width == +width && (width += "px");
        height == +height && (height += "px");
        cs.width = width;
        cs.height = height;
        cs.clip = "rect(0 " + width + " " + height + " 0)";
        if (this._viewBox) {
            setViewBox.apply(this, this._viewBox);
        }
        return this;
    };
    R._engine.setViewBox = function (x, y, w, h, fit) {
        R.eve("setViewBox", this, this._viewBox, [x, y, w, h, fit]);
        var width = this.width,
            height = this.height,
            size = 1 / mmax(w / width, h / height),
            H, W;
        if (fit) {
            H = height / h;
            W = width / w;
            if (w * H < width) {
                x -= (width - w * H) / 2 / H;
            }
            if (h * W < height) {
                y -= (height - h * W) / 2 / W;
            }
        }
        this._viewBox = [x, y, w, h, !!fit];
        this._viewBoxShift = {
            dx: -x,
            dy: -y,
            scale: size
        };
        this.forEach(function (el) {
            el.transform("...");
        });
        return this;
    };
    var createNode,
        initWin = function (win) {
            var doc = win.document;
            doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
            try {
                !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                createNode = function (tagName) {
                    return doc.createElement('<rvml:' + tagName + ' class="rvml">');
                };
            } catch (e) {
                createNode = function (tagName) {
                    return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                };
            }
        };
    initWin(R._g.win);
    R._engine.create = function () {
        var con = R._getContainer.apply(0, arguments),
            container = con.container,
            height = con.height,
            s,
            width = con.width,
            x = con.x,
            y = con.y;
        if (!container) {
            throw new Error("VML container not found.");
        }
        var res = new R._Paper,
            c = res.canvas = R._g.doc.createElement("div"),
            cs = c.style;
        x = x || 0;
        y = y || 0;
        width = width || 512;
        height = height || 342;
        res.width = width;
        res.height = height;
        width == +width && (width += "px");
        height == +height && (height += "px");
        res.coordsize = zoom * 1e3 + S + zoom * 1e3;
        res.coordorigin = "0 0";
        res.span = R._g.doc.createElement("span");
        res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
        c.appendChild(res.span);
        cs.cssText = R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
        if (container == 1) {
            R._g.doc.body.appendChild(c);
            cs.left = x + "px";
            cs.top = y + "px";
            cs.position = "absolute";
        } else {
            if (container.firstChild) {
                container.insertBefore(c, container.firstChild);
            } else {
                container.appendChild(c);
            }
        }
        // plugins.call(res, res, R.fn);
        res.renderfix = function () {};
        return res;
    };
    R.prototype.clear = function () {
        R.eve("clear", this);
        this.canvas.innerHTML = E;
        this.span = R._g.doc.createElement("span");
        this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
        this.canvas.appendChild(this.span);
        this.bottom = this.top = null;
    };
    R.prototype.remove = function () {
        R.eve("remove", this);
        this.canvas.parentNode.removeChild(this.canvas);
        for (var i in this) {
            this[i] = removed(i);
        }
        return true;
    };
}(window.Raphael);;
(function($, document, window, Raphael, undefined) {
  // jQuery Plugin Factory
  function jQueryPluginFactory( $, name, methods, getters ){
    getters = getters instanceof Array ? getters : [];
    var getters_obj = {};
    for(var i=0; i<getters.length; i++){
      getters_obj[getters[i]] = true;
    }
  
    
    // Create the object
    var Plugin = function(element){
      this.element = element;
    };
    Plugin.prototype = methods;
    
    // Assign the plugin
    $.fn[name] = function(){
      var args = arguments;
      var returnValue = this;
      
      this.each(function() {
        var $this = $(this);
        var plugin = $this.data('plugin-'+name);
        // Init the plugin if first time
        if( !plugin ){
          plugin = new Plugin($this);
          $this.data('plugin-'+name, plugin);
          if(plugin._init){
            plugin._init.apply(plugin, args);
          }
          
        // call a method
        } else if(typeof args[0] == 'string' && args[0].charAt(0) != '_' && typeof plugin[args[0]] == 'function'){
          var methodArgs = Array.prototype.slice.call(args, 1);
          var r = plugin[args[0]].apply(plugin, methodArgs);
          // set the return value if method is a getter
          if( args[0] in getters_obj ){
            returnValue = r;
          }
        }
        
      });
      
      return returnValue; // returning the jQuery object
    };
  };
  
  
  // Some constants
  var WIDTH = 930,
      HEIGHT = 630,
      LABELS_WIDTH = 70;
  
  // Default options
  var defaults = {
    // The styles for the state
    'stateStyles': {
      fill: "#333",
      stroke: "#666",
      "stroke-width": 1,
      "stroke-linejoin": "round",
      scale: [1, 1]
    },
    
    // The styles for the hover
    'stateHoverStyles': {
      fill: "#33c",
      stroke: "#000",
      scale: [1.1, 1.1]
    },
    
    // The time for the animation, set to false to remove the animation
    'stateHoverAnimation': 500,
    
    // State specific styles. 'ST': {}
    'stateSpecificStyles': {},
    
    // State specific hover styles
    'stateSpecificHoverStyles': {},
    
    
    // Events
    'click': null,
    
    'mouseover': null,
    
    'mouseout': null,
    
    'clickState': {},
    
    'mouseoverState': {},
    
    'mouseoutState': {},
    
    
    // Labels
    'showLabels' : true,
    
    'labelWidth': 20,
    
    'labelHeight': 15,
    
    'labelGap' : 6,
    
    'labelRadius' : 3,
    
    'labelBackingStyles': {
      fill: "#333",
      stroke: "#666",
      "stroke-width": 1,
      "stroke-linejoin": "round",
      scale: [1, 1]
    },
    
    // The styles for the hover
    'labelBackingHoverStyles': {
      fill: "#33c",
      stroke: "#000"
    },
    
    'stateSpecificLabelBackingStyles': {},
    
    'stateSpecificLabelBackingHoverStyles': {},
    
    'labelTextStyles': {
      fill: "#fff",
      'stroke': 'none',
      'font-weight': 300,
      'stroke-width': 0,
      'font-size': '10px'
    },
    
    // The styles for the hover
    'labelTextHoverStyles': {},
    
    'stateSpecificLabelTextStyles': {},
    
    'stateSpecificLabelTextHoverStyles': {}
  };
  
  
  // Methods
  var methods = {
    /**
     * The init function
     */
    _init: function(options) {
      // Save the options
      this.options = {};
      $.extend(this.options, defaults, options);
      
      // Save the width and height;
      var width = this.element.width();
      var height = this.element.height();
      
      // Calculate the width and height to match the container while keeping the labels at a fixed size
      var xscale = this.element.width()/WIDTH;
      var yscale = this.element.height()/HEIGHT;
      this.scale = Math.min(xscale, yscale);
      this.labelAreaWidth = Math.ceil(LABELS_WIDTH/this.scale); // The actual width with the labels reversed scaled
      
      var paperWidthWithLabels = WIDTH + Math.max(0, this.labelAreaWidth - LABELS_WIDTH);
      // Create the Raphael instances
      this.paper = Raphael(this.element.get(0), paperWidthWithLabels, HEIGHT);//this.element.width(), this.element.height());
      
      // Scale to fit
      this.paper.setSize(width, height);
      this.paper.setViewBox(0, 0, paperWidthWithLabels, HEIGHT, false);
      
      // Keep track of all the states
      this.stateHitAreas = {}; // transparent for the hit area
      this.stateShapes = {}; // for the visual shape
      this.topShape = null;
      
      // create all the states
      this._initCreateStates();
      
      // create the labels for the smaller states
      this.labelShapes = {};
      this.labelTexts = {};
      this.labelHitAreas = {};
      if(this.options.showLabels) {
        this._initCreateLabels();
      }
      
      // Add the 
    },
    
    /**
     * Create the state objects
     */
    _initCreateStates: function() {
      // TODO: Dynamic attrs
      var attr = this.options.stateStyles;
      var R = this.paper; // shorter name for usage here
      
      // The coords for each state
      var paths = {
        HI: "M 233.08751,519.30948 L 235.02744,515.75293 L 237.2907,515.42961 L 237.61402,516.23791 L 235.51242,519.30948 z M 243.27217,515.59127 L 249.4153,518.17784 L 251.51689,517.85452 L 253.1335,513.97465 L 252.48686,510.57977 L 248.28366,510.09479 L 244.24213,511.87306 z M 273.9878,525.61427 L 277.706,531.11074 L 280.13092,530.78742 L 281.26255,530.30244 L 282.7175,531.59573 L 286.43571,531.43407 L 287.40568,529.97912 L 284.49577,528.20085 L 282.55584,524.48263 L 280.45424,520.92609 L 274.63444,523.83599 z M 294.19545,534.50564 L 295.48874,532.5657 L 300.17691,533.53566 L 300.82356,533.05068 L 306.96668,533.69732 L 306.64336,534.99062 L 304.05678,536.44556 L 299.69193,536.12224 z M 299.53027,539.67879 L 301.47021,543.55866 L 304.54176,542.42703 L 304.86509,540.81041 L 303.24848,538.70882 L 299.53027,538.3855 z M 306.4817,538.54716 L 308.74496,535.63726 L 313.43313,538.06218 L 317.79798,539.19381 L 322.16284,541.94205 L 322.16284,543.88198 L 318.6063,545.66026 L 313.75645,546.63022 L 311.33154,545.17527 z M 323.13281,554.06663 L 324.74942,552.77335 L 328.14431,554.38997 L 335.74238,557.94651 L 339.13727,560.0481 L 340.75387,562.47302 L 342.69381,566.83787 L 346.73534,569.42445 L 346.41202,570.71775 L 342.53215,573.95097 L 338.32896,575.40592 L 336.87401,574.75928 L 333.80244,576.53754 L 331.37753,579.77077 L 329.11427,582.68067 L 327.33599,582.51901 L 323.77945,579.93243 L 323.45613,575.40592 L 324.10277,572.981 L 322.48616,567.32286 L 320.38456,565.54458 L 320.2229,562.958 L 322.48616,561.98804 L 324.58776,558.91648 L 325.07274,557.94651 L 323.45613,556.16823 z",
        AK: "M 158.07671,453.67502 L 157.75339,539.03215 L 159.36999,540.00211 L 162.44156,540.16377 L 163.8965,539.03215 L 166.48308,539.03215 L 166.64475,541.94205 L 173.59618,548.73182 L 174.08117,551.3184 L 177.47605,549.37846 L 178.1227,549.2168 L 178.44602,546.14524 L 179.90096,544.52863 L 181.0326,544.36697 L 182.97253,542.91201 L 186.04409,545.01361 L 186.69074,547.92352 L 188.63067,549.05514 L 189.7623,551.48006 L 193.64218,553.25833 L 197.03706,559.2398 L 199.78529,563.11966 L 202.04855,565.86791 L 203.50351,569.58611 L 208.515,571.36439 L 213.68817,573.46598 L 214.65813,577.83084 L 215.14311,580.9024 L 214.17315,584.29729 L 212.39487,586.56054 L 210.77826,585.75224 L 209.32331,582.68067 L 206.57507,581.22573 L 204.7968,580.09409 L 203.98849,580.9024 L 205.44344,583.65065 L 205.6051,587.36885 L 204.47347,587.85383 L 202.53354,585.9139 L 200.43195,584.62061 L 200.91693,586.23722 L 202.21021,588.0155 L 201.40191,588.8238 C 201.40191,588.8238 200.59361,588.50048 200.10863,587.85383 C 199.62363,587.20719 198.00703,584.45895 198.00703,584.45895 L 197.03706,582.19569 C 197.03706,582.19569 196.71374,583.48898 196.06709,583.16565 C 195.42044,582.84233 194.7738,581.71071 194.7738,581.71071 L 196.55207,579.77077 L 195.09712,578.31582 L 195.09712,573.30432 L 194.28882,573.30432 L 193.48052,576.6992 L 192.34888,577.1842 L 191.37892,573.46598 L 190.73227,569.74777 L 189.92396,569.26279 L 190.24729,574.92094 L 190.24729,576.05256 L 188.79233,574.75928 L 185.23579,568.77781 L 183.13419,568.29283 L 182.48755,564.57462 L 180.87094,561.66472 L 179.25432,560.53308 L 179.25432,558.26983 L 181.35592,556.97654 L 180.87094,556.65322 L 178.28436,557.29986 L 174.88947,554.87495 L 172.30289,551.96504 L 167.45306,549.37846 L 163.41152,546.79188 L 164.70482,543.55866 L 164.70482,541.94205 L 162.92654,543.55866 L 160.01664,544.69029 L 156.29843,543.55866 L 150.64028,541.13375 L 145.14381,541.13375 L 144.49717,541.61873 L 138.03072,537.73885 L 135.92912,537.41553 L 133.18088,531.59573 L 129.62433,531.91905 L 126.06778,533.374 L 126.55277,537.90052 L 127.68439,534.99062 L 128.65437,535.31394 L 127.19941,539.67879 L 130.43263,536.93055 L 131.07928,538.54716 L 127.19941,542.91201 L 125.90612,542.58869 L 125.42114,540.64875 L 124.12785,539.84045 L 122.83456,540.97208 L 120.08632,539.19381 L 117.01475,541.29541 L 115.23649,543.397 L 111.8416,545.4986 L 107.15342,545.33693 L 106.66844,543.23534 L 110.38664,542.58869 L 110.38664,541.29541 L 108.12338,540.64875 L 109.09336,538.22384 L 111.35661,534.34397 L 111.35661,532.5657 L 111.51827,531.75739 L 115.88313,529.49413 L 116.85309,530.78742 L 119.60134,530.78742 L 118.30805,528.20085 L 114.58983,527.87752 L 109.57834,530.62576 L 107.15342,534.02064 L 105.37515,536.60723 L 104.24352,538.87049 L 100.04033,540.32543 L 96.96876,542.91201 L 96.645439,544.52863 L 98.908696,545.4986 L 99.717009,547.60018 L 96.96876,550.83341 L 90.502321,555.03661 L 82.742574,559.2398 L 80.640977,560.37142 L 75.306159,561.50306 L 69.971333,563.76631 L 71.749608,565.0596 L 70.294654,566.51455 L 69.809672,567.64618 L 67.061434,566.67621 L 63.828214,566.83787 L 63.019902,569.10113 L 62.049939,569.10113 L 62.37326,566.67621 L 58.816709,567.96951 L 55.90681,568.93947 L 52.511924,567.64618 L 49.602023,569.58611 L 46.368799,569.58611 L 44.267202,570.87941 L 42.65059,571.68771 L 40.548995,571.36439 L 37.962415,570.23276 L 35.699158,570.87941 L 34.729191,571.84937 L 33.112578,570.71775 L 33.112578,568.77781 L 36.184142,567.48452 L 42.488929,568.13117 L 46.853782,566.51455 L 48.955378,564.41296 L 51.86528,563.76631 L 53.643553,562.958 L 56.391794,563.11966 L 58.008406,564.41296 L 58.978369,564.08964 L 61.241626,561.3414 L 64.313196,560.37142 L 67.708076,559.72478 L 69.00137,559.40146 L 69.648012,559.88644 L 70.456324,559.88644 L 71.749608,556.16823 L 75.791141,554.71329 L 77.731077,550.99508 L 79.994336,546.46856 L 81.610951,545.01361 L 81.934272,542.42703 L 80.317657,543.72032 L 76.922764,544.36697 L 76.276122,541.94205 L 74.982838,541.61873 L 74.012865,542.58869 L 73.851205,545.4986 L 72.39625,545.33693 L 70.941306,539.51713 L 69.648012,540.81041 L 68.516388,540.32543 L 68.193068,538.3855 L 64.151535,538.54716 L 62.049939,539.67879 L 59.463361,539.35547 L 60.918305,537.90052 L 61.403286,535.31394 L 60.756645,533.374 L 62.211599,532.40404 L 63.504883,532.24238 L 62.858241,530.4641 L 62.858241,526.09925 L 61.888278,525.12928 L 61.079966,526.58423 L 54.936843,526.58423 L 53.481892,525.29094 L 52.835247,521.41108 L 50.733651,517.85452 L 50.733651,516.88456 L 52.835247,516.07625 L 52.996908,513.97465 L 54.128536,512.84303 L 53.320231,512.35805 L 52.026941,512.84303 L 50.895313,510.09479 L 51.86528,505.08328 L 56.391794,501.85007 L 58.978369,500.23345 L 60.918305,496.51525 L 63.666554,495.22195 L 66.253132,496.35359 L 66.576453,498.77851 L 69.00137,498.45517 L 72.23459,496.03026 L 73.851205,496.67691 L 74.821167,497.32355 L 76.437782,497.32355 L 78.701041,496.03026 L 79.509354,491.6654 C 79.509354,491.6654 79.832675,488.75551 80.479317,488.27052 C 81.125959,487.78554 81.44928,487.30056 81.44928,487.30056 L 80.317657,485.36062 L 77.731077,486.16893 L 74.497847,486.97723 L 72.557911,486.49225 L 69.00137,484.71397 L 63.989875,484.55231 L 60.433324,480.83411 L 60.918305,476.95424 L 61.564957,474.52932 L 59.463361,472.75105 L 57.523423,469.03283 L 58.008406,468.22453 L 64.798177,467.73955 L 66.899773,467.73955 L 67.869736,468.70951 L 68.516388,468.70951 L 68.354728,467.0929 L 72.23459,466.44626 L 74.821167,466.76958 L 76.276122,467.90121 L 74.821167,470.00281 L 74.336186,471.45775 L 77.084435,473.07437 L 82.095932,474.85264 L 83.874208,473.88268 L 81.610951,469.51783 L 80.640977,466.2846 L 81.610951,465.47629 L 78.21606,463.53636 L 77.731077,462.40472 L 78.21606,460.78812 L 77.407756,456.90825 L 74.497847,452.22007 L 72.072929,448.01688 L 74.982838,446.07694 L 78.21606,446.07694 L 79.994336,446.72359 L 84.197528,446.56193 L 87.915733,443.00539 L 89.047366,439.93382 L 92.765578,437.5089 L 94.382182,438.47887 L 97.130421,437.83222 L 100.84863,435.73062 L 101.98027,435.56896 L 102.95023,436.37728 L 107.47674,436.21561 L 110.22498,433.14405 L 111.35661,433.14405 L 114.91316,435.56896 L 116.85309,437.67056 L 116.36811,438.80219 L 117.01475,439.93382 L 118.63137,438.31721 L 122.51124,438.64053 L 122.83456,442.35873 L 124.7745,443.81369 L 131.88759,444.46033 L 138.19238,448.66352 L 139.64732,447.69356 L 144.82049,450.28014 L 146.92208,449.6335 L 148.86202,448.82518 L 153.71185,450.76512 L 158.07671,453.67502 z M 42.973913,482.61238 L 45.075509,487.9472 L 44.913847,488.91717 L 42.003945,488.59384 L 40.225672,484.55231 L 38.447399,483.09737 L 36.02248,483.09737 L 35.86082,480.51078 L 37.639093,478.08586 L 38.770722,480.51078 L 40.225672,481.96573 z M 40.387333,516.07625 L 44.105542,516.88456 L 47.823749,517.85452 L 48.632056,518.8245 L 47.015444,522.5427 L 43.94388,522.38104 L 40.548995,518.8245 z M 19.694697,502.01173 L 20.826327,504.5983 L 21.957955,506.21492 L 20.826327,507.02322 L 18.72473,503.95166 L 18.72473,502.01173 z M 5.9534943,575.0826 L 9.3483796,572.81934 L 12.743265,571.84937 L 15.329845,572.17269 L 15.814828,573.7893 L 17.754763,574.27429 L 19.694697,572.33436 L 19.371375,570.71775 L 22.119616,570.0711 L 25.029518,572.65768 L 23.897889,574.43595 L 19.533037,575.56758 L 16.784795,575.0826 L 13.066588,573.95097 L 8.7017347,575.40592 L 7.0851227,575.72924 z M 54.936843,570.55609 L 56.553455,572.49602 L 58.655048,570.87941 L 57.2001,569.58611 z M 57.846745,573.62764 L 58.978369,571.36439 L 61.079966,571.68771 L 60.271663,573.62764 z M 81.44928,571.68771 L 82.904234,573.46598 L 83.874208,572.33436 L 83.065895,570.39442 z M 90.17899,559.2398 L 91.310623,565.0596 L 94.220522,565.86791 L 99.232017,562.958 L 103.59687,560.37142 L 101.98027,557.94651 L 102.46525,555.52159 L 100.36365,556.81488 L 97.453752,556.00657 L 99.070357,554.87495 L 101.01029,555.68325 L 104.89016,553.90497 L 105.37515,552.45003 L 102.95023,551.64172 L 103.75853,549.70178 L 101.01029,551.64172 L 96.322118,555.19827 L 91.472284,558.10817 z M 132.53423,539.35547 L 134.95915,537.90052 L 133.98918,536.12224 L 132.21091,537.09221 z",
        FL: "M 755.39728,445.50676 L 757.66294,452.82536 L 761.39264,462.56762 L 766.72743,471.94392 L 770.44562,478.24868 L 775.29544,483.74514 L 779.33695,487.46333 L 780.95355,490.37322 L 779.82193,491.6665 L 779.01363,492.95978 L 781.92351,500.39617 L 784.8334,503.30605 L 787.41997,508.64085 L 790.9765,514.46063 L 795.50299,522.70531 L 796.79628,530.30335 L 797.28126,542.26623 L 797.9279,544.04449 L 797.60458,547.43936 L 795.17967,548.73265 L 795.50299,550.67257 L 794.85635,552.6125 L 795.17967,555.0374 L 795.66465,556.97733 L 792.91643,560.21054 L 789.84488,561.66548 L 785.96503,561.82714 L 784.51008,563.44375 L 782.08518,564.41371 L 780.79189,563.92873 L 779.66027,562.95877 L 779.33695,560.04888 L 778.52864,556.65401 L 775.13377,551.48087 L 771.57724,549.21763 L 767.69739,548.89431 L 766.88909,550.18759 L 763.81754,545.82276 L 763.1709,542.26623 L 760.58433,538.22472 L 758.80607,537.09309 L 757.18946,539.19468 L 755.4112,538.87136 L 753.30961,533.85988 L 750.39972,529.98003 L 747.48983,524.64524 L 744.90327,521.57369 L 741.34674,517.8555 L 743.44832,515.43059 L 746.68153,509.93413 L 746.51987,508.31753 L 741.99338,507.34757 L 740.37677,507.99421 L 740.7001,508.64085 L 743.28666,509.61081 L 741.83172,514.13731 L 741.02342,514.62229 L 739.24515,510.58078 L 737.95187,505.73096 L 737.62855,502.98273 L 739.08349,498.29458 L 739.08349,488.75661 L 736.01194,485.03842 L 734.71866,481.96687 L 729.54552,480.67359 L 727.6056,480.02695 L 725.98899,477.44038 L 722.59412,475.82377 L 721.4625,472.4289 L 718.71427,471.45894 L 716.28936,467.74075 L 712.08619,466.28581 L 709.1763,464.83086 L 706.58974,464.83086 L 702.54822,465.63917 L 702.38656,467.57909 L 703.19487,468.54905 L 702.70988,469.68068 L 699.63834,469.51902 L 695.92015,473.07555 L 692.36361,475.01547 L 688.48376,475.01547 L 685.25055,476.30876 L 684.92723,473.56053 L 683.31063,471.6206 L 680.40074,470.48898 L 678.78414,469.03403 L 670.70111,465.15418 L 663.10307,463.37592 L 658.73824,464.02256 L 652.7568,464.50754 L 646.77536,466.60913 L 643.29612,467.22209 L 643.0582,459.17234 L 640.47163,457.23242 L 638.69336,455.45415 L 639.01668,452.38259 L 649.2013,451.08931 L 674.7437,448.17942 L 681.53345,447.53278 L 686.96945,447.81305 L 689.55602,451.69291 L 691.01096,453.14785 L 699.10912,453.66307 L 709.92887,453.01643 L 731.44126,451.72314 L 736.88698,451.04877 L 741.46423,451.0765 L 741.62589,453.98639 L 745.44989,454.79469 L 745.77321,449.98792 L 744.15661,445.46141 L 745.11145,444.72869 L 750.22414,445.18344 z M 767.94269,577.91184 L 770.36761,577.2652 L 771.66089,577.02271 L 773.11585,574.67862 L 775.45993,573.06201 L 776.75322,573.547 L 778.45066,573.87032 L 778.85481,574.92111 L 775.37911,576.13357 L 771.17591,577.58852 L 768.83183,578.80098 z M 781.44139,572.90035 L 782.65385,573.95115 L 785.40209,571.84956 L 790.7369,567.64637 L 794.4551,563.7665 L 796.96085,557.1384 L 797.93082,555.44096 L 798.09248,552.04608 L 797.365,552.53106 L 796.39504,555.36013 L 794.94008,559.96746 L 791.70686,565.22146 L 787.34202,569.42464 L 783.94714,571.36457 z",
        SC: "M 761.23097,412.93785 L 759.45391,413.90735 L 756.86734,412.61406 L 756.2207,410.51247 L 754.92742,406.95594 L 752.66416,404.85434 L 750.07759,404.2077 L 748.46099,399.35789 L 745.71275,393.37644 L 741.50958,391.4365 L 739.40798,389.49658 L 738.1147,386.91001 L 736.01311,384.97007 L 733.74986,383.67679 L 731.48661,380.7669 L 728.41506,378.50366 L 723.88855,376.72538 L 723.40357,375.27044 L 720.97867,372.36055 L 720.49368,370.90559 L 717.0988,365.73246 L 713.70393,365.89412 L 709.66241,363.4692 L 708.36913,362.17592 L 708.04581,360.39765 L 708.85411,358.45773 L 711.11736,357.48775 L 710.79404,355.38617 L 716.93714,352.7996 L 725.99014,348.2731 L 733.26487,347.46479 L 749.75427,346.97981 L 752.01752,348.91974 L 753.63412,352.15296 L 757.99897,351.66798 L 770.6085,350.21302 L 773.51839,351.02133 L 786.12793,358.61939 L 796.23601,366.74107 L 790.81484,372.19941 L 788.22827,378.34251 L 787.74329,384.64727 L 786.12669,385.45557 L 784.99506,388.2038 L 782.57016,388.85044 L 780.46857,392.40697 L 777.72034,395.1552 L 775.4571,398.55007 L 773.84049,399.35837 L 770.28396,402.75324 L 767.37407,402.9149 L 768.34404,406.14811 L 763.33256,411.64457 z",
        GA: "M 689.61648,357.97274 L 684.76666,358.78105 L 676.3603,359.91267 L 667.79229,360.8018 L 667.79229,362.98422 L 667.95395,365.08582 L 668.60059,368.48069 L 671.99547,376.40206 L 674.42038,386.26337 L 675.87532,392.40648 L 677.49193,397.25629 L 678.94688,404.2077 L 681.04847,410.51247 L 683.63504,413.90735 L 684.12002,417.30222 L 686.05995,418.11052 L 686.22161,420.21212 L 684.44334,425.06193 L 683.95836,428.29515 L 683.7967,430.23508 L 685.41331,434.59992 L 685.73663,439.93472 L 684.92832,442.35963 L 685.57497,443.16794 L 687.02992,443.97624 L 687.67656,447.37111 L 690.26313,451.25097 L 691.71807,452.70591 L 699.63945,452.86757 L 710.4592,452.22093 L 731.97159,450.92765 L 737.41731,450.25328 L 741.99456,450.28101 L 742.15622,453.1909 L 744.74279,453.9992 L 745.06611,449.63436 L 743.4495,445.10786 L 744.58113,443.49126 L 750.40091,444.29956 L 755.37832,444.61734 L 754.6029,438.31855 L 756.86614,428.2956 L 758.32109,424.09242 L 757.8361,421.50586 L 761.17051,415.26156 L 760.66021,413.90988 L 758.7468,414.61446 L 756.16024,413.32116 L 755.51359,411.21957 L 754.22031,407.66304 L 751.95705,405.56145 L 749.37049,404.91481 L 747.75388,400.06499 L 744.82887,393.72999 L 740.6257,391.79006 L 738.5241,389.85013 L 737.23081,387.26356 L 735.12923,385.32363 L 732.86598,384.03034 L 730.60273,381.12045 L 727.53118,378.85721 L 723.00467,377.07893 L 722.51969,375.62399 L 720.09478,372.7141 L 719.6098,371.25915 L 716.21492,366.35117 L 712.82005,366.51284 L 708.69014,363.4692 L 707.39686,362.17592 L 707.07354,360.39765 L 707.88184,358.45773 L 710.23348,357.22259 L 709.09954,356.00037 L 709.17743,355.70949 L 703.35764,356.67945 L 696.40623,357.48775 z",
        AL: "M 625.59784,466.77079 L 623.98224,451.57429 L 621.234,432.82165 L 621.39566,418.75716 L 622.20396,387.71831 L 622.0423,371.06725 L 622.20739,364.64819 L 629.96369,364.2775 L 657.76933,361.69094 L 666.69187,361.02874 L 666.54407,363.21116 L 666.70573,365.31276 L 667.35238,368.70763 L 670.74726,376.629 L 673.17216,386.49031 L 674.62711,392.63342 L 676.24371,397.48324 L 677.69867,404.43465 L 679.80025,410.73941 L 682.38682,414.1343 L 682.8718,417.52916 L 684.81174,418.33747 L 684.9734,420.43906 L 683.19512,425.28888 L 682.71014,428.5221 L 682.54848,430.46202 L 684.1651,434.82687 L 684.48842,440.16166 L 683.6801,442.58658 L 684.32676,443.39488 L 685.7817,444.20318 L 686.81695,446.73845 L 680.51218,446.73845 L 673.72243,447.3851 L 648.18003,450.29498 L 637.76847,451.70175 L 637.67209,455.45415 L 639.45036,457.23242 L 642.03693,459.17234 L 642.61779,467.10778 L 637.07573,469.68068 L 634.32751,469.35736 L 637.07573,467.41743 L 637.07573,466.44747 L 634.00419,460.46603 L 631.74094,459.81939 L 630.28599,464.18422 L 628.99271,466.93245 L 628.34607,466.77079 z",
        NC: "M 832.10653,298.47179 L 833.81653,303.17039 L 837.37306,309.63681 L 839.79796,312.06172 L 840.4446,314.32497 L 838.0197,314.48663 L 838.828,315.13327 L 838.50468,319.33644 L 835.91811,320.62972 L 835.27147,322.73131 L 833.97819,325.6412 L 830.25999,327.2578 L 827.83509,326.93448 L 826.38014,326.77282 L 824.76354,325.47954 L 825.08686,326.77282 L 825.08686,327.74279 L 827.02679,327.74279 L 827.83509,329.03607 L 825.89516,335.34083 L 830.09833,335.34083 L 830.74498,336.95743 L 833.00822,334.69419 L 834.30151,334.2092 L 832.36158,337.76573 L 829.29003,342.61555 L 827.99675,342.61555 L 826.86512,342.13057 L 824.1169,342.77721 L 818.94376,345.20212 L 812.47734,350.53691 L 809.08247,355.22506 L 807.14255,361.69148 L 806.65757,364.11639 L 801.96941,364.60137 L 796.51628,365.93803 L 786.56987,357.7355 L 773.96033,350.13745 L 771.05044,349.32914 L 758.44091,350.78409 L 754.16445,351.53424 L 752.54785,348.30102 L 749.57749,346.18432 L 733.0881,346.6693 L 725.81336,347.4776 L 716.76037,352.00411 L 710.61726,354.59067 L 709.00066,354.91399 L 703.18087,355.88396 L 696.22946,356.69226 L 689.43971,357.17725 L 689.9398,353.12292 L 691.71807,351.66798 L 694.46631,351.02133 L 695.11295,347.30313 L 699.31613,344.55491 L 703.19598,343.09995 L 707.39917,339.54342 L 711.764,337.44183 L 712.41064,334.37027 L 716.2905,330.49042 L 716.93714,330.32876 C 716.93714,330.32876 716.93714,331.46039 717.74545,331.46039 C 718.55375,331.46039 719.68538,331.78371 719.68538,331.78371 L 721.94863,328.22717 L 724.05022,327.58052 L 726.31346,327.90385 L 727.93008,324.34732 L 730.83997,321.76074 L 731.32495,319.65915 L 731.32495,315.69846 L 735.85145,316.42594 L 742.98754,315.13265 L 758.80727,313.19272 L 775.94331,310.60615 L 795.86504,306.60555 L 815.59836,302.44073 L 826.9628,299.6443 z M 836.00199,331.45961 L 838.58857,328.95386 L 841.74095,326.36728 L 843.27673,325.72064 L 843.43839,323.69988 L 842.79175,317.55676 L 841.3368,315.21268 L 840.69015,313.35358 L 841.41763,313.11108 L 844.16587,318.60756 L 844.57002,323.05323 L 844.40836,326.44812 L 841.01348,327.98389 L 838.18441,330.40881 L 837.05279,331.62127 z",
        TN: "M 697.05288,320.62911 L 645.15979,325.6406 L 629.40023,327.41886 L 624.77903,327.93157 L 620.91068,327.90385 L 620.91068,331.78371 L 612.50433,332.26869 L 605.55292,332.91533 L 594.45689,332.96824 L 594.19215,338.80367 L 592.05398,345.07921 L 591.05891,348.09522 L 589.71017,352.47628 L 589.38685,355.06285 L 585.34533,357.32609 L 586.80027,360.88263 L 585.83031,365.24747 L 584.86193,366.03712 L 592.11797,365.84281 L 616.20542,363.90289 L 621.54027,363.74122 L 629.62326,363.25623 L 657.42891,360.66967 L 667.59966,359.86136 L 676.01988,358.8914 L 684.42624,357.75978 L 689.27606,356.95147 L 689.14548,352.44207 L 690.92375,350.98713 L 693.67198,350.34049 L 694.31863,346.62229 L 698.52181,343.87406 L 702.40166,342.4191 L 706.60484,338.86257 L 710.96967,336.76099 L 711.84326,333.23553 L 716.17702,329.35568 L 716.82367,329.19402 C 716.82367,329.19402 716.82367,330.32564 717.63197,330.32564 C 718.44027,330.32564 719.5719,330.64896 719.5719,330.64896 L 721.83515,327.09242 L 723.93674,326.44578 L 726.19998,326.7691 L 727.8166,323.21257 L 729.93216,320.96641 L 730.53062,319.99957 L 730.70699,316.06745 L 729.22336,315.77929 L 726.79845,317.71923 L 718.87707,317.88089 L 706.88174,319.78157 z",
        RI: "M 874.07001,179.82344 L 873.58706,175.61904 L 872.77876,171.2542 L 871.08133,165.35359 L 876.82028,163.81781 L 878.43688,164.94943 L 881.83176,169.31427 L 884.74063,173.76056 L 881.82968,175.29696 L 880.5364,175.1353 L 879.40478,176.91357 L 876.97987,178.85349 z",
        CT: "M 873.19331,180.05038 L 872.56579,175.84599 L 871.75749,171.48115 L 870.14088,165.4997 L 865.989,166.40438 L 844.16479,171.17336 L 844.81143,174.48742 L 846.26638,181.76216 L 846.26638,189.84519 L 845.13475,192.10845 L 846.96715,194.21757 L 851.9225,190.81637 L 855.47903,187.58316 L 857.41895,185.48157 L 858.22726,186.12821 L 860.97548,184.67327 L 866.14862,183.54165 z",
        MA: "M 899.97704,173.85121 L 902.14896,173.16533 L 902.60622,171.45066 L 903.63502,171.56497 L 904.66382,173.85121 L 903.4064,174.30845 L 899.5198,174.42277 z M 890.6035,174.65139 L 892.88972,172.02222 L 894.49009,172.02222 L 896.31908,173.50827 L 893.91854,174.53707 L 891.74662,175.56587 z M 855.80437,152.6632 L 873.26374,148.46002 L 875.527,147.81338 L 877.62858,144.58017 L 881.36535,142.91686 L 884.25459,147.3297 L 881.82968,152.50284 L 881.50636,153.95778 L 883.44629,156.54435 L 884.57791,155.73605 L 886.35618,155.73605 L 888.61942,158.32261 L 892.49928,164.30405 L 896.05581,164.78903 L 898.31905,163.81907 L 900.09732,162.0408 L 899.28901,159.29258 L 897.18743,157.67597 L 895.73248,158.48427 L 894.76252,157.19099 L 895.2475,156.70601 L 897.34909,156.54435 L 899.12735,157.35265 L 901.06728,159.77756 L 902.03724,162.68745 L 902.36056,165.11235 L 898.15739,166.5673 L 894.27754,168.50722 L 890.39769,173.03372 L 888.45776,174.48866 L 888.45776,173.5187 L 890.88267,172.06375 L 891.36765,170.28549 L 890.55935,167.21394 L 887.64946,168.66888 L 886.84116,170.12383 L 887.32614,172.38707 L 885.25981,173.3875 L 882.51261,168.86037 L 879.11773,164.49553 L 877.04723,162.68306 L 870.51396,164.55926 L 865.42163,165.61005 L 843.59742,170.37904 L 843.19483,165.43441 L 843.84147,154.84564 L 849.01462,153.9565 z",
        ME: "M 923.21476,77.330719 L 925.15469,79.432305 L 927.41794,83.150496 L 927.41794,85.090422 L 925.31635,89.778575 L 923.37642,90.425217 L 919.98155,93.496766 L 915.13174,98.993222 C 915.13174,98.993222 914.4851,98.993222 913.83846,98.993222 C 913.19182,98.993222 912.86849,96.891636 912.86849,96.891636 L 911.09023,97.053296 L 910.12027,98.508241 L 907.69536,99.963185 L 906.7254,101.41813 L 908.342,102.87307 L 907.85702,103.51972 L 907.37204,106.26794 L 905.43211,106.10628 L 905.43211,104.48968 L 905.10879,103.19639 L 903.65385,103.51972 L 901.87558,100.28651 L 899.774,101.57979 L 901.06728,103.03473 L 901.3906,104.16636 L 900.5823,105.45964 L 900.90562,108.53119 L 901.06728,110.14779 L 899.45068,112.73436 L 896.54079,113.21934 L 896.21747,116.12923 L 890.88267,119.20078 L 889.58939,119.68576 L 887.97278,118.23082 L 884.90123,121.78735 L 885.8712,125.02056 L 884.41625,126.31384 L 884.25459,130.67867 L 883.13131,136.93803 L 880.66906,135.78208 L 880.18407,132.71052 L 876.30422,131.57889 L 875.9809,128.83065 L 868.70615,105.38983 L 864.50757,91.750088 L 865.92811,91.631923 L 867.4419,92.041822 L 867.4419,89.455254 L 868.2502,83.958798 L 870.83677,79.270645 L 872.29172,75.229133 L 870.35179,72.804226 L 870.35179,66.822789 L 871.16009,65.852826 L 871.9684,63.104598 L 871.80674,61.649654 L 871.64507,56.79984 L 873.42334,51.950026 L 876.33323,43.0587 L 878.43481,38.855528 L 879.7281,38.855528 L 881.02138,39.017188 L 881.02138,40.148811 L 882.31467,42.412058 L 885.06289,43.0587 L 885.8712,42.250397 L 885.8712,41.280435 L 889.91271,38.370546 L 891.69097,36.592281 L 893.14592,36.753942 L 899.12735,39.178849 L 901.06728,40.148811 L 910.12027,70.055998 L 916.1017,70.055998 L 916.91001,71.995924 L 917.07167,76.845738 L 919.98155,79.108984 L 920.78986,79.108984 L 920.95152,78.624003 L 920.46654,77.49238 z M 902.28301,107.47825 L 903.81879,105.94247 L 905.19291,106.99327 L 905.75872,109.41819 L 904.06128,110.30732 z M 908.99194,101.57763 L 910.77021,103.43673 C 910.77021,103.43673 912.0635,103.51755 912.0635,103.19423 C 912.0635,102.87091 912.30599,101.17347 912.30599,101.17347 L 913.19513,100.36517 L 912.38682,98.586893 L 910.36606,99.31437 z",
        NH: "M 880.79902,142.42476 L 881.66802,141.34826 L 882.75824,138.05724 L 880.21516,137.14377 L 879.73017,134.07221 L 875.85032,132.94059 L 875.527,130.19235 L 868.25225,106.75153 L 863.65083,92.208542 L 862.75375,92.203482 L 862.10711,93.820087 L 861.46047,93.335106 L 860.4905,92.365143 L 859.03556,94.305068 L 858.98709,99.337122 L 859.29874,105.00434 L 861.23866,107.75258 L 861.23866,111.7941 L 857.52046,116.85688 L 854.93389,117.98852 L 854.93389,119.12014 L 856.06552,120.89841 L 856.06552,129.46643 L 855.25721,138.6811 L 855.09555,143.53092 L 856.06552,144.82422 L 855.90386,149.35071 L 855.41887,151.12899 L 856.87382,152.01499 L 873.26374,147.32527 L 875.527,146.67863 L 877.06121,144.12627 z",
        VT: "M 844.34355,153.72643 L 843.53525,148.0683 L 841.14454,138.09663 L 840.4979,137.77331 L 837.588,136.48002 L 838.3963,133.57013 L 837.588,131.46854 L 834.88795,126.82856 L 835.85792,122.9487 L 835.04961,117.77555 L 832.6247,111.30911 L 831.81913,106.3866 L 858.06661,99.63916 L 858.39094,105.45824 L 860.33087,108.20648 L 860.33087,112.248 L 856.61267,116.28952 L 854.0261,117.42115 L 854.0261,118.55277 L 855.15772,120.33104 L 855.15772,128.89906 L 854.34942,138.11373 L 854.18776,142.96356 L 855.15772,144.25685 L 854.99606,148.78334 L 854.51108,150.56162 L 855.1717,152.12847 L 848.22029,153.5026 z",
        NY: "M 828.61427,189.42238 L 827.48264,188.45242 L 824.89606,188.29076 L 822.63282,186.35084 L 821.00221,180.22171 L 817.54375,180.31225 L 815.10004,177.60405 L 795.71472,181.98599 L 752.71294,190.71568 L 745.18329,191.94367 L 744.44513,185.47533 L 745.87323,184.34995 L 747.16651,183.21833 L 748.13648,181.60172 L 749.91474,180.4701 L 751.85467,178.69183 L 752.33965,177.07523 L 754.44123,174.327 L 755.57286,173.35704 L 755.4112,172.38707 L 754.11791,169.31553 L 752.33965,169.15387 L 750.39972,163.01077 L 753.30961,161.2325 L 757.67444,159.77756 L 761.71596,158.48427 L 764.94917,157.99929 L 771.25392,157.83763 L 773.19385,159.13092 L 774.81045,159.29258 L 776.91204,157.99929 L 779.49861,156.86767 L 784.67174,156.38269 L 786.77333,154.60442 L 788.55159,151.37121 L 790.1682,149.43129 L 792.26978,149.43129 L 794.20971,148.29966 L 794.37137,146.03642 L 792.91643,143.93483 L 792.59311,142.47989 L 793.72473,140.3783 L 793.72473,138.92336 L 791.94646,138.92336 L 790.1682,138.11506 L 789.3599,136.98343 L 789.19824,134.39686 L 795.01801,128.90041 L 795.66465,128.09211 L 797.1196,125.18222 L 800.02949,120.65572 L 802.77772,116.93753 L 804.8793,114.51263 L 807.2944,112.68702 L 810.37576,111.44108 L 815.87221,110.14779 L 819.10542,110.30945 L 823.63192,108.85451 L 831.19711,106.78334 L 831.7169,111.76301 L 834.14182,118.22945 L 834.95012,123.4026 L 833.98016,127.28246 L 836.56673,131.80896 L 837.37503,133.91055 L 836.56673,136.82045 L 839.47663,138.11373 L 840.12327,138.43705 L 843.19483,149.42999 L 842.65854,154.48966 L 842.17356,165.32093 L 842.98186,170.8174 L 843.79016,174.37394 L 845.24511,181.64868 L 845.24511,189.73172 L 844.11348,191.99497 L 845.95281,193.98776 L 846.74936,195.66618 L 844.80944,197.44445 L 845.13276,198.73773 L 846.42604,198.41441 L 847.88099,197.12113 L 850.14423,194.53456 L 851.27586,193.88792 L 852.89246,194.53456 L 855.15571,194.69622 L 863.07707,190.81637 L 865.98696,188.06814 L 867.28024,186.6132 L 871.48341,188.2298 L 868.08854,191.78633 L 864.20869,194.69622 L 857.09563,200.03101 L 854.50907,201.00098 L 848.68929,202.9409 L 844.64778,204.07253 L 843.47304,203.5396 L 843.22902,199.85107 L 843.714,197.10283 L 843.55234,195.00125 L 840.73883,193.30225 L 836.21233,192.33228 L 832.33247,191.20066 z",
        NJ: "M 828.16036,190.33018 L 826.05878,192.75509 L 826.05878,195.82665 L 824.11884,198.8982 L 823.95718,200.51482 L 825.25048,201.8081 L 825.08882,204.23302 L 822.82556,205.36464 L 823.63386,208.11287 L 823.79552,209.2445 L 826.54376,209.56782 L 827.51372,212.15439 L 831.07026,214.57931 L 833.49517,216.19591 L 833.49517,217.00422 L 830.26196,220.07578 L 828.64535,222.33902 L 827.1904,225.08726 L 824.92715,226.38054 L 823.7147,227.10802 L 823.4722,228.32048 L 822.86297,230.92722 L 823.95524,233.17141 L 827.18845,236.0813 L 832.03826,238.34455 L 836.07977,238.99119 L 836.24143,240.44613 L 835.43313,241.41609 L 835.75645,244.16432 L 836.56475,244.16432 L 838.66634,241.73942 L 839.47464,236.8896 L 842.22287,232.84809 L 845.29442,226.38167 L 846.42604,220.88522 L 845.7794,219.75359 L 845.61774,210.37728 L 844.00113,206.98242 L 842.86951,207.79072 L 840.12128,208.11404 L 839.6363,207.62906 L 840.76793,206.65909 L 842.86951,204.71917 L 842.93257,203.62534 L 842.54818,200.1915 L 843.03316,197.44326 L 842.8715,195.34167 L 840.28493,194.21004 L 835.75843,193.24008 L 831.87857,192.10845 z",
        PA: "M 822.20688,226.45982 L 823.33852,225.81317 L 825.60176,225.20074 L 827.05671,222.4525 L 828.67332,220.18925 L 831.90653,217.11769 L 831.90653,216.30939 L 829.48162,214.69279 L 825.92508,212.26787 L 824.95512,209.6813 L 822.20688,209.35798 L 822.04522,208.22635 L 821.23692,205.47812 L 823.50018,204.3465 L 823.66184,201.92158 L 822.36854,200.62829 L 822.5302,199.01168 L 824.47014,195.94013 L 824.47014,192.86857 L 826.81422,190.44366 L 827.02874,189.36021 L 824.44216,189.19855 L 822.17892,187.25863 L 819.754,181.92382 L 816.74942,180.99309 L 814.41919,178.85226 L 795.8282,182.89378 L 752.82642,191.62347 L 743.93507,193.07841 L 743.4394,185.99452 L 737.95187,191.62467 L 736.65858,192.10965 L 732.45629,195.11854 L 735.36705,214.25599 L 737.84871,223.98535 L 741.42051,243.24684 L 744.68982,242.60916 L 756.6334,241.10669 L 794.56003,233.44149 L 809.43624,230.61817 L 817.73659,228.99581 L 818.0037,228.75728 L 820.1053,227.14066 z",
        DE: "M 822.35259,230.42318 L 822.94187,228.32048 L 822.96339,227.11557 L 821.69394,227.02719 L 819.59234,228.6438 L 818.13739,230.09874 L 819.59234,234.30193 L 821.8556,239.96005 L 823.95718,249.6597 L 825.5738,255.96448 L 830.58528,255.80282 L 836.7274,254.59089 L 834.46317,247.23587 L 833.4932,247.72085 L 829.93667,245.29595 L 828.15841,240.60779 L 826.21848,237.05126 L 823.95524,236.0813 L 821.85365,232.52477 z",
        MD: "M 836.95336,255.30492 L 830.81223,256.59715 L 825.00642,256.75881 L 823.16286,249.6597 L 821.06127,239.96005 L 818.79801,234.30193 L 817.50963,229.9036 L 810.00361,231.52596 L 795.1274,234.34928 L 757.67597,241.90018 L 758.80727,246.91184 L 759.77723,252.56995 L 760.10055,252.24663 L 762.20215,249.82173 L 764.46539,247.20407 L 766.8903,246.58851 L 768.34526,245.13356 L 770.12352,242.54699 L 771.4168,243.19364 L 774.32669,242.87031 L 776.91327,240.76873 L 778.92016,239.31546 L 780.76539,238.83048 L 782.40974,239.96043 L 785.31963,241.41537 L 787.25955,243.19364 L 788.47201,244.72942 L 792.59436,246.42685 L 792.59436,249.33674 L 798.09082,250.63003 L 799.23526,251.17201 L 800.64716,249.14369 L 803.52913,251.11385 L 802.25096,253.59578 L 801.48569,257.58144 L 799.70743,260.16801 L 799.70743,262.2696 L 800.35407,264.04787 L 805.41802,265.40356 L 809.72912,265.34184 L 812.80066,266.31181 L 814.90225,266.63513 L 815.87221,264.53354 L 814.41727,262.43196 L 814.41727,260.65369 L 811.99236,258.5521 L 809.89078,253.05565 L 811.18406,247.72085 L 811.0224,245.61927 L 809.72912,244.32598 C 809.72912,244.32598 811.18406,242.70938 811.18406,242.06274 C 811.18406,241.41609 811.66904,239.96115 811.66904,239.96115 L 813.60897,238.66787 L 815.54889,237.05126 L 816.03387,238.02123 L 814.57893,239.63783 L 813.28565,243.35602 L 813.60897,244.48764 L 815.38723,244.81096 L 815.87221,250.30742 L 813.77063,251.27738 L 814.09395,254.83391 L 814.57893,254.67225 L 815.71055,252.73233 L 817.32716,254.51059 L 815.71055,255.80388 L 815.38723,259.19875 L 817.9738,262.59362 L 821.85365,263.0786 L 823.47026,262.2703 L 826.70681,266.45323 L 828.06516,266.98953 L 834.71883,264.19258 L 836.72641,260.16871 z M 820.32087,264.28945 L 821.45249,266.7952 L 821.61415,268.57347 L 822.74578,270.43257 C 822.74578,270.43257 823.63492,269.54343 823.63492,269.22011 C 823.63492,268.89679 822.90745,266.14855 822.90745,266.14855 L 822.17997,263.80446 z",
        WV: "M 756.56051,241.96731 L 757.67252,246.91184 L 758.75596,253.81817 L 762.31563,251.06994 L 764.57887,247.99838 L 767.11725,247.38283 L 768.5722,245.92789 L 770.35047,243.34132 L 771.53028,243.98796 L 774.44017,243.66464 L 777.02675,241.56305 L 779.03364,240.10979 L 780.87887,239.6248 L 782.18279,240.64127 L 784.41183,241.75579 L 786.35176,243.53406 L 787.72588,244.82734 L 787.58288,249.4984 L 781.92475,246.42685 L 777.39825,244.64858 L 777.23659,249.98339 L 776.75161,252.08497 L 775.13501,254.83321 L 774.48835,256.44982 L 771.4168,258.87472 L 770.93182,261.13798 L 767.53694,261.4613 L 767.21362,264.53285 L 766.082,270.02932 L 763.49543,270.02932 L 762.20215,269.22101 L 760.58553,266.47277 L 758.80727,266.63443 L 758.48395,270.99928 L 756.38236,277.62737 L 751.37088,288.45864 L 752.17918,289.75192 L 752.01752,292.50015 L 749.91593,294.44008 L 748.46099,294.11676 L 745.22777,296.54167 L 742.6412,295.57171 L 740.86294,300.25986 C 740.86294,300.25986 737.14473,301.06817 736.49809,301.22983 C 735.85145,301.39149 734.07318,299.93654 734.07318,299.93654 L 731.64827,302.19979 L 729.0617,302.84644 L 726.1518,302.03813 L 724.85852,300.74485 L 722.6663,297.72149 L 719.52371,295.73337 L 716.93714,292.98513 L 714.02726,289.26694 L 713.38061,287.00369 L 710.79404,285.54874 L 709.98573,283.93214 L 709.74324,278.67816 L 711.92566,278.59733 L 713.8656,277.78903 L 714.02726,275.0408 L 715.64386,273.58585 L 715.80552,268.57437 L 716.77548,264.69451 L 718.06877,264.04787 L 719.36205,265.17949 L 719.84704,266.95776 L 721.62531,265.98779 L 722.11029,264.37119 L 720.97867,262.59292 L 720.97867,260.16801 L 721.94863,258.87472 L 724.21188,255.47985 L 725.50516,254.02491 L 727.60676,254.50989 L 729.87,252.89327 L 732.94155,249.4984 L 735.20481,245.61854 L 735.52813,239.96043 L 736.01311,234.94894 L 736.01311,230.26078 L 734.88149,227.18923 L 735.85145,225.73427 L 737.13493,224.44099 L 740.62618,244.26811 L 745.25719,243.51696 z",
        KY: "M 721.78301,297.81787 L 719.45844,300.5008 L 715.25525,304.05734 L 710.9557,309.95951 L 709.17743,311.73778 L 709.17743,313.83936 L 705.29757,315.94095 L 699.63945,319.33583 L 696.11989,319.72047 L 644.252,324.61933 L 628.49244,326.39759 L 623.87124,326.9103 L 620.00289,326.88258 L 619.77594,331.10286 L 611.59653,331.24742 L 604.64512,331.89406 L 594.21453,332.09966 L 596.12731,331.87803 L 598.30736,330.11601 L 600.36496,328.97291 L 600.59359,325.77218 L 601.50808,323.9432 L 599.90126,321.4043 L 600.70309,319.49749 L 602.96635,317.71923 L 605.06793,317.07258 L 607.81616,318.36587 L 611.3727,319.65915 L 612.50433,319.33583 L 612.66599,317.07258 L 611.3727,314.64767 L 611.69602,312.38442 L 613.63595,310.92948 L 616.22253,310.28283 L 617.83913,309.63619 L 617.03083,307.85792 L 616.38419,305.91799 L 617.51581,305.10969 L 618.5666,301.79563 L 621.55732,300.0982 L 627.37711,299.12824 L 630.93365,298.64326 L 632.38859,300.58319 L 634.16686,301.39149 L 635.94513,298.15828 L 638.85502,296.70333 L 640.79495,298.31994 L 641.60325,299.45156 L 643.70485,298.96658 L 643.54318,295.57171 L 646.45308,293.9551 L 647.5847,293.14679 L 648.71632,294.7634 L 653.40449,294.7634 L 654.21279,292.66181 L 653.88947,290.39857 L 656.79936,286.84202 L 661.48752,282.96217 L 661.9725,278.43567 L 664.72074,278.11235 L 668.60059,276.33408 L 671.34883,274.39415 L 671.0255,272.45422 L 669.57055,270.99928 L 670.13637,268.81687 L 674.25872,268.57437 L 676.68363,267.76607 L 679.59352,269.38267 L 681.21013,273.74751 L 687.02992,274.07083 L 688.80818,275.8491 L 690.90977,276.01076 L 693.33468,274.55582 L 696.40623,275.0408 L 697.69952,276.49574 L 700.44776,273.90917 L 702.22602,272.61588 L 703.84263,272.61588 L 704.48927,275.36412 L 706.26754,276.33408 L 708.68933,278.54915 L 708.85099,284.04561 L 709.65929,285.66222 L 712.24587,287.11716 L 712.89251,289.38042 L 715.8024,293.09861 L 718.38896,295.84685 z",
        OH: "M 731.43589,195.0077 L 725.34235,199.06105 L 721.4625,201.3243 L 718.06763,205.04249 L 714.02612,208.92234 L 710.79291,209.73064 L 707.88302,210.21562 L 702.38656,212.80219 L 700.28498,212.96385 L 696.89011,209.8923 L 691.71697,210.53895 L 689.13041,209.084 L 686.74934,207.73317 L 681.85677,208.43658 L 671.67215,210.05319 L 663.91243,211.26565 L 665.20572,225.89593 L 666.98399,239.6371 L 669.57055,263.0779 L 670.13637,267.90907 L 674.25872,267.78005 L 676.68363,266.97174 L 680.04743,268.47488 L 682.11792,272.83971 L 687.25686,272.82261 L 689.1486,274.94131 L 690.90977,274.87601 L 693.44816,273.53455 L 695.95233,273.90605 L 697.92646,275.361 L 699.65343,273.22832 L 701.99908,271.93504 L 704.06957,271.25419 L 704.71621,274.00243 L 706.49449,274.97239 L 709.97018,277.31646 L 712.1526,277.23564 L 713.29822,276.08691 L 713.23293,274.70038 L 714.84954,273.24542 L 715.0112,268.23395 C 715.0112,268.23395 715.98116,264.35409 715.98116,264.35409 L 717.5014,262.91312 L 719.02163,263.8178 L 719.84704,265.02868 L 721.05794,264.85305 L 720.63513,262.44212 L 720.07087,261.7986 L 720.07087,259.37368 L 721.04084,258.0804 L 723.30408,254.68553 L 724.59737,253.23058 L 726.69896,253.71556 L 728.96221,252.09895 L 732.03376,248.70408 L 734.29702,244.82422 L 734.50686,239.39306 L 734.99184,234.38157 L 734.99184,229.69341 L 733.86022,226.62186 L 734.83018,225.16691 L 735.75069,224.2123 L 734.34578,214.36947 z",
        MI: "M 581.61931,82.059006 L 583.4483,80.001402 L 585.62022,79.201221 L 590.99286,75.314624 L 593.27908,74.743065 L 593.73634,75.200319 L 588.59232,80.344339 L 585.27728,82.287628 L 583.21967,83.202124 z M 667.79369,114.18719 L 668.44033,116.69293 L 671.67355,116.85459 L 672.96684,115.64213 C 672.96684,115.64213 672.88601,114.18719 672.56269,114.02552 C 672.23936,113.86386 670.94608,112.16642 670.94608,112.16642 L 668.76366,112.40891 L 667.14704,112.57057 L 666.82372,113.7022 z M 697.86007,177.23689 L 694.62686,168.9922 L 692.36361,159.93922 L 689.93871,156.70601 L 687.35214,154.92774 L 685.73554,156.05937 L 681.85568,157.83763 L 679.91576,162.84911 L 677.16753,166.5673 L 676.03591,167.21394 L 674.58096,166.5673 C 674.58096,166.5673 671.9944,165.11235 672.15606,164.46571 C 672.31772,163.81907 672.64104,159.45424 672.64104,159.45424 L 676.03591,158.16095 L 676.84421,154.76608 L 677.49085,152.17952 L 679.91576,150.56291 L 679.59244,140.53996 L 677.97583,138.27672 L 676.68255,137.46841 L 675.87425,135.36683 L 676.68255,134.55853 L 678.29915,134.88185 L 678.46081,133.26524 L 676.03591,131.00199 L 674.74262,128.41543 L 672.15606,128.41543 L 667.62956,126.96048 L 662.13311,123.56561 L 659.38488,123.56561 L 658.73824,124.21226 L 657.76827,123.72727 L 654.69673,121.46403 L 651.78684,123.24229 L 648.87695,125.50554 L 649.20027,129.06207 L 650.17023,129.38539 L 652.27182,129.87037 L 652.7568,130.67867 L 650.17023,131.48698 L 647.58367,131.8103 L 646.12872,133.58856 L 645.8054,135.69015 L 646.12872,137.30675 L 646.45204,142.80321 L 642.89551,144.9048 L 642.24887,144.74313 L 642.24887,140.53996 L 643.54215,138.11506 L 644.1888,135.69015 L 643.38049,134.88185 L 641.44057,135.69015 L 640.4706,139.89332 L 637.72238,141.02494 L 635.94411,142.96487 L 635.78245,143.93483 L 636.42909,144.74313 L 635.78245,147.3297 L 633.5192,147.81468 L 633.5192,148.94631 L 634.32751,151.37121 L 633.19588,157.51431 L 631.57928,161.55582 L 632.22592,166.24398 L 632.7109,167.3756 L 631.9026,169.80051 L 631.57928,170.60881 L 631.25596,173.35704 L 634.81249,179.33847 L 637.72238,185.80489 L 639.17732,190.65471 L 638.36902,195.34286 L 637.39906,201.3243 L 634.97415,206.49743 L 634.65083,209.24566 L 631.39196,212.33081 L 635.80057,212.16876 L 657.21906,209.90551 L 664.4969,208.91845 L 664.59327,210.5848 L 671.44521,209.37234 L 681.74329,207.86921 L 685.59749,207.4083 L 685.73554,206.82075 L 685.8972,205.36581 L 687.99878,201.64762 L 689.99934,199.90977 L 689.77705,194.85788 L 691.37404,193.26089 L 692.46466,192.91795 L 692.68694,189.36142 L 694.22271,186.3303 L 695.2735,186.93652 L 695.43516,187.58316 L 696.24347,187.74482 L 698.18339,186.77486 z M 567.49209,111.21318 L 568.20837,110.63278 L 570.9566,109.82447 L 574.51313,107.56123 L 574.51313,106.59126 L 575.15978,105.94462 L 581.14121,104.97466 L 583.56612,103.03473 L 587.93095,100.93315 L 588.09261,99.639864 L 590.03254,96.729975 L 591.8108,95.921673 L 593.10409,94.143408 L 595.36733,91.880161 L 599.73217,89.455254 L 604.42032,88.970273 L 605.55194,90.101896 L 605.22862,91.071859 L 601.51043,92.041822 L 600.05549,95.113371 L 597.79224,95.921673 L 597.30726,98.34658 L 594.88235,101.57979 L 594.55903,104.16636 L 595.36733,104.65134 L 596.3373,103.51972 L 599.89383,100.60983 L 601.18711,101.90311 L 603.45036,101.90311 L 606.68357,102.87307 L 608.13851,104.0047 L 609.59345,107.07625 L 612.34168,109.82447 L 616.22153,109.66281 L 617.67648,108.69285 L 619.29308,109.98613 L 620.90969,110.47112 L 622.20297,109.66281 L 623.33459,109.66281 L 624.9512,108.69285 L 628.99271,105.13632 L 632.38758,104.0047 L 639.01566,103.68138 L 643.54215,101.74145 L 646.12872,100.44817 L 647.58367,100.60983 L 647.58367,106.26794 L 648.06865,106.59126 L 650.97853,107.39957 L 652.91846,106.91458 L 659.06156,105.29798 L 660.19318,104.16636 L 661.64813,104.65134 L 661.64813,111.60274 L 664.88134,114.67429 L 666.17462,115.32093 L 667.4679,116.29089 L 666.17462,116.61421 L 665.36632,116.29089 L 661.64813,115.80591 L 659.54654,116.45255 L 657.28329,116.29089 L 654.05008,117.74584 L 652.27182,117.74584 L 646.45204,116.45255 L 641.27891,116.61421 L 639.33898,119.20078 L 632.38758,119.84742 L 629.96267,120.65572 L 628.83105,123.72727 L 627.53777,124.8589 L 627.05279,124.69724 L 625.59784,123.08063 L 621.07135,125.50554 L 620.42471,125.50554 L 619.29308,123.88893 L 618.48478,124.05059 L 616.54486,128.41543 L 615.57489,132.45694 L 612.39377,139.45774 L 611.21701,138.42347 L 609.84527,137.39215 L 607.90449,127.10413 L 604.36001,125.73408 L 602.30743,123.44785 L 590.18707,120.70437 L 587.3318,119.67473 L 579.10138,117.50199 L 571.21139,116.35887 z",
        WY: "M 354.25168,143.77587 L 343.70253,142.96884 L 311.61454,139.67342 L 295.38233,137.61582 L 267.03312,133.50061 L 247.14296,130.52852 L 245.72387,141.70448 L 241.88464,165.96502 L 236.62631,196.37183 L 235.09531,206.88801 L 233.4256,218.77684 L 239.94947,219.70521 L 265.82883,222.20513 L 286.39795,224.51213 L 323.18167,228.62731 L 347.00271,231.48733 L 351.50702,187.295 L 352.94689,161.91789 z",
        MT: "M 356.67064,122.27385 L 357.31846,111.12326 L 359.57695,86.336144 C 360.0342,81.306439 360.66066,77.864038 360.94869,70.926078 L 361.88845,56.374463 L 331.21413,53.56663 L 301.95358,50.0101 L 272.69304,45.968588 L 240.36094,40.633793 L 221.93165,37.238923 L 189.208,30.306187 L 184.72898,51.653719 L 188.15832,59.19826 L 186.78658,63.770712 L 188.61556,68.343163 L 191.81629,69.714902 L 196.43711,80.484355 L 199.13221,83.660878 L 199.58945,84.803996 L 203.01879,85.947114 L 203.47604,88.004707 L 196.38874,105.60866 L 196.38874,108.12351 L 198.90359,111.32422 L 199.81807,111.32422 L 204.61914,108.35213 L 205.30502,107.20901 L 206.90538,107.89488 L 206.67675,113.1532 L 209.42023,125.72745 L 212.39232,128.24229 L 213.3068,128.92816 L 215.13579,131.21438 L 214.67854,134.64373 L 215.36441,138.07306 L 216.50753,138.98756 L 218.79375,136.70133 L 221.53722,136.70133 L 224.73794,138.30169 L 227.25279,137.3872 L 231.368,137.3872 L 235.02595,138.98756 L 237.76943,138.53031 L 238.22667,135.55821 L 241.19876,134.87235 L 242.5705,136.24409 L 243.02775,139.4448 L 244.80717,140.80977 L 246.34057,129.2447 L 267.03312,132.21679 L 295.22184,136.17153 L 311.77502,138.06865 L 343.2211,141.52455 L 354.21124,143.04862 L 355.26321,127.62136 z",
        ID: "M 162.11948,180.95969 C 139.5086,176.61641 147.97221,178.11269 140.97881,176.60895 L 145.40585,159.10648 L 149.74968,141.38823 L 151.12142,137.15871 L 153.63626,131.21453 L 152.37884,128.9283 L 149.86398,129.04261 L 149.06381,128.01381 L 149.52106,126.8707 L 149.86398,123.78429 L 154.32213,118.29734 L 156.15111,117.8401 L 157.29422,116.69699 L 157.86578,113.49627 L 158.78026,112.81041 L 162.66685,106.98053 L 166.55344,102.6367 L 166.78206,98.864432 L 163.35272,96.235269 L 162.03814,91.834286 L 162.43823,82.174988 L 166.09619,65.714155 L 170.55433,44.909503 L 174.3266,31.420781 L 175.08853,27.617595 L 188.08467,30.145706 L 183.92659,51.653719 L 186.8745,59.358741 L 185.82372,63.931193 L 187.81318,68.503644 L 191.0139,70.196335 L 195.47424,80.002923 L 198.16934,83.821359 L 198.78707,84.964477 L 202.21641,86.107595 L 202.67365,88.646611 L 195.74683,105.44818 L 196.06779,108.76541 L 198.7431,111.64517 L 200.62046,112.1266 L 205.42153,108.51261 L 205.78645,108.01139 L 205.94251,108.85775 L 206.19532,112.99272 L 208.77832,125.88793 L 212.23184,128.56324 L 212.6649,129.40959 L 214.81483,131.85629 L 214.03664,134.64373 L 214.7225,138.39401 L 216.66801,139.30851 L 218.79375,137.6642 L 221.37674,137.18276 L 224.73794,138.78312 L 227.25279,138.18958 L 231.04705,138.0291 L 235.02595,139.62946 L 237.76943,139.3327 L 238.70811,137.0025 L 241.19876,135.35378 L 241.9286,137.04647 L 242.54631,139.28432 L 244.85453,141.82336 L 241.08226,165.80454 L 235.9382,194.8133 L 231.779,194.4946 L 223.59476,192.96239 L 213.78818,191.13341 L 201.62502,188.75485 L 189.09694,186.25099 L 180.61372,184.41102 L 171.35451,182.74252 z",
        WA: "M 93.573239,6.3617734 L 97.938071,7.8167177 L 107.6377,10.564946 L 116.2057,12.504871 L 136.2516,18.162988 L 159.20739,23.821104 L 174.36801,27.215777 L 173.36373,31.099829 L 169.27051,44.909503 L 164.81238,65.714155 L 161.63584,81.854036 L 161.28429,91.232806 L 148.10315,87.33877 L 132.53264,83.955591 L 118.86585,84.551329 L 117.28528,83.01913 L 111.95881,84.916253 L 107.9821,84.665645 L 105.2606,82.904814 L 103.68223,83.430208 L 99.476903,83.201576 L 97.601755,81.829846 L 92.824862,80.093194 L 91.382778,79.886558 L 86.397035,78.560984 L 84.614222,80.069004 L 78.922841,79.726077 L 74.101997,75.931831 L 74.30643,75.131651 L 74.374575,67.197996 L 72.248826,63.31142 L 68.133618,62.57938 L 67.768708,60.225014 L 65.2543,59.597968 L 62.372763,59.063086 L 60.594498,60.033049 L 58.331251,57.123161 L 58.654572,54.213272 L 61.4028,53.889951 L 63.019405,49.84844 L 60.432837,48.716816 L 60.594498,44.998625 L 64.959331,44.351984 L 62.211103,41.603756 L 60.756158,34.490695 L 61.4028,31.580807 L 61.4028,23.659444 L 59.624535,20.426234 L 61.887782,11.049927 L 63.989368,11.534908 L 66.414275,14.444797 L 69.162503,17.031364 L 72.395712,18.97129 L 76.922205,21.072876 L 79.993756,21.719518 L 82.903645,23.174462 L 86.298518,24.144425 L 88.561764,23.982765 L 88.561764,21.557857 L 89.855048,20.426234 L 91.956634,19.13295 L 92.279955,20.264574 L 92.603276,22.042839 L 90.340029,22.52782 L 90.016708,24.629406 L 91.794974,26.084351 L 92.926597,28.509258 L 93.573239,30.449183 L 95.028183,30.287523 L 95.189843,28.994239 L 94.219881,27.700955 L 93.734899,24.467746 L 94.543201,22.689481 L 93.89656,21.234537 L 93.89656,18.97129 L 95.674825,15.41476 L 94.543201,12.828192 L 92.118294,7.9783781 L 92.441615,7.1700758 z M 84.116548,12.340738 L 86.137312,12.179078 L 86.622294,13.553197 L 88.158073,11.936582 L 90.502155,11.936582 L 91.310458,13.472361 L 89.774678,15.169801 L 90.42133,15.978114 L 89.693853,17.998875 L 88.319734,18.403021 C 88.319734,18.403021 87.430596,18.483857 87.430596,18.160536 C 87.430596,17.837215 88.885551,15.573958 88.885551,15.573958 L 87.188111,15.008141 L 86.86479,16.463095 L 86.137312,17.109737 L 84.60153,14.84648 z",
        TX: "M 357.05332,333.3739 L 379.74411,334.45984 L 410.8368,335.60296 L 408.50219,359.05876 L 408.20543,377.21228 L 408.27357,379.29407 L 412.6174,383.1125 L 414.35405,383.93466 L 416.16326,384.18747 L 416.84913,382.93225 L 417.73945,383.79837 L 419.47609,384.2798 L 421.08086,383.54998 L 422.21956,383.95885 L 421.92279,387.364 L 426.19848,388.39501 L 428.8738,389.21718 L 432.82854,389.74256 L 435.02242,391.57154 L 438.27152,389.99537 L 441.05896,390.36028 L 443.09237,393.14772 L 444.16733,393.46868 L 444.00686,395.43395 L 447.09547,396.60124 L 449.86312,394.79644 L 451.37114,395.16136 L 453.72552,395.32184 L 454.15859,397.19478 L 458.79918,399.18423 L 461.45473,398.9798 L 463.4442,394.86459 L 463.78492,394.86459 L 464.92804,396.76172 L 469.3642,397.76853 L 472.7012,398.9798 L 475.99425,399.73382 L 478.14419,398.9798 L 478.99053,396.46496 L 482.69245,396.46496 L 484.58958,397.21896 L 487.654,395.64279 L 488.31569,395.64279 L 488.6806,396.76172 L 492.95629,396.76172 L 495.35904,395.5065 L 497.02754,395.80326 L 498.44324,397.67621 L 501.32299,399.34471 L 504.84467,400.41968 L 507.58814,401.83759 L 510.03484,403.45991 L 513.32788,402.56962 L 515.26897,403.55225 L 515.78008,413.69188 L 516.11532,423.39405 L 516.80118,432.92806 L 517.32658,436.97511 L 520.00191,441.57175 L 521.07687,445.63859 L 524.93927,451.92792 L 525.48884,454.80769 L 526.01424,455.8145 L 525.32836,463.31069 L 522.67723,467.69847 L 523.63568,470.55845 L 523.27076,473.0733 L 522.42442,480.38923 L 521.05268,483.10852 L 521.65692,487.49475 L 515.99204,489.07993 L 506.13075,493.60643 L 505.16079,495.54635 L 502.57422,497.48628 L 500.47264,498.94122 L 499.17935,499.74952 L 493.52124,505.08432 L 490.77301,507.18591 L 485.43821,510.41911 L 479.7801,512.84402 L 473.47534,516.23889 L 471.69708,517.69384 L 465.8773,521.25037 L 462.48243,521.89701 L 458.60258,527.39346 L 454.56107,527.71679 L 453.5911,529.65671 L 455.85435,531.59664 L 454.3994,537.09309 L 453.10612,541.61959 L 451.9745,545.49944 L 451.1662,550.02593 L 451.9745,552.45084 L 453.75276,559.40224 L 454.72273,565.54533 L 456.50099,568.29356 L 455.53103,569.74851 L 452.45948,571.68843 L 446.80136,567.80858 L 441.30491,566.67696 L 440.01162,567.16194 L 436.77841,566.5153 L 432.57524,563.44375 L 427.40211,562.31213 L 419.80406,558.91726 L 417.70248,555.0374 L 416.40919,548.57099 L 413.17599,546.63106 L 412.52934,544.36781 L 413.17599,543.72117 L 413.49931,540.3263 L 412.20602,539.67966 L 411.55938,538.7097 L 412.85266,534.34486 L 411.23606,532.08162 L 408.00285,530.78833 L 404.60798,526.4235 L 401.05145,519.79542 L 396.84828,517.20885 L 397.00994,515.26893 L 391.67514,502.98273 L 390.86684,498.77956 L 389.08858,496.83964 L 388.92692,495.38469 L 382.94548,490.0499 L 380.35891,486.97835 L 380.35891,485.84672 L 377.77234,483.74514 L 370.9826,482.61351 L 363.54622,481.96687 L 360.47467,479.70363 L 355.94818,481.48189 L 352.39165,482.93684 L 350.1284,486.17004 L 349.15844,489.88824 L 344.79361,496.03133 L 342.3687,498.45624 L 339.78213,497.48628 L 338.00387,496.35465 L 336.06394,495.70801 L 332.18409,493.44477 L 332.18409,492.79812 L 330.40583,490.8582 L 325.23269,488.75661 L 317.79631,480.99691 L 315.53306,476.30876 L 315.53306,468.22573 L 312.29985,461.75931 L 311.81487,459.01109 L 310.19827,458.04112 L 309.06664,455.93954 L 304.05517,453.83795 L 302.76189,452.22135 L 295.64882,444.29998 L 294.35554,441.06677 L 289.66738,438.80352 L 288.21243,434.43865 L 285.62584,431.52878 L 283.68593,431.04382 L 283.0367,426.36618 L 291.03857,427.05207 L 320.07356,429.79552 L 349.10864,431.39588 L 351.39487,407.61912 L 355.28142,352.0641 L 356.88181,333.31678 L 358.25355,333.34536 M 457.2302,567.32304 L 456.66439,560.20996 L 453.91615,553.01604 L 453.35033,545.98379 L 454.88611,537.73908 L 458.20017,530.86849 L 461.67587,525.45284 L 464.82827,521.89629 L 465.47491,522.13879 L 460.70591,528.76689 L 456.34107,535.31417 L 454.3203,541.94226 L 453.99698,547.11542 L 454.88611,553.25854 L 457.47269,560.45246 L 457.95767,565.6256 L 458.11933,567.08056 L 457.2302,567.32304 z",
        CA: "M 136.74132,386.75359 L 140.5564,386.26497 L 142.04244,384.25353 L 142.77448,382.31244 L 139.59796,382.22232 L 138.49879,380.45929 L 139.27701,378.74462 L 139.23083,372.59378 L 141.44892,371.266 L 144.14622,368.68302 L 144.5573,363.76763 L 146.20382,360.27014 L 148.14711,358.16638 L 151.41598,356.45171 L 152.69537,355.72188 L 153.4516,354.23804 L 152.58327,353.34553 L 151.62262,351.8353 L 150.68615,346.48685 L 147.7822,341.25051 L 147.87926,338.46426 L 145.67843,335.2162 L 130.67947,311.98682 L 111.24655,283.27272 L 88.819562,250.23896 L 76.117107,230.69405 L 77.913818,223.48571 L 84.726337,197.53705 L 92.84244,166.10144 L 80.477041,162.76442 L 66.988306,159.33508 L 54.414067,155.21987 L 46.869522,153.16227 L 35.438394,150.19018 L 28.387579,147.77848 L 26.80746,152.50284 L 26.645799,159.93922 L 21.472664,171.74043 L 18.401116,174.327 L 18.077795,175.45862 L 16.299529,176.26693 L 14.844585,180.4701 L 14.036283,183.70331 L 16.784511,187.90648 L 18.401116,192.10965 L 19.532739,195.66618 L 19.209418,202.1326 L 17.431153,205.20415 L 16.784511,211.02393 L 15.814548,214.74212 L 17.592813,218.62197 L 20.341041,223.14846 L 22.604288,227.99828 L 23.897571,232.03979 L 23.574251,235.273 L 23.25093,235.75798 L 23.25093,237.85956 L 28.909046,244.16432 L 28.424065,246.58923 L 27.777423,248.85248 L 27.130781,250.7924 L 27.292441,259.03709 L 29.394027,262.75528 L 31.333953,265.34184 L 34.082181,265.82683 L 35.052144,268.57505 L 33.920521,272.13158 L 31.818934,273.74819 L 30.687311,273.74819 L 29.879009,277.62804 L 30.36399,280.53793 L 33.5972,284.90276 L 35.213804,290.23756 L 36.668748,294.92571 L 37.962032,297.99726 L 41.356902,303.81704 L 42.811846,306.4036 L 43.296828,309.31349 L 44.913432,310.28345 L 44.913432,312.70836 L 44.10513,314.64829 L 42.326865,321.76135 L 41.841883,323.70127 L 44.266791,326.4495 L 48.469963,326.93448 L 52.996456,328.71275 L 56.876307,330.81433 L 59.786196,330.81433 L 62.696084,333.88588 L 65.282651,338.7357 L 66.414275,340.99894 L 70.294126,343.10053 L 75.14394,343.90883 L 76.598884,346.01042 L 77.245526,349.24363 L 75.790582,349.89027 L 76.113903,350.86023 L 79.347114,351.66853 L 82.095342,351.8302 L 85.005231,356.51835 L 88.885085,360.72152 L 89.693387,362.98477 L 92.279955,367.18794 L 92.603276,370.42115 L 92.603276,379.79746 L 93.088257,381.57572 L 103.11121,383.03067 L 122.83378,385.77889 z M 48.793607,337.03691 L 50.086895,338.57269 L 49.925235,339.86598 L 46.692014,339.78515 L 46.1262,338.57269 L 45.479556,337.11774 z M 50.733539,337.03691 L 51.945997,336.39027 L 55.50254,338.49186 L 58.5741,339.70431 L 57.684964,340.35097 L 53.158455,340.10847 L 51.541845,338.49186 z M 71.426153,356.84039 L 73.204418,359.18447 L 74.012731,360.15444 L 75.54851,360.72025 L 76.114317,359.2653 L 75.144354,357.48703 L 72.476951,355.46627 L 71.426153,355.62793 z M 69.971198,365.48925 L 71.749474,368.64164 L 72.961932,370.58158 L 71.506978,370.82406 L 70.213694,369.61161 C 70.213694,369.61161 69.486217,368.15666 69.486217,367.7525 C 69.486217,367.34836 69.486217,365.57008 69.486217,365.57008 z",
        AZ: "M 137.74699,387.50041 L 135.11998,389.65874 L 134.79666,391.11369 L 135.28164,392.08365 L 154.19591,402.75324 L 166.32045,410.35128 L 181.03155,418.91929 L 197.84424,428.94224 L 210.13044,431.36715 L 235.25838,434.07206 L 237.7892,421.56511 L 241.54187,394.32217 L 248.50673,341.44101 L 252.76399,310.47532 L 228.16728,306.79655 L 200.96119,302.2241 L 167.53204,295.90642 L 164.61014,313.99826 L 164.1529,314.45551 L 162.43823,317.08467 L 159.92338,316.97035 L 158.66596,314.22688 L 155.92249,313.88395 L 155.00799,312.74084 L 154.09351,312.74084 L 153.17901,313.3124 L 151.23572,314.3412 L 151.12142,321.31418 L 150.89278,323.02885 L 150.32124,335.60309 L 148.83519,337.775 L 148.26363,341.09003 L 151.0071,346.00542 L 152.26452,351.8353 L 153.06471,352.8641 L 154.09351,353.43566 L 153.97919,355.72188 L 152.37884,357.09361 L 148.9495,358.80828 L 147.00621,360.75158 L 145.52016,364.40953 L 144.9486,369.32492 L 142.09082,372.06839 L 140.03322,372.75426 L 139.91891,378.58414 L 139.46166,380.29881 L 139.91891,381.09899 L 143.57687,381.67053 L 143.00531,384.41401 L 141.51926,386.58592 z",
        NV: "M 140.65786,177.57182 L 161.63805,182.08304 L 171.35451,184.02634 L 180.61372,185.85531 L 187.22838,187.48864 L 186.67001,193.35369 L 183.12636,210.68284 L 179.03314,230.66313 L 177.08985,240.3818 L 174.91793,253.66389 L 171.76337,270.07854 L 168.24171,285.76337 L 166.27332,295.94373 L 163.80775,312.71445 L 163.35051,313.8136 L 162.27775,316.28228 L 160.40481,316.16797 L 159.30786,313.4245 L 156.56439,312.92108 L 155.16847,311.93845 L 153.13064,312.25941 L 152.21615,312.99145 L 150.91477,314.3412 L 150.47951,321.31418 L 149.92992,323.02885 L 149.51885,335.12166 L 148.19675,336.83582 L 146.32033,334.57429 L 131.80281,311.82634 L 112.36989,282.79128 L 89.621946,248.95514 L 77.240446,230.3731 L 78.87668,223.80666 L 85.849676,197.858 L 93.737155,166.51015 L 127.34467,174.65279 L 141.06203,177.62488",
        UT: "M 252.97063,309.30699 L 228.32776,305.83369 L 201.76357,300.94029 L 167.93683,294.92034 L 169.52553,285.76337 L 172.72624,270.55998 L 176.04127,253.98484 L 178.21319,240.3818 L 180.15648,231.46552 L 183.92875,211.00379 L 187.4724,193.51417 L 188.58694,187.94149 L 201.30406,190.19914 L 213.30675,192.25674 L 223.59476,194.08573 L 231.93948,195.45747 L 235.61725,195.93663 L 234.13245,206.56705 L 231.82083,219.73971 L 239.62852,220.66808 L 256.03504,222.47287 L 264.24601,223.32851 L 262.11553,245.29707 L 258.91482,267.86257 L 255.16215,295.68875 L 253.49601,306.79655 z",
        CO: "M 378.62078,256.79629 L 380.06066,235.51461 L 347.96558,232.45018 L 323.50262,229.75064 L 286.23746,225.63547 L 265.5471,223.12065 L 262.91791,245.29707 L 259.7172,267.70209 L 255.96454,295.68875 L 254.45888,306.79655 L 254.20828,309.55981 L 288.13455,313.35406 L 325.87526,317.62063 L 357.83587,320.7865 L 374.44407,321.63284",
        NM: "M 282.72425,431.045 L 282.07384,424.9219 L 290.71762,425.4473 L 320.23405,428.5117 L 348.62721,429.95159 L 350.59248,407.61912 L 354.31856,351.74315 L 355.43752,332.35392 L 357.45116,332.70345 L 357.43687,321.62845 L 325.23335,319.22539 L 288.29503,314.79835 L 253.83017,310.68314 L 249.63006,341.44101 L 242.6652,394.64312 L 238.91254,421.56511 L 236.86315,434.87445 L 252.32382,436.8636 L 253.6171,426.84065 L 270.26813,429.42722 z",
        OR: "M 140.30581,176.68623 L 144.60346,158.78553 L 149.26824,140.9068 L 150.31903,136.67728 L 152.6734,131.05405 L 152.05789,129.89117 L 149.54303,129.84499 L 148.26143,128.17429 L 148.71867,126.71022 L 149.22208,123.46334 L 153.68023,117.97639 L 155.50921,116.87724 L 156.65232,115.73413 L 158.13836,112.1685 L 162.18542,106.4991 L 165.75105,102.6367 L 165.97967,99.185383 L 162.71081,96.716701 L 161.50192,92.206659 L 148.26363,88.462106 L 133.17454,84.918456 L 117.74252,85.032762 L 117.28528,83.661033 L 111.79833,85.718637 L 107.34019,85.147078 L 104.93965,83.546717 L 103.68223,84.232592 L 98.99547,84.00396 L 97.280804,82.632231 L 92.022478,80.574627 L 91.222297,80.688943 L 86.878467,79.202887 L 84.935176,81.03187 L 78.762364,80.688943 L 72.818181,76.573734 L 73.504046,75.773554 L 73.732667,68.000381 L 71.446442,64.113804 L 67.331234,63.542245 L 66.645369,61.027398 L 64.291437,60.560833 L 58.492912,62.619617 L 56.229665,69.086035 L 52.996456,79.108984 L 49.763246,85.575403 L 44.751772,99.639864 L 38.285353,113.21934 L 30.20233,125.82886 L 28.262404,128.73875 L 27.454102,137.30675 L 26.160818,143.28819 L 28.86901,146.81562 L 35.598871,149.06684 L 47.190476,152.35988 L 55.055974,154.89892 L 67.469737,158.5327 L 80.797995,162.12252 L 93.965776,165.68813",
        ND: "M 471.30528,127.66846 L 470.94037,120.17229 L 468.95092,112.85637 L 467.12193,99.207152 L 466.66469,89.376374 L 464.67523,86.267982 L 463.07487,80.917336 L 463.07487,70.629316 L 463.76073,66.742729 L 461.64538,61.243718 L 433.22188,60.679691 L 414.63093,60.033049 L 388.11861,58.739765 L 363.17227,56.855896 L 361.91155,71.086559 L 360.53981,86.175663 L 358.28133,111.12326 L 357.79515,122.14348 L 414.61127,125.90763 z",
        SD: "M 472.79706,203.1809 L 471.84336,202.10003 L 470.32265,198.47334 L 472.15163,194.77142 L 473.20241,189.21633 L 470.61942,187.15872 L 470.32265,184.41526 L 470.91618,181.41897 L 473.06612,180.61658 L 473.36289,174.88124 L 473.29475,144.79538 L 472.67702,141.82329 L 468.56181,138.23348 L 467.57918,136.24402 L 467.57918,134.3227 L 469.4763,133.0433 L 471.00852,131.19013 L 471.19098,128.47084 L 413.80889,126.87049 L 357.63468,122.9839 L 356.86798,128.26326 L 355.25497,144.1315 L 353.90976,162.07837 L 352.30941,186.67509 L 368.33718,187.70389 L 387.97453,188.847 L 405.96758,190.15059 L 429.74434,191.45417 L 440.4896,190.67598 L 443.34959,192.96221 L 447.66923,195.93431 L 448.65187,196.68831 L 452.19331,195.798 L 456.24038,195.50124 L 458.98385,195.43309 L 462.09665,196.64436 L 466.64491,198.08424 L 469.77747,199.84507 L 470.3952,201.76638 L 471.30969,203.66351 L 472.01534,203.18207 z",
        NE: "M 484.24444,246.9897 L 485.61618,249.66503 L 485.70851,251.79078 L 488.06288,255.51689 L 490.78217,258.66923 L 485.73269,258.66923 L 442.25013,257.73055 L 401.46327,256.84025 L 380.27171,255.8796 L 381.34448,234.55175 L 347.96558,231.80828 L 352.30941,187.79842 L 367.85574,188.82723 L 387.97453,189.97033 L 405.8071,191.11345 L 429.58386,192.25656 L 440.32912,191.79932 L 442.38672,194.08554 L 447.1878,197.05764 L 448.33091,197.97213 L 452.67474,196.60039 L 456.56133,196.14315 L 459.3048,195.91452 L 461.13378,197.28626 L 466.16348,198.88662 L 469.13557,200.48698 L 469.59282,202.08734 L 470.50731,204.14494 L 472.33629,204.14494 L 473.13427,204.19111 L 474.11689,209.40326 L 476.86037,217.42924 L 478.09582,222.06983 L 480.22156,225.88828 L 480.74695,230.82564 L 482.18684,235.10132 L 482.73641,241.57092",
        IA: "M 566.59351,201.62843 L 566.76414,203.57088 L 569.05036,204.71064 L 570.1918,205.96722 L 570.53556,207.22883 L 574.42215,210.43123 L 575.10802,212.60398 L 574.30868,215.46595 L 572.82012,219.01043 L 572.02078,221.75222 L 569.84803,223.35426 L 568.13252,223.92666 L 562.64725,225.41186 L 561.96138,227.69475 L 561.16204,229.9793 L 561.73443,231.35104 L 563.44994,233.06488 L 563.44826,236.72617 L 561.27886,238.32653 L 560.81995,239.81342 L 560.81995,242.32994 L 559.33139,242.78718 L 557.61755,244.15725 L 557.16198,245.64246 L 557.61755,247.35964 L 556.24331,248.56409 L 553.94955,245.87276 L 552.46601,243.24611 L 544.12548,244.04544 L 533.95428,244.61617 L 508.91758,245.30372 L 495.88274,245.53234 L 486.50922,245.76096 L 485.19344,245.88221 L 483.53879,241.41044 L 483.31017,234.78037 L 481.70981,230.66516 L 481.02395,225.40685 L 478.73772,221.74888 L 477.82324,216.94781 L 475.07976,209.40326 L 473.93665,204.03062 L 472.56491,201.85871 L 470.96455,199.11525 L 472.79353,194.77142 L 474.16527,189.05585 L 471.4218,186.99824 L 470.96455,184.25477 L 471.87905,181.73992 L 473.59372,181.73992 L 485.13916,181.73992 L 534.75027,181.05405 L 554.62705,180.36819 L 556.47778,183.115 L 558.31012,185.73663 L 558.76569,186.541 L 556.93503,189.28949 L 557.3906,193.51148 L 559.90546,197.39807 L 562.8742,199.22202 L 565.27892,199.45232 z",
        MS: "M 624.55882,466.96958 L 624.30456,468.22573 L 619.13142,468.22573 L 617.67648,467.41743 L 615.57489,467.09411 L 608.78515,469.03403 L 607.00689,468.22573 L 604.42032,472.4289 L 603.31778,473.20692 L 602.19395,470.71894 L 601.05083,466.83235 L 597.6215,463.63164 L 598.7646,456.08709 L 598.07874,455.1726 L 596.24976,455.40122 L 588.01934,456.08709 L 563.78534,456.77296 L 563.3281,455.1726 L 564.01397,447.1708 L 567.44331,440.99799 L 572.70163,431.85309 L 571.78714,429.79549 L 572.93025,429.79549 L 573.61612,426.59477 L 571.32989,424.76579 L 571.55852,422.93681 L 569.50091,418.36436 L 569.21513,413.0203 L 570.58686,410.36256 L 570.18678,406.01873 L 568.81504,403.04663 L 570.18678,401.6749 L 568.81504,399.6173 L 569.27229,397.78832 L 570.18678,391.6155 L 573.15887,388.87204 L 572.473,386.81443 L 576.13097,381.5561 L 578.87444,380.64162 L 578.87444,378.12677 L 578.18857,376.75503 L 580.93204,371.49672 L 583.67551,370.3536 L 583.78295,366.94152 L 592.4584,366.86408 L 616.54585,364.92416 L 621.12643,364.69553 L 621.13451,371.06725 L 621.29617,387.71831 L 620.48787,418.75716 L 620.32621,432.82165 L 623.07445,451.57429 z",
        IN: "M 618.42049,300.8552 L 618.48577,297.99662 L 618.97076,293.47011 L 621.234,290.56023 L 623.01228,286.68036 L 625.59884,282.47719 L 625.11386,276.6574 L 623.3356,273.90917 L 623.01228,270.67596 L 623.82058,265.17949 L 623.3356,258.22808 L 622.0423,242.22367 L 620.74902,226.86591 L 619.77855,215.14589 L 622.84961,216.0354 L 624.30456,217.00536 L 625.43618,216.68204 L 627.53777,214.74212 L 630.36734,213.12513 L 635.46014,212.96309 L 657.44601,210.69983 L 663.02174,210.16667 L 664.52488,226.12288 L 668.77623,262.96443 L 669.37469,268.73603 L 669.00319,270.99928 L 670.23117,272.79465 L 670.32756,274.1672 L 667.80627,275.76671 L 664.26684,277.31802 L 661.06471,277.8683 L 660.46625,282.73523 L 655.89156,286.0477 L 653.09514,290.05814 L 653.41846,292.43487 L 652.83712,293.96907 L 649.51065,293.96907 L 647.92512,292.35247 L 645.43181,293.61467 L 642.74885,295.11781 L 642.91052,298.17226 L 641.71673,298.43029 L 641.24885,297.41215 L 639.08197,295.90901 L 635.83165,297.25049 L 634.28034,300.25674 L 632.8425,299.44844 L 631.38755,297.84893 L 626.92321,298.33392 L 621.33038,299.30388 z",
        IL: "M 617.80493,301.60133 L 617.80493,297.99662 L 618.06296,293.12969 L 620.43968,289.99286 L 622.21795,286.22646 L 624.80452,282.36371 L 624.43302,277.11131 L 622.42781,273.56874 L 622.33143,270.22206 L 623.02626,264.95255 L 622.20085,257.77418 L 621.13451,241.99673 L 619.84123,226.97939 L 618.91895,215.34019 L 618.64644,214.4188 L 617.83814,211.83223 L 616.54486,208.11404 L 614.92825,206.33577 L 613.47331,203.74921 L 613.23974,198.26025 L 603.33707,199.57249 L 576.13098,201.28716 L 567.44331,200.8585 L 567.67193,203.23045 L 569.95816,203.91632 L 570.87264,205.05943 L 571.32989,206.88841 L 575.21647,210.31775 L 575.90235,212.60398 L 575.21647,216.03332 L 573.38749,219.69128 L 572.70163,222.20612 L 570.4154,224.03511 L 568.58642,224.72098 L 563.3281,226.09271 L 562.64223,227.92169 L 561.95636,229.9793 L 562.64223,231.35104 L 564.47121,232.9514 L 564.24259,237.0666 L 562.4136,238.66696 L 561.72774,240.26732 L 561.72774,243.01079 L 559.89876,243.46803 L 558.2984,244.61115 L 558.06978,245.98289 L 558.2984,248.04049 L 556.58373,249.35506 L 555.55493,252.1557 L 556.01217,255.81365 L 558.2984,263.12958 L 565.61433,270.67413 L 571.10126,274.33209 L 570.87264,278.67592 L 571.78714,280.04766 L 578.18857,280.5049 L 580.93204,281.87664 L 580.24618,285.5346 L 577.95995,291.47879 L 577.27408,294.67951 L 579.5603,298.56609 L 585.96174,303.82441 L 590.5342,304.51028 L 592.59179,309.53998 L 594.6494,312.74069 L 593.73491,315.71278 L 595.33527,319.82799 L 597.16425,321.8856 L 599.10861,321.0933 L 599.7953,318.93012 L 601.8316,317.49228 L 605.06793,316.39174 L 608.15659,317.57154 L 611.03228,318.63788 L 611.82348,318.42804 L 611.75819,317.18606 L 610.69186,314.42072 L 611.12866,312.044 L 613.409,310.47557 L 615.76863,309.48851 L 616.93134,309.06882 L 616.34998,307.74444 L 615.58986,305.57757 L 616.83496,304.31536 z",
        MN: "M 471.87905,128.47084 L 471.4218,120.0118 L 469.59282,112.69588 L 467.76384,99.207152 L 467.30659,89.376374 L 465.47761,85.947031 L 463.87725,80.917336 L 463.87725,70.629316 L 464.56311,66.742729 L 462.74218,61.291062 L 492.8746,61.326333 L 493.19792,53.081649 L 493.84456,52.919988 L 496.10781,53.40497 L 498.04773,54.213272 L 498.85603,59.709728 L 500.31098,65.852826 L 501.92758,67.469431 L 506.7774,67.469431 L 507.10072,68.924375 L 513.40548,69.247696 L 513.40548,71.349282 L 518.25529,71.349282 L 518.57861,70.055998 L 519.71023,68.924375 L 521.97348,68.277733 L 523.26676,69.247696 L 526.17665,69.247696 L 530.0565,71.834263 L 535.3913,74.25917 L 537.81621,74.744152 L 538.30119,73.774189 L 539.75613,73.289207 L 540.24111,76.199096 L 542.82768,77.49238 L 543.31266,77.007398 L 544.60595,77.169059 L 544.60595,79.270645 L 547.19251,80.240608 L 550.26406,80.240608 L 551.88067,79.432305 L 555.11388,76.199096 L 557.70044,75.714115 L 558.50875,77.49238 L 558.99373,78.785663 L 559.96369,78.785663 L 560.93365,77.977361 L 569.82498,77.65404 L 571.60324,80.725589 L 572.24989,80.725589 L 572.9635,79.64131 L 577.40341,79.270645 L 576.79131,81.550104 L 572.85259,83.387229 L 563.60681,87.448357 L 558.83207,89.455254 L 555.76052,92.041822 L 553.33561,95.598352 L 551.07237,99.478203 L 549.2941,100.28651 L 544.76761,105.29798 L 543.47432,105.45964 L 539.63268,108.39354 L 536.81624,111.55445 L 536.58762,114.52487 L 536.81457,122.30306 L 535.21755,123.90342 L 529.95924,128.01694 L 528.12691,133.73419 L 530.6451,137.38211 L 531.10402,139.90198 L 529.95589,142.87575 L 529.72893,146.53538 L 530.18618,153.61933 L 533.61218,157.72618 L 536.58762,157.72618 L 539.09745,160.01909 L 542.29984,161.38414 L 545.95948,166.41886 L 553.04677,171.44186 L 554.87742,173.50448 L 555.11107,179.00649 L 534.52332,179.69236 L 474.27457,180.15128 L 473.93665,144.47443 L 473.47941,141.50234 L 469.3642,138.073 L 468.22108,136.24402 L 468.22108,134.64365 L 470.27868,133.0433 L 471.65042,131.67156 z",
        WI: "M 612.94089,197.18116 L 613.31165,194.21124 L 611.69504,189.68474 L 611.0484,183.54165 L 609.91678,181.11674 L 610.88674,178.04519 L 611.69504,175.1353 L 613.14999,172.54874 L 612.50334,169.15387 L 611.8567,165.59734 L 612.34168,163.81907 L 614.28161,161.39416 L 614.44327,158.64593 L 613.63497,157.35265 L 614.28161,154.76608 L 614.76659,151.53287 L 617.51482,145.87476 L 620.42471,139.08502 L 620.58637,136.82177 L 620.26305,135.85181 L 619.45474,136.33679 L 615.25157,142.64155 L 612.50334,146.68306 L 610.56342,148.46133 L 609.75512,150.72457 L 608.30017,151.53287 L 607.16855,153.4728 L 605.7136,153.14948 L 605.55194,151.37121 L 606.84523,148.94631 L 608.94681,144.25815 L 610.72508,142.64155 L 611.8264,140.34999 L 610.19574,139.44474 L 608.824,138.073 L 607.22364,127.78498 L 603.56569,126.64187 L 602.19395,124.35564 L 589.6197,121.61217 L 587.10485,120.46906 L 578.87444,118.18283 L 570.64402,117.03971 L 566.47456,111.63491 L 565.94513,112.89602 L 564.81351,112.73436 L 564.16686,111.60274 L 561.41864,110.79444 L 560.28701,110.9561 L 558.50875,111.92606 L 557.53878,111.27942 L 558.18543,109.33949 L 560.12535,106.26794 L 561.25697,105.13632 L 559.31705,103.68138 L 557.21546,104.48968 L 554.30557,106.4296 L 546.86919,109.66281 L 543.9593,110.30945 L 541.04942,109.82447 L 540.06769,108.94622 L 537.95099,111.7814 L 537.72237,114.52487 L 537.72237,122.9839 L 536.57925,124.58427 L 531.32093,128.47084 L 529.03471,134.41503 L 529.49195,134.64365 L 532.0068,136.70126 L 532.69266,139.90198 L 530.86368,143.10269 L 530.86368,146.98928 L 531.32093,153.61933 L 534.29302,156.59143 L 537.72237,156.59143 L 539.55135,159.79215 L 542.98068,160.24939 L 546.86727,165.96496 L 553.95457,170.08017 L 556.01217,172.82364 L 556.92667,180.25388 L 557.61253,183.5689 L 559.89876,185.16926 L 560.12738,186.541 L 558.06978,189.97033 L 558.2984,193.17106 L 560.81325,197.05764 L 563.3281,198.20075 L 566.30019,198.65799 L 567.64253,200.03811 L 576.81603,200.03809 L 602.88316,198.55122 z",
        MO: "M 555.78857,249.52738 L 553.2687,246.44013 L 552.12558,244.1539 L 544.35242,244.83977 L 534.52164,245.29701 L 509.14453,246.21151 L 495.6558,246.44013 L 487.76835,246.55444 L 485.48209,246.66875 L 486.73952,249.1836 L 486.5109,251.46982 L 489.02574,255.35641 L 492.11214,259.47162 L 495.19855,262.21509 L 497.48478,262.44371 L 498.85651,263.35821 L 498.85651,266.3303 L 497.02754,267.93066 L 496.57028,270.21688 L 498.62789,273.64623 L 501.14275,276.61832 L 503.65759,278.4473 L 505.02932,290.10705 L 504.34346,325.42926 L 504.57208,330.11601 L 505.02932,335.49952 L 528.46231,335.3827 L 551.66834,334.69683 L 572.473,333.89582 L 584.12774,333.66552 L 586.29714,337.09152 L 585.61295,340.39902 L 582.5257,342.80206 L 581.95331,344.6394 L 587.3318,345.09666 L 591.22676,344.41078 L 592.94394,338.91715 L 593.59536,333.06036 L 595.91436,331.03553 L 597.62651,329.54864 L 599.68412,328.519 L 599.79926,325.65871 L 600.37334,323.9432 L 599.34202,322.19493 L 596.59688,322.3395 L 594.42748,319.71451 L 593.05406,315.48584 L 593.85507,312.96764 L 591.91094,309.53998 L 590.0803,304.96418 L 585.28089,304.16484 L 578.31209,298.56609 L 576.59323,294.45256 L 577.39258,291.25184 L 579.45185,285.19417 L 579.91077,282.33054 L 577.96163,281.29923 L 571.10629,280.50156 L 570.07832,278.7894 L 569.96652,274.55904 L 564.47958,271.12803 L 557.50407,263.35653 L 555.21785,256.0406 L 554.98756,251.81528 z",
        AR: "M 590.95215,344.95331 L 587.10485,345.89098 L 580.93204,345.43373 L 581.61791,342.46164 L 584.81863,339.71817 L 585.27587,337.43194 L 583.44689,334.45984 L 572.473,334.91709 L 551.66834,335.83158 L 528.34883,336.51745 L 505.02932,336.97469 L 506.62968,343.83338 L 506.62967,352.0638 L 508.00142,363.03779 L 508.23004,400.87472 L 510.51627,402.81801 L 513.48836,401.44628 L 516.23184,402.58939 L 516.66218,412.91269 L 539.548,412.77064 L 558.41187,411.96962 L 568.53344,411.77209 L 569.67907,409.68172 L 569.39245,406.13221 L 567.56682,403.16011 L 569.16551,401.6749 L 567.56682,399.1634 L 568.25102,396.65357 L 569.61941,391.04814 L 572.1376,388.98551 L 571.45173,386.70095 L 575.1097,381.32916 L 577.85317,379.96077 L 577.73969,378.46719 L 577.39425,376.64155 L 580.2512,371.04282 L 582.65424,369.78623 L 583.03837,366.3586 L 584.80904,365.1169 L 585.66552,360.88263 L 584.32406,356.87219 L 588.36558,354.49548 L 588.91584,352.47628 L 590.15112,348.2087 z",
        OK: "M 375.34313,322.57146 L 364.65498,322.11427 L 358.22497,321.62845 L 358.48217,321.82848 L 357.77873,332.25058 L 379.74411,333.65746 L 411.79966,334.96106 L 409.46506,359.37971 L 409.00781,377.21228 L 409.23644,378.81264 L 413.58027,382.4706 L 415.63787,383.61371 L 416.32374,383.38509 L 417.00961,381.32748 L 418.38135,383.15647 L 420.43895,383.15647 L 420.43895,381.78473 L 423.18242,383.15647 L 422.72518,387.04305 L 426.84039,387.27167 L 429.35523,388.41479 L 433.47044,389.10066 L 435.98529,390.92964 L 438.27152,388.87204 L 441.70086,389.5579 L 444.21571,392.98724 L 445.13019,392.98724 L 445.13019,395.27347 L 447.41642,395.95933 L 449.70264,393.67311 L 451.53163,394.35897 L 454.04647,394.35897 L 454.96097,396.87383 L 459.76204,398.7028 L 461.13378,398.01694 L 462.96276,393.90173 L 464.10587,393.90173 L 465.24899,395.95933 L 469.3642,396.6452 L 473.02215,398.01694 L 475.99425,398.93143 L 477.82324,398.01694 L 478.5091,395.50209 L 482.85293,395.50209 L 484.91053,396.41658 L 487.654,394.35897 L 488.79712,394.35897 L 489.48299,395.95933 L 493.59819,395.95933 L 495.19855,393.90173 L 497.02754,394.35897 L 499.08514,396.87383 L 502.28585,398.7028 L 505.48658,399.6173 L 507.42766,400.73623 L 507.03856,363.51922 L 505.66681,352.54524 L 505.50635,343.6729 L 504.06646,337.13517 L 503.28826,329.95553 L 503.22012,326.13931 L 491.08328,326.45805 L 444.67324,326.00081 L 399.63433,323.94319 z",
        KS: "M 503.38059,325.13028 L 490.76233,325.33471 L 444.67324,324.87748 L 400.11576,322.81985 L 375.48602,321.56244 L 379.62981,256.84247 L 401.46327,257.64264 L 441.92918,259.01437 L 486.05364,259.47162 L 491.14927,259.47162 L 494.39617,262.69652 L 497.16383,262.92514 L 498.05413,264.00011 L 498.05413,266.00934 L 496.22515,267.60971 L 495.7679,270.21688 L 497.98598,273.80671 L 500.50084,276.93927 L 503.01569,278.92873 L 504.06646,290.10705 z",
        LA: "M 602.20213,472.99473 L 601.17268,470.37851 L 600.02956,467.28625 L 596.7137,463.74511 L 597.62986,456.99488 L 597.51137,455.85345 L 596.24976,456.19555 L 588.01934,457.10836 L 562.99102,457.56728 L 562.30683,455.1726 L 563.21964,446.7169 L 566.53552,440.77105 L 571.56688,432.08003 L 570.99281,429.68201 L 572.2494,429.00116 L 572.70833,427.04867 L 570.42209,424.99274 L 570.3103,423.05029 L 568.47964,418.70478 L 568.02323,412.76393 L 558.2984,412.87741 L 539.0941,413.79191 L 516.88913,413.82048 L 516.9177,423.39405 L 517.60357,432.76758 L 518.28944,436.65416 L 520.80429,440.76937 L 521.71878,445.79908 L 526.06261,451.28601 L 526.29123,454.48673 L 526.9771,455.1726 L 526.29123,463.63164 L 523.31914,468.66133 L 524.9195,470.71894 L 524.23362,473.23378 L 523.54776,480.54971 L 522.17602,483.75042 L 522.29848,487.36687 L 526.98496,485.84672 L 535.06798,485.5234 L 545.41425,489.07993 L 551.88067,490.21156 L 555.59886,488.75661 L 558.83207,489.88824 L 562.06528,490.8582 L 562.87358,488.75661 L 559.64037,487.62499 L 557.0538,488.10997 L 554.30557,486.49337 C 554.30557,486.49337 554.46724,485.20008 555.11388,485.03842 C 555.76052,484.87676 558.18543,484.06846 558.18543,484.06846 L 559.96369,485.5234 L 561.74196,484.55344 L 564.97517,485.20008 L 566.43011,487.62499 L 566.75343,489.88824 L 571.27992,490.21156 L 573.05819,491.98982 L 572.24989,493.60643 L 570.9566,494.41473 L 572.57321,496.03133 L 580.97955,499.58786 L 584.53608,498.29458 L 585.50605,495.86967 L 588.09261,495.22303 L 589.87088,493.76809 L 591.16416,494.73805 L 591.97246,497.64794 L 589.70922,498.45624 L 590.35586,499.10288 L 593.75073,497.8096 L 596.01398,494.41473 L 596.82228,493.92975 L 594.72069,493.60643 L 595.52899,491.98982 L 595.36733,490.53488 L 597.46892,490.0499 L 598.60054,488.75661 L 599.24718,489.56491 C 599.24718,489.56491 599.08552,492.63646 599.89383,492.63646 C 600.70213,492.63646 604.097,493.28311 604.097,493.28311 L 608.13851,495.22303 L 609.10847,496.67798 L 612.01836,496.67798 L 613.14999,497.64794 L 615.41323,494.57639 L 615.41323,493.12144 L 614.11995,493.12144 L 610.72508,490.37322 L 604.9053,489.56491 L 601.67209,487.30167 L 602.80372,484.55344 L 605.06696,484.87676 L 605.22862,484.23012 L 603.45036,483.26016 L 603.45036,482.77517 L 606.68357,482.77517 L 608.46183,479.70363 L 607.16855,477.7637 L 606.84523,475.01547 L 605.39028,475.17713 L 603.45036,477.27872 L 602.80372,479.86529 L 599.73217,479.21864 L 598.7622,477.44038 L 600.54047,475.50045 L 602.56122,473.7222 z",
        VA: "M 828.90662,269.2457 L 828.76271,267.29867 L 835.21614,264.74879 L 834.44573,267.96663 L 831.52578,271.74574 L 831.10769,276.33156 L 831.56944,279.722 L 829.74147,284.70016 L 827.5772,286.6163 L 826.10686,281.97549 L 826.55275,276.52638 L 828.13975,272.34331 z M 831.18615,297.54706 L 773.01197,310.12249 L 735.585,315.40156 L 728.90667,315.02638 L 726.32142,316.95276 L 718.98229,317.17345 L 710.60018,318.15112 L 701.67396,319.10283 L 710.15465,314.15454 L 710.14153,312.07961 L 711.66158,309.93348 L 722.21536,298.43205 L 726.16208,302.90951 L 729.94509,303.87349 L 732.48855,302.73317 L 734.72577,301.42201 L 737.26238,302.76553 L 741.17655,301.33777 L 743.05328,296.78143 L 745.6542,297.32145 L 748.50944,295.1902 L 750.30871,295.6838 L 753.13592,292.00723 L 753.48417,289.92412 L 752.52051,288.64855 L 753.52328,286.78192 L 758.79755,274.50477 L 759.41432,268.76969 L 760.64321,268.24615 L 762.82174,270.68902 L 766.7576,270.38785 L 768.68681,262.81422 L 771.4808,262.25336 L 772.53055,259.51229 L 775.11037,257.16541 L 776.37834,254.8232 L 777.8822,251.47022 L 777.96713,246.40267 L 787.78864,250.22549 C 788.46949,250.56591 788.44474,245.44151 788.44474,245.44151 L 792.49505,246.81886 L 792.03305,249.44766 L 800.18916,252.38732 L 801.48203,254.18171 L 800.61409,257.86385 L 799.35101,259.18967 L 798.84509,260.93571 L 799.339,263.33843 L 801.29798,264.61681 L 805.21607,266.06202 L 808.16474,267.02998 L 813.02121,267.97209 L 815.17352,270.06055 L 818.36396,270.46308 L 819.23203,271.6631 L 818.79254,276.35318 L 820.16727,277.45573 L 819.68832,279.38612 L 820.91773,280.17589 L 820.69593,281.56049 L 818.00194,281.46555 L 818.0909,283.08107 L 820.37189,284.62394 L 820.49343,286.03584 L 822.26654,287.82122 L 822.75833,290.34535 L 820.20529,291.72666 L 821.77751,293.22096 L 827.57853,291.53513 z",
        DC: "M 801.75695,253.84384 L 800.67992,252.20717 L 799.66604,251.36463 L 800.7653,249.74841 L 802.99814,251.25941 z"
      
      }
      
      // Create the actual objects
      var stateAttr = {};
      for(var state in paths) {
        stateAttr = {};
        if(this.options.stateSpecificStyles[state]) {
          $.extend(stateAttr, attr, this.options.stateSpecificStyles[state]);
        } else {
          stateAttr = attr;
        }
        this.stateShapes[state] = R.path(paths[state]).attr(stateAttr);
        this.topShape = this.stateShapes[state];
        
        this.stateHitAreas[state] = R.path(paths[state]).attr({fill: "#000",
      "stroke-width": 0, "opacity" : 0.0, 'cursor': 'pointer'});
        this.stateHitAreas[state].node.dataState = state;
      }
      
      // Bind events
      this._onClickProxy = $.proxy(this, '_onClick');
      this._onMouseOverProxy = $.proxy(this, '_onMouseOver'),
      this._onMouseOutProxy = $.proxy(this, '_onMouseOut');
        
      for(var state in this.stateHitAreas) {
        this.stateHitAreas[state].toFront();
        $(this.stateHitAreas[state].node).bind('mouseout touchend', this._onMouseOutProxy);
        $(this.stateHitAreas[state].node).bind('click touchend', this._onClickProxy);
        $(this.stateHitAreas[state].node).bind('mouseover touchstart', this._onMouseOverProxy);
        
      }
    },
    
    
    
    /**
     * Create the labels
     */
    _initCreateLabels: function() {
      var R = this.paper; // shorter name for usage here
      var neStates = ['VT', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'DC'];
      
      // calculate the values for placing items
      var neBoxX = 860;
      var neBoxY = 220;
      var oWidth = this.options.labelWidth;
      var oHeight = this.options.labelHeight;
      var oGap = this.options.labelGap;
      var oRadius = this.options.labelRadius;
      
      var shapeWidth = oWidth/this.scale;
      var shapeHeight = oHeight/this.scale;
      
      var colWidth = (oWidth+oGap)/this.scale;
      var downBy = (oHeight+oGap)/this.scale*0.5;
      
      var shapeRadius = oRadius/this.scale;
      
      // Styling information
      var backingAttr = this.options.labelBackingStyles;
      var textAttr = this.options.labelTextStyles;
      var stateAttr = {};
      
      // NE States
      for(var i=0, x, y, state; i<neStates.length; ++i) {
        state = neStates[i];
        
        // position
        x = ((i+1)%2) * colWidth + neBoxX;
        y = i*downBy + neBoxY;
        
        // attributes for styling the backing
        stateAttr = {};
        if(this.options.stateSpecificLabelBackingStyles[state]) {
          $.extend(stateAttr, backingAttr, this.options.stateSpecificLabelBackingStyles[state]);
        } else {
          stateAttr = backingAttr;
        }
        
        // add the backing
        this.labelShapes[state] = R.rect(x, y, shapeWidth, shapeHeight, shapeRadius).attr(stateAttr);
        
        // attributes for styling the text
        stateAttr = {};
        if(this.options.stateSpecificLabelTextStyles[state]) {
          $.extend(stateAttr, textAttr, this.options.stateSpecificLabelTextStyles[state]);
        } else {
          $.extend(stateAttr, textAttr);
        }
        
        // adjust font-size
        if(stateAttr['font-size']) {
          stateAttr['font-size'] = (parseInt(stateAttr['font-size'])/this.scale) + 'px';
        }
        
        // add the text
        this.labelTexts[state] = R.text(x+(shapeWidth/2), y+(shapeHeight/2), state).attr(stateAttr);
        
        // Create the hit areas
        this.labelHitAreas[state] = R.rect(x, y, shapeWidth, shapeHeight, shapeRadius).attr({
          fill: "#000",
          "stroke-width": 0, 
          "opacity" : 0.0, 
          'cursor': 'pointer'
        });
        this.labelHitAreas[state].node.dataState = state;
      }
      
      
      
      // Bind events
      for(var state in this.labelHitAreas) {
        this.labelHitAreas[state].toFront();
        $(this.labelHitAreas[state].node).bind('mouseout touchend', this._onMouseOutProxy);
        $(this.labelHitAreas[state].node).bind('click touchend', this._onClickProxy);
        $(this.labelHitAreas[state].node).bind('mouseover touchstart', this._onMouseOverProxy);
      }
    },
    
    
    
    /**
     * Get the state Raphael object
     */
    _getStateFromEvent: function(event) {
      // first get the state name
      var stateName = (event.target && event.target.dataState) || (event.dataState);
      return this._getState(stateName);
    },
    
    
    /**
     *
     */
    _getState: function(stateName) {
      var stateShape = this.stateShapes[stateName];
      var stateHitArea = this.stateHitAreas[stateName];
      var labelBacking = this.labelShapes[stateName];
      var labelText = this.labelTexts[stateName];
      var labelHitArea = this.labelHitAreas[stateName]
      
      return {
        shape: stateShape, 
        hitArea: stateHitArea, 
        name: stateName, 
        labelBacking: labelBacking, 
        labelText: labelText, 
        labelHitArea: labelHitArea
      };
    },
    
    
    
    /**
     * The mouseout handler
     */
    _onMouseOut: function(event) {
      var stateData = this._getStateFromEvent(event);
      
      // Stop if no state was found
      if(!stateData.hitArea) {
        return;
      }
      
      return !this._triggerEvent('mouseout', event, stateData);

    },
    
    
    /**
     *
     */
    _defaultMouseOutAction: function(stateData) {
      // hover effect
      // ... state shape
      var attrs = {};
      if(this.options.stateSpecificStyles[stateData.name]) {
        $.extend(attrs, this.options.stateStyles, this.options.stateSpecificStyles[stateData.name]);
      } else {
        attrs = this.options.stateStyles;
      }
      
      stateData.shape.animate(attrs, this.options.stateHoverAnimation);
      
      
      // ... for the label backing
      if(stateData.labelBacking) {
        var attrs = {};
        
        if(this.options.stateSpecificLabelBackingStyles[stateData.name]) {
          $.extend(attrs, this.options.labelBackingStyles, this.options.stateSpecificLabelBackingStyles[stateData.name]);
        } else {
          attrs = this.options.labelBackingStyles;
        }
        
        stateData.labelBacking.animate(attrs, this.options.stateHoverAnimation);
      }
    },
    
    
    /**
     * The click handler
     */
    _onClick: function(event) {
      var stateData = this._getStateFromEvent(event);
      
      // Stop if no state was found
      if(!stateData.hitArea) {
        return;
      }
      
      return !this._triggerEvent('click', event, stateData);
    },
    
    
    
    /**
     * The mouseover handler
     */
    _onMouseOver: function(event) {
      var stateData = this._getStateFromEvent(event);
      
      // Stop if no state was found
      if(!stateData.hitArea) {
        return;
      }
      
      return !this._triggerEvent('mouseover', event, stateData);
    },
    
    
    
    /**
     * The default on hover action for a state
     */
    _defaultMouseOverAction: function(stateData) {
      // hover effect
      this.bringShapeToFront(stateData.shape);
      this.paper.safari();
      
      // ... for the state
      var attrs = {};
      if(this.options.stateSpecificHoverStyles[stateData.name]) {
        $.extend(attrs, this.options.stateHoverStyles, this.options.stateSpecificHoverStyles[stateData.name]);
      } else {
        attrs = this.options.stateHoverStyles;
      }
      
      stateData.shape.animate(attrs, this.options.stateHoverAnimation);
      
      // ... for the label backing
      if(stateData.labelBacking) {
        var attrs = {};
        
        if(this.options.stateSpecificLabelBackingHoverStyles[stateData.name]) {
          $.extend(attrs, this.options.labelBackingHoverStyles, this.options.stateSpecificLabelBackingHoverStyles[stateData.name]);
        } else {
          attrs = this.options.labelBackingHoverStyles;
        }
        
        stateData.labelBacking.animate(attrs, this.options.stateHoverAnimation);
      }
    },
    
    
    
    
    
    
    /**
     * Trigger events
     *
     * @param type string - the type of event
     * @param event Event object - the original event object
     * @param stateData object - information about the state
     *
     * return boolean - true to continue to default action, false to prevent the default action
     */
    _triggerEvent: function(type, event, stateData) {
      var name = stateData.name;
      var defaultPrevented = false;
      
      // State specific
      var sEvent = $.Event('usmap'+type+name);
      sEvent.originalEvent = event;
      
      // Do the one in options first
      if(this.options[type+'State'][name]) {
        defaultPrevented = this.options[type+'State'][name](sEvent, stateData) === false;
      }
      
      // Then do the bounded ones
      if(sEvent.isPropagationStopped()) {
        this.element.trigger(sEvent, [stateData]);
        defaultPrevented = defaultPrevented || sEvent.isDefaultPrevented();
      }
      
      
      // General
      if(!sEvent.isPropagationStopped()) {
        var gEvent = $.Event('usmap'+type);
        gEvent.originalEvent = event;
        
        // Options handler first
        if(this.options[type]) {
          defaultPrevented = this.options[type](gEvent, stateData) === false || defaultPrevented;
        }
        
        // Bounded options next
        if(!gEvent.isPropagationStopped()) {
          this.element.trigger(gEvent, [stateData]);
          defaultPrevented = defaultPrevented || gEvent.isDefaultPrevented();
        }
      }
      
      // Do the default action
      if(!defaultPrevented) {
        switch(type) {
          case 'mouseover':
            this._defaultMouseOverAction(stateData);
            break;
          
          case 'mouseout': 
            this._defaultMouseOutAction(stateData);
            break;
        }
      }
      
      return !defaultPrevented;
    },
    
    
    /**
     *
      @param string state - The two letter state abbr
     */
    trigger: function(state, type, event) {
      type = type.replace('usmap', ''); // remove the usmap if they added it
      state = state.toUpperCase(); // ensure state is uppercase to match
      
      var stateData = this._getState(state);
      
      this._triggerEvent(type, event, stateData);
    },
    
    
    /**
     * Bring a state shape to the top of the state shapes, but not above the hit areas
     */
    bringShapeToFront: function(shape) {
      if(this.topShape) {
        shape.insertAfter(this.topShape);
      }
      this.topShape = shape;
    }
  };
  
  
  // Getters
  var getters = [];
  
  
  // Create the plugin
  jQueryPluginFactory($, 'usmap', methods, getters);

})(jQuery, document, window, Raphael);;
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox') && (Drupal.settings.googleanalytics.trackColorbox)) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Downloads",
            "eventAction": Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(),
            "eventLabel": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", {
            "hitType": "pageview",
            "page": Drupal.googleanalytics.getPageUrl(this.href),
            "transport": "beacon"
          });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", {
            "hitType": "event",
            "eventCategory": "Mails",
            "eventAction": "Click",
            "eventLabel": this.href.substring(7),
            "transport": "beacon"
          });
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode !== 2 || (Drupal.settings.googleanalytics.trackDomainMode === 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains))) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Outbound links",
              "eventAction": "Click",
              "eventLabel": this.href,
              "transport": "beacon"
            });
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga("send", {
        "hitType": "pageview",
        "page": location.pathname + location.search + location.hash
      });
    };
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  if (Drupal.settings.googleanalytics.trackColorbox) {
    $(document).bind("cbox_complete", function () {
      var href = $.colorbox.element().attr("href");
      if (href) {
        ga("send", {
          "hitType": "pageview",
          "page": Drupal.googleanalytics.getPageUrl(href)
        });
      }
    });
  }

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
};

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
};

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
};

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
};

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
};

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
};

})(jQuery);
;
