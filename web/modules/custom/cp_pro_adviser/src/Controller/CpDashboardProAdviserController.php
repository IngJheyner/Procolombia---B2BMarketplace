<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * An cp_pro_adviser controller.
 */
class CpDashboardProAdviserController extends ControllerBase
{
    /**
     * Returns a template twig file.
     */
    public function index()
    {
        $vid = 'categories_flow_semaphore';
        //load taxonomy_term storage.
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_production_chain=[];
        foreach ($terms as $term) {
            array_push($tree_production_chain, [
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

        $vid = 'locations';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_deparment=[];
        foreach ($terms as $term) {
            array_push($tree_deparment, [
                    "ID" => $term->tid,
                    "Name" => $term->name
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
                    return new RedirectResponse("/en/dashboard/adviser/user/col", 301);
                }else{
                    return new RedirectResponse("/es/tablero/adviser/usuario/col", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/dashboard/adviser/user/col'){
                        return new RedirectResponse("/en/dashboard/adviser/user/col", 301);
                    }
                }else{
                    if($path != '/tablero/adviser/usuario/col'){
                        return new RedirectResponse("/es/tablero/adviser/usuario/col", 301);
                    }
                }
            }
        }

        return [
            // Your theme hook name.
            '#theme' => 'cp_dashboard_pro_adviser_template_hook',
            '#tree_production_chain' => $tree_production_chain,
            '#tree_business_model' => $tree_business_model,
            '#tree_categorization' => $tree_categorization,
            '#tree_deparment' => $tree_deparment,
        ];
    }

    public function indexInternational()
    {
        $vid = 'categories_flow_semaphore';
        //load taxonomy_term storage.
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_production_chain=[];
        foreach ($terms as $term) {
            array_push($tree_production_chain, [
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

        $vid = 'locations';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_deparment=[];
        foreach ($terms as $term) {
            array_push($tree_deparment, [
                    "ID" => $term->tid,
                    "Name" => $term->name
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
                    return new RedirectResponse("/en/dashboard/adviser/user/international", 301);
                }else{
                    return new RedirectResponse("/es/tablero/adviser/usuario/international", 301);
                }
            }else{
                //get path of url
                $path = \Drupal::service('path.current')->getPath();
                if($language == 'en'){
                    if($path != '/dashboard/adviser/user/international'){
                        return new RedirectResponse("/en/dashboard/adviser/user/international", 301);
                    }
                }else{
                    if($path != '/tablero/adviser/usuario/international'){
                        return new RedirectResponse("/es/tablero/adviser/usuario/international", 301);
                    }
                }
            }
        }
        return [
            // Your theme hook name.
            '#theme' => 'cp_dashboard_pro_adviser_international_template_hook',
            '#tree_production_chain' => $tree_production_chain,
            '#tree_business_model' => $tree_business_model,
            '#tree_categorization' => $tree_categorization,
            '#tree_deparment' => $tree_deparment,
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

    /*
    * Function to return all users that have role exportador are active
    */
    public function get_all_exportador_by_page(Request $request)
    {
        //get all user with role exportador and active and return total
        try
        {
            $start = $request->request->get('start');
            $limit = $request->request->get('length');
            //search
            $search = $request->request->get('search');
            //get order[column] and order[dir]
            $order = $request->request->get('order');
            //get column
            $column = $order[0]['column'];
            //get dir
            $dir = $order[0]['dir'];

            $query = \Drupal::entityQuery('user');
            $query->condition('roles', 'exportador', 'IN');
            //detect filters if value is not empty
            //filter company_name
            $company_name = $request->request->get('company_name');
            if (!empty($company_name)) {
                $query->condition('field_company_name', $company_name, 'CONTAINS');
            }
            //filter nit
            $nit = $request->request->get('nit');
            if (!empty($nit)) {
                $query->condition('name', $nit, 'CONTAINS');
            }
            //filter status
            $status = $request->request->get('status');
            if (!empty($status)) {
                $query->condition('status', $status, 'CONTAINS');
            }
            //filter deparment
            $deparment = $request->request->get('deparment');
            if (!empty($deparment)) {
                $query->condition('field_company_deparment', $deparment, 'CONTAINS');
            }
            //filter production_chain
            $production_chain = $request->request->get('productive_chain');
            if (!empty($production_chain)) {
                $query->condition('field_productive_chain', $production_chain, 'CONTAINS');
            }
            //filter published
            $published = $request->request->get('published');
            if (!empty($published)) {
                //$query->condition('field_published', $published, 'CONTAINS');
            }

            //filter advisor
            $advisor = $request->request->get('advisor');
            if (!empty($advisor)) {
                //$query->condition('field_advisor', $advisor, 'CONTAINS');
            }
            //step equal 3
            $query->condition('field_step', 3, '=');

            //sort
            //check if 
            switch ($column) {
               case 1:
                    $query->sort('name', $dir);
                    break;
                case 2:
                    $query->sort('field_company_name', $dir);
                    break;
                case 3:
                    $query->sort('langcode', $dir);
                    break;
                case 5:
                    $query->sort('field_company_deparment.entity.name', $dir);
                    break;
                case 6:
                    $query->sort('field_company_city.entity.name', $dir);
                    break;
                case 7:
                    $query->sort('field_productive_chain.entity.name', $dir);
                    break;
                case 8:
                    $query->sort('changed', $dir);
                    break;
                case 11:
                    $query->sort('status', $dir);
                    break;
                default:
                    //sort by create date of drupal
                    $query->sort('changed', "desc");
                    break;
            }
            
            $query->range($start, $limit);
            //get users
            $uids = $query->execute();
            //get users
            $users = \Drupal\user\Entity\User::loadMultiple($uids);
            
            //return company_name and email
            $exportadores = array();
            foreach ($users as $user) {
                //get lang
                $lang = $user->getPreferredLangcode();
                if($lang == 'es'){
                    $lang = 'ES';
                }else{
                    $lang = 'EN';
                }
                //get update date
                $update_date = $user->get('changed')->value;
                $update_date = date('d/m/Y - H:i', $update_date);
                //get status name
                $status = $user->get('status')->value;
                //cehck if user has company name
                $company_name = $user->get('field_company_name')->value;
                //check if step 3 is completed
                $step = $user->get('field_step')->value;
                if($company_name != '' && $step == 3){
                    $exportadores[] = array(
                        //username
                        'id' => $user->id(),
                        //get username
                        'nit' => $user->get('name')->value,
                        //get email
                        'email' => $user->get('mail')->value,
                        //company name
                        'company_name' => $user->get('field_company_name')->value,
                        //lang
                        'lang' => $lang,
                        //get company_logo
                        'company_logo' => file_create_url($user->get('field_company_logo')->entity->getFileUri()),
                        //field_company_deparment taxonomy term name
                        'company_deparment' => $user->get('field_company_deparment')->entity->getName(),
                        //field_company_city taxonomy term name
                        'company_city' => $user->get('field_company_city')->entity->getName(),
                        //field_productive_chain get taxonomy term name
                        'productive_chain' => $user->get('field_productive_chain')->entity->getName(),
                        //get update date or created date of user
                        'update_date' => $update_date,
                        //get status name
                        'status' => $user->get('field_account_status')->entity->getName(),
                    );
                }
                
            }

            //get count of all exportador users with count query
            $query = \Drupal::entityQuery('user');
            $query->condition('roles', 'exportador', 'IN');
            //detect filters if value is not empty
            //filter company_name
            $company_name = $request->request->get('company_name');
            if (!empty($company_name)) {
                $query->condition('field_company_name', $company_name, 'CONTAINS');
            }
            //filter nit
            $nit = $request->request->get('nit');
            if (!empty($nit)) {
                $query->condition('name', $nit, 'CONTAINS');
            }
            //filter status
            $status = $request->request->get('status');
            if (!empty($status)) {
                $query->condition('status', $status, 'CONTAINS');
            }
            //filter deparment
            $deparment = $request->request->get('deparment');
            if (!empty($deparment)) {
                $query->condition('field_company_deparment', $deparment, 'CONTAINS');
            }
            //filter production_chain
            $production_chain = $request->request->get('productive_chain');
            if (!empty($production_chain)) {
                $query->condition('field_productive_chain', $production_chain, 'CONTAINS');
            }
            //filter published
            $published = $request->request->get('published');
            if (!empty($published)) {
                //$query->condition('field_published', $published, 'CONTAINS');
            }

            //filter advisor
            $advisor = $request->request->get('advisor');
            if (!empty($advisor)) {
                //$query->condition('field_advisor', $advisor, 'CONTAINS');
            }

            //check step 3
            $query->condition('field_step', 3, '=');
            $query->count();
            $count = $query->execute();
            return new JsonResponse(array(
                'draw' => $request->request->get('draw'),
                'recordsTotal' => $count,
                'recordsFiltered' => $count,
                'data' => $exportadores,
            ), 200);
        }
        catch (Exception $e)
        {
            return new JsonResponse(array('error' => $e->getMessage()), 500);
        }
       
    }

    /*
    * Function to return all users that have role buyer are active
    */
    public function get_all_buyer_by_page(Request $request)
    {
        //get all user with role buyer and active
        try
        {
            $start = $request->request->get('start');
            $limit = $request->request->get('length');
            //search
            $search = $request->request->get('search');
            //get order[column] and order[dir]
            $order = $request->request->get('order');
            //get column
            $column = $order[0]['column'];
            //get dir
            $dir = $order[0]['dir'];

            $query = \Drupal::entityQuery('user');
            $query->condition('roles', 'buyer', 'IN');
            //detect filters if value is not empty
            //company_name
            $company_name = $request->request->get('company_name');
            if (!empty($company_name)) {
                $query->condition('field_company_name', $company_name, 'CONTAINS');
            }
            //subcat_interest_1
            $subcat_interest_1 = $request->request->get('subcat_interest_1');
            if (!empty($subcat_interest_1)) {
                $query->condition('field_subcat_interest_1', $subcat_interest_1, 'CONTAINS');
            }
            //filter status
            $status = $request->request->get('status');
            if (!empty($status)) {
                $query->condition('status', $status, 'CONTAINS');
            }
            //step equal 5
            $query->condition('field_step', 5, '=');
            //sort
            //check if 
            switch ($column) {
                case 1:
                    $query->sort('field_company_name', $dir);
                    break;
                case 2:
                    $query->sort('mail', $dir);
                    break;
                case 3:
                    $query->sort('langcode', $dir);
                    break;
                case 4:
                    $query->sort('field_country', $dir);
                    break;
                case 5:
                    $query->sort('field_subcat_interest_1', $dir);
                    break;
                case 6:
                    $query->sort('changed', $dir);
                    break;
                case 7:
                    $query->sort('status', $dir);
                    break;
                default:
                    //sort by create date of drupal
                    $query->sort('changed', "desc");
                    break;
            }
            
            $query->range($start, $limit);
            //get users
            $uids = $query->execute();
            //get users
            $users = \Drupal\user\Entity\User::loadMultiple($uids);
            
            //return company_name and email
            $buyers = array();
            foreach ($users as $user) {
                //get lang
                $lang = $user->getPreferredLangcode();
                if($lang == 'es'){
                    $lang = 'ES';
                }else{
                    $lang = 'EN';
                }
                //get update date
                $update_date = $user->get('changed')->value;
                $update_date = date('d/m/Y - H:i', $update_date);
                //get status name
                $status = $user->get('status')->value;
                $status_name = $status == 1 ? 'Activo' : 'Inactivo';
                //cehck if step is 5
                $step = $user->get('field_step')->value;
                if($step == 5){
                    $buyers[] = array(
                        //username
                        'id' => $user->id(),
                        //get email
                        'email' => $user->get('mail')->value,
                        //company name
                        'company_name' => $user->get('field_company_name')->value,
                        //lang
                        'lang' => $lang,
                        //country
                        'country' => "Colombia",
                        //field_subcat_interest_1 get taxonomy term name
                        'subcategory' => $user->get('field_subcat_interest_1')->entity->getName(),
                        //get update date or created date of user
                        'update_date' => $update_date,
                        //get status name
                        'status' => $user->get('field_account_status')->entity->getName(),
                    );
                }
            }

            //get count of all buyer users with count query
            $query = \Drupal::entityQuery('user');
            $query->condition('roles', 'buyer', 'IN');
            //detect filters if value is not empty
            //company_name
            $company_name = $request->request->get('company_name');
            if (!empty($company_name)) {
                $query->condition('field_company_name', $company_name, 'CONTAINS');
            }
            //subcat_interest_1
            $subcat_interest_1 = $request->request->get('subcat_interest_1');
            if (!empty($subcat_interest_1)) {
                $query->condition('field_subcat_interest_1', $subcat_interest_1, 'CONTAINS');
            }
            //filter status
            $status = $request->request->get('status');
            if (!empty($status)) {
                $query->condition('status', $status, 'CONTAINS');
            }
            //step 5
            $query->condition('field_step', 5, '=');
            $query->count();
            $count = $query->execute();
            return new JsonResponse(array(
                'draw' => $request->request->get('draw'),
                'recordsTotal' => $count,
                'recordsFiltered' => $count,
                'data' => $buyers,
            ), 200);
        }
        catch (Exception $e)
        {
            return new JsonResponse(array('error' => $e->getMessage()), 500);
        }
       
    }
}
