<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

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
        //get site key of module reCaptcha
        $site_key = \Drupal::config('recaptcha.settings')->get('site_key');

        //redirect if $_SESSION['language'] is not the current path
        $language = $_COOKIE['language'];
        //get actual language
        $actual_language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        //check if query params has token
        $token = \Drupal::request()->query->get('token');
        if(isset($language) && !isset($token)){
            if ($language != $actual_language) {
                if($language == 'en'){
                    return new RedirectResponse("/en/verification/user", 301);
                }else{
                    return new RedirectResponse("/es/verificacion/usuario", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/verification/user'){
                        return new RedirectResponse("/en/verification/user", 301);
                    }
                }else{
                    if($path != '/verificacion/usuario'){
                        return new RedirectResponse("/es/verificacion/usuario", 301);
                    }
                }
            }
        }

        return [
            // Your theme hook name.
            '#theme' => 'cp_check_nit_template_hook',
            '#site_key' => $site_key,
        ];
    }

    /**
     * return uid of user by nit with search by Username
     */
    public function getUid($nit)
    {
        $query = \Drupal::entityQuery('user')
            ->condition('name', $nit)
            ->execute();
        if(!empty($query)){
            $user = \Drupal\user\Entity\User::load(reset($query));
            $uid = $user->id();
            return $uid;
        }
        else{
            return null;
        }
    }

    public function getUidByEmail($email)
    {
        $query = \Drupal::entityQuery('user')
            ->condition('mail', $email)
            ->execute();
        if(!empty($query)){
            $user = \Drupal\user\Entity\User::load(reset($query));
            $uid = $user->id();
            return $uid;
        }
        else{
            return null;
        }
    }

    //Check if nit is already registered
    public function checkNit(Request $request)
    {
        \Drupal::moduleHandler()->loadInclude('cp_register', 'inc', 'sf/servicios.sf');
        $bool_cp_in_neo = FALSE;
        $data = $request->request->all();
        $user = $this->getUid($data['nit']);
        //Check if user is already registered
        $user_email = $this->getUidByEmail($data['email']);
        if(isset($user)){
            //if step is equal 3 return true
            $userData = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
            $step = $userData->get('field_step')->value;
            if($step == 3){
                return new JsonResponse(['user' => true]);
            }
        }
        //Check if user is already registered by email
        if(isset($user_email)){
            return new JsonResponse(['user' => true]);
        }

        $empresas = ConsultaNIT($data['nit']);
        if (!empty($empresas)) {
            $comp_neo = reset($empresas);
            if (isset($comp_neo['nit'])) {
                $bool_cp_in_neo = TRUE;
            }
        }
        //return if cp is in neo
        if($bool_cp_in_neo){
            return new JsonResponse(['success' => true, 'data' => $empresas]);
        }else{
            return new JsonResponse(['neo' => true]);
        }

    }

}
