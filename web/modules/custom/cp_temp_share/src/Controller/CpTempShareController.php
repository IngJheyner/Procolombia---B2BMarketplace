<?php

namespace Drupal\cp_temp_share\Controller;

use Drupal\Core\Controller\ControllerBase;

class CpTempShareController extends ControllerBase {

    /**
   * Returns a template twig file.
   */
  public function index() {
    // Get site key of module reCaptcha.
    return [
      // Your theme hook name.
      '#theme' => 'cp_temp_share_template_hook',
    ];
  }
}