<?php
/**
 * @file
 * error_malicious_data.tpl.php
 */
?>
<div class="container">
    <?php
        if(arg(3) != 1) {
    ?>
    <h1 class="h_bt_bod upper_c">Your Account Is Not Yet Active</h1>
    <div class="wd_1 left">
        <p>
            <!--We have sent you an email ID confirmation link to activate your account and use NDSBS services. Please click on the link to activate your account.-->
            We have sent you an Account activation link on your email address in order to verify your email account. Please click on account 
            activation link to use NDSBS services.
            <br />
            <br />
        </p>
        <?php
            print "In case if you haven't received the activation link then please click here <b>" . l(t('Resend Account Activation Link'), 'user/resend/confirmationmail') . '</b>';
        ?>
    </div>
    <?php
        } else {
            print '<h1 class="h_bt_bod upper_c">Please try to login.</h1>';
        }
    ?>
</div>