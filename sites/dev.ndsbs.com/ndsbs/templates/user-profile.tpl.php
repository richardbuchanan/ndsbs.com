<?php
/**
 * @file
 * user-profile.tpl.php
 */
global $base_path;
global $user;
$client_profile = user_load(arg(1));
?>
<h1>My Profile</h1>
<div class="pro_wrap">
  <div class="gray_border_box">
    <div class="gray_white_bkg">
      <table class="schedule_table">
        <tr>
          <td><b>Name:</b></td>
          <td><?php echo $user_profile['field_first_name'][0]['#markup'] . ' ' . $user_profile['field_middle_name'][0]['#markup'] . ' ' . $user_profile['field_last_name'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>Email:</b></td>
          <td><?php echo $client_profile->mail; ?>
          </td>
        </tr>
        <tr>
          <td><b>Gender:</b></td>
          <td><?php echo $user_profile['field_gender'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>Date Of Birth:</b></td>
          <td><?php echo $user_profile['field_month'][0]['#markup'] . ' ' . $user_profile['field_dobdate'][0]['#markup'] . ', ' . $user_profile['field_year'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>Phone:</b></td>
          <td><?php echo $user_profile['field_phone'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>Second Phone:</b></td>
          <td><?php echo $user_profile['field_second_phone'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>Address:</b></td>
          <td><?php echo $user_profile['field_address'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>City:</b></td>
          <td><?php echo $user_profile['field_city'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>State:</b></td>
          <td><?php echo $user_profile['field_state'][0]['#markup']; ?></td>
        </tr>
        <tr>
          <td><b>Zip:</b></td>
          <td><?php echo $user_profile['field_zip'][0]['#markup']; ?></td>
        </tr>
      </table>
    </div>
  </div>
</div>
<?php print l(t('Edit Profile'), 'user/'.$user->uid.'/edit');  ?>