<?php

extract($variables);
drupal_add_css(drupal_get_path('module', 'dashboard') . '/dashboard.css');
print '<div id="dashboard" class="row">' . $element['#children'] . '</div>';