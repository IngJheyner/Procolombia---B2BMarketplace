<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\RedirectResponse;
/**
 * An cp_register controller.
 */
class CpRegisterBuyerController extends ControllerBase
{

    /**
     * Returns a template twig file.
     */
    public function index()
    {
        //List of terms to set a select field deparments.
        $vid = 'categorization';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_categorization=[];
        foreach ($terms as $term) {
            array_push($tree_categorization, [
                    "ID" => $term->tid,
                    "Name" => $term->name
                ]
            );
        }
         //List of terms to set a select field modelos_de_negocio.
         $vid = 'modelos_de_negocio';
         //load taxonomy_term storage.
         $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
         $tree_business_model=[];
         foreach ($terms as $term) {
             array_push($tree_business_model, [
                     "ID" => $term->tid,
                     "Name" => $term->name
                 ]
             );
         }

         //List of terms to set a select field modelos_de_negocio.
         $vid = 'countries';
         //load taxonomy_term storage.
         $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
         $tree_countries=[];
         foreach ($terms as $term) {
             array_push($tree_countries, [
                     "ID" => $term->tid,
                     "Name" => $term->name
                 ]
             );
         }

         //get advisor user with role asesor_internacional.
        $query = \Drupal::entityQuery('user');
        $query->condition('roles', 'asesor_internacional');
        $uids = $query->execute();
        $users = \Drupal\user\Entity\User::loadMultiple($uids);
        $tree_advisor=[];
        foreach ($users as $user) {
            array_push($tree_advisor, [
                    "ID" => $user->id(),
                    "Name" => $user->get('field_company_contact_name')->value . ' ' . $user->get('field_company_contact_lastname')->value
                ]
            );
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
                    return new RedirectResponse("/en/register/user/buyer", 301);
                }else{
                    return new RedirectResponse("/es/registro/usuario/comprador", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/register/user/buyer'){
                        return new RedirectResponse("/en/register/user/buyer", 301);
                    }
                }else{
                    if($path != '/registro/usuario/comprador'){
                        return new RedirectResponse("/es/registro/usuario/comprador", 301);
                    }
                }
            }
        }

        return [
            // Your theme hook name.
            '#theme' => 'cp_register_buyer_template_hook',
            '#tree_categorization' => $tree_categorization,
            '#tree_business_model' => $tree_business_model,
            '#tree_countries' => $tree_countries,
            '#tree_advisor' => $tree_advisor,
        ];
    }

    /**
     * get subcategories.
     */
    public function getSubcategories(Request $request)
    {
        $data = $request->request->all();
        $vid = 'categorization';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, $data['cat_interest'], 1, false);
        $tree_sub_categorization=[];
        foreach ($terms as $term) {
            array_push($tree_sub_categorization, [
                    "ID" => $term->tid,
                    "Name" => $term->name
                ]
            );
        }
        return new JsonResponse(['status' => 'success', 'subcategories' => $tree_sub_categorization]);
    }
     /**
     * return uid of user by nit with search by Username
     */
    public function getUid($email)
    {
        $query = \Drupal::entityQuery('user')
            ->condition('name', $email)
            ->execute();
        if(!empty($query)){
            $user = \Drupal\user\Entity\User::load(reset($query));
            $uid = $user->id();
            return $uid;
        }
        else{
            return 0;
        }
    }

    /**
     * save data dataForm2
     */
    public function createStep2(Request $request)
    {
        $data = $request->request->all();
        $uid = $this->getUid($data['email']);
        if($uid){
            $user = \Drupal\user\Entity\User::load($uid);
            $user->set("field_step", 2);
            $user->set("field_company_contact_position", $data['position']);
            $user->set("field_company_web_site", $data['web_site']);
            //$user->set("field_company_city", $data['city']);
            $user->set("field_country", $data['country']);
            $user->set('field_company_adviser', $data['principal_advisor']);
            $user->save();
            return new JsonResponse(['status' => 'ok', 'message' => json_encode($data)]);
        }else{
            return new JsonResponse(['status' => 'error']);
        }
    }

    /**
     * save data dataForm3
     */
    public function createStep3(Request $request)
    {
        $data = $request->request->all();
        $uid = $this->getUid($data['email']);
        if($uid){
            $user = \Drupal\user\Entity\User::load($uid);
            $user->set("field_step", 3);
            $user->set("field_cat_interest_1", $data['cat_interest_1']);
            $user->set("field_subcat_interest_1", $data['subcat_interest_1']);
            $model_arr = explode(',', $data['company_model']);
            $user->set('field_company_model', $model_arr);
            $user->save();
            return new JsonResponse(['status' => 'ok', 'message' => json_encode($data)]);
        }else{
            return new JsonResponse(['status' => 'error']);
        }
    }

    /**
     * save data dataForm4
     */
    public function createStep4(Request $request)
    {
        $data = $request->request->all();
        $uid = $this->getUid($data['email']);
        if($uid){
            $user = \Drupal\user\Entity\User::load($uid);
            $user->set("field_step", 4);
            $user->set("field_cat_interest_2", $data['cat_interest_2']);
            $user->set("field_subcat_interest_2", $data['subcat_interest_2']);
            $model_arr = explode(',', $data['company_model_2']);
            $user->set('field_company_model_2', $model_arr);
            $user->save();
            return new JsonResponse(['status' => 'ok', 'message' => json_encode($data)]);
        }else{
            return new JsonResponse(['status' => 'error']);
        }
    }

    /**
     * save data dataForm5
     */
    public function createStep5(Request $request)
    {
        $data = $request->request->all();
        $uid = $this->getUid($data['email']);
        if($uid){
            $user = \Drupal\user\Entity\User::load($uid);
            $user->set("field_step", 5);
            $user->set("field_cat_interest_3", $data['cat_interest_3']);
            $user->set("field_subcat_interest_3", $data['subcat_interest_3']);
            $model_arr = explode(',', $data['company_model_3']);
            $user->set('field_company_model_3', $model_arr);
            $user->save();
            return new JsonResponse(['status' => 'ok', 'message' => json_encode($data)]);
        }else{
            return new JsonResponse(['status' => 'error']);
        }
    }
 
    /**
     * get data user if nit exist and return in json format
     */
    public function getDataUser(Request $request)
    {
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email_buyer']));
        //check if user exist and is not deleted
        //ceck if user is not deleted in drupal

        $data_user = [
            'step' => $user->get('field_step')->value,
            'name' => $user->get('name')->value,
            'email' => $user->get('mail')->value,
            'position' => $user->get('field_company_contact_position')->value,
            'web_site' => $user->get('field_company_web_site')->uri,
            'city' => $user->get('field_company_city')->value,
            'country' => $user->get('field_country')->value,
            'cat_interest_1' => $user->get('field_cat_interest_1')->target_id,
            'subcat_interest_1' => $user->get('field_subcat_interest_1')->target_id,
            'company_model' => $user->get('field_company_model')->target_id,
            'cat_interest_2' => $user->get('field_cat_interest_2')->target_id,
            'subcat_interest_2' => $user->get('field_subcat_interest_2')->target_id,
            'company_model_2' => $user->get('field_company_model_2')->target_id,
            'cat_interest_3' => $user->get('field_cat_interest_3')->target_id,
            'subcat_interest_3' => $user->get('field_subcat_interest_3')->target_id,
            'company_model_3' => $user->get('field_company_model_3')->target_id,
        ];

        return new JsonResponse(['status' => 200, 'data' => $data_user]);
    
    }

    /**
     * delete user by nit
     */
    public function deleteUser(Request $request)
    {
        //check if user exist and is active and is active delete user
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
        if($user->isActive()){
            $user->delete();
        }
        return new JsonResponse(['status' => 200]);
    }
}
