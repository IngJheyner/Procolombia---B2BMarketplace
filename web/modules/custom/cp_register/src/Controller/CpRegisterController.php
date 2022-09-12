<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
/**
 * An cp_register controller.
 */
class CpRegisterController extends ControllerBase
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

        //get advisor user with role asesor_comercial.
        $query = \Drupal::entityQuery('user');
        $query->condition('roles', 'asesor_comercial');
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

        return [
            // Your theme hook name.
            '#theme' => 'cp_register_template_hook',
            '#deparments' => $tree_deparment,
            '#production_chain' => $tree_production_chain,
            '#business_model' => $tree_business_model,
            '#certificacion_de_empresa' => $tree_certificacion_de_empresa,
            '#advisor' => $tree_advisor,
        ];
    }
    /**
     * Check the actual step with field step in user search by NIT
     */
    public function checkStep($nit)
    {
        $query = \Drupal::entityQuery('user')
            ->condition('field_nit', $nit)
            ->execute();
        if(!empty($query)){
            $user = \Drupal\user\Entity\User::load(reset($query));
            $step = $user->get('field_step')->getString();
            return $step;
        }
        else{
            return 0;
        }
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
            return 0;
        }
    }

        /**
     * Create step 1 of create form and save logo User::create().
     */
    public function createStep1(Request $request)
    {
        $data = $request->request->all();
        $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
        $data = $request->request->all();
        if($this->getUid($data['nit'])){
            $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        }else{
            $user = \Drupal\user\Entity\User::create();
            $user->setPassword($data['password']);
            $user->enforceIsNew();
            $user->setEmail($data['email']);
            $user->setUsername($data['nit']);
            $user->set('init',$data['email']);
            $user->addRole('exportador');
            $user->set('preferred_langcode', $lang);
            $user->set("field_step", 1);
        }
        $file = $request->files->get('logo');
        $file2 = file_get_contents($file);
        $user->set("field_company_logo", $this->saveFile($file2, $data['nit'] . '-logo.' . $file->getClientOriginalName(), 'public://matchmaking/images/users_logos/'));
        $user->set("field_company_name", $data['business_name']);
        $user->set("field_company_web_site", $data['website']);
        $user->set("field_company_video_youtube", $data['video']);
        $user->set("field_company_info", $data['description_business_spanish']);
        $user->set("field_company_info_english", $data['description_business_english']);

        $user->save();
        //_user_mail_notify('status_activated', $user);
        
        return new JsonResponse(['status' =>  200]);
    }

    /**
     * Update data of user step 2 with nit
     */
    public function updateStep2(Request $request)
    {
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        $user->set('field_productive_chain', $data['production_chain']);
        $user->set('field_ciiu_principal', $data['principal_code_ciiu']);
        $user->set('field_ciiu_secundario', $data['secondary_code_ciiu']);
        $user->set('field_ciiu_terciario', $data['third_code_ciiu']);
        $user->set('field_company_deparment', $data['departament']);
        $user->set('field_company_city', $data['ciudad']);
        //add multiple reference to field_company_model
        $model_arr = explode(',', $data['modelo_de_negocio']);
        $user->set('field_company_model', $model_arr);
        //save certification_business only if is not empty and save file certification_business_file
        if(!empty($data['certification_business'])){
            $certification_arr = explode(',', $data['certification_business']);
            $user->set('field_company_certification', $certification_arr);
            $file = $request->files->get('certification_business_file');
            $file2 = file_get_contents($file);
            $user->set("field_company_certification_file", $this->saveFile($file2, $data['nit'] . '-certificado.' . $file->getClientOriginalName(), 'private://users_certificates/'));
        }
        //principal_advisor
        $user->set('field_company_adviser', $data['principal_advisor']);
        $user->set('field_step', 2);
        $user->save();
        return new JsonResponse(['status' =>  200]);
    }

    /**
     * Update data of user step 3 with nit
     */
    public function updateStep3(Request $request)
    {
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        $user->set('field_company_contact_name', $data['name']);
        $user->set('field_company_contact_lastname', $data['last_name']);
        $user->set('field_company_contact_position', $data['position_spanish']);
        $user->set('field_company_contact_position_e', $data['position_english']);
        $user->set('field_company_contact_phone', $data['country_code_landline'].$data['landline']);
        $user->set('field_company_contact_cell_phone', $data['country_code_mobile'].$data['mobile']);
        $user->set('field_company_contact_email', $data['contact_email']);
        //country_code_landline
        $user->set('field_country_code_landline', $data['country_code_landline']);
        $user->set('field_country_code_mobile', $data['country_code_mobile']);
        $user->set('field_step', 3);
        $user->save();
        return new JsonResponse(['status' =>  200]);
    }

    /**
     * get city by departamento in request data
     */
    public function getCity(Request $request)
    {
        $data = $request->request->all();
        $vid = 'locations';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid,$data['departament'],NULL,TRUE);
        $tree_ciudades=[];
        foreach ($terms as $term) {
            array_push($tree_ciudades, [
                    "ID" => $term->tid->value,
                    "Name" => $term->getName(),
                ]
            );
        }
        return new JsonResponse(['status' => 'success', 'ciudades' => $tree_ciudades]);
    }

    /**
     * get data user if nit exist and return in json format
     */
    public function getDataUser(Request $request)
    {
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        //check if user exist and is not deleted
        //ceck if user is not deleted in drupal

        if($user->isActive()){
            $data_user = [
                'step' => $user->get('field_step')->value,
                //'logo' => $user->get('field_company_logo')->entity->getFileUri(),
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
            ];
    
            return new JsonResponse(['status' => 200, 'data' => $data_user]);
        }else{
            return new JsonResponse(['status' => 'error', 'message' => 'El usuario no existe']);
        }
    }

    /**
     * delete user by nit
     */
    public function deleteUser(Request $request)
    {
        //check if user exist and is active and is active delete user
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        if($user->isActive()){
            $user->delete();
        }
        return new JsonResponse(['status' => 200]);
    }
}

