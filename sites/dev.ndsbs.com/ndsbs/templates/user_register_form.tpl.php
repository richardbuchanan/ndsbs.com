<?php
/**
 * @file
 * footer.tpl.php
 */
global $base_path;
global $base_url;
//echo '<pre>';
//print_r($form);
//echo '</pre>';
?>
<span itemprop="name" style="display: none">Get Started</span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
    </li>
    <meta itemprop="position" content="1" />
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/user/register">
        <span itemprop="name">Register</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
  </ol>
</div>

    <h1>Register for New Account</h1>
    <div class="wd_1">
        <div id="fnamelname" class="wd_blanck">
            <div class="custom_name_fileld">
                <div class="form-item_custum block_fileld form-item_custum01">
                    <?php print drupal_render($form['field_first_name']); ?>
                    <span class="validate-fileld error" id="user_fname" style="float: right;"></span>
                </div>

                <div class="form-item_custum form-item_custum02">
                    <?php print drupal_render($form['field_middle_name']); ?>
                    <span class="validate-fileld error" id="user_mname"></span>
                </div>

                <div class="form-item_custum form-item_custum03">
                    <?php print drupal_render($form['field_last_name']); ?>
                    <span class="validate-fileld error ml_5" id="user_lname"></span>
                </div>
                
            </div>
        </div>
        <div class="form-item_custum">
            <?php print drupal_render($form['account']['mail']); ?>
            <span class="validate-fileld error" id="user_email"></span>
        </div>
        
        <div class="form-item_custum">
            <?php print drupal_render($form['account']['conf_mail']); ?>
            <span class="validate-fileld error" id="user_conf_email"></span>
        </div>
        
        <div class="form-item_custum">
            <?php print drupal_render($form['account']['pass']); ?>
            <span class="validate-fileld error" id="user_password"></span>
            <span class="validate-fileld error" id="user_password_match"></span>
        </div>
          
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_gender']); ?>
            <span class="validate-fileld error" id="user_gender"></span>
        </div>
        <div class="custom_dob_fileld">
          <div class="form-item_custum">
              <label class="block">Date Of Birth</label>
              <div class="left">
              <?php print drupal_render($form['field_month']); ?>
              <?php print drupal_render($form['field_dobdate']); ?>
              <?php print drupal_render($form['field_year']); ?>
              <span class="validate-fileld error ml_5" id="user_dob"></span>
              </div>
          </div>
         </div>
        
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_phone']); ?>
               <span class="phone_format"> Format : 987-654-1234</span>
		<span class="validate-fileld error" id="user_phone" style="top:-6px;clear:left;"></span>
        </div>
        
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_second_phone']); ?>
        <span class="phone_format"> Format : 987-654-1234</span>
		<span class="validate-fileld error" id="user_second_phone" style="top:-6px;clear:left;"></span>
        </div>
        
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_address']); ?>
            <span class="validate-fileld error" id="user_address" style="top:-16px;"></span>
        </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_city']); ?>
            <span class="validate-fileld error" id="user_city" style="top:-16px;"></span>
        </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_state']); ?>
            <span class="validate-fileld error" id="user_state"></span>
        </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_zip']); ?>
            <span class="validate-fileld error" id="user_zip" style="top:-16px;"></span>
        </div>
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['field_referred_by']); ?>
            <span class="validate-fileld error" id="referred_by" style="top:-16px;"></span>
        </div>
        <div class="form-item_custom fw_fixed">
            <?php print drupal_render($form['field_reason_for_assessment']); ?>
        </div>
        <!-- <div class="form-item_custum fw_fixed">
          <div id="field-recipient-information-add-more-wrapper">
           	<h2>Recipient Information</h2>
						<p>We recommend addressing your report to the individual who is requesting it. If not yourself, please list recipient information here</p>
            <?php //print drupal_render($form['field_recipient_name']); ?>
            <?php //print drupal_render($form['field_recipient_title']); ?>
            <?php //print drupal_render($form['field_recipient_company']); ?>
            <?php //print drupal_render($form['field_recipient_street']); ?>
            <?php //print drupal_render($form['field_recipient_city']); ?>
            <?php //print drupal_render($form['field_recipient_state']); ?>
            <?php //print drupal_render($form['field_recipient_zip']); ?>
					</div>
        </div> -->
        
        <div class="form-item_custum fw_fixed user_ft">
            <?php print drupal_render($form['account']['roles']); ?>
        </div>
        
        <div class="form-item_custum fw_fixed">
            <?php print drupal_render($form['account']['notify']); ?>
        </div>
        
        <?php print drupal_render($form['captcha']); ?>

        <fieldset>
          <legend>Terms of Use</legend>
          <div class="form-item_custum fw_fixed" style="height: 200px; overflow: auto; padding: 10px 0; border: 1px solid #D5D5D5">
              <?php print drupal_render($form['field_terms_of_use_register']); ?>
          </div>
          <?php print drupal_render($form['field_terms_of_use']); ?>
        </fieldset>
        
        <div class="form-item_custum" id="user_registration_frm_validation">
            <?php print drupal_render($form['actions']['submit']); ?>	<!-- Button to submit the form -->
        </div>
        <?php
        ?>
        <div style="display: none"><?php
            //  Use to render the drupal 7 form
            print drupal_render_children($form);
        ?></div>
    </div>

<script>
    jQuery(document).ready(function() {
        //  hide the drupal default description text
        jQuery('.description').hide();
        jQuery('.field-name-field-reason-for-assessment .description').show();
        jQuery('.password-strength').hide();
        jQuery('.password-suggestions description').hide();
        
        jQuery('#edit-field-middle-name-und-0-value').val('Middle Name');
        
        //  Water mark function called
        jQuery('#edit-field-first-name-und-0-value').addClass('watermarkReg');
        jQuery('#edit-field-middle-name-und-0-value').addClass('watermarkReg');
        jQuery('#edit-field-last-name-und-0-value').addClass('watermarkReg');
        /* Start Universal textbox watermark function*/
            jQuery('.watermarkReg').each(function () {
                var default_value = this.value;
                jQuery(this).focus(function () {
                    if (this.value == default_value) {
                        this.value = '';
                    }
                });
                jQuery(this).blur(function () {
                    if (this.value == '') {
                        this.value = default_value;
                    }
                });
            });
        /* End Universal textbox watermark function*/
         $('#edit-field-phone-und-0-value').keyup(function() {
     var text=jQuery('#edit-field-phone-und-0-value').val();
     var len = text.length;
     if(len==3 ||len==7){
     var newtext=text+'-';
     $('#edit-field-phone-und-0-value').val(newtext);
     }
     if(len>12){
      var newtext=text.substr(0,12);
     $('#edit-field-phone-und-0-value').val(newtext);
     }

});
              $('#edit-field-second-phone-und-0-value').keyup(function() {
     var text=jQuery('#edit-field-second-phone-und-0-value').val();
     var len = text.length;
     if(len==3 ||len==7){
     var newtext=text+'-';
     $('#edit-field-second-phone-und-0-value').val(newtext);
     }
     if(len>12){
      var newtext=text.substr(0,12);
     $('#edit-field-second-phone-und-0-value').val(newtext);
     }

});

        jQuery("#user_registration_frm_validation").click(function() {
            var ck_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            var error_status = false;
            jQuery('#fnamelname').addClass('wd_blanck2');
            
            if(jQuery('#edit-field-first-name-und-0-value').val() == 'First Name') {
                jQuery('#edit-field-first-name-und-0-value').val('');
            }
            
            if(jQuery('#edit-field-middle-name-und-0-value').val() == 'Middle Name') {
                jQuery('#edit-field-middle-name-und-0-value').val('');
            }
            
            if(jQuery('#edit-field-last-name-und-0-value').val() == 'Last Name') {
                jQuery('#edit-field-last-name-und-0-value').val('');
            }
           
            if(jQuery('#edit-field-first-name-und-0-value').val() == '') {
                error_status = true;
                jQuery('#user_fname').html('Please enter your first name.');
                jQuery('#edit-field-first-name-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_fname').html('');
            }
            
            if(jQuery('#edit-field-last-name-und-0-value').val() == '') {
                error_status = true;
                jQuery('#user_lname').html('Please enter your last name.');
                jQuery('#edit-field-last-name-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_lname').html('');
            }

        

            if(jQuery('#edit-mail').val() == '' || !ck_email.test(jQuery('#edit-mail').val())) {
                error_status = true;
                jQuery('#user_email').html('Please enter valid email id.');
                jQuery('#edit-mail').addClass('input_box watermark error_box');
               // jQuery('#edit-conf-mail').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_email').html('');
            }
            
            if(jQuery('#edit-conf-mail').val() == '') {
                error_status = true;
                jQuery('#user_conf_email').html('Please enter confirm email id.');
              //  jQuery('#edit-conf-mail').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_conf_email').html('');
            }
            
            <?php
                if($user->uid != 1) {
            ?>
                    if(jQuery('#edit-mail').val() != jQuery('#edit-conf-mail').val()) {
                        error_status = true;
                        jQuery('#user_conf_email').html('Email and Confirm email address do not match.');
                        //return false;
                    } else {
                        jQuery('#user_conf_email').html('');
                    }
            <?php
                }
            ?>
            
            if(jQuery('#edit-pass-pass1').val() == '') {
                error_status = true;
                jQuery('#user_password').html('Please enter your password and confirm password.');
                jQuery('#edit-pass-pass1').addClass('input_box watermark error_box');
                jQuery('#edit-pass-pass2').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_password').html('');
            }
            
            if(jQuery('#edit-pass-pass1').val() != jQuery('#edit-pass-pass2').val()) {
                error_status = true;
                jQuery('#user_password_match').html('Password and confirm password do not match.');
                //return false;
            } else {
                jQuery('#user_password_match').html('');
            }

            if(jQuery('#edit-field-gender-und').val() == '_none') {
                error_status = true;
                jQuery('#user_gender').html('Please select your gender.');
                jQuery('#edit-field-gender-und').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_gender').html('');
            }

            //  Age Validation Start                /////////////////////////////////////////////////////////////////////////
            if(jQuery('#edit-field-dobdate-und').val() == '_none' || jQuery('#edit-field-month-und').val() == '_none' || jQuery('#edit-field-year-und').val() == '_none') {
                error_status = true;
                jQuery('#user_dob').html('Please select your Date of birth.');
                jQuery('#edit-field-dobdate-und').addClass('input_box watermark error_box');
                jQuery('#edit-field-month-und').addClass('input_box watermark error_box');
                jQuery('#edit-field-year-und').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_dob').html('');
                var date_user = jQuery('#edit-field-dobdate-und').val();
                var month_user = jQuery('#edit-field-month-und').val();
                var year_user = jQuery('#edit-field-year-und').val();
                //  alert(getAge('"'+month_user+'/'+date_user+'/'+year_user+'"'));
                var user_age = getAge(month_user+'/'+date_user+'/'+year_user);

                //  alert(getAge("09/23/1981"));
                if(user_age < 0) {
                    error_status = true;
                    jQuery('#user_dob').html('Your age ' + user_age + ' years, must be greater then 13 years.');
                    //return false;
                } else {
                    jQuery('#user_dob').html('Your age ' + user_age + ' years.');
                }
                //  Age Validation End          /////////////////////////////////////////////////////////////////////////
            }
            
            if(jQuery('#edit-field-phone-und-0-value').val() == '') {
                error_status = true;
                jQuery('#user_phone').html('Please enter your phone.');
                jQuery('#edit-field-phone-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_phone').html('');
            }
            var text=jQuery('#edit-field-phone-und-0-value').val();
            var matches = text.match(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{4}$/);
            if(!text.match(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{4}$/)) {
                error_status = true;
                jQuery('#user_phone').html('Please enter a valid phone number.');
                jQuery('#edit-field-phone-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_phone').html('');
            } 
			var text=jQuery('#edit-field-second-phone-und-0-value').val();
            var matches = text.match(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{4}$/);
			if(text.length>0){
            if(!text.match(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{4}$/)) {
                error_status = true;
                jQuery('#user_second_phone').html('Please enter a valid phone number.');
                jQuery('#edit-field-second-phone-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_second_phone').html('');
            } 
			}
            if(jQuery('#edit-field-address-und-0-value').val() == '') {
                error_status = true;
                jQuery('#user_address').html('Please enter your address.');
                jQuery('#edit-field-address-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_address').html('');
            }
            ///////////////////////////////////////////////////////////
            if(jQuery('#edit-field-city-und-0-value').val() == '') {
                error_status = true;
                jQuery('#user_city').html('Please enter your city.');
                jQuery('#edit-field-city-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_city').html('');
            }
            if(jQuery('#edit-field-state-und').val() == '_none') {
                error_status = true;
                jQuery('#user_state').html('Please enter your state.');
                jQuery('#edit-field-state-und').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_state').html('');
            }
            if(jQuery('#edit-field-zip-und-0-value').val() == '') {
                error_status = true;
                jQuery('#user_zip').html('Please enter your zip.');
                jQuery('#edit-field-zip-und-0-value').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_zip').html('');
            }
            ///////////////////////////////////////////////////////////
            
            //if(jQuery('#edit-captcha-response').val() == '') {
                //error_status = true;
                //jQuery('#user_captcha').html('Please enter the characters shown in the image.');
                 //jQuery('#edit-captcha-response').addClass('input_box watermark error_box');
                //return false;
            //} else {
                //jQuery('#user_captcha').html('');
            //}
            
            if(error_status) {
                return false;
            }
            
        });
        
        //  Date of birth calculation called
        jQuery('#edit-field-year-und').unbind('change');
        jQuery("#edit-field-year-und").bind("change",function(){
            //alert('Yes Callled');
            //  Age Validation Start                /////////////////////////////////////////////////////////////////////////
            if(jQuery('#edit-field-dobdate-und').val() == '_none' || jQuery('#edit-field-month-und').val() == '_none' || jQuery('#edit-field-year-und').val() == '_none') {
                error_status = true;
                jQuery('#user_dob').html('Please select your Date of birth.');
                jQuery('#edit-field-dobdate-und').addClass('input_box watermark error_box');
                //return false;
            } else {
                jQuery('#user_dob').html('');
                var date_user = jQuery('#edit-field-dobdate-und').val();
                var month_user = jQuery('#edit-field-month-und').val();
                var year_user = jQuery('#edit-field-year-und').val();
                //  alert(getAge('"'+month_user+'/'+date_user+'/'+year_user+'"'));

                var user_age = getAge(month_user+'/'+date_user+'/'+year_user);

                //  alert(getAge("09/23/1981"));
                if(user_age < 0) {
                    error_status = true;
                    jQuery('#user_dob').html('Your age ' + user_age + ' years, must be greater then 13 years.');
                    //return false;
                } else {
                    jQuery('#user_dob').html('Your age ' + user_age + ' years.');
                }
                //  Age Validation End          /////////////////////////////////////////////////////////////////////////
            }
            
        });
    });




    //  Function defined to calculate the age of the Client
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    //  alert(getAge("09/23/1981"));
</script>
