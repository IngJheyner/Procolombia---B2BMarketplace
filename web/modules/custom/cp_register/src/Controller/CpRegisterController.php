<?php

namespace Drupal\cp_register\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
        return [
            // Your theme hook name.
            '#theme' => 'cp_register_template_hook',
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
    public function saveFile($fileToSave, $name)
    {
        $directory = 'public://logos/';
        \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
        $file = file_save_data($fileToSave, $directory . $name, \Drupal\Core\File\FileSystemInterface::EXISTS_REPLACE);
        return $file;
    }

    /**
     * Create step 1 of create form and save logo User::create().
     */
    public function createStep1(Request $request)
    {
        $data = $request->request->all();
        $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
        $user = \Drupal\user\Entity\User::create();
        $user->setPassword($data['password']);
        $user->enforceIsNew();
        $user->setEmail($data['email']);
        $user->setUsername($data['nit']);
        $user->set('init',$data['email']);
        
        $file = $request->files->get('logo');
        $file2 = file_get_contents($file);
        $user->set('user_picture', $this->saveFile($file2, $data['nit'].".".$file->getClientOriginalExtension()));
        $user->set('preferred_langcode', $lang);
        $user->set("field_step", 1);
        $user->addRole('exportador');
        $user->activate();
        $user->save();
        _user_mail_notify('status_activated', $user);
        
        return new JsonResponse(['status' => 'success']);
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
     * Update data of user step 2 with nit
     */
    public function updateStep2(Request $request)
    {
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        $user->set('field_company_name', $data['bussines']);
        $user->set('field_step', 2);
        $user->save();
        return new JsonResponse(['status' => 'success']);
    }

    /**
     * Update data of user step 2 with nit
     */
    public function updateStep3(Request $request)
    {
        $data = $request->request->all();
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        $user->set('field_company', $data['bussines']);
        $user->set('field_step', 3);
        $user->save();
        return new JsonResponse(['status' => 'success']);
    }
}
