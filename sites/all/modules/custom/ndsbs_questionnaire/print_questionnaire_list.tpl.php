<?php
/**
 * @file
 * assessment_questionnaire_form.tpl.php
 */
?>
<?php
$host = $_SERVER['HTTP_HOST'];
$uid = arg(6);
$user_info = user_load($uid);
$dob = $user_info->field_month['und'][0]['value'] . '/' . $user_info->field_dobdate['und'][0]['value'] . '/' . $user_info->field_year['und'][0]['value'];
$age = ' (' . get_age($dob) . ' years old)';
$name = $user_info->field_first_name['und'][0]['value'] . ' ' . $user_info->field_last_name['und'][0]['value'];
?>

<!DOCTYPE html>
<html>
<head>
  <title>Print questionnaire</title>
  <link href="/<?php print drupal_get_path('module', 'ndsbs_questionnaire') . '/ndsbs-questionnaire.print.css'; ?>" rel="stylesheet" />
</head>
<body>
<input type="button" value="Print this page" onClick="window.print()">
<?php $data = admin_assessment_questionnaire_ques_ans_list(); ?>
<h3><?php print t($name); ?></h3>
<div class="user-info"><?php print t($dob) . t($age); ?>
  <div><?php print $user_info->field_phone['und'][0]['value']; ?></div>
  <div><?php print $user_info->mail; ?></div>
  <div><?php print bdg_ndsbs_therapist_reports_service_title($user_info->uid); ?></div>
</div>
<dl>
  <?php foreach ($data as $qdata): ?>
    <dt><?php print $qdata['question']; ?></dt>
    <?php foreach ($qdata['answer'] as $qans): ?>
      <?php if ($qans <> ''): ?>
        <dd><?php print $qans; ?></dd>
      <?php endif; ?>
    <?php endforeach; ?>
  <?php endforeach; ?>
</dl>
<input type="button" value="Print this page" onClick="window.print()">
</body>
</html>
