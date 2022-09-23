<?php

namespace Drupal\cp_advisor_moderation\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Returns responses for cp_advisor moderation routes.
 */
class CpAdvisorModerationController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function build() {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('It works!'),
    ];

    return $build;
  }

}
