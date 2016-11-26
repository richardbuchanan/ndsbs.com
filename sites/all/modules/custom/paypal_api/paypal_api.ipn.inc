<?php
// $Id$

/**
 *
 * Handle the PayPal IPN signal for create and type view operations.
 *
 * @see paypal_api_handle_ipn()
 *
 * @param $uid
 * @param $bundle
 * @param $op
 * @param $nid
 */
function paypal_api_ipn($uid, $op, $bundle, $nid) {
  $payment_status = '1';
  $custom_data = $_POST['custom'];
  $main_report_id = 0;

  if($custom_data <> '') {
    $custom_data = explode('-||-', $custom_data);
    $shipping_info = $custom_data[0];
    $tmp_tid_cost = unserialize($custom_data[1]);
    if($custom_data[2] <> '') {
      $main_report_id = $custom_data[2];
    }
    if($custom_data[3] > 0) {
        $express_mail = $custom_data[3];
    } else {
        $express_mail = 0;
    }
  }
  $payment_method = 'paypal';
  
  //  Custom Watchdog created
  watchdog('paypal_api', 'Function paypal_api_ipn --- IPN hit called');
  
  if (!paypal_api_ipn_validate()) {
    //  Custom Watchdog created
    watchdog('paypal_api', 'Function paypal_api_ipn --- IPN Invalid');
    return "";
  }

  if ($_POST['payment_status'] != 'Completed') {
    //  Custom Watchdog created
    watchdog('paypal_api', 'Function paypal_api_ipn --- Payment Status : ' . $_POST['payment_status']);
    
    $payment_status = '0';
    //  Finoit NDSBS custom function added to capture the transaction data START
    //  //  Save Records into database when paypal response is success
    $inserted_oid = save_transaction_data($nid, 0, $uid, $_POST['mc_gross'], $_POST['txn_id'], serialize($_POST), $payment_status, $shipping_info, $payment_method, $express_mail);
    save_transaction_terms($inserted_oid, $main_report_id, $tmp_tid_cost, $uid, $payment_status);

    ////////////////////////////
    //  Finoit NDSBS custom function added to capture the transaction data END
    
    module_invoke_all('paypal_payment', $_POST['payment_status'], $uid, $op, $bundle, $nid);
    return "";
  }

  $config = paypal_api_bundle_config($bundle);
  if (!$config) {
    //  Custom Watchdog created
    watchdog('paypal_api', 'Function paypal_api_ipn --- Bundel Error');

    $message =  t("Invalid PayPal transaction detected.  Expecting to find a configuration for the given bundle !bundle");
    watchdog('paypal_api', $message, array('bundle' => $bundle));
    return "";
  }

  // basic checks to make sure this looks like a valid transaction
  if ($config['instance'] || $config['deferred_create']) {
    // instance purchase, so nid should match the item_number in the post
    if (!is_numeric($nid)) {
      $message =  t("Invalid PayPal transaction detected.  Expecting a valid node id for an instance purchase.");
      watchdog('paypal_api', $message);
      return "";
    }

    if ($_POST['item_number'] != $nid) {
      $message =  t("Invalid PayPal transaction detected.  Expecting item_number to be the same as the entity id passed in the URL");
      watchdog('paypal_api', $message);
      return "";
    }
  }
  else {
    //  Custom Watchdog created
    watchdog('paypal_api', 'Function paypal_api_ipn --- Item Number not equal to bundle');
    
    if ($_POST['item_number'] != $bundle) {
      $message =  t("Invalid PayPal transaction detected.  Expecting item_number to be the same as the bundle passed in the URL");
      watchdog('paypal_api', $message);
      return "";
    }
  }

  $account = paypal_api_account_from_ipn($uid);
  if (!$account) {
    watchdog('paypal_api', t("Invalid PayPal transaction detected.  Expecting to find a user record for the uid passed in the URL"));
    return "";
  }

  $quantity = $config['quantity'];
  if (is_numeric($nid) && $op == 'instance') {
    $settings = paypal_api_instance_config($nid);
    $quantity = $settings['quantity'];
  }
  
  //  Finoit NDSBS custom function added to capture the transaction data START
  //  //  Save Records into database when paypal response is success
  $inserted_oid = save_transaction_data($nid, 0, $account->uid, $_POST['mc_gross'], $_POST['txn_id'], serialize($_POST), $payment_status, $shipping_info, $payment_method, $express_mail);
  save_transaction_terms($inserted_oid, $main_report_id, $tmp_tid_cost, $account->uid, $payment_status);
  ////////////////////////////
  //  Finoit NDSBS custom function added to capture the transaction data END
  
  // archive this transaction (for reference purposes only)
  paypal_api_save_transaction($account->uid, $op, $bundle, $nid, $_POST);
  //  Custom Watchdog created
  watchdog('paypal_api', 'Function paypal_api_ipn --- Data saved into DB');
  
  // don't send nid through for anything but an instance operation.
  $new_quantity = paypal_api_update_purchased_quantity($account->uid, $op, $bundle, ($op == 'instance')? $nid : NULL, $quantity);

  // if this is a deferred creation, publish the node now
  paypal_api_publish_deferred($bundle, $nid, $account->uid);

  // give other modules a chance to add their bit
  module_invoke_all('paypal_payment', $_POST['payment_status'], $account->uid, $op, $bundle, $nid, $new_quantity);

  if (module_exists('trigger')) {
    $action_ids = trigger_get_assigned_actions('paypal_transaction');
    $context = array(
      'group' => 'paypal_api',
      'hook'  => 'paypal_transaction',
    );
    $params = array(
      'op'	      => $op,
      'bundle'	  => $bundle,
      'nid'			  => $nid,
      'quantity'	=> $new_quantity
    );

    actions_do($action_ids, $account, $context, $params);

  }

  return "";
}

/**
 * Get an account from a Paypal IPN signal or from the given parameter.
 *
 * @param $uid
 * If this is 0, the function gets the email address from $_POST and creates a user account with it, returning
 * the new account
 *
 * @return
 * A valid user account.  Returns NULL on error.
 */
function paypal_api_account_from_ipn($uid) {
  if ((int) $uid) {
    return user_load($uid);
  }

  $email = (isset($_POST['custom']))? $_POST['custom'] : '';
  if (!$email) {
    watchdog('paypal_api', t("Invalid PayPal transaction detected.  No uid in the URL, and no email address in _POST"));
    return NULL;
  }

  // they may already be registered but didn't bother to sign in
  $account = user_load_by_mail($email);
  if ($account) {
    return $account;
  }

  // create a new account with this email address
  $account = (object) array('is_new' => TRUE);
  $edit = array(
    'init'    => $email,
    'mail'    => $email,
    'pass'    => user_password(),
    'name'    => $email,
    'status'  => 1
  );

  $account = user_save($account, $edit);

  $settings = variable_get('paypal_api_settings', array());
  if (isset($settings['notify_user']) && $settings['notify_user']) {
    watchdog('me', 'here');
    _user_mail_notify('register_no_approval_required', $account);
  }

  return $account;
}


/**
 *
 * Validate a PayPal IPN signal.
 *
 * Code from their example script.
 *
 * @return
 * TRUE if this is a valid message.
 */
function paypal_api_ipn_validate() {
  $req = 'cmd=_notify-validate';

  foreach ($_POST as $key => $value) {
  	$req .= "&$key=" .  urlencode(stripslashes($value));
  }

  // Post back to PayPal to validate
  $paypal_url = paypal_api_url(FALSE);

  $header = "POST /cgi-bin/webscr HTTP/1.0\r\n";
  $header .= "Content-Type: application/x-www-form-urlencoded\r\n";
  $header .= "Host: ".$paypal_url."\r\n";  // www.paypal.com for a live site
  $header .= "Content-Length: " . strlen($req) . "\r\n\r\n";
  
  $fp = fsockopen ('ssl://' . $paypal_url, 443, $errno, $errstr, 30);

  if (!$fp) {
    // HTTP error
    // @TODO: handle HTTP errors during verification
    return FALSE;
  }

  $validated = FALSE;

  fputs($fp, $header . $req);
  while (!feof($fp)) {
  	$res = fgets ($fp, 1024);
  	if (strcmp ($res, "VERIFIED") == 0) {
  	  $validated = TRUE;
  	}
  	else if (strcmp ($res, "INVALID") == 0) {
  	  watchdog('paypal_api', t("Invalid PayPal IPN message recieved"), $_POST);
  	}
  }
  fclose ($fp);

  return $validated;
}
