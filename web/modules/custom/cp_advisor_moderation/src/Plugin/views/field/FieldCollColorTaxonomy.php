<?php

namespace Drupal\cp_advisor_moderation\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\NodeType;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\Component\Serialization\Json;

/**
 * Field handler to flag the node type.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("field_collection_file_color")
 */

class FieldCollColorTaxonomy extends FieldPluginBase
{
  /**
   * @{inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * Define the available options
   * @return array
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    $options['field_collection_type'] = array('default' => 'field_de_tu_interes');

    return $options;
  }

  /**
   * @{inheritdoc}
   */
  public function render(ResultRow $values) {
    $fieldcoll = $values->_entity;
    $markup = [
      '#markup' => 'Test',
    ];
    return $markup;
  }

}
