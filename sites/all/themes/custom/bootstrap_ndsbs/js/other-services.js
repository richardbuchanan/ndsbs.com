jQuery(document).ready(function ($) {
  $('#edit-field-progress-notes-und').unbind('change');
  $('#edit-field-progress-notes-und').bind('change', function () {
    var postdata = $('#edit-field-progress-notes-und').val();
    var idval = 'field_progress_notes_amount';
    var idval_txt_box = 'edit-field-progress-notes-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed

  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-proof-of-attendence-und').unbind('change');
  $('#edit-field-proof-of-attendence-und').bind('change', function () {
    var postdata = $('#edit-field-proof-of-attendence-und').val();
    var idval = 'field_proof_of_attendence_amount';
    var idval_txt_box = 'edit-field-proof-of-attendence-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-discharge-summaries-und').unbind('change');
  $('#edit-field-discharge-summaries-und').bind('change', function () {
    var postdata = $('#edit-field-discharge-summaries-und').val();
    var idval = 'field_discharge_summaries_amount';
    var idval_txt_box = 'edit-field-discharge-summaries-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-notary-fee-und').unbind('change');
  $('#edit-field-notary-fee-und').bind('change', function () {
    var postdata = $('#edit-field-notary-fee-und').val();
    var idval = 'field_notary_fee_amount';
    var idval_txt_box = 'edit-field-notary-fee-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-broken-appointment-und').unbind('change');
  $('#edit-field-broken-appointment-und').bind('change', function () {
    var postdata = $('#edit-field-broken-appointment-und').val();
    var idval = 'field_broken_appointment_amount';
    var idval_txt_box = 'edit-field-broken-appointment-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-state-form-1-3-page-und').unbind('change');
  $('#edit-field-state-form-1-3-page-und').bind('change', function () {
    var postdata = $('#edit-field-state-form-1-3-page-und').val();
    var idval = 'field_state_form_1_3_page_amount';
    var idval_txt_box = 'edit-field-state-form-1-3-page-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-state-form-4-6-page-und').unbind('change');
  $('#edit-field-state-form-4-6-page-und').bind('change', function () {
    var postdata = $('#edit-field-state-form-4-6-page-und').val();
    var idval = 'field_state_form_4_6_page_amount';
    var idval_txt_box = 'edit-field-state-form-4-6-page-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-state-form-7-9-page-und').unbind('change');
  $('#edit-field-state-form-7-9-page-und').bind('change', function () {
    var postdata = $('#edit-field-state-form-7-9-page-und').val();
    var idval = 'field_state_form_7_9_page_amount';
    var idval_txt_box = 'edit-field-state-form-7-9-page-amount-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
  ///////////////////////////////////////////////////////////////////////////
  $('#edit-field-state-form-10-12-page-und').unbind('change');
  $('#edit-field-state-form-10-12-page-und').bind('change', function () {
    var postdata = $('#edit-field-state-form-10-12-page-und').val();
    var idval = 'field_state_form_10_12_page_amou';
    var idval_txt_box = 'edit-field-state-form-10-12-page-amou-und-0-value';
    ajaxRequest(postdata, idval, idval_txt_box);
  });// Bind function closed
});

function ajaxRequest(postdata, idval, idval_txt_box) {
  // Fire the ajax request
  jQuery.ajax({
    url: 'https://www.ndsbs.com/otherservices/getprice',
    type: 'post',
    data: {postdata: postdata},
    success: function (response) {
      jQuery('#' + idval).html('$' + response);
      jQuery('#' + idval_txt_box).val(response);
      //alert(response);
    }
  });//  Ajax function closed
}