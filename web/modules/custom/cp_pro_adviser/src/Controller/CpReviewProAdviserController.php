<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_pro_adviser controller.
 */
class CpReviewProAdviserController extends ControllerBase
{
    /**
     * Returns a template twig file.
     */
    public function index()
    {
        return [
            // Your theme hook name.
            '#theme' => 'cp_review_pro_adviser_template_hook',
        ];
    }
}