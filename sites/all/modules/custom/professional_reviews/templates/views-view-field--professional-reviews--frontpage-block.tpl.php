<?php

$view = $variables['view'];
$field = $variables['field'];
$row = $variables['row'];
?>

<div class="item-content">
  <div class="views-field views-field-body">
    <div class="field-content"><?php print $professional_review['review']; ?></div>
  </div>
  <div class="views-field views-field-title">
    <span class="field-content"><em><?php print $professional_review['reviewer']; ?></em></span>
  </div>
</div>
