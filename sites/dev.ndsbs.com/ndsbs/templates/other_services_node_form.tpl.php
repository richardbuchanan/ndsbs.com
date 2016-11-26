<?php
/**
 * @file
 * other_services_node_form.tpl.php
 */
global $base_path, $base_url;
//echo '<pre>';
//print_r($form);
//echo '</pre>';
?>
<h1>Other Services Pricing</h1>
<div class="wd_1 aeassessment_page">

    <div class="form-item_custum">
        <?php print drupal_render($form['field_progress_notes']); ?>
        <label id="field_progress_notes_amount" class="label_item">
            <?php print '$' . $form['#node']->field_progress_notes_amount['und'][0]['value']; ?>
        </label>
    </div>

    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_progress_notes_amount']); ?>
    </div> 

    <div class="form-item_custum fw_fixed">
        <?php print drupal_render($form['field_proof_of_attendence']); ?>
        <label id="field_proof_of_attendence_amount" class="label_item">
            <?php print '$' . $form['#node']->field_proof_of_attendence_amount['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_proof_of_attendence_amount']); ?>
    </div>

    <div class="form-item_custum">
        <?php print drupal_render($form['field_discharge_summaries']); ?>
        <label id="field_discharge_summaries_amount" class="label_item">
            <?php print '$' . $form['#node']->field_discharge_summaries_amount['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_discharge_summaries_amount']); ?>
    </div>

    <div class="form-item_custum">
        <?php print drupal_render($form['field_notary_fee']); ?>
        <label id="field_notary_fee_amount" class="label_item">
            <?php print '$' . $form['#node']->field_notary_fee_amount['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_notary_fee_amount']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php print drupal_render($form['field_broken_appointment']); ?>
        <label id="field_broken_appointment_amount" class="label_item">
            <?php print '$' . $form['#node']->field_broken_appointment_amount['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_broken_appointment_amount']); ?>
    </div>    
    
    <div class="form-item_custum">
        <?php print drupal_render($form['field_state_form_1_3_page_']); ?>
         <label id="field_state_form_1_3_page_amount" class="label_item">
            <?php print '$' . $form['#node']->field_state_form_1_3_page_amount['und'][0]['value']; ?>
         </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_state_form_1_3_page_amount']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php print drupal_render($form['field_state_form_4_6_page_']); ?>
        <label id="field_state_form_4_6_page_amount" class="label_item">
            <?php print '$' . $form['#node']->field_state_form_4_6_page_amount['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_state_form_4_6_page_amount']); ?>
    </div> 
    
    <div class="form-item_custum">
        <?php print drupal_render($form['field_state_form_7_9_page_']); ?>
        <label id="field_state_form_7_9_page_amount" class="label_item">
            <?php print '$' . $form['#node']->field_state_form_7_9_page_amount['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_state_form_7_9_page_amount']); ?>
    </div>
    
    <div class="form-item_custum">
        <?php print drupal_render($form['field_state_form_10_12_page_']); ?>
        <label id="field_state_form_10_12_page_amou" class="label_item">
            <?php print '$' . $form['#node']->field_state_form_10_12_page_amou['und'][0]['value']; ?>
        </label>
    </div>
    
    <div class="form-item_custum" style='display:none;'>
        <?php print drupal_render($form['field_state_form_10_12_page_amou']); ?>
    </div>
 
    <div class="form-item_custum">
        <?php print drupal_render($form['actions']['submit']); ?>
    </div>

    <div style='display:none;'>
        <?php
        //  Use to render the drupal 7 form
        print drupal_render_children($form);
        ?>
    </div>
</div>
<script>
    jQuery(document).ready(function() {
        jQuery('#edit-field-progress-notes-und').unbind('change');
        jQuery('#edit-field-progress-notes-und').bind('change',function() {
            var postdata = jQuery('#edit-field-progress-notes-und').val();
            var idval = 'field_progress_notes_amount';
            var idval_txt_box = 'edit-field-progress-notes-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-proof-of-attendence-und').unbind('change');
        jQuery('#edit-field-proof-of-attendence-und').bind('change',function() {
            var postdata = jQuery('#edit-field-proof-of-attendence-und').val();
            var idval = 'field_proof_of_attendence_amount';
            var idval_txt_box = 'edit-field-proof-of-attendence-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-discharge-summaries-und').unbind('change');
        jQuery('#edit-field-discharge-summaries-und').bind('change',function() {
            var postdata = jQuery('#edit-field-discharge-summaries-und').val();
            var idval = 'field_discharge_summaries_amount';
            var idval_txt_box = 'edit-field-discharge-summaries-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-notary-fee-und').unbind('change');
        jQuery('#edit-field-notary-fee-und').bind('change',function() {
            var postdata = jQuery('#edit-field-notary-fee-und').val();
            var idval = 'field_notary_fee_amount';
            var idval_txt_box = 'edit-field-notary-fee-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-broken-appointment-und').unbind('change');
        jQuery('#edit-field-broken-appointment-und').bind('change',function() {
            var postdata = jQuery('#edit-field-broken-appointment-und').val();
            var idval = 'field_broken_appointment_amount';
            var idval_txt_box = 'edit-field-broken-appointment-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-state-form-1-3-page-und').unbind('change');
        jQuery('#edit-field-state-form-1-3-page-und').bind('change',function() {
            var postdata = jQuery('#edit-field-state-form-1-3-page-und').val();
            var idval = 'field_state_form_1_3_page_amount';
            var idval_txt_box = 'edit-field-state-form-1-3-page-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-state-form-4-6-page-und').unbind('change');
        jQuery('#edit-field-state-form-4-6-page-und').bind('change',function() {
            var postdata = jQuery('#edit-field-state-form-4-6-page-und').val();
            var idval = 'field_state_form_4_6_page_amount';
            var idval_txt_box = 'edit-field-state-form-4-6-page-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-state-form-7-9-page-und').unbind('change');
        jQuery('#edit-field-state-form-7-9-page-und').bind('change',function() {
            var postdata = jQuery('#edit-field-state-form-7-9-page-und').val();
            var idval = 'field_state_form_7_9_page_amount';
            var idval_txt_box = 'edit-field-state-form-7-9-page-amount-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        jQuery('#edit-field-state-form-10-12-page-und').unbind('change');
        jQuery('#edit-field-state-form-10-12-page-und').bind('change',function() {
            var postdata = jQuery('#edit-field-state-form-10-12-page-und').val();
            var idval = 'field_state_form_10_12_page_amou';
            var idval_txt_box = 'edit-field-state-form-10-12-page-amou-und-0-value';
            ajaxRequest(postdata, idval, idval_txt_box);
        });// Bind function closed
        ///////////////////////////////////////////////////////////////////////////
        
        
    });// Main function closed
    

    function ajaxRequest(postdata, idval, idval_txt_box) {
        // Fire the ajax request
        jQuery.ajax({
            url: '<?php print $base_url; ?>/otherservices/getprice',
            type: 'post',
            data: { postdata: postdata },
            success: function(response) {
                jQuery('#'+idval).html('$'+response);
                jQuery('#'+idval_txt_box).val(response);
                //alert(response);
            }
        });//  Ajax function closed
    }

    
</script>