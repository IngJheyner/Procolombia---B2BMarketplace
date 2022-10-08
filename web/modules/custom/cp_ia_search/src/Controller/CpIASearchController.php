<?php

namespace Drupal\cp_ia_search\Controller;

use Drupal\Core\Controller\ControllerBase;

class CpIASearchController extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    // Get site key of module reCaptcha.
    return [
      // Your theme hook name.
      '#theme' => 'cp_ia_search_template_hook',
    ];
  }
}