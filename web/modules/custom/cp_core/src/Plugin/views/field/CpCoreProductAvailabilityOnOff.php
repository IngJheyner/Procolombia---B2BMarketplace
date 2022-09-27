<?php

namespace Drupal\cp_core\Plugin\views\field;

use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;
use Drupal\node\NodeInterface;
use Drupal\Core\Url;

/**
 * Field handler to flag the node type.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("cp_core_product_availability_on_off")
 */
class CpCoreProductAvailabilityOnOff extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $status = '';
    if ($values->_entity && $values->_entity instanceof NodeInterface) {
      $node = $values->_entity;
      $status = $node->field_pr_product_availability->value ? 'on' : 'off';
      $url = Url::fromRoute(
        'cp_core.product_toggle_availability',
        ['node' => $node->id()]
      );
      $link = [
        '#type' => 'link',
        '#title' => $status,
        '#url' => $url,
        '#attributes' => [
          'class' => [
            $status,
            'use-ajax',
            'toggle',
            'product-availability-toggle-' . $node->id()
          ],
        ],
      ];
      return $link;
    }
    else {
      return '';
    }
  }

}
