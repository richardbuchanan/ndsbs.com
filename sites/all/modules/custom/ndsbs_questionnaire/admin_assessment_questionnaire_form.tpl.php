<?php
/**
 * @file
 * assessment_questionnaire_form.tpl.php
 */
//  http://dev.newndsbs.com/admin/questionnaire/258/uid/118    Admin Panel Link for questionnaire
?>

<div class="wd_1">

  <?php
    $uid = arg(6);
    $user_info = user_load($uid);
    $dob = $user_info->field_month['und'][0]['value'] . '/' . $user_info->field_dobdate['und'][0]['value'] . '/' . $user_info->field_year['und'][0]['value'];
    $age = ' (' . get_age($dob, ' years old') . ')';
    $name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value'];
    $reason_for_assessment_field_info = field_info_field('field_reason_for_assessment');
    $reasons_for_assessment = $reason_for_assessment_field_info['settings']['allowed_values'];
    $reason_for_assessment = $reasons_for_assessment[$user_info->field_reason_for_assessment['und'][0]['value']];
    $for_courts = $user_info->field_reason_for_assessment['und'][0]['value'] == 0 || $user_info->field_reason_for_assessment['und'][0]['value'] == 1 || $user_info->field_reason_for_assessment['und'][0]['value'] == 2 ? $user_info->field_for_courts['und'][0]['value'] : 0;
    $for_probation_field_info = field_info_field('field_for_probation');
    $reasons_for_probation = $for_probation_field_info['settings']['allowed_values'];
    $for_probation = $user_info->field_reason_for_assessment['und'][0]['value'] == 7 || $user_info->field_reason_for_assessment['und'][0]['value'] == 3 ? $reasons_for_probation[$user_info->field_for_probation['und'][0]['value']] : 0;
  ?>

  <table class="table table-striped">
    <thead>
      <tr>
        <td><b>Name:</b> <?php print l(t($name), 'user/' . $user_info->uid . '/edit'); ?></td>
        <td><b>Service:</b> <?php print arg(8); ?></td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <b>Date of Birth:</b> <?php print t($dob) . t($age); ?>
        </td>
        <td>
          <?php print $reason_for_assessment; ?>
          <?php if ($for_courts): ?>
            <br>
            <?php print $for_courts; ?>
          <?php endif; ?>
          <?php if ($for_probation): ?>
            <br>
            <?php print $for_probation; ?>
          <?php endif; ?>
        </td>
      </tr>

      <tr>
        <td>
          <b>Email:</b> <?php print $user_info->mail; ?>
          <br>
          <b>Phone:</b> <?php print $user_info->field_phone['und'][0]['value']; ?>
        </td>
        <td>
          <?php print $user_info->field_address['und'][0]['value']; ?>
          <br>
          <?php print $user_info->field_city['und'][0]['value']; ?>, <?php print $user_info->field_state['und'][0]['value']; ?> <?php print $user_info->field_zip['und'][0]['value']; ?>
        </td>
      </tr>

    </tbody>
  </table>

  <div class="form-item_custum" style="width:100%;">
    <dl>
      <?php
      $data = admin_assessment_questionnaire_ques_ans_list();

      foreach ($data as $qdata) {
        print '<dt>' . $qdata['question'] . '</dt>';

        print '<dd>';

        foreach ($qdata['answer'] as $qans) {
          if ($qans <> '') {
            print '&nbsp&nbsp&nbsp&nbsp' . $qans . '<br>';
          }
        }

        print '</dd><br>';
      }
      ?>
    </dl>
  </div>
</div>
