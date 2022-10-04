<?php

namespace Drupal\cp_advisor_moderation\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\Request;

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

  public function exportView(Request $request = NULL) {
    $params = $request->query->all();
    $path = $params['route'] ?? FALSE;
    $context = $params;
    if (isset($context['route'])) unset($context['route']);
    return [
      '#theme' => 'cp_advisor_moderation_export',
      '#url' => [
        '#type' => 'link',
        '#title' => $this->t('EXCEL'),
        '#url' => $path ? Url::fromRoute($path, $context) : FALSE,
      ],
      '#description' => $this->t('Choose the format in which you want to download the file locally.'),
    ];
  }

}
