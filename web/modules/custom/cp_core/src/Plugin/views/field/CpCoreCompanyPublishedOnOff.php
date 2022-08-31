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
 * @ViewsField("cp_core_company_published_on_off")
 */
class CpCoreCompanyPublishedOnOff extends FieldPluginBase {

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
      $status = $node->field_com_published->value ? 'on' : 'off';
      $url = Url::fromRoute(
        'cp_core.company_toggle_published',
        ['node' => $node->id()]
      );
      $link = [
        '#type' => 'link',
        '#title' => $status == 'on' ? $this->t('Yes') : $this->t('No'),
        '#url' => $url,
        '#attributes' => [
          'class' => [$status, 'use-ajax', 'toggle'],
          'id' => 'company-published-toggle-' . $node->id(),
        ],
      ];
      return $link;
    }
    else {
      return '';
    }
  }

}
