<?php

/**
 * @file
 * Default theme implementation to present all user profile data.
 *
 * This template is used when viewing a registered member's profile page,
 * e.g., example.com/user/123. 123 being the users ID.
 *
 * Use render($user_profile) to print all profile items, or print a subset
 * such as render($user_profile['user_picture']). Always call
 * render($user_profile) at the end in order to print all remaining items. If
 * the item is a category, it will contain all its profile items. By default,
 * $user_profile['summary'] is provided, which contains data on the user's
 * history. Other data can be included by modules. $user_profile['user_picture']
 * is available for showing the account picture.
 *
 * Available variables:
 *   - $user_profile: An array of profile items. Use render() to print them.
 *   - Field variables: for each field instance attached to the user a
 *     corresponding variable is defined; e.g., $account->field_example has a
 *     variable $field_example defined. When needing to access a field's raw
 *     values, developers/themers are strongly encouraged to use these
 *     variables. Otherwise they will have to explicitly specify the desired
 *     field language, e.g. $account->field_example['en'], thus overriding any
 *     language negotiation rule that was previously applied.
 *
 * @see user-profile-category.tpl.php
 *   Where the html is handled for the group.
 * @see user-profile-item.tpl.php
 *   Where the html is handled for each item in the group.
 * @see template_preprocess_user_profile()
 *
 * @ingroup themeable
 */
?>
<div<?php print $attributes; ?>>
  <div uk-grid>
    <div class="uk-width-1-3 uk-width-1-4@m">
      <strong>Name</strong>
    </div>
    <div class="uk-width-2-3 uk-width-3-4@m"><?php print $user_name; ?></div>
  </div>

  <div class="uk-margin-small-top" uk-grid>
    <div class="uk-width-1-3 uk-width-1-4@m">
      <strong>Email</strong>
    </div>
    <div class="uk-width-2-3 uk-width-3-4@m"><?php print $user_email; ?></div>
  </div>

  <div class="uk-margin-small-top" uk-grid>
    <div class="uk-width-1-3 uk-width-1-4@m">
      <strong>Gender</strong>
    </div>
    <div class="uk-width-2-3 uk-width-3-4@m"><?php print $user_gender; ?></div>
  </div>

  <div class="uk-margin-small-top" uk-grid>
    <div class="uk-width-1-3 uk-width-1-4@m">
      <strong>Date of Birth</strong>
    </div>
    <div class="uk-width-2-3 uk-width-3-4@m"><?php print $user_dob; ?></div>
  </div>

  <div class="uk-margin-small-top" uk-grid>
    <div class="uk-width-1-3 uk-width-1-4@m">
      <strong>Phone</strong>
    </div>
    <div class="uk-width-2-3 uk-width-3-4@m"><?php print $user_phone; ?></div>
  </div>

  <div class="uk-margin-small-top" uk-grid>
    <div class="uk-width-1-3 uk-width-1-4@m">
      <strong>Address</strong>
    </div>
    <div class="uk-width-2-3 uk-width-3-4@m">
      <div><?php print $user_street; ?></div>
      <div><?php print $user_address; ?></div>
    </div>
  </div>
</div>
