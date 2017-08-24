<?php

function user_release_authorization_form($form, &$form_state) {
  global $user;

  $form_guidelines = t('<h2>Authorization to Release Substance Abuse Asssessment Treatment and/or Mental Health Information</h2>');
  $form_guidelines .= t('<p>This form, when completed and digitally signed by you or a personal representative having legal authority to execute this authorization on your behalf, authorizes Directions Counseling Group (ndsbs.com) to release <strong>protected health information (PHI)</strong> from your clinical record to the person/agency you designate.</p>');

  $form['top'] = array(
    '#markup' => $form_guidelines,
  );

  // Personal information
  $form['personal_information'] = array(
    '#type' => 'fieldset',
    '#title' => t('Personal Information'),
    '#collapsible' => FALSE,
  );
  $form['personal_information']['client_name'] = array(
    '#type' => 'textfield',
    '#title' => t("Client's Name"),
  );
  $form['personal_information']['client_dob'] = array(
    '#type' => 'textfield',
    '#title' => t("Client's DOB (mm/dd/yy)"),
  );
  $form['personal_information']['parent_guardian_poa'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Check below if you are the parent of, guardian of, or power of attorney for the client:'),
    '#options' => array(
      'parent' => t('parent'),
      'guardian' => t('guardian'),
      'poa' => t('POA'),
    ),
  );
  $form['personal_information']['parent_guardian_poa_name'] = array(
    '#type' => 'textfield',
    '#title' => t('Your Name'),
  );

  // Authorization
  $form['authorization'] = array(
    '#type' => 'fieldset',
    '#title' => t('Authorization'),
    '#collapsible' => FALSE,
  );
  $form['authorization']['clinician'] = array(
    '#type' => 'checkboxes',
    '#options' => array(
      'brian_t_davis' => 'Brian T. Davis',
      'travis_somers' => 'Travis Somers',
      'trevor_davis' => 'Trevor Davis',
      'ryan_smith' => 'Ryan Smith',
    ),
    '#prefix' => t('I authorize (clinician) '),
    '#suffix' => t(' of Directions Counseling Group and ndsbs.com to:')
  );
  $form['authorization']['exchange_release_obtain'] = array(
    '#type' => 'checkboxes',
    '#options' => array(
      'exchange' => t('exchange client information with:'),
      'release' => t('release client information to:'),
      'obtain' => t('obtain client information from:'),
    ),
  );
  $form['authorization']['recipient'] = array(
    '#type' => 'container',
  );
  $form['authorization']['recipient']['recipient_name'] = array(
    '#type' => 'textfield',
    '#title' => t('Individual'),
  );
  $form['authorization']['recipient']['recipient_company'] = array(
    '#type' => 'textfield',
    '#title' => t('Company'),
  );
  $form['authorization']['recipient']['recipient_address'] = array(
    '#type' => 'textfield',
    '#title' => t('Address'),
  );
  $form['authorization']['recipient']['recipient_city'] = array(
    '#type' => 'textfield',
    '#title' => t('City'),
  );
  $form['authorization']['recipient']['recipient_state'] = array(
    '#type' => 'textfield',
    '#title' => t('State'),
  );
  $form['authorization']['recipient']['recipient_zip'] = array(
    '#type' => 'number',
    '#title' => t('zip'),
  );
  $form['authorization']['recipient']['recipient_email'] = array(
    '#type' => 'emailfield',
    '#title' => t('Email'),
    '#attributes' => array(
      'class' => array(
        'uk-input',
        'uk-form-width-large',
      ),
    ),
  );
  $form['authorization']['recipient']['recipient_phone'] = array(
    '#type' => 'telfield',
    '#title' => t('Phone'),
    '#attributes' => array(
      'class' => array(
        'uk-input',
        'uk-form-width-large',
      ),
    ),
  );
  $form['authorization']['recipient']['recipient_fax'] = array(
    '#type' => 'telfield',
    '#title' => t('Fax'),
    '#attributes' => array(
      'class' => array(
        'uk-input',
        'uk-form-width-large',
      ),
    ),
  );
  $form['authorization']['information_provided'] = array(
    '#type' => 'checkboxes',
    '#options' => array(
      'assessment' => t('Assessment with Diagnosis & Recommendations'),
      'other' => t('Other'),
    ),
    '#prefix' => t('<p>Please provide the following information to the individual/company above:</p>'),
  );
  $form['authorization']['purpose'] = array(
    '#type' => 'checkboxes',
    '#options' => array(
      'court' => t('Court / legal proceedings'),
      'medical' => t('Physician/NP or Medical Care'),
      'treatment' => t('Beginning or transfer to treatment'),
      'employer' => t('Employer Required'),
      'adoption' => t('Adoption Planning'),
      'domestic' => t('Domestic court/custody'),
      'professional' => t('Professional board'),
      'license' => t('Licensing Bureau'),
      'other' => t('Other'),
    ),
    '#prefix' => t('<p>The general purpose of this request is for:</p>'),
  );

  // Method of transfer
  $form['method_of_transfer'] = array(
    '#type' => 'fieldset',
    '#title' => t('Method of Transfer to Above'),
    '#collapsible' => FALSE,
  );
  $form['method_of_transfer']['external_transfer'] = array(
    '#type' => 'checkbox',
    '#title' => t('External Transfer Distributed Via:'),
  );
  $form['method_of_transfer']['method_of_transfer_email'] = array(
    '#type' => 'checkbox',
    '#title' => t('Email PHI - Email address: see above or additional'),
  );
  $form['method_of_transfer']['method_of_transfer_email_additional'] = array(
    '#type' => 'textfield',
    '#title' => t('Email'),
    '#title_display' => 'invisible',
  );
  $form['method_of_transfer']['method_of_transfer_fax'] = array(
    '#type' => 'checkbox',
    '#title' => t('Fax PHI - Fax number:'),
  );
  $form['method_of_transfer']['method_of_transfer_fax_additional'] = array(
    '#type' => 'textfield',
    '#title' => t('Fax'),
    '#title_display' => 'invisible',
  );
  $form['method_of_transfer']['method_of_transfer_mail'] = array(
    '#type' => 'checkbox',
    '#title' => 'Mailed to address above',
  );
  $form['method_of_transfer']['method_of_transfer_pickup'] = array(
    '#type' => 'checkbox',
    '#title' => t('Picked up by:'),
  );
  $form['method_of_transfer']['method_of_transfer_pickup_additional'] = array(
    '#type' => 'textfield',
    '#title' => 'Picked up by',
    '#title_display' => 'invisible',
    '#suffix' => t('<p>I am aware that this person will be required to show a state issued ID in order to pick up this documentation. I am willing to have my PHI shared via unsecured email or fax and I have been made aware of the risks that are involved by using this form of unsecured communication means.</p>')
  );
  $form['method_of_transfer']['method_of_transfer_intials'] = array(
    '#type' => 'textfield',
    '#title' => t('Initials'),
  );

  // Revocation
  $form['revocation'] = array(
    '#type' => 'fieldset',
    '#title' => t('Revocation'),
    '#collapsible' => FALSE,
  );
  $form['revocation']['revocation_agreement'] = array(
    '#markup' => t('<p>I understand that I have a right to revoke this authorization at any time by sending written notification to Directions Counseling Group.  I further understand that a revocation of the authorization is not effective to the extent that action has been taken in reliance on the authorization.  This consent will automatically expire one (1) year after the date of my signature as it appears below, unless indicated otherwise here:</p>')
  );
  $form['revocation']['revocation_date'] = array(
    '#type' => 'textfield',
    '#title' => t('date'),
    '#title_display' => 'invisible',
  );

  // Conditions
  $form['conditions'] = array(
    '#type' => 'fieldset',
    '#title' => t('Conditions'),
  );
  $form['conditions']['conditions_agreement'] = array(
    '#markup' => t('<p>I understand that in some circumstances, by not signing this agreement, my therapist may condition providing me mental health services.</p>'),
  );

  // Disclosure
  $form['disclosure'] = array(
    '#type' => 'fieldset',
    '#title' => t('Form of Disclosure'),
  );
  $form['disclosure']['disclosure_agreement'] = array(
    '#markup' => t('<p>Unless you have specifically requested in writing that the disclosure be made in a certain format, we reserve the right to disclose information as permitted by this authorization in any manner that we deem to be appropriate and consistent with applicable law, including, but not limited to, verbally, in paper format, or electronically.</p>'),
  );

  // Redisclosure
  $redisclosure = t('<p><strong>Substance Abuse Information being Released</strong>: Federal law prohibits the person or organization to whom disclosure is made from making any further disclosure of substance abuse treatment information unless further disclosure is expressly permitted by the written authorization of the person to whom it pertains or as otherwise permitted by 42 C.F.R. Part 2. I will be given a copy of this authorization for my records.</p>');
  $redisclosure .= t('<p><strong>Mental Health Information being Released</strong>: I understand that there is the potential that the protected health information that is disclosed pursuant to this authorization may be redisclosed by the recipient and the protected health information will no longer be protected by the HIPAA privacy regulations, unless a state law applies that is more strict than HIPAA and provides additional privacy protections.</p>');
  $form['redisclosure'] = array(
    '#type' => 'fieldset',
    '#title' => t('Redisclosure'),
  );
  $form['redisclosure']['redisclosure_agreement'] = array(
    '#markup' => $redisclosure,
  );

  // Digital signature
  $form['digital_signature'] = array(
    '#type' => 'textfield',
    '#title' => t('Digital signature'),
    '#title_display' => 'invisible',
    '#description' => 'Digital (typed) Signature of Client',
    '#prefix' => '<p>I, the undersigned, authorize this release of information:</p>',
  );
  $form['digital_signature_date'] = array(
    '#type' => 'textfield',
    '#title' => t('Date'),
    '#title_display' => 'invisible',
    '#description' => 'Date',
  );
  $form['digital_signature_other'] = array(
    '#type' => 'textfield',
    '#title' => t('Digital signature'),
    '#title_display' => 'invisible',
    '#description' => 'Digital (typed) Signature of Client Or authorized Parent, Guardian, or Personal Rep.',
  );
  $form['digital_signature_other_date'] = array(
    '#type' => 'textfield',
    '#title' => t('Date'),
    '#title_display' => 'invisible',
    '#description' => 'Date',
  );

  // Identifying information
  $form['identifying_information'] = array(
    '#type' => 'fieldset',
    '#title' => t('Identifying Information'),
    '#collapsible' => FALSE,
  );
  $form['identifying_information']['identifying_information_ssn'] = array(
    '#type' => 'textfield',
    '#title' => t('First 3 numbers of social security #'),
  );
  $form['identifying_information']['identifying_information_address'] = array(
    '#type' => 'textfield',
    '#title' => t('Client Street Address #'),
  );
  $form['identifying_information']['identifying_information_client_dob'] = array(
    '#type' => 'textfield',
    '#title' => t('Client Birth Date'),
  );

  $form['actions'] = array('#type' => 'actions');
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  $form['#submit'][] = 'user_release_authorization_form_submit';

  return $form;
}

function user_release_authorization_form_submit($form, &$form_state) {
  drupal_set_message(t('Authorization to release has been sent to NDSBS.'));
}
