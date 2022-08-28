<?php

/**
 * @file
 * Field module functionality for the File module.
 */

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldFilteredMarkup;
use Drupal\Core\Render\Element;

/**
 * Prepares variables for multi file form widget templates.
 *
 * Default template: file-widget-multiple.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - element: A render element representing the widgets.
 */
function template_preprocess_cp_core_file_widget_multiple(&$variables) {
  $element = $variables['element'];

  // Special ID and classes for draggable tables.
  $weight_class = $element['#id'] . '-weight';

  // Build up a table of applicable fields.
  $headers = [];
  $headers[] = t('File information');
  if ($element['#display_field']) {
    $headers[] = [
      'data' => t('Display'),
      'class' => ['checkbox'],
    ];
  }
  $headers[] = t('Weight');
  $headers[] = t('Operations');

  // Get our list of widgets in order (needed when the form comes back after
  // preview or failed validation).
  $widgets = [];
  foreach (Element::children($element) as $key) {
    unset($element[$key]['_weight']);
    $widgets[] = &$element[$key];

  }
  usort($widgets, '_field_multiple_value_form_sort_helper');

  $variables['element'] = $widgets;
}
