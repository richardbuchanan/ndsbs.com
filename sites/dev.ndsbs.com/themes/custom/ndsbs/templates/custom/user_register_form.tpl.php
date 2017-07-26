<?php global $base_url; ?>
<span itemprop="name" style="display: none">Get Started</span>
<div id="breadcrumb" style="display: none;" itemscope itemtype="http://schema.org/BreadcrumbList">
  <ol>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>">
        <span itemprop="name">NDSBS</span>
      </a>
    </li>
    <meta itemprop="position" content="1"/>
    <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <a itemprop="item" href="<?php print $base_url; ?>/user/register">
        <span itemprop="name">Register</span>
      </a>
      <meta itemprop="position" content="2"/>
    </li>
  </ol>
</div>

<div class="form-group form-item form-type-select form-item-first-name">
  <?php print drupal_render($form['field_first_name']); ?>
</div>
<div class="form-group form-item form-type-select form-item-middle-name">
  <?php print drupal_render($form['field_middle_name']); ?>
</div>
<div class="form-group form-item form-type-select form-item-last-name">
  <?php print drupal_render($form['field_last_name']); ?>
</div>
<?php print drupal_render($form['account']['mail']); ?>
<?php print drupal_render($form['account']['conf_mail']); ?>
<?php print drupal_render($form['account']['pass']); ?>
<div class="form-group form-item form-type-select form-item-date-of-birth">
  <label>Date Of Birth</label>
  <div class="form-items-inline">
    <?php print drupal_render($form['field_month']); ?>
    <?php print drupal_render($form['field_dobdate']); ?>
    <?php print drupal_render($form['field_year']); ?>
  </div>
  <div id="user-dob" style="display: none;"></div>
</div>
<div class="form-group form-item form-type-select form-item-phone">
  <?php print drupal_render($form['field_phone']); ?>
</div>
<div class="form-group form-item form-type-select form-item-address">
  <?php print drupal_render($form['field_address']); ?>
</div>
<div class="form-group form-item form-type-select form-item-city">
  <?php print drupal_render($form['field_city']); ?>
</div>
<div class="form-group form-item form-type-select form-item-state">
  <?php print drupal_render($form['field_state']); ?>
</div>
<div class="form-group form-item form-type-select form-item-zip">
  <?php print drupal_render($form['field_zip']); ?>
</div>
<div class="form-group form-item form-type-select form-item-reason-for-assessment">
  <?php print drupal_render($form['field_who_referred_you']); ?>
</div>
<div class="form-group form-item form-type-select form-item-reason-for-assessment">
  <?php print drupal_render($form['field_reason_for_assessment']); ?>
  <?php print drupal_render($form['field_for_courts']); ?>
  <?php print drupal_render($form['field_for_probation']); ?>
</div>
<div class="form-group form-item form-type-select form-item-assessment-state">
  <?php print drupal_render($form['field_assessment_state']); ?>
</div>
<div class="form-group form-item form-type-text-long form-item-pre-purchase-questions">
  <?php print drupal_render($form['field_pre_purchase_questions']); ?>
</div>
<div class="form-group form-item form-type-text-long form-item-preferred-contact">
  <?php print drupal_render($form['field_preferred_contact']); ?>
</div>

<div class="form-group form-item form-type-select form-item-terms-of-use">
  <fieldset>
    <legend>Terms of Use</legend>
    <div id="form-items-terms-of-use" class="form-item_custum fw_fixed" style="height: 200px; overflow: auto; border: 1px solid #D5D5D5">
      <?php hide($form['field_terms_of_use_register']); ?>
      <?php $terms = node_load('162'); ?>
      <?php $terms = $terms->body['und'][0]['value']; ?>
      <div class="field-name-field-terms-of-use-register">
        <?php print $terms; ?>
      </div>
    </div>
    <?php print drupal_render($form['field_terms_of_use']); ?>
  </fieldset>
</div>

<?php hide($form['profile_main']); ?>
<?php hide($form['field_second_phone']); ?>
<?php hide($form['field_gender']); ?>
<?php hide($form['field_recipient_name']); ?>
<?php hide($form['field_recipient_title']); ?>
<?php hide($form['field_recipient_company']); ?>
<?php hide($form['field_recipient_street']); ?>
<?php hide($form['field_recipient_city']); ?>
<?php hide($form['field_recipient_state']); ?>
<?php hide($form['field_recipient_zip']); ?>
<?php hide($form['field_referred_by']); ?>
<?php print drupal_render($form['captcha']); ?>
<?php print drupal_render_children($form); ?>
