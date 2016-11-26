<?php

/**
 * @file
 * Theme implementation of the get started page. Shows the user registration
 * form for users not logged in.
 *
 * TODO: Add content for users that ARE logged in.
 */
?>
<?php global $user; ?>
<div id="page-container">
  <?php include('includes/top-header.inc'); ?>
  <?php include('includes/sub-header.inc'); ?>
  <section id="content-section" class="clearfix sub-header-padding">
    <a id="main-content"></a>
    <?php include('includes/admin-actions.inc'); ?>
    <div id="content">
      <article id="page-content">
        <div class="content-wrap">
          <?php print $messages; ?>
          <?php if (!$logged_in): ?>
          <h1>Register</h1>
          <?php print drupal_render(drupal_get_form('user_register_form')); ?>
          <?php print render($page['content']); ?>
          <?php endif; ?>
          <?php if ($logged_in): ?>
          <?php drupal_goto('user/'.$user->uid.'/my-assessment', array(
            'query' => array(
              'step' => 'null',
            ))); ?>
          <?php endif; ?>
        </div>
      </article>
    </div>
  </section>
  <?php include('includes/footer.inc'); ?>
</div>
