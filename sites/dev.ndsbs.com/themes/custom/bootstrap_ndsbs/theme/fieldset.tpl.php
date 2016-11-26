<?php
$element = $variables['element'];
element_set_attributes($element, array('id'));
_form_set_class($element, array('form-wrapper'));

if (!empty($element['#group']) && $element['#group'] == 'additional_settings') {
  $output = '<fieldset' . drupal_attributes($element ['#attributes']) . '>';
  if (!empty($element ['#title'])) {
    // Always wrap fieldset legends in a SPAN for CSS positioning.
    $output .= '<legend><span class="fieldset-legend">' . $element ['#title'] . '</span></legend>';
  }
  $output .= '<div class="fieldset-wrapper">';
  if (!empty($element ['#description'])) {
    $output .= '<div class="fieldset-description">' . $element ['#description'] . '</div>';
  }
  $output .= $element ['#children'];
  if (isset($element ['#value'])) {
    $output .= $element ['#value'];
  }
  $output .= '</div>';
  $output .= "</fieldset>\n";
}

else {
  $description = '';
  $title = (isset($element['#title']) ? $element['#title'] : '');

  $heading_attributes = array(
    'class' => array('panel-heading')
  );

  $classes = $element['#attributes']['class'];

  $panel_attributes = array(
    'class' => array(
      'panel',
      'panel-default'
    )
  );

  if (isset($element['#collapsible']) && $element['#collapsible']) {
    $panel_attributes['id'] = 'accordion';
    $panel_attributes['role'] = 'tablist';
    $panel_attributes['aria-multiselectable'] = 'true';
    $heading_attributes['role'] = 'tab';
    $heading_attributes['id'] = 'heading-' . $element['#attributes']['id'];

    $heading_accordion_attributes = array(
      'role' => 'button',
      'data-toggle' => 'collapse',
      'data-parent' => '#' . $panel_attributes['id'],
      'href' => '#collapse-' . $element['#attributes']['id'],
      'aria-expanded' => 'true',
      'aria-controls' => 'collapse-' . $element['#attributes']['id']
    );

    if ($element['#collapsed']) {
      $heading_accordion_attributes['aria-expanded'] = 'false';
      $heading_accordion_attributes['class'][] = 'collapsed';
    }

    $title = '<a' . drupal_attributes($heading_accordion_attributes) . '>' . $element['#title'] . '</a>';
  }

  $output = '<div' . drupal_attributes($element['#attributes']) . '>';
  $output .= '<div' . drupal_attributes($panel_attributes) . '>';

  if (!empty($element['#title'])) {
    $output .= '<div' . drupal_attributes($heading_attributes) . '><h3 class="panel-title">' . $title . '</h3></div>';
  }

  if (isset($element['#collapsible']) && $element['#collapsible']) {
    $panel_collapse_attributes = array(
      'id' => 'collapse-' . $element['#attributes']['id'],
      'class' => array(
        'panel-collapse',
        'collapse'
      ),
      'role' => 'tabpanel',
      'aria-labeledby' => 'heading-' . $element['#attributes']['id'],
      'aria-expanded' => 'true'
    );

    if ($element['#collapsed']) {
      $panel_collapse_attributes['aria-expanded'] = 'false';
    }
    else {
      $panel_collapse_attributes['class'][] = 'in';
    }

    $output .= '<div' . drupal_attributes($panel_collapse_attributes) . '>';
  }

  if (!empty($element['#description'])) {
    $description = '<p class="help-block">' . $element['#description'] . '</p>';
  }
  $output .= '<div class="panel-body">' . $description . $element['#children'] . '</div>';

  if (isset($element['#collapsible']) && $element['#collapsible']) {
    $output .= '</div>';
  }

  if (isset($element['#value'])) {
    $output .= $element['#value'];
  }

  $output .= '</div></div>';
}

print $output;
