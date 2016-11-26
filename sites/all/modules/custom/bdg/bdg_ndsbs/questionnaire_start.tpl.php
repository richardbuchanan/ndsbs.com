<?php
$status = bdg_ndsbs_get_steps_page_no_base_url();
$options = array('view/assessment/status', 'non-client', 'anonymous-user');
drupal_set_message($status);
if (in_array($status, $options)) {
    drupal_goto('view/assessment/status');
}
else {
    drupal_goto($status);
}