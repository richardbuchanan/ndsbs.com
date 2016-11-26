<?php

/**
 * @file
 * functions.inc
 *
 * This file defines functions we can use in our page templates.
 */

/**
 * ode_load_form()
 *
 * Function defined to load a node creation form in a page template.
 * $node_machine_name: The machine name of the node we want to load.
 */
function ode_load_add_node_form($node_machine_name) {
  global $user;
  module_load_include('inc', 'node', 'node.pages');
  $node = (object) array(
    'uid' => $user->uid,
    'name' => (isset($user->name) ? $user->name : ''),
    'type' => $node_machine_name,
    'language' => LANGUAGE_NONE,
  );
  $form = drupal_get_form($node_machine_name . '_node_form', $node);
  print drupal_render($form);
}
