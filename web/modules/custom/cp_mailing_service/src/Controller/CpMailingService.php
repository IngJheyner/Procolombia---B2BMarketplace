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
        $token = $data['token'];
        $server_name = \Drupal::request()->getSchemeAndHttpHost();
        $link = $server_name.'/verification/user?token='.$token.'&email='.$email;
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
            return new JsonResponse('success', 200);
        }
        
    }
}
