<?php

namespace Drupal\cp_pro_adviser\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * An cp_pro_adviser controller.
 */
class CpEditColCompany extends ControllerBase
{
    /**
     * Returns a template twig file.
     */
    public function index()
    {
        //List of terms to set a select field deparments.
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
        //List of terms to set a select field production_chain.
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
        //List of terms to set a select field certificacion_de_empresa.
        $vid = 'certificacion_de_empresa';
        //load taxonomy_term storage.
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_certificacion_de_empresa=[];
        foreach ($terms as $term) {
            array_push($tree_certificacion_de_empresa, [
                    "ID" => $term->tid,
                    "Name" => $term->name
                ]
            );
        }
        //List of terms to set a select field countries.
        $vid = 'countries';
        //load taxonomy_term storage.
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, false);
        $tree_countries=[];
       /*  foreach ($terms as $term) {
            //get file_create_url of field_bandera.
            $image = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term->tid)->get('field_bandera')->getValue();
            $file = File::load($image[0]['target_id']);
            $file_url = file_create_url($file->getFileUri());
            //get image of field_indicativo.
            $indicativo = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term->tid)->get('field_indicativo')->getValue();
            array_push($tree_countries, [
                    "ID" => $term->tid,
                    "Name" => $term->name,
                    "Image" => $file_url,
                    "Indicativo" => $indicativo[0]['value']
                ]
            );
        } */

        return [
            // Your theme hook name.
            '#theme' => 'cp_edit_col_company_template_hook',
            '#deparments' => $tree_deparment,
            '#production_chain' => $tree_production_chain,
            '#business_model' => $tree_business_model,
            '#certificacion_de_empresa' => $tree_certificacion_de_empresa,
            '#countries' => $tree_countries,
        ];
    }

    public function getUid($email)
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

    //get_col_user in drupal and return user object data.
    public function get_col_user(Request $request)
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

        //get all 'certification_business' target_id.
        $certification_business = $user->get('field_company_certification')->getValue();
        foreach ($certification_business as $key => $value) {
            //push targer_id to array.
            $certification_business_target_id[$key] = $value['target_id'];
        }

        $data_user = [
            'step' => $user->get('field_step')->value,
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
            'modelo_de_negocio' => $field_company_model_target_id,
            'certification_business' => $certification_business_target_id,
            'contact_name' => $user->get('field_company_contact_name')->value,
            'contact_lastname' => $user->get('field_company_contact_lastname')->value,
            'contact_email' => $user->get('field_company_contact_email')->value,
            'contact_position' => $user->get('field_company_contact_position')->value,
            'contact_phone' => $user->get('field_company_contact_phone')->value,
            'contact_cellphone' => $user->get('field_company_contact_cell_phone')->value,
            'country_code_landline' => $user->get('field_country_code_landline')->value,
            'country_code_mobile' => $user->get('field_country_code_mobile')->value,
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
    public function update_form_col_company(Request $request)
    {
        //get data request
        $data = $request->request->all();
        //get user with email
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
        $user->set('field_productive_chain', $data['production_chain']);
        $user->set('field_ciiu_principal', $data['principal_code_ciiu']);
        $user->set('field_ciiu_secundario', $data['secondary_code_ciiu']);
        $user->set('field_company_deparment', $data['departament']);
        $user->set('field_company_city', $data['ciudad']);
        $model_arr = explode(',', $data['modelo_de_negocio']);
        $user->set('field_company_model', $model_arr);

        $file = $request->files->get('logo');
        if(!empty($file)){
            $file2 = file_get_contents($file);
            //check if file2 is not empty
            $user->set("field_company_logo", $this->saveFile($file2, $user->get('name')->value . '-logo.' . $file->getClientOriginalName(), 'public://matchmaking/images/users_logos/'));
        }
        $user->set("field_company_name", $data['business_name']);
        $user->set("field_company_web_site", $data['website']);
        $user->set("field_company_info", $data['description_business_spanish']);
        $user->set("field_company_info_english", $data['description_business_english']);
        $user->set('field_company_contact_name', $data['name']);
        $user->set('field_company_contact_lastname', $data['last_name']);
        $user->set('field_company_contact_position', $data['position_spanish']);
        $user->set('field_company_contact_phone', $data['landline']);
        $user->set('field_company_contact_cell_phone', $data['mobile']);
        $user->set('field_company_contact_email', $data['contact_email']);
        //country_code_landline
        $user->set('field_country_code_landline', $data['country_code_landline']);
        $user->set('field_country_code_mobile', $data['country_code_mobile']);
        $user->save();
        return new JsonResponse(['status' =>  200]);
    }

    /**
     * Aprove user
     */
    public function approve_user_col(Request $request)
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
            return new JsonResponse(['status' =>  200]);
        }catch(Exception $e){
            return new JsonResponse(['status' =>  500]);
        }
    }

    /**
     * Reject user
     */
    public function reject_user_col(Request $request)
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
            return new JsonResponse(['status' =>  200]);
        }catch(Exception $e){
            return new JsonResponse(['status' =>  500]);
        }
    }
}
