<?php

namespace Drupal\cp_company_col\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;


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
        $uid = \Drupal::currentUser();
        $user = \Drupal\user\Entity\User::load($uid->id());
        //ceck if user is not deleted in drupal
        $data_user=[];
        if($user->isActive()){
            $data_user = [
                'step' => $user->get('field_step')->value,
                //get username
                'username' => $user->get('name')->value,
                //get path and name of field_company_logo
                
                'company_logo' => file_create_url($user->get('field_company_logo')->entity->getFileUri()),
                //get name of file
                'company_logo_name' => $user->get('field_company_logo')->entity->getFilename(),
                //get size of file
                'company_logo_size' => $user->get('field_company_logo')->entity->getSize(),
                'business_name' => $user->get('field_company_name')->value,
                //get url field website and video youtube
                'website' => $user->get('field_company_web_site')->uri,
                'video' => $user->get('field_company_video_youtube')->uri,
                'description_spanish' => $user->get('field_company_info')->value,
                'description_english' => $user->get('field_company_info_english')->value,
                'production_chain' => $user->get('field_productive_chain')->target_id,
                'principal_code_ciiu' => $user->get('field_ciiu_principal')->value,
                'secondary_code_ciiu' => $user->get('field_ciiu_secundario')->value,
                'third_code_ciiu' => $user->get('field_ciiu_terciario')->value,
                'departament' => $user->get('field_company_deparment')->target_id,
                'ciudad' => $user->get('field_company_city')->target_id,
                'modelo_de_negocio' => $user->get('field_company_model')->target_id,
                'certification_business' => $user->get('field_company_certification')->target_id,
                'contact_name' => $user->get('field_company_contact_name')->value,
                'contact_lastname' => $user->get('field_company_contact_lastname')->value,
                'contact_email' => $user->get('field_company_contact_email')->value,
                'contact_position' => $user->get('field_company_contact_position')->value,
                'contact_phone' => $user->get('field_company_contact_phone')->value,
                'contact_cellphone' => $user->get('field_company_contact_cell_phone')->value,
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
                    return new RedirectResponse("/en/dashboard/col/user", 301);
                }else{
                    return new RedirectResponse("/es/tablero/col/usuario", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/dashboard/col/user'){
                        return new RedirectResponse("/en/dashboard/col/user", 301);
                    }
                }else{
                    if($path != '/tablero/col/usuario'){
                        return new RedirectResponse("/es/tablero/col/usuario", 301);
                    }
                }
            }
        }

        return [
            // Your theme hook name.
            '#theme' => 'cp_dashboard_company_col_template_hook',
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
