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
class CpPreRegisterBuyerController extends ControllerBase
{

    /**
     * Returns a template twig file.
     */
    public function index()
    {
        return [
            // Your theme hook name.
            '#theme' => 'cp_pre_register_buyer_template_hook',
        ];
    }

     /**
     * return uid of user by nit with search by Username
     */
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

    public function createStep1(Request $request)
    {
        //check if email is already registered
       
        $data = $request->request->all();
        $email = $data['email'];
        $uid = $this->getUid($email);
        if(!isset($uid)){
            if($this->getUid($data['email'])){
                $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
            }else{
                $user = \Drupal\user\Entity\User::create();
                $user->setPassword($data['password']);
                $user->enforceIsNew();
                $user->setEmail($data['email']);
                $user->setUsername($data['email']);
                $user->set('init',$data['email']);
                $user->addRole('buyer');
                $user->set('preferred_langcode', $data['langcode']);
                $user->set("field_step", 1);
                $user->activate();
            }
            $user->set("field_company_contact_name", $data['name']);
            $user->set("field_company_name", $data['company']);
            $user->set("field_company_contact_lastname", $data['last_name']);
            $user->set("field_company_contact_cell_phone", $data['cellphone']);
            $user->save();
            //_user_mail_notify('status_activated', $user);
            return new JsonResponse(['status' =>  200]);
        }
        return new JsonResponse(['status' =>  500]);

    }

}
