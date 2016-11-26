<?php

/**
 * Implements hook_views_data().
 */
function bdg_ndsbs_views_views_data() {
  $data = array();
  $data['users_transactions']['table']['group'] = t('User Transactions');

  $data['users_transactions']['table']['base'] = array(
    'title' => t('User Transactions'),
    'help' => t('Contains user transaction data.'),
  );

  return $data;
}