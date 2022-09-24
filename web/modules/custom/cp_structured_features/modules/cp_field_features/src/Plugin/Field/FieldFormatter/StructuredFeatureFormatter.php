<?php

namespace Drupal\cp_field_features\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Unicode;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Path\PathValidatorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Field\FieldItemInterface;

/**
 * Plugin implementation of the 'structured_feature' formatter.
 *
 * @FieldFormatter(
 *   id = "sf_default",
 *   label = @Translation("Default"),
 *   field_types = {
 *     "structured_feature"
 *   }
 * )
 */
class StructuredFeatureFormatter extends FormatterBase {

  /**
   * The path validator service.
   *
   * @var \Drupal\Core\Path\PathValidatorInterface
   */
  protected $pathValidator;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $container->get('path.validator')
    );
  }

  /**
   * Constructs a new Formatter.
   *
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the formatter is associated.
   * @param array $settings
   *   The formatter settings.
   * @param string $label
   *   The formatter label display setting.
   * @param string $view_mode
   *   The view mode.
   * @param array $third_party_settings
   *   Third party settings.
   * @param \Drupal\Core\Path\PathValidatorInterface $path_validator
   *   The path validator service.
   */
  public function __construct($plugin_id, $plugin_definition, FieldDefinitionInterface $field_definition, array $settings, $label, $view_mode, array $third_party_settings, PathValidatorInterface $path_validator) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $label, $view_mode, $third_party_settings);
    $this->pathValidator = $path_validator;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    $ret = parent::defaultSettings();
    return $ret;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = parent::settingsForm($form, $form_state);
    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = [];
    $entity = $items->getEntity();
    $settings = $this->getSettings();

    $sf = [];
    $sf['structure_one'] = [
      'type' => 'product',
      'part' => ['090111', '090112'],
      'properties' => [
        'first' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['one' => 'Uno', 'two' => 'Dos'],
          'label' => 'Etiqueta 1',
          'help' => 'Help 1',
          'maxlength' => NULL,
        ],
        'second' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Etiqueta 2',
          'help' => 'Help 2',
          'maxlength' => NULL,
        ],
        'third' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'textfield',
          'options' => NULL,
          'label' => 'Etiqueta 3',
          'help' => 'Help 3',
          'maxlength' => 100,
        ],
      ],
    ];
    $sf['structure_two'] = [
      'type' => 'product',
      'part' => ['090111', '090112'],
      'properties' => [
        'first' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['one' => 'Uno', 'two' => 'Dos'],
          'label' => 'Etiqueta 1',
          'help' => 'Help',
          'maxlength' => NULL,
        ],
      ],
    ];

    foreach ($items as $delta => $item) {
      $view_value = $this->viewValue($item, $sf['structure_one']);
      $elements[$delta] = $view_value;
    }

    return $element;
  }

  /**
   * Generate the output appropriate for one field item.
   *
   * @param \Drupal\Core\Field\FieldItemInterface $item
   *   One field item.
   * @param array $structure
   *   The structure of configuration.
   *
   * @return array
   *   The textual output generated as a render array.
   */
  protected function viewValue(FieldItemInterface $item, array $structure) {
    $config = $structure['properties'][$item->property];
    // The text value has no text format assigned to it, so the user input
    // should equal the output, including newlines.
    return [
      '#type' => 'inline_template',
      '#template' => '{{ value|nl2br }}',
      '#context' => ['value' => '<span class="property-label">' . $config['label'] . '</span><span>' . $item->value . '</span>'],
    ];
  }

}
