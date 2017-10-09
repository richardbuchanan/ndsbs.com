<?php

/**
 * @file
 * Contains the accordion style plugin.
 */

/**
 * Style plugin to render each item in UIkit accordion.
 *
 * @ingroup views_style_plugins
 */
class UIkitViewsPluginStyleAccordion extends views_plugin_style {

  /**
   * Set default options
   */
  function option_definition() {
    $options = parent::option_definition();

    $options['title_field'] = array('default' => NULL);
    $options['targets'] = array('default' => '> *');
    $options['active'] = array('default' => 0);
    $options['collapsible'] = array('default' => TRUE);
    $options['multiple'] = array('default' => FALSE);
    $options['animation'] = array('default' => TRUE);
    $options['transition'] = array('default' => 'ease');
    $options['duration'] = array('default' => 200);

    return $options;
  }

  /**
   * Render the given style.
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    if (isset($form['grouping'])) {
      $title_field_options = array();

      foreach (element_children($form['grouping']) as $key => $value) {
        if (!empty($form['grouping'][$key]['field']['#options']) && is_array($form['grouping'][$key]['field']['#options'])) {
          $title_field_options = array_merge($title_field_options, $form['grouping'][$key]['field']['#options']);
        }
      }

      $form['title_field'] = array(
        '#type' => 'select',
        '#title' => t('Title field'),
        '#options' => $title_field_options,
        '#required' => TRUE,
        '#default_value' => $this->options['title_field'],
        '#description' => t('Select the field to use as the accordian title to create a toggle for the accordion items.'),
      );
      $form['targets'] = array(
        '#type' => 'textfield',
        '#title' => t('CSS selector of the element(s) to toggle.'),
        '#default_value' => $this->options['targets'],
      );
      $form['active'] = array(
        '#type' => 'numberfield',
        '#title' => t('Index of the element to open initially.'),
        '#default_value' => $this->options['active'],
      );
      $form['collapsible'] = array(
        '#type' => 'checkbox',
        '#title' => t('Allow all items to be closed.'),
        '#default_value' => $this->options['collapsible'],
      );
      $form['multiple'] = array(
        '#type' => 'checkbox',
        '#title' => t('Allow multiple open items.'),
        '#default_value' => $this->options['multiple'],
      );
      $form['animation'] = array(
        '#type' => 'checkbox',
        '#title' => t('Reveal item directly (unchecked) or with a transition (checked).'),
        '#default_value' => $this->options['animation'],
      );
      $form['transition'] = array(
        '#type' => 'select',
        '#title' => t('The transition to use when revealing items.'),
        '#required' => TRUE,
        '#default_value' => $this->options['transition'],
        '#description' => t('Uses a keyword from <a href="@transition" target="_blank">easing functions</a>.', array('@transition' => 'https://developer.mozilla.org/en-US/docs/Web/CSS/single-transition-timing-function#Keywords_for_common_timing-functions')),
        '#options' => array(
          'linear' => 'linear',
          'ease' => 'ease',
          'ease-in' => 'ease-in',
          'ease-in-out' => 'ease-in-out',
          'ease-out' => 'ease-out',
          'step-start' => 'step-start',
          'step-end' => 'step-end',
        ),
      );
      $form['duration'] = array(
        '#type' => 'numberfield',
        '#title' => t('Animation duration in milliseconds.'),
        '#default_value' => $this->options['duration'],
      );
    }
  }

}
