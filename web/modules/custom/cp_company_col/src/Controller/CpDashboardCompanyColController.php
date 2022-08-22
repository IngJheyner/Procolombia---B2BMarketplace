<?php

namespace Drupal\cp_company_col\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_company_col controller.
 */
class CpDashboardCompanyColController extends ControllerBase
{
    /**
     * Returns a template twig file.
     */
    public function index()
    {
        return [
            // Your theme hook name.
            '#theme' => 'cp_dashboard_company_col_template_hook',
        ];
    }

}