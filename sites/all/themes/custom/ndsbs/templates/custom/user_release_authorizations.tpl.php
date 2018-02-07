<?php
global $user;

$query = new EntityFieldQuery();
$entities = $query->entityCondition('entity_type', 'node')
  ->entityCondition('bundle', 'release_authorization')
  ->propertyCondition('uid', $user->uid)
  ->execute();
$nodes = node_load_multiple(array_keys($entities['node']));

$header = array(
  'Recipient',
  'Date of Authorization',
  'Date of Revocation',
  'Operations',
);
$rows = array();

foreach ($nodes as $nid => $node) {
  $recipient = $node->field_recipient_name['und'][0]['value'];
  $date_of_authorization = date('m/d/Y', $node->created);
  $date_of_revocation = strtotime($node->field_revocation_date['und'][0]['value']);
  $date_of_revocation = date('m/d/Y', $date_of_revocation);

  $view_options = array(
    'attributes' => array(
      'class' => array('uk-margin-small-right'),
      'target' => '_blank',
    ),
  );

  $edit_options = array(
    'query' => array(
      'destination' => 'user/release-authorizations',
    ),
  );

  $view_path = 'node/' . $nid;
  $edit_path = $view_path . '/edit';

  $view = l('View', $view_path, $view_options);
  $edit = l('Edit', $edit_path, $edit_options);
  $operations = $view . $edit;

  $rows[] = array(
    $recipient,
    $date_of_authorization,
    $date_of_revocation,
    $operations,
  );
}

$options = array(
  'attributes' => array(
    'class' => array(
      'uk-button',
      'uk-button-primary',
    ),
  ),
  'query' => array(
    'destination' => 'user/release-authorizations',
  ),
);
?>

<h2>Authorization to Release Substance Abuse Asssessment Treatment and/or Mental Health Information</h2>
<p>This form, when completed and digitally signed by you or a personal representative having legal authority to execute this authorization on your behalf, authorizes Directions Counseling Group (ndsbs.com) to release <strong>protected health information (PHI)</strong> from your clinical record to the person/agency you designate.</p>

<?php
print l('Add new authorization', 'node/add/release-authorization', $options);

print theme('table', array(
  'header' => $header,
  'rows' => $rows,
  'empty' => t('No records found.'),
  'sticky' => TRUE,
));
