<?php

/**
 * @file
 * Theme implementation to display the user profile page.
 * URL alias: /user/%user-id
 *
 * The following variables are available:
 *   $edit_url - This is the URL the user goes to when editing their account.
 *   $fullname - A pre-formatted name value (ie, Richard Clark Buchanan, III).
 *   $uid - The user's ID.
 *   $email - The user's email address.
 *   $register_date - The date user was created.
 *   $gender - The user's gender.
 *   $street - The user's street address.
 *   $second_street - The user's second street address line. †
 *   $city - The user's city.
 *   $state - The user's state.
 *   $zipcode - The user's zipcode.
 *   $refferal - The user's response to 'How did you hear about us?'. ‡
 *   $recipient_name - The recipient name for the user. ‡‖
 *   $recipient_company - The recipient's company name. †
 *   $recipient_street - The recipient's street address.
 *   $recipient_second_street - The recipient's second street address line. †
 *   $recipient_city - The recipient's city.
 *   $recipient_state - The recipient's state.
 *   $recipient_zipcode - The recipient's zipcode.
 *   $birth_date - A pre-formatted value of user's date of birth (ie, Janurary 30, 1982).
 *   $rush_order - The user's response to 'Do you need rush order service?'.
 *   $rush_order_date - The user's rush order completed by date value. †
 *   $rush_order_time - The user's rush order completed by time value.
 *   $therapist - The assigned therapist, assigned by ODE staff.
 *   $phone - A pre-formatted value of user's phone number (ie, (330) 207-4953).
 *
 *    † - Use a php if statement to determine whether these fields should be rendered.
 *        ie, <?php if ($test): ?>
 *            <?php print $test; ?>
 *            <?php endif; ?>
 *
 *    ‡ - Use a php if/else statement to determine what to render.
 *        ie, <?php if ($test): ?>
 *            <?php print $test; ?>
 *            <?php else: ?>
 *            <?php print "N/A"; ?>
 *            <?php endif; ?>
 *
 *    ‖ - When testing if there is a recipient name, include all the recipient values
 *         inside the if statement for the recipient name.
 *         ie, <?php if ($recipient_name): ?>
 *             <?php print $recipient_name; ?>
 *             <?php print $recipient_street; ?>
 *             ...etc
 *             <?php endif; ?>
 */
?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <?php include('includes/highlights.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding content-wrap" style="width: 90%; max-width: 1440px;">
    <a id="main-content"></a>
    <?php global $user; ?>
    <?php if (!in_array('client', $user->roles)): ?>
    <?php include('includes/admin-actions.inc'); ?>
    <?php endif; ?>
    <div id="content">
      <article id="page-content">
        <?php include('includes/variables.inc'); ?>

        <div class="content-wrap">
          <?php print render($page['content']); ?>
        </div>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
