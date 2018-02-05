<?php
/**
 * @file
 * important_document_node_form.tpl.php
 */
global $user, $base_path;

if($user->roles[6] == 'client') {
  include_once 'headerimpdoc.tpl.php';
}
?>
<?php print drupal_render_children($form); ?>
