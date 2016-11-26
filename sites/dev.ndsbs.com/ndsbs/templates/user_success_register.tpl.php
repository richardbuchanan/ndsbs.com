<?php
/**
 * @file
 * user_welcome.tpl.php
 */
?>
<div class="container">
    <h1 class="h_bt_bod upper_c">Registration Successful</h1>
    <div class="wd_1 left">
        <div class="form-item_custum">
            Account has been created successfully and a confirmation email has been sent to the specified email address. To use services as a registered user please confirm by opening the sent email and clicking on the confirmation link.
        </div><br /><br />
        <div class="cust_pass">
            In case if you haven't received the activation link then please enter your registered email address and click on E-mail new password button.
            <br />
            <br />
            <?php
                //print "In case if you haven't received the activation link then please click here <b>" . l(t('Resend Account Activation Link'), 'user/resend/confirmationmail') . '</b>';
                module_load_include('inc', 'user', 'user.pages');
                print drupal_render(drupal_get_form('user_pass'));
            ?>
        </div>
    </div>
</div>