<?php
/**
 * @file
 * user_welcome.tpl.php
 */
global $base_url, $user;

//  Function call to send the user welcome email and make that this user is confirmed
_ndsbs_user_signup_confirmation($user->uid, $user);
?>
<div class="container">
  <h1 class="h_bt_bod upper_c">Welcome to New Directions</h1>
  <div class="wd_1 left">
    <div id="pa-post-header">
      <h1>What Type of Assessment Do You Need?</h1>
    </div>
    <div id="pa-assessments">
      <div id="pa-left">
        <h1>DUI Alcohol Assessment</h1>
        <span>For reporting to courts related to an alcohol related DUI</span>
        <h4>One-time Fee:</h4>
        <h2>$250.00</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/dui-alcohol">Learn more</a></span>
          <a href="https://www.ndsbs.com/user/cart/nid/259/tid/28" class="grey_btn">Purchase Now</a>
        </div>
      </div>
      <div id="pa-right">
        <h1>Alcohol Assessment</h1>
        <span>For courts, self-assessment, or non-DUI related</span>
        <h4>One-time Fee:</h4>
        <h2>$250.00</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/alcohol-assessment">Learn more</a></span>
          <a href="https://www.ndsbs.com/user/cart/nid/328/tid/30" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-left">
        <h1>General Drug &amp; Alcohol Assessment</h1>
        <span>For reporting to courts, physicians, and self-assessment</span>
        <h4>One-time Fee:</h4>
        <h2>$325.00</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/general-drug-alcohol">Learn more</a></span>
          <a href="https://www.ndsbs.com/user/cart/nid/272/tid/27" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-right">
        <h1>Anger Management Assessment</h1>
        <span>For reporting to courts and employers</span>
        <h4>One-time Fee:</h4>
        <h2>$250.00</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/Anger-Management-Evaluation">Learn more</a></span>
          <a href="https://www.ndsbs.com/user/cart/nid/502/tid/34" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-left">
        <h1>Employer Required  Drug &amp; Alcohol Assessment</h1>
        <span>For reporting to employers</span>
        <h4>One-time Fee:</h4>
        <h2>$350.00</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/employer-required-drug-alcohol">Learn more</a></span>
          <a href="https://www.ndsbs.com/user/cart/nid/273/tid/29" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-right">
        <h1>License Reinstatement Evaluation</h1>
        <span>For reporting to DMV, BMV &amp; Licensing Bureaus</span>
        <h4>One-time Fee:</h4>
        <h2>Varies Per State</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/license-reinstatement">Learn more</a></span>
        </div>
      </div>
      <div id="pa-left" class="pa-centered">
        <h1>Underage/Minor in Possession</h1>
        <span>For reporting to courts, schools, self-assessment</span>
        <h4>One-time Fee:</h4>
        <h2>$250.00</h2>
        <div class="opg">
          <span><a href="https://www.ndsbs.com/assessments/underage-minor-possession">Learn more</a></span>
          <a href="https://www.ndsbs.com/user/cart/nid/271/tid/1" class="grey_btn">Purchase Now</a> 
        </div>
      </div>
      <div id="pa-disclaimer">
        <p>You may contact us directly at 614-888-7274 (9-5 EST) or email us at <a href="mailto:info@ndsbs.com">info@ndsbs.com</a>.</p>
        <p>We look forward to serving you!</p>
        <p>Please review our <a href="<?php print $base_url; ?>/terms-of-service">Terms Of Services</a> and <a href="<?php print $base_url; ?>/hippa">Privacy Policy</a> here.</p>
      </div>
    </div>
  </div>
</div>
