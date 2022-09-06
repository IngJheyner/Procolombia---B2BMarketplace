<?php

namespace Drupal\cp_auth_service\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Url;
use Drupal\Component\Utility\Html;

/**
 * An cp_auth_service controller.
 */
class CpAuthService extends ControllerBase
{

    
    
    /**
     * login_form function.
     * based in the username and password, logged the user in the system and return rol
     * @access public
     * @param Request $request
     * @return role of the user
     */

    public function login_form(Request $request)
    {
        //get the username and password from the request
        $username = $request->request->get('username');
        $password = $request->request->get('password');
        //load the user by the username
        $user = user_load_by_name($username);
        //return user
        if ($user) {
            //check if the password is correct
            $uid = \Drupal::service('user.auth')->authenticate($username, $password);
            if ($uid) {
                //get the user roles
                $roles = $user->getRoles();
                //check if user is active
                if ($user->isActive()) {
                    //sign in the user and avoid redirect
                    user_login_finalize($user);
                } else {
                    //return error message
                    return new JsonResponse(['error' => 'User is not active']);
                }
                
            } else {
                //return error
                return new JsonResponse(['error' => 'Invalid credentials']);
            }
        } else {
            //return error message
            return new JsonResponse(['error' => 'Invalid credentials']);
        }
    }

    //get role of logged user
    public function get_role(Request $request)
    {
        //get the user
        $user = \Drupal::currentUser();
        //get the user roles
        $roles = $user->getRoles();
        //check if user is active
        //get if user is exportador, buyer or advisor
        //check if roles is exportador
        if (in_array('exportador', $roles)) {
            //return exportador
            return new JsonResponse(['role' => 'exportador']);
        } elseif (in_array('buyer', $roles)) {
            //return buyer
            return new JsonResponse(['role' => 'buyer']);
        } elseif (in_array('advisor', $roles)) {
            //return advisor
            return new JsonResponse(['role' => 'advisor']);
        } else {
            //return error
            return new JsonResponse(['error' => 'user without role']);
        }
        
    }

    /**
     * recover_password_form function.
     * based in the username, send an email to the user with a link to recover the password
     * @access public
     * @param Request $request
     * @return status 200 if the email was sent, 500 if not
     */
    public function recover_password_form(Request $request)
    {
        //get the username from the request
        $username = $request->request->get('username');
        //load the user by the username
        $user = user_load_by_name($username);
        //if the user exists, send the email, finally, return status 200, if not return 500
        if ($user) {
            // Create a timestamp.
            $timestamp = \Drupal::time()->getRequestTime();

            $mailManager = \Drupal::service('plugin.manager.mail');
            $module = 'cp_auth_service';
            $key = 'user_reset_links'; // Replace with Your key
            $to = $user->getEmail();
            $langcode = \Drupal::currentUser()->getPreferredLangcode();
            $send = true;

            // create link with domain and query params {email} and {timestamp} and {hash}
            // get the server name
            $server_name = \Drupal::request()->getSchemeAndHttpHost();
            $link =   $server_name.'?email=' .  $to . '&time=' . $timestamp . '&token=' . user_pass_rehash($user, $timestamp);
            // Set the message and the subject.
            //add message and translate "<p>To recover your password go to the following link</p><p><a href='@link'>@link</a></p>"
            $params['message'] = "<h1>To recover your password go to the following link</p><p><a href='".$link."'>".$link."</a></h1>";
            $params['title'] = t("Recover password");

            // Send mail and collect the result.
            $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
            if ($result['result'] != true) {
                return new JsonResponse('error', 500);
            } else {
                return new JsonResponse('success', 200);
            }
        } else {
            return new JsonResponse('error', 500);
        }
    }

    /**
     * change_password_form function.
     * based in the request (uid, timestamp and hash), change the password of the user
     * @access public
     * @param Request $request
     * @return status 200 if the email was sent, 500 if not
     */
    public function change_password_form(Request $request)
    {
        //get the uid, timestamp and hash from the request
        $email = $request->request->get('email');
        $timestamp = $request->request->get('timestamp');
        $hash = $request->request->get('hash');
        //load the user by email
        $user = user_load_by_mail($email);
        //if the user exists, change the password, finally, return status 200, if not return 500
        if ($user) {
            // Check if the hash is valid.
            if (user_pass_rehash($user, $timestamp) == $hash) {
                // Set the new password.
                $user->setPassword($request->request->get('password'));
                $user->save();
                return new JsonResponse('success', 200);
            } else {
                return new JsonResponse('error', 500);
            }
        } else {
            return new JsonResponse('error', 500);
        }
    }

    /*
    * get_email function.
    * based in the username, return the email of the user
    * @access public
    * @param Request $request
    * @return email of the user
    */
    public function get_email(Request $request)
    {
        //get the username from the request
        $username = $request->request->get('username');
        //load the user by the username
        $user = user_load_by_name($username);
        //if the user exists, return the email, finally, return status 200, if not return 500
        if ($user) {
            return new JsonResponse(array('email' => $user->getEmail()));
        } else {
            return new JsonResponse('error', 500);
        }
    }
}
