<?php

namespace Drupal\cp_mailing_service\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Url;
use Drupal\Component\Utility\Html;

/**
 * An cp_mailing_service controller.
 */
class CpMailingService extends ControllerBase
{

    /**
     * verification_email function.
     * send a verification email to the user with the link to verify the email that is the actual path with the token of request in query
     * @access public
     * @param Request $request
     * @return status 200 if the email was sent, 500 if not
     */
    public function verification_email_col(Request $request)
    {
        $data = $request->request->all();
        $email = $data['email'];
        $unique_id = uniqid(rand(), true);
        $token = md5($unique_id);
        $server_name = \Drupal::request()->getSchemeAndHttpHost();
        $link = $server_name.'/verification/user?token='.$unique_id.'&email='.$email;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $module = 'cp_mailing_service';
        $key = 'verification_email';
        $to = $email;
        $params['message'] = "<h1>Verificate your email with this url: </h1>".$link;
        $params['title'] = "Verificate your email";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        if ($result['result'] != true) {
            return new JsonResponse('error', 500);
        } else {
            return new JsonResponse(['status' => 'ok', 'token' => $token], 200);
        }
    }

    public function verification_email_international(Request $request)
    {
        $data = $request->request->all();
        $email = $data['email'];
        $unique_id = uniqid(rand(), true);
        $token = md5($unique_id);
        $server_name = \Drupal::request()->getSchemeAndHttpHost();
        $link = $server_name.'/pre-register/buyer?token='.$unique_id.'&email='.$email;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $module = 'cp_mailing_service';
        $key = 'verification_email';
        $to = $email;
        $params['message'] = "<h1>Verificate your email with this url: </h1>".$link;
        $params['title'] = "Verificate your email";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        if ($result['result'] != true) {
            return new JsonResponse('error', 500);
        } else {
            return new JsonResponse(['status' => 'ok', 'token' => $token], 200);
        }
    }


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

    public function getUidMail($nit)
    {
        $query = \Drupal::entityQuery('user')
            ->condition('mail', $nit)
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

    // compare both token
    public function verification_user(Request $request)
    {
        $data = $request->request->all();
        $token = $data['token'];
        $token_encoded = $data['token_encoded'];
        //check if the token is the same
        $token_new_encode = md5($token);
        if ($token_new_encode == $token_encoded) {
            return new JsonResponse(['status' => 'ok'], 200);
        } else {
            return new JsonResponse('error', 500);
        }
    }

    //send information email pending to aproval
    public function send_success_registration_user_col(Request $request)
    {
        $data = $request->request->all();
        $email = $data['email'];
        $user = \Drupal\user\Entity\User::load($this->getUid($data['nit']));
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $module = 'cp_mailing_service';
        $key = 'information_email';
        $to = $email;
        $params['message'] = "<h1>Su perfil como Empresa exportadora de ".$nombre." se encuentra en estado pendiente por aprobación por parte de ProColombia.</h1>";
        $params['title'] = "Thank you for your registration";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        //get user field_company_adviser of user and send email to the user
        //load user by username
        $field_company_adviser = $user->get('field_company_adviser')->getValue();
        //check if the user has a field_company_adviser
        if(!empty($field_company_adviser)){
            $field_company_adviser = $field_company_adviser[0]['target_id'];
            $user_adviser = \Drupal\user\Entity\User::load($field_company_adviser);
            $email_adviser = $user_adviser->get('mail')->value;
            $key = 'information_email_adviser';
            $to = $email_adviser;
            $params['message'] = "<h1>Se ha registrado ".$nombre." como empresa colombiana en ProColombia, por favor realizar la validación de la cuenta.</h1>";
            $params['title'] = "Nueva empresa colombiana registrada";
            $send = true;
            $result2 = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        }else{
            $result2['result'] = true;
        }
    
        if ($result['result'] != true || $result2['result'] != true) {
            return new JsonResponse('error', 500);
        } else {
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }

    //send information email pending to aproval
    public function send_success_registration_user_international(Request $request)
    {
        $data = $request->request->all();
        $email = $data['email'];
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $module = 'cp_mailing_service';
        $key = 'information_email';
        $to = $email;
        $params['message'] = "<h1>Su perfil como Comprador Internacional de la empresa ".$nombre." se encuentra en estado pendiente por aprobación por parte de ProColombia.</h1>";
        $params['title'] = "Thank you for your registration";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        //get user field_company_adviser of user and send email to the user
        //load user by username
        $field_company_adviser = $user->get('field_company_adviser')->getValue();
        //check if the user has a field_company_adviser
        if(!empty($field_company_adviser)){
            $field_company_adviser = $field_company_adviser[0]['target_id'];
            $user_adviser = \Drupal\user\Entity\User::load($field_company_adviser);
            $email_adviser = $user_adviser->get('mail')->value;
            $key = 'information_email_adviser';
            $to = $email_adviser;
            $params['message'] = "<h1>Se ha registrado ".$nombre." como comprador internacional en ProColombia, por favor realizar la validación de la cuenta.</h1>";
            $params['title'] = "Nuevo comprador internacional";
            $send = true;
            $result2 = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        }else{
            $result2['result'] = true;
        }
    
        if ($result['result'] != true || $result2['result'] != true) {
            return new JsonResponse('error', 500);
        } else {
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }

    //send information change data of user send to advisor
    public function send_change_data_user_col(Request $request)
    {
        $uid = \Drupal::currentUser();
        $user = \Drupal\user\Entity\User::load($uid->id());
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        //get user field_company_adviser of user and send email to the user
        //load user by username
        $field_company_adviser = $user->get('field_company_adviser')->getValue();
        //check if the user has a field_company_adviser
        if(!empty($field_company_adviser)){
            $field_company_adviser = $field_company_adviser[0]['target_id'];
            $user_adviser = \Drupal\user\Entity\User::load($field_company_adviser);
            $email_adviser = $user_adviser->get('mail')->value;
            $key = 'information_email_adviser';
            $module = 'cp_mailing_service';
            $langcode = \Drupal::currentUser()->getPreferredLangcode();
            $to = $email_adviser;
            $params['message'] = "<h1>Se ha modificado la información de ".$nombre." como empresa colombiana en ProColombia, por favor realizar la validación de la cuenta.</h1>";
            $params['title'] = "Se ha modificalo la información de una empresa colombiana registrada";
            $send = true;
            $result2 = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        }else{
            $result2['result'] = true;
        }
        if($result2['result'] != true){
            return new JsonResponse('error', 500);
        }else{
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }

    //send information change data of user send to advisor
    public function send_change_data_user_international(Request $request)
    {
        $uid = \Drupal::currentUser();
        $user = \Drupal\user\Entity\User::load($uid->id());
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        //get user field_company_adviser of user and send email to the user
        //load user by username
        $field_company_adviser = $user->get('field_company_adviser')->getValue();
        //check if the user has a field_company_adviser
        if(!empty($field_company_adviser)){
            $field_company_adviser = $field_company_adviser[0]['target_id'];
            $user_adviser = \Drupal\user\Entity\User::load($field_company_adviser);
            $email_adviser = $user_adviser->get('mail')->value;
            $key = 'information_email_adviser';
            $module = 'cp_mailing_service';
            $langcode = \Drupal::currentUser()->getPreferredLangcode();
            $to = $email_adviser;
            $params['message'] = "<h1>Se ha modificado la información de ".$nombre." como comprador internacional en ProColombia, por favor realizar la validación de la cuenta.</h1>";
            $params['title'] = "Se ha modificalo la información de un comprador internacional registrada";
            $send = true;
            $result2 = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        }else{
            $result2['result'] = true;
        }
        if($result2['result'] != true){
            return new JsonResponse('error', 500);
        }else{
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }

    //send information account approved to user col
    public function send_account_approved_user_col(Request $request)
    {
        try{
            //get data request
            $data = $request->request->all();
            //get user with email
            $user = \Drupal\user\Entity\User::load($this->getUidMail($data['email']));
            $nombre = $user->get('field_company_name')->value;
            $mailManager = \Drupal::service('plugin.manager.mail');
            $key = 'information_email_user';
            $module = 'cp_mailing_service';
            $to = $user->get('mail')->value;
            $params['message'] = "<h1>Se ha aprobado la cuenta de ".$nombre." como empresa colombiana en ProColombia.</h1>";
            $params['title'] = "Se ha aprobado la cuenta de una empresa colombiana registrada";
            $langcode = \Drupal::currentUser()->getPreferredLangcode();
            $send = true;
            $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
            if($result['result'] != true){
                return new JsonResponse('error', 500);
            }else{
                return new JsonResponse(['status' => 'ok'], 200);
            }
        }catch(\Exception $e){
            return new JsonResponse('error', 500);
        }
    }

    //send information account approved to user international
    public function send_account_approved_user_international(Request $request)
    {
        //get data request
        $data = $request->request->all();
        //get user with email
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $key = 'information_email_user';
        $module = 'cp_mailing_service';
        $to = $user->get('mail')->value;
        $params['message'] = "<h1>Se ha aprobado la cuenta de ".$nombre." como comprador internacional en ProColombia.</h1>";
        $params['title'] = "Se ha aprobado la cuenta de un comprador internacional registrada";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        if($result['result'] != true){
            return new JsonResponse('error', 500);
        }else{
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }

    //send information account rejected to user col
    public function send_account_rejected_user_col(Request $request)
    {
        //get data request
        $data = $request->request->all();
        //get user with email
        $user = \Drupal\user\Entity\User::load($this->getUidMail($data['email']));
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $key = 'information_email_user';
        $module = 'cp_mailing_service';
        $to = $user->get('mail')->value;
        $params['message'] = "<h1>Se ha rechazado la cuenta de ".$nombre." como empresa colombiana en ProColombia.</h1>";
        $params['title'] = "Se ha rechazado la cuenta de una empresa colombiana registrada";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        if($result['result'] != true){
            return new JsonResponse('error', 500);
        }else{
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }

    //send information account rejected to user international
    public function send_account_rejected_user_international(Request $request)
    {
        //get data request
        $data = $request->request->all();
        //get user with email
        $user = \Drupal\user\Entity\User::load($this->getUid($data['email']));
        $nombre = $user->get('field_company_name')->value;
        $mailManager = \Drupal::service('plugin.manager.mail');
        $key = 'information_email_user';
        $module = 'cp_mailing_service';
        $to = $user->get('mail')->value;
        $params['message'] = "<h1>Se ha rechazado la cuenta de ".$nombre." como comprador internacional en ProColombia.</h1>";
        $params['title'] = "Se ha rechazado la cuenta de un comprador internacional registrada";
        $langcode = \Drupal::currentUser()->getPreferredLangcode();
        $send = true;
        $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
        if($result['result'] != true){
            return new JsonResponse('error', 500);
        }else{
            return new JsonResponse(['status' => 'ok'], 200);
        }
    }
}
