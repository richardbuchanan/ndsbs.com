<?php
$element = $variables['element'];
$element['#attributes']['class'][] = 'uk-form-stacked';

if (isset($element['#action'])) {
  $element['#attributes']['action'] = drupal_strip_dangerous_protocols($element['#action']);
}

element_set_attributes($element, array('method', 'id'));

if (empty($element['#attributes']['accept-charset'])) {
  $element['#attributes']['accept-charset'] = "UTF-8";
}
?>

<form<?php print drupal_attributes($element['#attributes']); ?>>
  <h3 class="release-authorization-section uk-text-center">Personal Information</h3>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Client's Name:</div>

      <div class="uk-display-inline-block">
        <?php print render($element['title']); ?>
      </div>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Client's DOB (mm/dd/yyyy):</div>

      <div class="uk-display-inline-block">
        <?php print render($element['field_client_dob']); ?>
      </div>
    </div>
  </div>

  <div>
    <p class="uk-margin-remove">Check below if you are the parent of, guardian of, or power of attorney for the client:</p>
    <div class="uk-display-inline-block">
      <?php print render($element['field_parent_guardian_poa']); ?>
    </div>

    <div class="uk-display-inline-block uk-margin-left">
      <div class="uk-display-inline-block uk-margin-small-right">Your name:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_parent_guardian_poa_name']); ?>
      </div>
    </div>
  </div>

  <h3 class="release-authorization-section uk-text-center">Authorization</h3>
  <div class="uk-width-1-1">
    <div class="uk-display-inline uk-margin-small-right">I authorize (clinician)</div>
    <?php print render($element['field_clinician']); ?>
  </div>

  <div>
    <div class="uk-display-inline">of Directions Counseling Group and ndsbs.com to:</div>
    <div class="uk-display-inline">
      <?php print render($element['field_exchange_release_obtain']); ?>
    </div>
  </div>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Individual:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_recipient_name']); ?>
      </div>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Company:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_recipient_company']); ?>
      </div>
    </div>
  </div>

  <?php print render($element['field_recipient_address']); ?>

  <div class="uk-child-width-1-1 uk-child-width-1-3@m" uk-grid>
    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Email:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_recipient_email']); ?>
      </div>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Phone:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_recipient_phone']); ?>
      </div>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">Fax:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_recipient_fax']); ?>
      </div>
    </div>
  </div>

  <p class="uk-margin-remove">Please provide the following information to the individual/company above:</p>
  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>
      <?php print render($element['field_information_provided']); ?>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-left uk-margin-small-right">If other:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_information_provided_other']); ?>
      </div>
    </div>
  </div>

  <p class="uk-margin-remove">The general purpose of this request is for</p>
  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>
      <?php print render($element['field_purpose']); ?>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-left uk-margin-small-right">If other:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_purpose_other']); ?>
      </div>
    </div>
  </div>

  <h3 class="release-authorization-section uk-text-center">Method to Transfer Above</h3>
  <?php print render($element['field_external_transfer']); ?>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <div>
      <?php print render($element['field_method_of_transfer_email']); ?>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">If by email:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_transfer_email_additional']); ?>
      </div>
    </div>
  </div>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m uk-margin-remove-top" uk-grid>
    <div>
      <?php print render($element['field_method_of_transfer_fax']); ?>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">If by fax:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_transfer_fax_additional']); ?>
      </div>
    </div>
  </div>

  <?php print render($element['field_method_of_transfer_mail']); ?>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m uk-margin-remove-top" uk-grid>
    <div>
      <?php print render($element['field_method_of_transfer_pickup']); ?>
    </div>

    <div>
      <div class="uk-display-inline-block uk-margin-small-right">If by pickup:</div>
      <div class="uk-display-inline-block">
        <?php print render($element['field_transfer_pickup_additional']); ?>
      </div>
    </div>
  </div>

  <p class="uk-margin-remove">I am willing to have my PHI shared via unsecured email or fax and I have been made aware of the risks that are involved by using this form of unsecured communication means.</p>
  <div class="uk-display-inline-block uk-margin-small-right">Initials:</div>
  <div class="uk-display-inline-block">
    <?php print render($element['field_method_of_transfer_initial']); ?>
  </div>

  <?php print render($element['field_revocation_agreement']); ?>

  <div>
    <div class="uk-display-inline-block uk-margin-small-right">Revocation date (mm/dd/yyyy):</div>
    <div class="uk-display-inline-block">
      <?php print render($element['field_revocation_date']); ?>
    </div>
  </div>

  <?php print render($element['field_conditions_agreement']); ?>

  <?php print render($element['field_disclosure_agreement']); ?>

  <?php print render($element['field_redisclosure_agreement']); ?>

  <p>I, the undersigned, authorize this release of information:</p>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <?php print render($element['field_digital_signature']); ?>
    <?php print render($element['field_date']); ?>
  </div>

  <div class="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
    <?php print render($element['field_digital_signature_other']); ?>
    <?php print render($element['field_digital_signature_other_da']); ?>
  </div>

  <h3 class="release-authorization-section uk-text-center">Identifying Information</h3>

  <div>
    <div class="uk-display-inline-block uk-margin-small-right">First 3 numbers of client social security #:</div>
    <div class="uk-display-inline-block">
      <?php print render($element['field_identifying_info_ssn']); ?>
    </div>
  </div>

  <div>
    <div class="uk-display-inline-block uk-margin-small-right">Client Street Address #:</div>
    <div class="uk-display-inline-block">
      <?php print render($element['field_identifying_info_address']); ?>
    </div>
  </div>

  <div>
    <div class="uk-display-inline-block uk-margin-small-right">Client Birth Date (mm/dd/yyyy):</div>
    <div class="uk-display-inline-block">
      <?php print render($element['field_identifying_info_dob']); ?>
    </div>
  </div>

  <?php print render($element['actions']); ?>
</form>
