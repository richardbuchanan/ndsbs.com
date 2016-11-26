<?php

/**
 * @file
 * Form builder to configure the registration validation settings.
 */

/**
 * Form constructor for building our system configuration settings form.
 */
function registration_validation_admin($form, &$form_state) {
  $form['registration_validation']['blacklist_domains'] = array(
    '#type' => 'fieldset',
    '#title' => t('Blacklist e-mail domains'),
    '#description' => t('Often times you will find specific domains getting past CAPTCHA modules, if they are installed. When attempting to register with any e-mail domains you enter below, the registration will be blocked and a message will appear informing the user to use a different e-mail address.'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['registration_validation']['blacklist_domains']['registration_validation_blacklisted_domains'] = array(
    '#type' => 'textarea',
    '#title' => t('Blacklisted e-mail domains'),
    '#description' => t('Specify blacklisted e-mail domains by using their domain name and top-level domain (.com, .org, .info, etc.). Enter one domain per line. Example domains are example.com for @example.com e-mail addresses and example.* for all @example.* e-mail addresses (.com, .org, .info, etc.).'),
    '#default_value' => variable_get('registration_validation_blacklisted_domains'),
  );
  $form['registration_validation']['blacklist_domains']['registration_validation_blacklisted_domains_message'] = array(
    '#type' => 'textarea',
    '#title' => t('Failed validation error message'),
    '#description' => t('Enter the message to display on the page if the user\'s e-mail address domain is blacklisted. You can enter "%domain" (without quotes) anywhere in the message to print the domain name.<br>Default message: <em>The e-mail domain %domain has been blacklisted from registering. Please enter a different e-mail address.</em>'),
    '#default_value' => variable_get('registration_validation_blacklisted_domains_message', 'The e-mail domain %domain has been blacklisted from registering. Please enter a different e-mail address.'),
  );

  return system_settings_form($form);
}
