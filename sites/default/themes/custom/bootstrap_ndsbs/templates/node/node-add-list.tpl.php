<?php

$content = $variables['content'];
$output = '';

if ($content) {
  $output = '<ul class="list-group">';

  foreach ($content as $item) {
    $output .= '<li class="list-group-item">';
    $output .= '<h4 class="list-group-item-heading">' . l($item['title'], $item['href'], $item['localized_options']) . '</h4>';
    $output .= '<p class="list-group-item-text">' . filter_xss_admin($item['description']) . '</p>';
    $output .= '</li>';
  }

  $output .= '</ul>';
}

else {
  $output = '<p>' . t('You have not created any content types yet. Go to the <a href="@create-content">content type creation page</a> to add a new content type.', array('@create-content' => url('admin/structure/types/add'))) . '</p>';
}

print $output;
