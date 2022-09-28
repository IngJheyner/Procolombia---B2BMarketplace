<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * PHP version 7.
 *
 * @category Template_Class
 * @package Template_Class
 * @author Author <author@domain.com>
 * @license https://opensource.org/licenses/MIT MIT License
 * @link http://localhost/
 */
class CpPreRegisterController extends ControllerBase {

  /**
   * Returns a template twig file.
   *
   * @return array
   *
   *   DESCRIPTION
   */
  public function index() {

    return [
      // Your theme hook name.
      '#theme' => 'cp_pre_register_template_hook',
      '#site_key' => $site_key,
    ];
  }

}
