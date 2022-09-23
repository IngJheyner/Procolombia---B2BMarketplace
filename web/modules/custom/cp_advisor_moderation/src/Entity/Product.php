<?php

namespace Drupal\cp_advisor_moderation\Entity;

use Drupal\node\Entity\Node;
use Drupal\Core\Entity\EntityStorageInterface;

/**
 *
 */
class Product extends Node {

  /**
   *
   */
  public function preSave(EntityStorageInterface $storage) {
    $publishedStatus = $this->get('field_states')->getValue()[0]['value'];
    $this->publishedChange($publishedStatus);

    parent::preSave($storage);
  }

  /**
   *
   */
  public function publishedChange($publishedStatus) {
    if ($publishedStatus == 'approved') {
      $this->setPublished();
    }
    else {
      $this->setUnpublished();
    }
  }

}
