<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_pro_adviser controller.
 */
class CpEditInternationalCompany extends ControllerBase {

  /**
   * Returns a template twig file.
   */
  public function index() {
    // List of terms to set a select field deparments.
    $vid = 'categorization';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_categorization = [];
    foreach ($terms as $term) {
      array_push($tree_categorization, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }
    // List of terms to set a select field modelos_de_negocio.
    $vid = 'modelos_de_negocio';
    // Load taxonomy_term storage.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_business_model = [];
    foreach ($terms as $term) {
      array_push($tree_business_model, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

    // List of terms to set a select field modelos_de_negocio.
    $vid = 'countries';
    // Load taxonomy_term storage.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, FALSE);
    $tree_countries = [];
    foreach ($terms as $term) {
      array_push($tree_countries, [
        "ID" => $term->tid,
        "Name" => $term->name,
      ]
      );
    }

      //get advisor user with role asesor_comercial.
    $query = \Drupal::entityQuery('user');
    $query->condition('roles', 'asesor_internacional');
    $uids = $query->execute();
    $users = \Drupal\user\Entity\User::loadMultiple($uids);
    $tree_advisor = [];
    foreach ($users as $user) {
      array_push($tree_advisor, [
        "ID" => $user->id(),
        "Name" => $user->get('field_company_contact_name')->value . ' ' . $user->get('field_company_contact_lastname')->value,
      ]
      );
    }

    return [
      // Your theme hook name.
      '#theme' => 'cp_edit_international_company_template_hook',
      '#tree_categorization' => $tree_categorization,
      '#tree_business_model' => $tree_business_model,
      '#tree_countries' => $tree_countries,
      '#tree_advisor' => $tree_advisor,
    ];
  }

  /**
   * Create register in table advisor_logs.
   */
  public function createLog($email, $company_name, $action, $status) {
    $connection = \Drupal::database();
    $connection->insert('advisor_logs')
      ->fields([
        'email' => $email,
        'company_name' => $company_name,
        'created_at' => date('Y-m-d H:i:s'),
        'action' => $action,
        'status' => $status,
      ])
      ->execute();
  }

  /**
   * Get User ID. with email.
   */
  public function getUid($email) {
    $query = \Drupal::entityQuery('user')
      ->condition('mail', $email)
      ->execute();
    if (!empty($query)) {
      $user = \Drupal\user\Entity\User::load(reset($query));
      $uid = $user->id();
      return $uid;
    }
    else {
      return NULL;
    }
  }

    //get_international_user in drupal and return user object data.
    public function get_international_user(Request $request)
    {
        $data = $request->request->all();
        //get user with email
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));

        //get all 'field_company_model' target_id.
        $field_company_model = $user->get('field_company_model')->getValue();
        foreach ($field_company_model as $key => $value) {
            //push targer_id to array.
            $field_company_model_target_id[$key] = $value['target_id'];
        }
        //get all 'field_company_model' target_id.
        $field_company_model_2 = $user->get('field_company_model_2')->getValue();
        foreach ($field_company_model_2 as $key => $value) {
            //push targer_id to array.
            $field_company_model_target_id_2[$key] = $value['target_id'];
        }
        //get all 'field_company_model' target_id.
        $field_company_model_3 = $user->get('field_company_model_3')->getValue();
        foreach ($field_company_model_3 as $key => $value) {
            //push targer_id to array.
            $field_company_model_target_id_3[$key] = $value['target_id'];
        }
        $data_user = [
            'step' => $user->get('field_step')->value,
            'name' => $user->get('field_company_contact_name')->value,
            'lastname' => $user->get('field_company_contact_lastname')->value,
            'business_name' => $user->get('field_company_name')->value,
            'cellphone' => $user->get('field_company_contact_cell_phone')->value,
            'email' => $user->get('mail')->value,
            'position' => $user->get('field_company_contact_position')->value,
            'web_site' => $user->get('field_company_web_site')->uri,
            'city' => $user->get('field_company_city')->value,
            'country' => $user->get('field_country')->target_id,
            'cat_interest_1' => $user->get('field_cat_interest_1')->target_id,
            'subcat_interest_1' => $user->get('field_subcat_interest_1')->target_id,
            'company_model' => $field_company_model_target_id,
            'cat_interest_2' => $user->get('field_cat_interest_2')->target_id,
            'subcat_interest_2' => $user->get('field_subcat_interest_2')->target_id,
            'company_model_2' => $field_company_model_target_id_2,
            'cat_interest_3' => $user->get('field_cat_interest_3')->target_id,
            'subcat_interest_3' => $user->get('field_subcat_interest_3')->target_id,
            'company_model_3' => $field_company_model_target_id_3,
            'country_code_mobile' => $user->get('field_country_code_mobile')->value,
            'advisor' => $user->get('field_company_adviser')->target_id,
        ];

        return new JsonResponse(['status' => 200, 'data' => $data_user]);
        
    }

    /**
     * Save file in drupal 9 media library and return file
     */
    public function saveFile($fileToSave, $name, $directory)
    {
        \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
        $file = file_save_data($fileToSave, $directory . $name, \Drupal\Core\File\FileSystemInterface::EXISTS_REPLACE);
        return $file;
    }

    /**
     * Update data of user form1
     */
    public function update_form_international_company(Request $request)
    {
        //get data request
        $data = $request->request->all();
        //get user with email
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
        $user->setPassword($data['password']);
        $user->set("field_company_contact_name", $data['name']);
        $user->set("field_company_name", $data['business_name']);
        $user->set("field_company_contact_lastname", $data['last_name']);
        $user->set("field_company_contact_cell_phone", $data['cellphone']);
        $user->set("field_company_contact_position", $data['position']);
        $user->set("field_country", $data['country']);
        $user->set('field_country_code_mobile', $data['country_code_mobile']);
        $user->set("field_company_web_site", $data['web_site']);
        $user->set("field_cat_interest_1", $data['cat_interest_1']);
        $user->set("field_subcat_interest_1", $data['subcat_interest_1']);
        $model_arr = explode(',', $data['company_model']);
        $user->set('field_company_model', $model_arr);        
        $user->set("field_cat_interest_2", $data['cat_interest_2']);
        $user->set("field_subcat_interest_2", $data['subcat_interest_2']);
        $model_arr1 = explode(',', $data['company_model_2']);
        $user->set('field_company_model_2', $model_arr1);
        $user->set("field_cat_interest_3", $data['cat_interest_3']);
        $user->set("field_subcat_interest_3", $data['subcat_interest_3']);
        $user->set("field_company_adviser", $data['advisor']);
        $model_arr2 = explode(',', $data['company_model_3']);
        $user->set('field_company_model_3', $model_arr2);
        $user->save();
        //create log
        //current user email
        $current_user = \Drupal::currentUser();
        $current_user = \Drupal\user\Entity\User::load($current_user->id());
        $current_user_email = $current_user->get('mail')->value;
        $this->createLog($current_user_email , $data['business_name'], 'Editado', 'En espera de Aprobación');
        return new JsonResponse(['status' =>  200]);
    }

    /**
     * Aprove user
     */
    public function approve_user_international(Request $request)
    {
        try
        {
            //get data request
            $data = $request->request->all();
            //get user with email
            $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
            //set status user
            $user->set('status', 1);
            //change account_status to taxonomy id Aprobado
            //get taxonomy id
            $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['name' => 'Aprobado']);
            $term = reset($terms);
            $user->set('field_account_status', $term->id());
            $user->save();
            //create log
            //current user email

            //user get company name
            $company_name = $user->get('field_company_name')->value;
            $current_user = \Drupal::currentUser();
            $current_user = \Drupal\user\Entity\User::load($current_user->id());
            $current_user_email = $current_user->get('mail')->value;
            $this->createLog($current_user_email ,  $company_name, 'Aprobación', 'Aprobado');
            return new JsonResponse(['status' =>  200]);
        }catch(Exception $e){
            return new JsonResponse(['status' =>  500]);
        }
    }

    /**
     * Reject user
     */
    public function reject_user_international(Request $request)
    {
        try
        {
            //get data request
            $data = $request->request->all();
            //get user with email
            $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
            //set status user
            $user->set('status', 0);
            //change account_status to taxonomy id Rechazado
            //get taxonomy id
            $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['name' => 'Rechazado']);
            $term = reset($terms);
            $user->set('field_account_status', $term->id());
            $user->save();
            //create log
            //current user email
            //user get company name
            $company_name = $user->get('field_company_name')->value;
            $current_user = \Drupal::currentUser();
            $current_user = \Drupal\user\Entity\User::load($current_user->id());
            $current_user_email = $current_user->get('mail')->value;
            $this->createLog($current_user_email , $company_name, 'Rechazo', 'Rechazado');
            return new JsonResponse(['status' =>  200]);
        }catch(Exception $e){
            return new JsonResponse(['status' =>  500]);
        }
    }
}
