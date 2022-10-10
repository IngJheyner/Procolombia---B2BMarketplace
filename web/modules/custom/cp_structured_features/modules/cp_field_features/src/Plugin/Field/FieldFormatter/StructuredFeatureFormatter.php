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
use Drupal\cp_structured_features\StructuredFeatureInterface;

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
    $ret['show_as_details'] = FALSE;
    return $ret;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = parent::settingsForm($form, $form_state);
    $elements['show_as_details'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show as details container'),
      '#default_value' => $this->getSetting('show_as_details'),
    ];
  return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    if ($this->getSetting('show_as_details')) {
      $summary[] = $this->t('Show as details');
    }
    return $summary;
  }

  /**
   * Check reference uuid.
   */
  protected function checkReferenceFeaturedStructure($uuid) {
    $sfStorage = \Drupal::entityTypeManager()->getStorage('structured_feature');
    $query = $sfStorage->getQuery()
      ->accessCheck(TRUE)
      ->condition('status', TRUE);
    $ids = $query->execute();
    $all = $sfStorage->loadMultiple($ids);
    $ok = FALSE;
    foreach ($all as $sf) {
      if (in_array($uuid, $sf->get('references'))) {
        return $sf;
      }
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    $entity = $items->getEntity();
    $settings = $this->getSettings();

    $termStorage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
    if ($entity->field_product_type->value == 'service') {
      if (!$entity->field_categorization_parent->isEmpty()) {
        $entity->field_categorization_parent->target_id;
        $term = $termStorage->load($entity->field_categorization_parent->target_id);
        $uuid = $term->uuid();
        $sf = $this->checkReferenceFeaturedStructure($uuid);
      }
    }
    else {
      if (!$entity->field_partida_arancelaria_tax->isEmpty()) {
        $entity->field_partida_arancelaria_tax->target_id;
        $term = $termStorage->load($entity->field_partida_arancelaria_tax->target_id);
        $uuid = $term->uuid();
        $sf = $this->checkReferenceFeaturedStructure($uuid);
      }
    }

    if (!$sf) {
      return ['#markup' => $this->t("The structured feature can`t be loaded.")];
    }

    if ($this->getSetting('show_as_details')) {
      $elements[0] = [
        '#type' => 'details',
        '#open' => FALSE,
        '#collapsible' => TRUE,
        '#title' => $this->t('View more'),
      ];
      foreach ($items as $delta => $item) {
        $view_value = $this->viewValue($item, $sf);
        $elements[0][] = $view_value;
        $elements[0]['show_less'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Show less'),
          '#attributes' => [
            'class' => ['sf-structure-formatter-show-less'],
            'href' => '#',
          ],
          '#weight' => 99,
          '#attached' => ['library' => ['cp_structured_features/sf_structure_formatter']],
        ];
      }
    }
    else {
      foreach ($items as $delta => $item) {
        $view_value = $this->viewValue($item, $sf);
        $elements[$delta] = $view_value;
      }
    }


    return $elements;
  }

  /**
   * Generate the output appropriate for one field item.
   *
   * @param \Drupal\Core\Field\FieldItemInterface $item
   *   One field item.
   * @param Drupal\cp_structured_features\StructuredFeatureInterface $structure
   *   The structure of configuration.
   *
   * @return array
   *   The textual output generated as a render array.
   */
  protected function viewValue(FieldItemInterface $item, StructuredFeatureInterface $structure) {
    $config = $structure->get('properties')[$item->property];
    // The text value has no text format assigned to it, so the user input
    // should equal the output, including newlines.
    return [
      '#markup' => '<div class="property-wrapper"><span class="property-label">' . $config['label'] . ':</span> <span>' . $item->value . '</span></div>',
    ];
  }

}
