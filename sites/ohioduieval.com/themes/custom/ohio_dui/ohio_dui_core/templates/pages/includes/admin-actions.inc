<?php
/**
 * The following markup will only be rendered on a page if the logged in user
 * has the administrator role.
 */
if ($tabs and $is_admin): ?>
<div id="tabs" class="content-wrap">
  <?php print render($tabs); ?>
</div>
<?php endif; ?>

<?php
/**
 * The followiung markup will be rendered for all users.
 */
if ($action_links): ?>
<ul id="action-links">
  <?php print render($action_links); ?>
</ul>
<?php endif; ?>
