<?php

namespace Drupal\cp_company_international\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * An cp_company_international controller.
 */
class CpDashboardCompanyInternationalController extends ControllerBase
{
    /**
     * Returns a template twig file.
     */
    public function index()
    {
        $uid = \Drupal::currentUser();
        $user = \Drupal\user\Entity\User::load($uid->id());
        //ceck if user is not deleted in drupal
        $data_user=[];
        if($user->isActive()){
            $data_user = [
                'name' => $user->get('field_company_contact_name')->value,
                'lastname' => $user->get('field_company_contact_lastname')->value,
                'business_name' => $user->get('field_company_name')->value,
                'email' => $user->get('mail')->value,
            ];
        }

        //redirect if $_SESSION['language'] is not the current path
        $language = $_COOKIE['language'];
        //get actual language
        $actual_language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        //check if query params has token
        $token = \Drupal::request()->query->get('token');
        if(isset($language) && !isset($token)){
            if ($language != $actual_language) {
                if($language == 'en'){
                    return new RedirectResponse("/en/dashboard/international/user", 301);
                }else{
                    return new RedirectResponse("/es/tablero/internacional/usuario", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/dashboard/international/user'){
                        return new RedirectResponse("/en/dashboard/international/user", 301);
                    }
                }else{
                    if($path != '/tablero/internacional/usuario'){
                        return new RedirectResponse("/es/tablero/internacional/usuario", 301);
                    }
                }
            }
        }

        return [
            // Your theme hook name.
            '#theme' => 'cp_dashboard_company_international_template_hook',
            // The variables to pass to the theme template file.
            '#data' => $data_user,
        ];
    }

    /**
     * Edit email and passord user
     */
    public function edit_email_password(Request $request)
    {
        $data = $request->request->all();
        $uid = \Drupal::currentUser();
        $user = \Drupal\user\Entity\User::load($uid->id());
        $user->set('field_company_contact_email', $data['contact_email']);
        $user->setPassword($data['password']);
        $user->save();
        return new JsonResponse(['status' =>  200]);
    }

}
