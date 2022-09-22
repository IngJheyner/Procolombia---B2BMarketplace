<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

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

        //redirect if $_SESSION['language'] is not the current path
        $language = $_COOKIE['language'];
        //get actual language
        $actual_language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        //check if query params has token
        $token = \Drupal::request()->query->get('token');
        if(isset($language) && !isset($token)){
            if ($language != $actual_language) {
                if($language == 'en'){
                    return new RedirectResponse("/en/pre-register", 301);
                }else{
                    return new RedirectResponse("/es/pre-registro", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/pre-register'){
                        return new RedirectResponse("/en/pre-register", 301);
                    }
                }else{
                    if($path != '/pre-registro'){
                        return new RedirectResponse("/es/pre-registro", 301);
                    }
                }
            }
        }
        return [
            // Your theme hook name.
            '#theme' => 'cp_pre_register_template_hook',
            '#site_key' => $site_key,
        ];
    }
}
