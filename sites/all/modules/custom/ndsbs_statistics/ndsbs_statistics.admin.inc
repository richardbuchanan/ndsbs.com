<?php

/**
 * @file
 * Statistics administration and module settings UI.
 */

/**
 * List statistics administration filters that can be applied.
 *
 * @return
 *   An associative array of filters.
 */
function ndsbs_statistics_filters() {
  $filters['therapist'] = array(
    'title' => t('Therapist'),
    'options' => ndsbs_statistics_get_therapists(),
  );

  return $filters;
}

/**
 * List advanced statistics administration filters that can be applied.
 *
 * @return
 *   An associative array of filters.
 */
function ndsbs_statistics_advanced_filters() {
  $filters['therapist'] = array(
    'title' => t('Therapist'),
    'options' => ndsbs_statistics_get_therapists(),
  );

  return $filters;
}

/**
 * Returns the statistics administration filters form array to ndsbs_statistics_admin_content().
 *
 * @see ndsbs_statistics_admin_statistics()
 * @see ndsbs_statistics_admin_statistics_submit()
 * @see ndsbs_statistics_filter_form_submit()
 *
 * @ingroup forms
 */
function ndsbs_statistics_filter_form() {
  $date = new DateTime();
  $first_of_this_month  = mktime(0, 0, 0, $date->format('m'), 1, $date->format('Y'));
  $session = isset($_SESSION['ndsbs_statistics_overview_filter']) ? $_SESSION['ndsbs_statistics_overview_filter'] : array();
  $filters = ndsbs_statistics_filters();

  $form['filters'] = array(
    '#type' => 'fieldset',
    '#title' => t('Show only statistics where'),
    '#theme' => 'exposed_filters',
  );
  $form['filters']['left'] = array(
    '#type' => 'container',
  );

  foreach ($filters as $key => $filter) {
    $form['filters']['left'][$key] = array(
      '#type' => 'select',
      '#options' => $filter['options'],
      '#title' => $filter['title'],
      '#default_value' => isset($session[$key]) ? $session[$key] : '[all]',
    );
  }
  $form['filters']['left']['date'] = array(
    '#type' => 'select',
    '#title' => t('Date'),
    '#default_value' => isset($session['date']) ? $session['date'] : 'range',
    '#options' => array(
      'month' => t('Month and year'),
      'range' => t('Date range'),
    ),
    '#description' => t('Display transactions for an indiviual month/year or a date range.'),
  );

  $form['filters']['right'] = array(
    '#type' => 'container',
  );
  $form['filters']['right']['date_select'] = array(
    '#type' => 'date_select',
    '#title' => t('Month and year'),
    '#default_value' => isset($session['date']) ? $session['date_select'] : date('Y-m-d H:i:s', $first_of_this_month),
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M Y',
    '#date_label_position' => 'within',
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'month'),
      ),
    ),
  );
  $form['filters']['right']['date_beginning'] = array(
    '#type' => 'date_popup',
    '#title' => t('From'),
    '#default_value' => isset($session['date_beginning']) ? $session['date_beginning'] : date('Y-m-d H:i:s', $first_of_this_month),
    '#date_type' => DATE_DATETIME,
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M j, Y',
    '#date_increment' => 1,
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'range'),
      ),
    ),
  );
  $form['filters']['right']['date_ending'] = array(
    '#type' => 'date_popup',
    '#title' => t('To'),
    '#default_value' => isset($session['date_ending']) ? $session['date_ending'] : date('Y-m-d H:i:s'),
    '#date_type' => DATE_DATETIME,
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M j, Y',
    '#date_increment' => 1,
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'range'),
      ),
    ),
  );

  $form['filters']['actions'] = array(
    '#type' => 'actions',
    '#attributes' => array('class' => array('container-inline')),
  );
  $form['filters']['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => count($session) ? t('Refine') : t('Filter'),
  );
  if (count($session)) {
    $form['filters']['actions']['reset'] = array('#type' => 'submit', '#value' => t('Reset'));
  }

  drupal_add_js('misc/form.js');

  return $form;
}

/**
 * Returns the statistics advanced filters form array to ndsbs_statistics_advanced_content().
 *
 * @see ndsbs_statistics_advanced_statistics()
 * @see ndsbs_statistics_advanced_statistics_submit()
 * @see ndsbs_statistics_advanced_filter_form_submit()
 *
 * @ingroup forms
 */
function ndsbs_statistics_advanced_filter_form() {
  // $date = new DateTime();
  // $first_of_this_month  = mktime(0, 0, 0, $date->format('m'), 1, $date->format('Y'));
  $session = isset($_SESSION['ndsbs_statistics_advanced_filter']) ? $_SESSION['ndsbs_statistics_advanced_filter'] : array();
  $filters = ndsbs_statistics_advanced_filters();

  $form['filters'] = array(
    '#type' => 'fieldset',
    '#title' => t('Show only statistics where'),
    '#theme' => 'exposed_filters',
  );
  $form['filters']['left'] = array(
    '#type' => 'container',
  );

  foreach ($filters as $key => $filter) {
    $form['filters']['left'][$key] = array(
      '#type' => 'select',
      '#options' => $filter['options'],
      '#title' => $filter['title'],
      '#default_value' => isset($session[$key]) ? $session[$key] : '[all]',
    );
  }
  $form['filters']['left']['date'] = array(
    '#type' => 'select',
    '#title' => t('Date'),
    '#default_value' => isset($session['date']) ? $session['date'] : 'range',
    '#options' => array(
      'compare_dates' => t('Compare dates'),
      'compare_months' => t('Compare months'),
      'compare_years' => t('Compare years'),
    ),
  );

  $form['filters']['right'] = array(
    '#type' => 'container',
  );
  $form['filters']['right']['compare_date_one'] = array(
    '#type' => 'date_popup',
    '#title' => t('First date'),
    '#default_value' => isset($session['compare_date_one']) ? $session['compare_date_one'] : date('Y-m-d H:i:s'),
    '#date_type' => DATE_DATETIME,
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M j, Y',
    '#date_increment' => 1,
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'compare_dates'),
      ),
    ),
  );
  $form['filters']['right']['compare_date_two'] = array(
    '#type' => 'date_popup',
    '#title' => t('Second date'),
    '#default_value' => isset($session['compare_date_two']) ? $session['compare_date_two'] : date('Y-m-d H:i:s'),
    '#date_type' => DATE_DATETIME,
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M j, Y',
    '#date_increment' => 1,
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'compare_dates'),
      ),
    ),
  );
  $form['filters']['right']['compare_month_one'] = array(
    '#type' => 'date_select',
    '#title' => t('First month/year'),
    '#default_value' => isset($session['compare_month_one']) ? $session['compare_month_one'] : date('Y-m-d H:i:s'),
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M Y',
    '#date_label_position' => 'within',
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'compare_months'),
      ),
    ),
  );
  $form['filters']['right']['compare_month_two'] = array(
    '#type' => 'date_select',
    '#title' => t('Second month/year'),
    '#default_value' => isset($session['compare_month_two']) ? $session['compare_month_two'] : date('Y-m-d H:i:s'),
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'M Y',
    '#date_label_position' => 'within',
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'compare_months'),
      ),
    ),
  );
  $form['filters']['right']['compare_year_one'] = array(
    '#type' => 'date_select',
    '#title' => t('First year'),
    '#default_value' => isset($session['compare_year_one']) ? $session['compare_year_one'] : date('Y-m-d H:i:s'),
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'Y',
    '#date_label_position' => 'within',
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'compare_years'),
      ),
    ),
  );
  $form['filters']['right']['compare_year_two'] = array(
    '#type' => 'date_select',
    '#title' => t('Second year'),
    '#default_value' => isset($session['compare_year_two']) ? $session['compare_year_two'] : date('Y-m-d H:i:s'),
    '#date_timezone' => date_default_timezone(),
    '#date_format' => 'Y',
    '#date_label_position' => 'within',
    '#date_year_range' => '-4:now',
    '#states' => array(
      'visible' => array(
        ':input[name="date"]' => array('value' => 'compare_years'),
      ),
    ),
  );

  $form['filters']['actions'] = array(
    '#type' => 'actions',
    '#attributes' => array('class' => array('container-inline')),
  );
  $form['filters']['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => count($session) ? t('Refine') : t('Filter'),
  );
  if (count($session)) {
    $form['filters']['actions']['reset'] = array('#type' => 'submit', '#value' => t('Reset'));
  }

  drupal_add_js('misc/form.js');

  return $form;
}

/**
 * Form submission handler for ndsbs_statistics_filter_form().
 *
 * @see ndsbs_statistics_admin_content()
 * @see ndsbs_statistics_admin_statistics()
 * @see ndsbs_statistics_admin_statistics_submit()
 * @see ndsbs_statistics_filter_form()
 */
function ndsbs_statistics_filter_form_submit($form, &$form_state) {
  $filters = ndsbs_statistics_filters();
  switch ($form_state['values']['op']) {
    case t('Filter'):
    case t('Refine'):
      // Apply every filter that has a choice selected other than 'any'.
      foreach ($filters as $filter => $options) {
        if (isset($form_state['values'][$filter])) {
          $_SESSION['ndsbs_statistics_overview_filter'][$filter] = $form_state['values'][$filter];
        }
      }
      $_SESSION['ndsbs_statistics_overview_filter']['date'] = $form_state['values']['date'];
      $_SESSION['ndsbs_statistics_overview_filter']['date_select'] = $form_state['values']['date_select'];
      $_SESSION['ndsbs_statistics_overview_filter']['date_beginning'] = $form_state['values']['date_beginning'] . ' 00:00:00';
      $_SESSION['ndsbs_statistics_overview_filter']['date_ending'] = $form_state['values']['date_ending'] . ' 12:59:59';
      break;
    case t('Reset'):
      $_SESSION['ndsbs_statistics_overview_filter'] = array();
      break;
  }
}

/**
 * Form submission handler for ndsbs_statistics_filter_form().
 *
 * @see ndsbs_statistics_advanced_content()
 * @see ndsbs_statistics_advanced_statistics()
 * @see ndsbs_statistics_advanced_statistics_submit()
 * @see ndsbs_statistics_advanced_filter_form()
 * @see ndsbs_statistics_advanced_filter_form_submit()
 */
function ndsbs_statistics_advanced_filter_form_validate($form, &$form_state) {
  $compare_date_one = $form_state['values']['compare_date_one'];
  $compare_date_two = $form_state['values']['compare_date_two'];
  $compare_month_one = $form_state['values']['compare_month_one'];
  $compare_month_two = $form_state['values']['compare_month_two'];
  $compare_year_one = $form_state['values']['compare_year_one'];
  $compare_year_two = $form_state['values']['compare_year_two'];

  $t_args = array(
    '@compare_date' => 'The first and second dates must not be the same.',
    '@compare_month' => 'The first and second months/years must not be the same.',
    '@compare_year' => 'The first and second years must not be the same.',
  );

  switch ($form_state['values']['date']) {
    case 'compare_dates':
      if ($compare_date_one == $compare_date_two) {
        form_set_error('right', t('@compare_date', $t_args));
      }
      break;

    case 'compare_months':
      if ($compare_month_one == $compare_month_two) {
        form_set_error('right', t('@compare_month', $t_args));
      }
      break;

    case 'compare_years':
      if ($compare_year_one == $compare_year_two) {
        form_set_error('right', t('@compare_year', $t_args));
      }
      break;
  }
}

/**
 * Form submission handler for ndsbs_statistics_filter_form().
 *
 * @see ndsbs_statistics_advanced_content()
 * @see ndsbs_statistics_advanced_statistics()
 * @see ndsbs_statistics_advanced_statistics_submit()
 * @see ndsbs_statistics_advanced_filter_form()
 * @see ndsbs_statistics_advanced_filter_form_validate()
 */
function ndsbs_statistics_advanced_filter_form_submit($form, &$form_state) {
  $filters = ndsbs_statistics_advanced_filters();
  switch ($form_state['values']['op']) {
    case t('Filter'):
    case t('Refine'):
      // Apply every filter that has a choice selected other than 'any'.
      foreach ($filters as $filter => $options) {
        if (isset($form_state['values'][$filter])) {
          $_SESSION['ndsbs_statistics_advanced_filter'][$filter] = $form_state['values'][$filter];
        }
      }
      $_SESSION['ndsbs_statistics_advanced_filter']['date'] = $form_state['values']['date'];
      $_SESSION['ndsbs_statistics_advanced_filter']['compare_date_one'] = $form_state['values']['compare_date_one'];
      $_SESSION['ndsbs_statistics_advanced_filter']['compare_date_two'] = $form_state['values']['compare_date_two'];
      $_SESSION['ndsbs_statistics_advanced_filter']['compare_month_one'] = $form_state['values']['compare_month_one'];
      $_SESSION['ndsbs_statistics_advanced_filter']['compare_month_two'] = $form_state['values']['compare_month_two'];
      $_SESSION['ndsbs_statistics_advanced_filter']['compare_year_one'] = $form_state['values']['compare_year_one'];
      $_SESSION['ndsbs_statistics_advanced_filter']['compare_year_two'] = $form_state['values']['compare_year_two'];
      break;
    case t('Reset'):
      $_SESSION['ndsbs_statistics_advanced_filter'] = array();
      break;
  }
}

/**
 * Page callback: Form constructor for the statistics administration form.
 *
 * @see ndsbs_statistics_admin_statistics()
 * @see ndsbs_statistics_admin_statistics_submit()
 * @see ndsbs_statistics_filter_form()
 * @see ndsbs_statistics_filter_form_submit()
 * @see ndsbs_statistics_menu()
 *
 * @ingroup forms
 */
function ndsbs_statistics_admin_content($form, $form_state) {
  $form['filter'] = ndsbs_statistics_filter_form();
  $form['#submit'][] = 'ndsbs_statistics_filter_form_submit';
  $form['admin'] = ndsbs_statistics_admin_statistics();

  return $form;
}

/**
 * Page callback: Form constructor for the advanced statistics form.
 *
 * @see ndsbs_statistics_advanced_filter_form()
 * @see ndsbs_statistics_advanced_filter_form_submit()
 * @see ndsbs_statistics_menu()
 *
 * @ingroup forms
 */
function ndsbs_statistics_advanced_content($form, $form_state) {
  $form['filter'] = ndsbs_statistics_advanced_filter_form();
  $form['#submit'][] = 'ndsbs_statistics_advanced_filter_form_submit';
  $form['#validate'][] = 'ndsbs_statistics_advanced_filter_form_validate';
  $form['admin'] = ndsbs_statistics_advanced_statistics();

  return $form;
}

/**
 * Form builder: Builds the statistics administration overview.
 *
 * @see ndsbs_statistics_admin_statistics_submit()
 * @see ndsbs_statistics_filter_form()
 * @see ndsbs_statistics_filter_form_submit()
 *
 * @ingroup forms
 */
function ndsbs_statistics_admin_statistics() {
  $session = $_SESSION['ndsbs_statistics_overview_filter'];
  if (!$session) {
    $date = new DateTime();
    $first_of_this_month  = mktime(0, 0, 0, $date->format('m'), 1, $date->format('Y'));
    $session = array(
      'therapist' => '[all]',
      'date' => 'range',
      'date_beginning' => date('Y-m-d H:i:s', $first_of_this_month),
      'date_ending' => date('Y-m-d H:i:s'),
    );
  }

  // Build the table headers.
  $transactions_header = array(
    'client' => t('Client details'),
    'transaction' => t('Transaction details'),
    'date' => t('Order date'),
    'amount' => t('Transaction amount'),
  );
  $assessments_header = array(
    'therapist' => t('Therapist'),
    'transactions' => t('Transactions'),
    'assessments' => t('No. of assessnents'),
  );
  $registration_header = array(
    'day' => t('Day'),
    'registrations' => t('No. of registrations'),
  );

  $transactions_query = db_select('users_transactions', 'ut');
  $transactions_query->addTag('ndsbs_statistics_admin_filter');
  $transactions_query
    ->condition('ut.payment_status', 1);

  if ($session['date'] == 'range') {
    $transactions_query
      ->condition('ut.order_date', strtotime($session['date_beginning']), '>=')
      ->condition('ut.order_date', strtotime($session['date_ending']), '<=');
  }
  else {
    $date_select = explode('-', $session['date_select']);
    $first = mktime(0, 0, 0, $date_select[1], 1, $date_select[0]);
    $last = mktime(23, 59, 59, $date_select[1] + 1, 0, $date_select[0]);

    $transactions_query
      ->condition('ut.order_date', $first, '>=')
      ->condition('ut.order_date', $last, '<=');
  }

  if ($session['therapist'] != '[all]') {
    $transactions_query->condition('ut.therapist', $session['therapist']);
  }

  $oids = $transactions_query
    ->fields('ut',array('order_id'))
    ->condition('cost', '0.00', '!=')
    ->execute()
    ->fetchCol();
  $transactions = transactions_load_multiple($oids);

  // Prepare the list of transactions.
  $transactions_options = array();
  $transaction_totals = array(
    'assessments' => 0,
    'rush' => 0,
    'refunds' => 0,
    'total' => 0,
  );
  foreach ($transactions as $transaction) {
    $refunded = transaction_refunded($transaction);
    $client_details = transaction_get_client_details($transaction->uid, $transaction->therapist);
    $transaction_details = transaction_get_details($transaction);
    $amount_details = transaction_get_amounts($transaction, $refunded, TRUE);
    $transaction_amounts = transaction_get_amounts($transaction, $refunded);

    $transactions_options[$transaction->order_id] = array(
      'client' => implode('<br>', $client_details),
      'transaction' => implode('<br>', $transaction_details),
      'date' => format_date($transaction->order_date, $type = 'blog_date', $format = ''),
      'amount' => implode('<br>', $amount_details),
    );

    $transaction_totals['assessments'] = $transaction_totals['assessments'] + $transaction_amounts['cost'];
    $transaction_totals['rush'] = $transaction_totals['rush'] + $transaction_amounts['rush_cost'];
    $transaction_totals['refunds'] = $transaction_totals['refunds'] + $transaction_amounts['refund'];
    $transaction_totals['total'] = $transaction_totals['total'] + $transaction_amounts['total'];
  }

  $formatted_transaction_totals = transactions_get_formatted_totals($transaction_totals);

  $transactions_options[] = array(
    '',
    '',
    '',
    $formatted_transaction_totals,
  );

  // Prepare the list of assessments.
  $assessments_options = array();
  $therapist_totals = ndsbs_statistics_get_therapist_totals($transactions);
  $assessment_totals = array(
    'assessment_totals' => t('<strong>Total</strong>'),
    'transactions' => 0,
    'assessments' => 0,
  );
  foreach ($therapist_totals as $uid => $therapist) {
    $assessment_count = count($therapist['assessments']);

    if ($assessment_count) {
      if (!$uid) {
        $assessments_options[$uid] = [
          'therapist' => t('Unassigned'),
          'transactions' => transaction_money_format($therapist['total']),
          'assessments' => $assessment_count,
        ];
      }
      elseif ($uid) {
        $assessments_options[$uid] = [
          'therapist' => t('@therapist', ['@therapist' => $therapist['therapist']]),
          'transactions' => transaction_money_format($therapist['total']),
          'assessments' => $assessment_count,
        ];
      }

      $assessment_totals['transactions'] = $assessment_totals['transactions'] + $therapist['total'];
      $assessment_totals['assessments'] = $assessment_totals['assessments'] + $assessment_count;
    }
  }
  $assessments_options[] = array(
    $assessment_totals['assessment_totals'],
    transaction_money_format($assessment_totals['transactions']),
    $assessment_totals['assessments'],
  );

  // Prepare the list of registrations.
  $registration_options = array();
  $registration_totals = ndsbs_statistics_get_registration_totals($session);

  foreach ($registration_totals as $day => $registration_total) {
    $day = ucfirst($day);

    $registration_options[] = array(
      ucfirst($day),
      $registration_total,
    );
  }

  $form['statistics'] = array(
    '#type' => 'container',
    '#attributes' => array(
      'class' => array('row'),
    ),
  );
  $form['statistics']['transactions'] = array(
    '#theme' => 'table',
    '#header' => $transactions_header,
    '#rows' => $transactions_options,
    '#caption' => t('<h3>Transactions</h3>'),
    '#empty' => t('No transactions available.'),
    '#attributes' => array('id' => 'ndsbs-statistics-transactions'),
    '#prefix' => '<div class="col-xs-12 col-md-9">',
    '#suffix' => '</div>',
  );
  $form['statistics']['assessments'] = array(
    '#theme' => 'table',
    '#header' => $assessments_header,
    '#rows' => $assessments_options,
    '#caption' => t('<h3>Assessments</h3>'),
    '#empty' => t('No assessments available.'),
    '#attributes' => array('id' => 'ndsbs-statistics-assessments'),
    '#prefix' => '<div class="col-xs-12 col-md-3">',
    '#suffix' => '</div>',
  );
  $form['statistics']['registrations'] = array(
    '#theme' => 'table',
    '#header' => $registration_header,
    '#rows' => $registration_options,
    '#caption' => t('<h3>Registrations</h3>'),
    '#empty' => t('No registration data available.'),
    '#attributes' => array('id' => 'ndsbs-statistics-registrations'),
    '#prefix' => '<div class="col-xs-12 col-md-3">',
    '#suffix' => '</div>',
  );

  return $form;
}

/**
 * Form builder: Builds the statistics administration overview.
 *
 * @see ndsbs_statistics_advanced_statistics_submit()
 * @see ndsbs_statistics_filter_form()
 * @see ndsbs_statistics_filter_form_submit()
 *
 * @ingroup forms
 */
function ndsbs_statistics_advanced_statistics() {
  drupal_set_title(t('Advanced statistics'));
  $session = $_SESSION['ndsbs_statistics_advanced_filter'];
  if (!$session) {
    $date = new DateTime();
    $first_of_this_month  = mktime(0, 0, 0, $date->format('m'), 1, $date->format('Y'));
    $session = array(
      'therapist' => '[all]',
      'date' => 'range',
      'date_beginning' => date('Y-m-d H:i:s', $first_of_this_month),
      'date_ending' => date('Y-m-d H:i:s'),
    );
  }

  $transactions_query = db_select('users_transactions', 'ut');
  $transactions_query->addTag('ndsbs_statistics_advanced_filter');
  $transactions_query
    ->condition('ut.payment_status', 1);

  if ($session['date'] == 'range') {
    $transactions_query
      ->condition('ut.order_date', strtotime($session['date_beginning']), '>=')
      ->condition('ut.order_date', strtotime($session['date_ending']), '<=');
  }
  else {
    $date_select = explode('-', $session['date_select']);
    $first = mktime(0, 0, 0, $date_select[1], 1, $date_select[0]);
    $last = mktime(23, 59, 59, $date_select[1] + 1, 0, $date_select[0]);

    $transactions_query
      ->condition('ut.order_date', $first, '>=')
      ->condition('ut.order_date', $last, '<=');
  }

  if ($session['therapist'] != '[all]') {
    $transactions_query->condition('ut.therapist', $session['therapist']);
  }

  /*$oids = $transactions_query
    ->fields('ut',array('order_id'))
    ->condition('cost', '0.00', '!=')
    ->execute()
    ->fetchCol();*/
  //$transactions = transactions_load_multiple($oids);

  //foreach ($transactions as $transaction) {
  //}

  $form = array();

  return $form;
}

/**
 * Process ndsbs_statistics_admin_statistics form submissions.
 *
 * Executes the chosen 'Update option' on the selected nodes.
 *
 * @see ndsbs_statistics_admin_statistics()
 * @see ndsbs_statistics_filter_form()
 * @see ndsbs_statistics_filter_form_submit()
 */
function ndsbs_statistics_admin_statistics_submit($form, &$form_state) {
  $operations = module_invoke_all('node_operations');
  $operation = $operations[$form_state['values']['operation']];
  // Filter out unchecked nodes
  $nodes = array_filter($form_state['values']['nodes']);
  if ($function = $operation['callback']) {
    // Add in callback arguments if present.
    if (isset($operation['callback arguments'])) {
      $args = array_merge(array($nodes), $operation['callback arguments']);
    }
    else {
      $args = array($nodes);
    }
    call_user_func_array($function, $args);

    cache_clear_all();
  }
  else {
    // We need to rebuild the form to go to a second step. For example, to
    // show the confirmation form for the deletion of nodes.
    $form_state['rebuild'] = TRUE;
  }
}
