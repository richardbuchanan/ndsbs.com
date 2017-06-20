<?php

$description = $variables['form']['description']['#markup'];
$variables['form']['description']['#markup'] = '<p>' . $description . '</p>';

print drupal_render_children($variables['form']);
