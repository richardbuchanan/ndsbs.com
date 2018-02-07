<?php
$element = $variables['element'];
element_set_attributes($element, array('id', 'name', 'cols', 'rows'));
_form_set_class($element, array('form-control', 'form-item'));

$wrapper_attributes = array(
  'class' => array('form-textarea-wrapper'),
);

// When editing a block textarea, Ckeditor will remove some HTML code from the
// textarea. This will remove the Ckeditor module/library from the form so
// we can maintain the HTML code entered in the textarea.
if (!empty($element['#title']) && $element['#title'] == 'Block body') {
  $path = explode('/', current_path());
  $manage_block = ($path[2] = 'block' && $path[3] == 'manage') ? TRUE : FALSE;

  if ($manage_block && isset($element['#pre_render'])) {
    foreach ($element['#pre_render'] as $key => $pre_render) {
      if ($pre_render == 'ckeditor_pre_render_text_format') {
        foreach ($element['#attributes']['class'] as $class_key => $class) {
          if ($class == 'ckeditor-mod') {
            unset($element['#attributes']['class'][$class_key]);
          }
        }
        foreach ($element['#attached']['css'] as $attached_css_key => $attached_css) {
          if ($attached_css == 'sites/all/modules/contrib/ckeditor/css/ckeditor.editor.css') {
            if (count($element['#attached']['css']) == '1') {
              unset($element['#attached']['css']);
            }
            else {
              unset($element['#attached']['css'][$attached_css_key]);
            }
          }
        }
        unset($element['#pre_render'][$key]);
      }
    }
  }
}

// Add resizable behavior.
if (!empty($element['#resizable'])) {
  drupal_add_library('system', 'drupal.textarea');
  $wrapper_attributes['class'][] = 'resizable';
}

// Add aria-describedby attribute for screen readers.
if (!empty($element['#description'])) {
  $element['#attributes']['aria-describedby'] = 'help-' . $element['#id'];
}

$output = '<div' . drupal_attributes($wrapper_attributes) . '>';
$output .= '<textarea' . drupal_attributes($element['#attributes']) . '>' . check_plain($element['#value']) . '</textarea>';
$output .= '</div>';
print $output;
