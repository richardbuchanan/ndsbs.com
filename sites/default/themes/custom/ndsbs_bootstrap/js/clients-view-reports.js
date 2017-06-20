jQuery(document).ready(function ($) {
  ////////////////////////////////////////////////////////////////////////
  //                AJAX Form Submission REQUEST START                  //
  ////////////////////////////////////////////////////////////////////////
  //  save the papaerwork request
  jQuery('#save_paper_work_verification').unbind('click');
  jQuery("#save_paper_work_verification").bind("click",function() {
    var postdata = jQuery("#paperwork-frm").serialize();
    //alert(postdata);
    ajaxRequest(postdata);
  });
});

//  make ajax request to save the form
function ajaxRequest(postdata) {
  // Fire the ajax request
  jQuery.ajax({
    url: '<?php print $base_url; ?>/save/paperwork/verification',
    type: 'post',
    enctype: 'multipart/form-data',
    data: { postdata: postdata },
    success: function(response) {
      jQuery('#success_msg_pprwrk').html('Record Saved successfully.');
      //alert(response);
      if(response == 'success') {
        //   window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/transid/<?php print arg(9); ?>/tab/1';
      }
    }
  });//  Ajax function closed
}

//  make ajax request to save the form
function ajaxRequestStateForm(postdata) {
  // Fire the ajax request
  jQuery.ajax({
    url: '<?php print $base_url; ?>/save/stateform/verification',
    type: 'post',
    enctype: 'multipart/form-data',
    data: { postdata: postdata },
    success: function(response) {
      jQuery('#success_msg_statfrm').html('Record Saved successfully.');
      //alert(response);
      if(response == 'success') {
        //  window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/tab/3';
      }
    }
  });//  Ajax function closed
}

//  make ajax request to save the form
function ajaxRequestAssessmentForm(postdata) {
  // Fire the ajax request
  jQuery.ajax({
    url: '<?php print $base_url; ?>/save/assessmentform/verification',
    type: 'post',
    enctype: 'multipart/form-data',
    data: {postdata: postdata},
    success: function (response) {
      jQuery('#success_msg_assessmentfrm').html('Record Saved successfully.');
      //alert(response);
      if (response == 'success') {
        // window.location.href = '<?php print $base_url; ?>/users/view/reports/<?php print arg(3); ?>/tid/<?php print arg(5); ?>/nid/<?php print arg(7); ?>/tab/2';
      }
    }
  });//  Ajax function closed
}