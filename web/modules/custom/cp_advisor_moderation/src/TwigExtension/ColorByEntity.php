<?php
namespace Drupal\cp_advisor_moderation\TwigExtension;

use Drupal\taxonomy\TermInterface;
use Drupal\views\ResultRow;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ColorByEntity extends AbstractExtension {

  /**
   * {@inheritdoc}
   */
  public function getFunctions() {
    return [
      new TwigFunction('color_entity', [$this, 'getColorByEntity']),
    ];
  }

  public function getColorByEntity(ResultRow $values) {
    $color = FALSE;
    $fieldcoll = $values->_relationship_entities;

    if (isset($fieldcoll['field_account_status']) && ($fieldcoll['field_account_status'] instanceof TermInterface)) {
      /* @var $term TermInterface*/
      $term = $fieldcoll['field_account_status'];
      if ($term->hasField('field_status_color')) {
        $fieldColor = $term->get('field_status_color');
        if (!$fieldColor->isEmpty()) {
          $color = $fieldColor->getValue()[0]['color'] ?? '#FFFFF';
        }
      }
    }
    return $color;
  }
}
