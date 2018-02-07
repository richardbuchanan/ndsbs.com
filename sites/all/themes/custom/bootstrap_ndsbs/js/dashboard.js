jQuery(document).ready(function ($) {
  $('body').append('<div id="dialog" class="sr-only" title="Select Dashboard"></div>');
  $('#dialog').html('<p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the "x" icon.</p>');
  $( "#dialog" ).dialog();
});