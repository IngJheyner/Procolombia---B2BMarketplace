<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_register controller.
 */
class CpPreRegisterController extends ControllerBase
{

    /**
     * Returns a template twig file.
     */
    public function index()
    {
        return [
            // Your theme hook name.
            '#theme' => 'cp_pre_register_template_hook',
        ];
    }
}
