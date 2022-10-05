<?php

namespace Drupal\cp_contact\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * An cp_chat controller.
 */
class CpContactController extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    return [
      // Your theme hook name.
      '#theme' => 'cp_contact_template_hook',
    ];
  }

}
