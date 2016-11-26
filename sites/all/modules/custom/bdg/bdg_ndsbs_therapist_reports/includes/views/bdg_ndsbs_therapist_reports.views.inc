<?php

/**
 * Implements hook_views_data().
 */
function bdg_ndsbs_therapist_reports_views_data() {
  $data = array();
  $data['users_transactions']['table']['group'] = t('Transactions');

  $data['users_transactions']['table']['base'] = array(
    'field' => 'nid',
    'title' => t('Transactions'),
    'weight' => 100,
    'defaults' => array(
      'field' => 'title',
    ),
  );

  $data['users_transactions']['table']['join'] = array(
    'node' => array(
      'left_field' => 'nid',
      'field' => 'nid',
    ),
    'users' => array(
      'left_field' => 'uid',
      'field' => 'uid',
    ),
  );

  $data['users_transactions']['table']['default_relationship'] = array(
    'node' => array(
      'table' => 'node',
      'field' => 'nid',
    ),
  );

  $data['users_transactions']['nid'] = array(
    'title' => t('Node ID'),
    'help' => t('Node ID of the assessment purchased.'),
    'relationship' => array(
      'title' => t('Assessment'),
      'help' => t('Relate assessment to the one purchased.'),
      'handler' => 'views_handler_relationship',
      'base' => 'node',
      'base field' => 'nid',
      'label' => t('assessment'),
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_numeric',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_node_nid',
    ),
    'field' => array(
      'handler' => 'views_handler_field_numeric',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['users_transactions']['uid'] = array(
    'title' => t('User ID'),
    'help' => t('The user ID who purchased the assessment.'),
    'relationship' => array(
      'title' => t('User'),
      'help' => t('Relate to user who purchased the assessment.'),
      'handler' => 'views_handler_relationship',
      'base' => 'users',
      'base field' => 'uid',
      'label' => t('user'),
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_numeric',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_user_uid',
      'name field' => 'name',
    ),
    'field' => array(
      'handler' => 'views_handler_field_numeric',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['users_transactions']['transaction_id'] = array(
    'title' => t('Transaction ID'),
    'help' => t('Transaction ID for the order.'),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['users_transactions']['order_id'] = array(
    'title' => t('Order ID'),
    'help' => t('Order ID for the order.'),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['users_transactions']['order_date'] = array(
    'title' => t('Order date'),
    'help' => t('The date the assessment was purchased.'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort_date',
    ),
    'filter' => array(
      'handler' => 'date_views_filter_handler',
    ),
  );

  $data['users_transactions']['cost'] = array(
    'title' => t('Transaction amount'),
    'help' => t('The total cost of the transaction.'),
    'field' => array(
      'handler' => 'views_handler_field_dollar',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_numeric',
    ),
  );

  $data['users_transactions']['rush_cost'] = array(
    'title' => t('Rush amount'),
    'help' => t('The rush amount of the transaction.'),
    'field' => array(
      'handler' => 'views_handler_field_dollar',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_numeric',
    ),
  );

  $data['users_transactions']['therapist'] = array(
    'title' => t('Therapist'),
    'help' => t('The therapist assigned to the user.'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
  );

  return $data;
}

/**
 * Implements hook_views_data_alter().
 */
function bdg_ndsbs_therapist_reports_views_data_alter(&$data) {
  // This example alters the title of the node:nid field in the Views UI.
  $data['users_transactions']['order_date']['filter'] = array(
    'handler' => 'date_views_filter_handler',
    'is date' => TRUE,
  );
}

function bdg_ndsbs_therapist_reports_users_by_role($rid) {
  $query = 'SELECT DISTINCT(ur.uid)
  FROM {users_roles} AS ur
  WHERE ur.rid IN (:rids)';
  $result = db_query($query, array(':rids' => array($rid)));

  $uids = $result->fetchCol();

  return user_load_multiple($uids);
}
