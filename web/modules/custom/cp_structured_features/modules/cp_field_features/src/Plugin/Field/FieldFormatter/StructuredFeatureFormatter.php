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
    $elements = [];
    $entity = $items->getEntity();
    $settings = $this->getSettings();

    $sf = [];
    $sf['structure_one'] = [
      'id' => 'structure_one',
      'label' => 'Structure one',
      'uuid' => '....',
      'description' => '...',
      'type' => 'product',
      'references' => ['090111', '090112'],
      'properties' => [
        'tipo_de_cafe' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['one' => 'Uno', 'two' => 'Dos'],
          'label' => 'Tipo de Café',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
          'status' => TRUE,
        ],
        'organico' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Orgánico',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'clasificacion_cafe_verde' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Clasificación - Café Verde',
          'help' => 'Si su producto NO es Café Verde seleccione No Aplica.',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'cafe_especial' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Café Especial',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'tostion' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Tostión',
          'help' => 'Si su producto NO es Café Soluble / Instantáneo seleccione No Aplica.',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'presentacion_cafe_soluble' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Presentación Café Soluble',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'origen' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Origen',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'tipo_de_empaque' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Tipo de empaque',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'temporada_de_produccion' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Temporada de producción',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'left',
        ],
        'descafeinado' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Descafeinado',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'variedad' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Variedad',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'clasificacion_cafe_convencional' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Clasificación - Café Convencional',
          'help' => 'Si su producto NO es Café Convencional seleccione No Aplica.',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'presentacion_cafe_tostado' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Presentación - Café tostado',
          'help' => 'Si su producto NO es Café Tostado seleccione No Aplica.',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'proceso' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Proceso',
          'help' => 'Si su producto NO es Café Soluble / Instantáneo seleccione No Aplica.',
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'capacidad_de_produccion_anual' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'textfield',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Capacidad de producción anual',
          'help' => NULL,
          'maxlength' => 20,
          'size' => 60,
          'placeholder' => 'Capacidad de producción',
          'class' => 'right',
        ],
        'capacidad_de_produccion_anual_medida' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'textfield',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Capacidad de produccion anual (medida)',
          'help' => NULL,
          'maxlength' => 20,
          'size' => 60,
          'placeholder' => '# Unidad de medida',
          'class' => 'right',
        ],
        'canal_de_venta' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Canal de venta',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'modelo_de_negocio' => [
          'multiple' => FALSE,
          'required' => TRUE,
          'type' => 'select',
          'options' => ['third' => 'Tres', 'four' => 'Cuatro'],
          'label' => 'Modelo de negocio',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => NULL,
          'class' => 'right',
        ],
        'narrativa' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'textarea',
          'options' => NULL,
          'label' => 'Narrativa',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => 'Desde el año "X", en la empresa "Y" decidimos incorporar un enfoque de equidad de género/sostenibilidad/postconflicto como un pilar fundamental en la estrategia de generación de valor para la comunidad en el sector cafetero. Este enfoque está dirigido a "Z" familias/mujeres, que representan aproximadamente el X% de la caficultura en Colombia, y gracias a su implementación estamos generando un impacto positivo para la comunidad en la región "ZZ".',
          'class' => 'full',
          'language' => NULL,
        ],
        'narrativa_en' => [
          'multiple' => TRUE,
          'required' => TRUE,
          'type' => 'textarea',
          'options' => NULL,
          'label' => 'Narrativa',
          'help' => NULL,
          'maxlength' => NULL,
          'size' => NULL,
          'placeholder' => 'Desde el año "X", en la empresa "Y" decidimos incorporar un enfoque de equidad de género/sostenibilidad/postconflicto como un pilar fundamental en la estrategia de generación de valor para la comunidad en el sector cafetero. Este enfoque está dirigido a "Z" familias/mujeres, que representan aproximadamente el X% de la caficultura en Colombia, y gracias a su implementación estamos generando un impacto positivo para la comunidad en la región "ZZ".',
          'class' => 'full',
          'language' => 'en',
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

    foreach ($items as $delta => $item) {
      $view_value = $this->viewValue($item, $sf['structure_one']);
      $elements[$delta] = $view_value;
    }

    return $elements;
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
      '#markup' => '<span class="property-label">' . $config['label'] . ':</span> <span>' . $item->value . '</span>',
    ];
  }

}
