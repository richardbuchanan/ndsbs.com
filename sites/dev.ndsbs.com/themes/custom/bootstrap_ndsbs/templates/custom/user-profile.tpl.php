<?php
/**
 * @file
 * user-profile.tpl.php
 */
global $base_path, $user;
$client_profile = user_load(arg(1));
$middle_name = isset($user_profile['field_middle_name'][0]) ? ' ' . $user_profile['field_middle_name'][0]['#markup'] . ' ' : ' ';
?>
<div id="user-profile" class="well">
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-3">
      <b>Name:</b>
    </div>
    <div class="col-xs-12 col-sm-9 col-md-9">
      <span class="user-profile-right"><?php echo $user_profile['field_first_name'][0]['#markup'] . $middle_name . $user_profile['field_last_name'][0]['#markup']; ?></span>
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-3">
      <b>Email:</b>
    </div>
    <div class="col-xs-12 col-sm-9 col-md-9">
      <span class="user-profile-right"><?php echo $client_profile->mail; ?></span>
    </div>
  </div>

  <?php if (isset($user_profile['field_gender'][0])): ?>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3">
        <b>Gender:</b>
      </div>
      <div class="col-xs-12 col-sm-9 col-md-9">
        <span class="user-profile-right"><?php echo $user_profile['field_gender'][0]['#markup']; ?></span>
      </div>
    </div>
  <?php endif; ?>

  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-3">
      <b>Date of Birth:</b>
    </div>
    <div class="col-xs-12 col-sm-9 col-md-9">
      <span class="user-profile-right"><?php echo $user_profile['field_month'][0]['#markup'] . ' ' . $user_profile['field_dobdate'][0]['#markup'] . ', ' . $user_profile['field_year'][0]['#markup']; ?></span>
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-3">
      <b>Phone:</b>
    </div>
    <div class="col-xs-12 col-sm-9 col-md-9">
      <span class="user-profile-right"><?php echo $user_profile['field_phone'][0]['#markup']; ?></span>
    </div>
  </div>

  <?php if (isset($user_profile['field_second_phone'][0])): ?>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-3">
        <b>Second phone:</b>
      </div>
      <div class="col-xs-12 col-sm-9 col-md-9">
        <span class="user-profile-right"><?php echo $user_profile['field_second_phone'][0]['#markup']; ?></span>
      </div>
    </div>
  <?php endif; ?>

  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-3">
      <b>Address:</b>
    </div>
    <div class="col-xs-12 col-sm-9 col-md-9">
      <span class="user-profile-right"><?php echo $user_profile['field_address'][0]['#markup']; ?></span><br />
      <span class="user-profile-right"><?php echo $user_profile['field_city'][0]['#markup']; ?>, <?php echo $user_profile['field_state'][0]['#markup']; ?> <?php echo $user_profile['field_zip'][0]['#markup']; ?></span>
    </div>
  </div>

  <?php print l(t('Edit Profile'), 'user/'.$user->uid.'/edit');  ?>
</div>
