<?php

namespace Drupal\cp_home\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * An cp_company_col controller.
 */
class CpHomeController extends ControllerBase {
  
  /**
   * Returns a template twig file.
   */
  public function index() {
    // $uid = \Drupal::currentUser();
    // $user = \Drupal\user\Entity\User::load($uid->id());
    // // Check if user is not deleted in drupal.
    // $data_user = [];

    return [
      // Your theme hook name.
      '#theme' => 'cp_home_template_hook',
      // The variables to pass to the theme template file.
    //   '#data' => $data_user,
    ];
  }
}
