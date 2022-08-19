<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_register controller.
 */
class CpCheckNitController extends ControllerBase
{

    /**
     * Returns a template twig file.
     */
    public function index()
    {
        return [
            // Your theme hook name.
            '#theme' => 'cp_check_nit_template_hook',
        ];
    }

    //Check if nit is already registered
    public function checkNit(Request $request)
    {
        \Drupal::moduleHandler()->loadInclude('cp_register', 'inc', 'sf/servicios.sf');
        $bool_cp_in_neo = FALSE;
        $nit = $request->get('nit');
        /*$empresas = ConsultaNIT($nit);
        if (!empty($empresas)) {
            $comp_neo = reset($empresas);
            if (isset($comp_neo['nit'])) {
                $bool_cp_in_neo = TRUE;
            }
        }*/
        $bool_cp_in_neo = TRUE;
        //return if cp is in neo
        return new JsonResponse($bool_cp_in_neo);
    }

}
