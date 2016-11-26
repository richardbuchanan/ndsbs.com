<?php
/**
 * @file
 * user_profile_form.tpl.php
 */
global $base_path, $user;

//  Load the user to show counsellor information
$edit_user_id = arg(1);
$edit_user_load = user_load($edit_user_id);
?>
<div class="container">
    <h1>Profile</h1>
    <div class="wd_1">
        <div class="custom_name_fileld">
          <div class="form-item_custum block_fileld">
              <?php print drupal_render($form['field_first_name']); ?>
          </div>
          <div class="form-item_custum">
              <?php print drupal_render($form['field_middle_name']); ?>
          </div>
  
          <div class="form-item_custum">
              <?php print drupal_render($form['field_last_name']); ?>
          </div>
        </div>
        <div class="form-item_custum">
            <?php print drupal_render($form['account']['mail']); ?>
        </div>
        <div class="form-item_custum gender">
            <?php print drupal_render($form['field_gender']); ?>
        </div>     
        <div class="custom_dob_fileld">
          <div class="form-item_custum">
              <label class="block">Date Of Birth</label>
              <div class="left">
            <?php print drupal_render($form['field_month']); ?>
            <?php print drupal_render($form['field_dobdate']); ?>
            <?php print drupal_render($form['field_year']); ?>
          </div>
          </div>
         </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_phone']); ?>
        </div>

        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_second_phone']); ?>
        </div>
        
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_address']); ?>
        </div>
        
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_city']); ?>
            <span class="validate-fileld" id="user_city"></span>
        </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_state']); ?>
            <span class="validate-fileld" id="user_state"></span>
        </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_zip']); ?>
            <span class="validate-fileld" id="user_zip"></span>
        </div>
        <?php
            /*
            //  Assign therapist to client by super admin and staff admin only
            if(($user->roles[3] == 'super admin' || $user->roles[5] == 'staff admin') && $edit_user_load->roles[4] != 'therapist') {
        ?>
                <div class="form-item_custum fw_fixed">
                    <?php print drupal_render($form['field_assigned_therapist']); ?>
                </div>
        <?php
            }
            */
        ?>
        <?php
            if($user->roles[4] == 'therapist' || $edit_user_load->roles[4] == 'therapist') {
        ?>
            <div class="form-item_custum fw_fixed">
                <?php print drupal_render($form['field_profile_picture']); ?>
            </div>
        
            <div class="form-item_custum">
                <?php print drupal_render($form['field_therapist_large_image']); ?>
            </div>
        
            <!--   START HERE Therapist Section    -->
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_therapist_degree']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_biography_sub']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_biography_desc']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_education_sub']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_education_desc']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_assessments_sub']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_assessments_desc']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_get_in_touch_sub']); ?>
            </div>
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_get_in_touch_desc']); ?>
            </div>
            
            <div class="form-item_custum fw_fixed crequest_fixed">
                <?php print drupal_render($form['field_upload_report_signature']); ?>
            </div>
            
            <div class="form-item_custum fw_fixed user_ft">
                <?php print drupal_render($form['field_assessment_assigned']); ?>
            </div>
            <!--   END HERE Therapist Section    -->
        <?php 
            }
        ?>
        <div class="form-item_custum fw_fixed user_ft">
            <?php print drupal_render($form['account']['roles']); ?>
        </div>

        <div class="form-item_custum user_ftt fw_fixed">
            <?php print drupal_render($form['account']['status']); ?>
        </div>

        <?php
            if($user->roles[3] == 'super admin') {
        ?>
                <div style='display:inline;'>
                    <?php
                    //  Use to render the drupal 7 form
                    print drupal_render_children($form);
                    ?>
                </div>
        <?php
            }
        ?>
        <div class="form-item_custum" id="user_registration_frm_validation">
            <?php print drupal_render($form['actions']['submit']); ?>	<!-- Button to submit the form -->
        </div>
        <?php
            if($user->roles[3] != 'super admin') {
        ?>
                <div style='display:none;'>
                    <?php
                    //  Use to render the drupal 7 form
                    print drupal_render_children($form);
                    ?>
                </div>
        <?php
            }
        ?>
    </div>
</div>
