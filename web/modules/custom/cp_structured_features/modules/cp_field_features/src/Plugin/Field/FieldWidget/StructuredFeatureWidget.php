<?php

namespace Drupal\cp_field_features\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;

/**
 * Plugin implementation of the 'structured_feature' widget.
 *
 * @FieldWidget(
 *   id = "sf_default",
 *   label = @Translation("Default"),
 *   field_types = {
 *     "structured_feature"
 *   }
 * )
 */
class StructuredFeatureWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'placeholder_value' => '',
    ] + parent::defaultSettings();
  }

  /**
   * Special handling to create form elements for multiple values.
   *
   * Handles generic features for multiple fields:
   * - number of widgets
   * - AHAH-'add more' button
   * - table display and drag-n-drop value reordering.
   */
  protected function formMultipleElements(FieldItemListInterface $items, array &$form, FormStateInterface $form_state) {
    $sf = [];
    $sf['structure_one'] = [
      'id' => 'structure_one',
      'label' => 'Structure one',
      'uuid' => '....',
      'description' => '...',
      'type' => 'product',
      'references' => ['090111', '090112'],
      'properties' => [
        'first' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['one' => 'Uno', 'two' => 'Dos'],
          'label' => 'Etiqueta 1',
          'help' => 'Help 1',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => NULL,
        ],
        'second' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Etiqueta 2',
          'help' => 'Help 2',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => NULL,
        ],
        'third' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'textfield',
          'options' => NULL,
          'label' => 'Etiqueta 3',
          'help' => 'Help 3',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => NULL,
        ],
      ],
    ];
    $sf['structure_two'] = [
      'id' => 'structure_two',
      'label' => 'Structure two',
      'uuid' => '....',
      'description' => '...',
      'type' => 'service',
      'references' => ['123'],
      'properties' => [
        'first' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['one' => 'Uno', 'two' => 'Dos'],
          'label' => 'Etiqueta 1',
          'help' => 'Help',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => NULL,
        ],
      ],
    ];

    $delta = count($sf['structure_one']['properties']);
    $field_name = $this->fieldDefinition->getName();
    $parents = $form['#parents'];

    // Load the items for form rebuilds from the field state as they might not
    // be in $form_state->getValues() because of validation limitations. Also,
    // they are only passed in as $items when editing existing entities.
    $field_state = static::getWidgetState($parents, $field_name, $form_state);
    if (isset($field_state['items'])) {
      $field_state['items_count'] = $delta;
      for ($i = 0; $i < $delta; $i++) {
        if (!isset($field_state['items'][$i])) {
          $field_state['items'][] = [];
        }
      }
      if (count($field_state['items']) > $delta) {
        for ($i = count($items); $i > $delta; $i--) {
          if (isset($field_state['items'][$i])) {
            unset($field_state['items'][$i]);
          }
        }
      }
      $items->setValue($field_state['items']);
    }

    $cardinality = $this->fieldDefinition->getFieldStorageDefinition()->getCardinality();
    $parents = $form['#parents'];
    $field_state = static::getWidgetState($parents, $field_name, $form_state);
    $max = $delta;
    $is_multiple = TRUE;

    $title = $this->fieldDefinition->getLabel();
    $description = $this->getFilteredDescription();

    $elements = [];

    $delta = 0;
    foreach ($sf['structure_one']['properties'] as $property => $structure) {
      // Add a new empty item if it doesn't exist yet at this delta.
      if (!isset($items[$delta])) {
        $items->appendItem();
      }
      $element = [];
      $element = $this->formSingleElement($items, $delta, $element, $form, $form_state, $structure, $property);

      if ($element) {
        // Input field for the delta (drag-n-drop reordering).
        if ($is_multiple) {
          // We name the element '_weight' to avoid clashing with elements
          // defined by widget.
          unset($element['_weight']);
        }

        $elements[$delta] = $element;
      }
      $delta++;
    }

    if ($elements) {
      $elements += [
        '#theme' => 'cp_field_features_multiple_value_form',
        '#field_name' => $field_name,
        '#cardinality' => $cardinality,
        '#cardinality_multiple' => $this->fieldDefinition->getFieldStorageDefinition()->isMultiple(),
        '#required' => $this->fieldDefinition->isRequired(),
        '#title' => $title,
        '#description' => $description,
        '#max_delta' => $max,
      ];

    }

    return $elements;
  }

  /**
   * Generates the form element for a single copy of the widget.
   */
  protected function formSingleElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state, array $structure = NULL, string $property = NULL) {
    $element += [
      '#field_parents' => $form['#parents'],
      // Only the first widget should be required.
      '#required' => $delta == 0 && $this->fieldDefinition->isRequired(),
      '#delta' => $delta,
      '#weight' => $delta,
    ];

    $element = $this->formElement($items, $delta, $element, $form, $form_state, $structure, $property);

    if ($element) {
      // Allow modules to alter the field widget form element.
      $context = [
        'form' => $form,
        'widget' => $this,
        'items' => $items,
        'delta' => $delta,
        'default' => $this->isDefaultValueWidget($form_state),
      ];
      \Drupal::moduleHandler()->alterDeprecated('Deprecated in drupal:9.2.0 and is removed from drupal:10.0.0. Use hook_field_widget_single_element_form_alter or hook_field_widget_single_element_WIDGET_TYPE_form_alter instead. See https://www.drupal.org/node/3180429.', ['field_widget_form', 'field_widget_' . $this->getPluginId() . '_form'], $element, $form_state, $context);
      \Drupal::moduleHandler()->alter(['field_widget_single_element_form', 'field_widget_single_element_' . $this->getPluginId() . '_form'], $element, $form_state, $context);
    }

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state, array $structure = NULL, string $property = NULL) {
    $element['property'] = [
      '#type' => 'hidden',
      '#default_value' => $property,
    ];
    switch ($structure['type']) {
      case 'select':
      case 'radios':
      case 'checkboxes':
        if ($structure['multiple']) {
          $default_value = !empty($items[$delta]->value) ?
            array_combine(explode(';', $items[$delta]->value), explode(';', $items[$delta]->value))
          :
            array_combine(explode(';', $structure['default_value']), explode(';', $structure['default_value']));
        }
        else {
          $default_value = !empty($items[$delta]->value) ? $items[$delta]->value : $structure['default_value'];
        }
        $element['value'] = [
          '#type' => $structure['type'],
          '#title' => $structure['label'],
          '#default_value' => $default_value,
          '#placeholder' => $structure['placeholder'],
          '#attributes' => ['class' => [$structure['class']]],
          '#required' => $structure['required'],
          '#options' => $structure['options'],
        ];
        break;

      case 'checkbox':
        $default_value = !empty($items[$delta]->value) ? $items[$delta]->value : $structure['default_value'];
        $element['value'] = [
          '#type' => $structure['type'],
          '#title' => $structure['label'],
          '#default_value' => $default_value,
          '#attributes' => ['class' => [$structure['class']]],
          '#required' => $structure['required'],
        ];
        break;

      case 'textfield':
      case 'textarea':
        $default_value = !empty($items[$delta]->value) ? $items[$delta]->value : $structure['default_value'];
        $element['value'] = [
          '#type' => $structure['type'],
          '#title' => $structure['label'],
          '#default_value' => $default_value,
          '#size' => $structure['size'],
          '#placeholder' => $structure['placeholder'],
          '#maxlength' => $structure['maxlength'],
          '#attributes' => ['class' => [$structure['class']]],
          '#required' => $structure['required'],
        ];
        break;
    }

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    return $values;
  }

}
