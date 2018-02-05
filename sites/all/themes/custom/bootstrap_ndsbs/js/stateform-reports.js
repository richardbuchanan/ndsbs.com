function ajaxRequestStateForm(postdata) {
  // Fire the ajax request
  jQuery.ajax({
    url: '<?php print $base_url; ?>/save/stateform/verification',
    type: 'post',
    data: {postdata: postdata},
    success: function (response) {
      jQuery('#success_msg_statfrm').html('Record Saved successfully.');
      //alert(response);
      if (response == 'success') {
        window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/tab/3';
      }
    }
  });//  Ajax function closed
}