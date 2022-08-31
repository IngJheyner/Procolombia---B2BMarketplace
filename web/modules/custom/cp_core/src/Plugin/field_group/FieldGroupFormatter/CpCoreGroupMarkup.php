<?php

namespace Drupal\cp_core\Plugin\field_group\FieldGroupFormatter;

use Drupal\Component\Utility\Html;
use Drupal\field_group\FieldGroupFormatterBase;

/**
 * Class of Markup element.
 *
 * @FieldGroupFormatter(
 *   id = "cp_core_group_markup",
 *   label = @Translation("CP Core: Markup"),
 *   description = @Translation("Add a markup element"),
 *   supported_contexts = {
 *     "form",
 *     "view"
 *   }
 * )
 */
class CpCoreGroupMarkup extends FieldGroupFormatterBase {

  /**
   * {@inheritdoc}
   */
  public function process(&$element, $processed_object) {
    $element += [
      '#type' => 'field_group_html_element',
      '#wrapper_element' => 'div',
      // This formatter started out as #markup, but has since evolved
      // to use text formats.
      'markup' => [
        '#type' => 'processed_text',
        '#text' => $this->getSetting('markup')['value'],
        '#format' => $this->getSetting('markup')['format'],
      ],
      '#show_empty_fields' => $this->getSetting('show_empty_fields'),
    ];

    if ($this->getSetting('id')) {
      $element['#id'] = Html::getUniqueId($this->getSetting('id'));
    }

    $classes = $this->getClasses();
    if (!empty($classes)) {
      $element += [
        '#attributes' => ['class' => $classes],
      ];
    }

  }

  /**
   * {@inheritdoc}
   */
  public function preRender(&$element, $rendering_object) {
    parent::preRender($element, $rendering_object);
    $this->process($element, $rendering_object);
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm() {
    $form = parent::settingsForm();

    $form['markup'] = [
      '#title' => $this->t('Markup'),
      '#type' => 'text_format',
      '#default_value' => $this->getSetting('markup')['value'],
      '#format' => $this->getSetting('markup')['format'],
      '#weight' => -4,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultContextSettings($context) {
    $defaults = [
      'markup' => ['value' => '', 'format' => NULL],
      'show_empty_fields' => TRUE,
      'classes' => 'form-wrapper',
    ] + parent::defaultSettings($context);

    return $defaults;
  }

}
