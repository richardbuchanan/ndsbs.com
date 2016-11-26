<?php

/**
 * @file
 * Admin page callbacks for the Contact module.
 */

/**
 * Categories/list tab.
 */
function bdg_contact_category_list() {
  $header = array(
    t('Category'),
    t('Recipients'),
    t('Selected'),
    array('data' => t('Operations'), 'colspan' => 2),
  );
  $rows = array();

  // Get all the contact categories from the database.
  $categories = db_select('bdg_contact', 'c')
    ->addTag('translatable')
    ->fields('c', array('cid', 'category', 'recipients', 'selected'))
    ->orderBy('weight')
    ->orderBy('category')
    ->execute()
    ->fetchAll();

  // Loop through the categories and add them to the table.
  foreach ($categories as $category) {
    $rows[] = array(
      check_plain($category->category),
      check_plain($category->recipients),
      ($category->selected ? t('Yes') : t('No')),
      l(t('Edit'), 'admin/structure/bdg-contact/edit/' . $category->cid),
      l(t('Delete'), 'admin/structure/bdg-contact/delete/' . $category->cid),
    );
  }

  if (!$rows) {
    $rows[] = array(array(
      'data' => t('No categories available.'),
      'colspan' => 5,
    ));
  }

  $build['category_table'] = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
  );
  return $build;
}

/**
 * Form constructor for the category edit form.
 *
 * @param $category
 *   An array describing the category to be edited. May be empty for new
 *   categories. Recognized array keys are:
 *   - category: The name of the category.
 *   - recipients: A comma-separated list of recipients.
 *   - reply: (optional) The body of the auto-reply message.
 *   - weight: The weight of the category.
 *   - selected: Boolean indicating whether the category should be selected by
 *     default.
 *   - cid: The category ID for which the form is to be displayed.
 *
 * @see bdg_contact_category_edit_form_validate()
 * @see bdg_contact_category_edit_form_submit()
 * @ingroup forms
 */
function bdg_contact_category_edit_form($form, &$form_state, array $category = array()) {
  // If this is a new category, add the default values.
  $category += array(
    'category' => '',
    'recipients' => '',
    'reply' => '',
    'weight' => 0,
    'selected' => 0,
    'cid' => NULL,
  );

  $form['category'] = array(
    '#type' => 'textfield',
    '#title' => t('Category'),
    '#maxlength' => 255,
    '#default_value' => $category['category'],
    '#description' => t("Example: 'website feedback' or 'product information'."),
    '#required' => TRUE,
  );
  $form['recipients'] = array(
    '#type' => 'textarea',
    '#title' => t('Recipients'),
    '#default_value' => $category['recipients'],
    '#description' => t("Example: 'webmaster@example.com' or 'sales@example.com,support@example.com' . To specify multiple recipients, separate each e-mail address with a comma."),
    '#required' => TRUE,
  );
  $form['reply'] = array(
    '#type' => 'textarea',
    '#title' => t('Auto-reply'),
    '#default_value' => $category['reply'],
    '#description' => t('Optional auto-reply. Leave empty if you do not want to send the user an auto-reply message.'),
  );
  $form['weight'] = array(
    '#type' => 'weight',
    '#title' => t('Weight'),
    '#default_value' => $category['weight'],
    '#description' => t('When listing categories, those with lighter (smaller) weights get listed before categories with heavier (larger) weights. Categories with equal weights are sorted alphabetically.'),
  );
  $form['selected'] = array(
    '#type' => 'select',
    '#title' => t('Selected'),
    '#options' => array(
      0 => t('No'),
      1 => t('Yes'),
    ),
    '#default_value' => $category['selected'],
    '#description' => t('Set this to <em>Yes</em> if you would like this category to be selected by default.'),
  );
  $form['cid'] = array(
    '#type' => 'value',
    '#value' => $category['cid'],
  );
  $form['actions'] = array('#type' => 'actions');
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

/**
 * Form validation handler for bdg_contact_category_edit_form().
 *
 * @see bdg_contact_category_edit_form_submit()
 */
function bdg_contact_category_edit_form_validate($form, &$form_state) {
  // Validate and each e-mail recipient.
  $recipients = explode(',', $form_state['values']['recipients']);

  // When creating a new contact form, or renaming the category on an existing
  // contact form, make sure that the given category is unique.
  $category = $form_state['values']['category'];
  $query = db_select('bdg_contact', 'c')->condition('c.category', $category, '=');
  if (!empty($form_state['values']['cid'])) {
    $query->condition('c.cid', $form_state['values']['cid'], '<>');
  }
  if ($query->countQuery()->execute()->fetchField()) {
    form_set_error('category', t('A contact form with category %category already exists.', array('%category' => $category)));
  }

  foreach ($recipients as &$recipient) {
    $recipient = trim($recipient);
    if (!valid_email_address($recipient)) {
      form_set_error('recipients', t('%recipient is an invalid e-mail address.', array('%recipient' => $recipient)));
    }
  }
  $form_state['values']['recipients'] = implode(',', $recipients);
}

/**
 * Form submission handler for bdg_contact_category_edit_form().
 *
 * @see bdg_contact_category_edit_form_validate()
 */
function bdg_contact_category_edit_form_submit($form, &$form_state) {
  if ($form_state['values']['selected']) {
    // Unselect all other contact categories.
    db_update('bdg_contact')
      ->fields(array('selected' => '0'))
      ->execute();
  }

  if (empty($form_state['values']['cid'])) {
    drupal_write_record('bdg_contact', $form_state['values']);
  }
  else {
    drupal_write_record('bdg_contact', $form_state['values'], array('cid'));
  }

  drupal_set_message(t('Category %category has been saved.', array('%category' => $form_state['values']['category'])));
  watchdog('bdg_contact', 'Category %category has been saved.', array('%category' => $form_state['values']['category']), WATCHDOG_NOTICE, l(t('Edit'), 'admin/structure/bdg-contact/edit/' . $form_state['values']['cid']));
  $form_state['redirect'] = 'admin/structure/bdg-contact';
}

/**
 * Form constructor for the contact category deletion form.
 *
 * @param $contact
 *   Array describing the contact category to be deleted. See the documentation
 *   of bdg_contact_category_edit_form() for the recognized keys.
 *
 * @see bdg_contact_menu()
 * @see bdg_contact_category_delete_form_submit()
 */
function bdg_contact_category_delete_form($form, &$form_state, array $contact) {
  $form['bdg_contact'] = array(
    '#type' => 'value',
    '#value' => $contact,
  );

  return confirm_form(
    $form,
    t('Are you sure you want to delete %category?', array('%category' => $contact['category'])),
    'admin/structure/bdg-contact',
    t('This action cannot be undone.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * Form submission handler for bdg_contact_category_delete_form().
 */
function bdg_contact_category_delete_form_submit($form, &$form_state) {
  $contact = $form['bdg_contact']['#value'];

  db_delete('bdg_contact')
    ->condition('cid', $contact['cid'])
    ->execute();

  drupal_set_message(t('Category %category has been deleted.', array('%category' => $contact['category'])));
  watchdog('bdg_contact', 'Category %category has been deleted.', array('%category' => $contact['category']), WATCHDOG_NOTICE);

  $form_state['redirect'] = 'admin/structure/bdg-contact';
}
