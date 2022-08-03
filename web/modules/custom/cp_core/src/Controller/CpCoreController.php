<?php
namespace Drupal\cp_core\Controller;

use Drupal;
use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\node\Entity\Node;
use Drupal\Core\Controller\ControllerBase;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Entity\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\Component\Utility\SafeMarkup;
use Drupal\Component\Utility\Html;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\Entity\User;
use Drupal\redirect\Entity\Redirect;
use Drupal\Core\Language\LanguageInterface;

/**
 * Controller for functions procolombia catalogo core.
 */
class CpCoreController extends ControllerBase {

  /**
   * Funtion to get forget mail form
   * @return render form
   */
  public function forgetMail() {
    $form = \Drupal::formBuilder()->getForm('Drupal\cp_core\Form\ForgetMail');
    return [
      '#markup' => render($form),
    ];
  }

  /**
   * Funtion to get recovery pass form
   * @return render form
   */
  public function recoverPass() {
    $form = \Drupal::formBuilder()->getForm('Drupal\cp_core\Form\RecoverPass');
    return [
      '#markup' => render($form),
    ];
  }


  /**
   * Funtion to get register exporter form
   * @return render form
   */
  public function registerExporterFom() {
    $form = \Drupal::formBuilder()->getForm('Drupal\cp_core\Form\RegisterExporter');
    return [
      '#markup' => render($form),
    ];
  }


  /**
   * Funtion to get add company form
   * @return render form
   */
  public function addCompany() {
    $form = \Drupal::formBuilder()->getForm('Drupal\cp_core\Form\AddEditCompany');
    return [
      '#markup' => render($form),
    ];
  }

  /**
   * Funtion to get edit company form
   * @return render form
   */
  public function editCompany($nid) {
    $form = \Drupal::formBuilder()->getForm('Drupal\cp_core\Form\AddEditCompany', $nid);
    return [
      '#markup' => render($form),
    ];
  }

  /**
   * Function editUser
   * @return Jsonresponse
   */
  public function editUser() {
    $id = \Drupal::request()->request->get('companyid');
    $pwd = \Drupal::request()->request->get('password');
    $cpwd = \Drupal::request()->request->get('cpassword');
    $mail = \Drupal::request()->request->get('mail');
    $currentUser = \Drupal::currentUser();
    $user_tmp = \Drupal\user\Entity\User::load($currentUser->id());
    $flag_save = FALSE;
    $msg = t('User has been update');
    $flag = TRUE;

    if (!empty($mail)) {
      $flag_save = TRUE;
      $user_tmp->setEmail($mail);
    }
    if (!empty($pwd) && !empty($cpwd) && $pwd == $cpwd) {
      $flag_save = TRUE;
      $user_tmp->setPassword($pwd);
    }
    elseif(!empty($pwd) || !empty($cpwd)) {
      $msg = t('Password was not updated.');
      $flag = FALSE;
    }

    if ($flag_save) {
      $user_tmp->save();
      user_cookie_delete('first_login');
    }

    $response = [
      'message' => $msg,
      'flag' => $flag,
    ];

    return new JsonResponse($response);
  }

  /**
   * Function to get products categries level 1
   * @return array tids categories
   */
  public function get_categories_leve1() {
    $opts = array();
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
    $query->join('taxonomy_term__parent', 'tp', 'tp.entity_id = tfd.tid');
    $query->addField('tfd', 'tid');
    $query->addField('tfd', 'name');
    $query->condition('tp.bundle', 'categorization');
    $query->condition('tp.parent_target_id', '0', '=');
    $query->condition('tfd.langcode', $lang);
    $result = $query->execute()->fetchAll();
    if (!empty($result)) {
      foreach ($result as $key => $value) {
        $opts[$value->tid] = $value->name;
      }
    }
    return $opts;
  }

  /**
   * Function get_categories_leve2
   * @param  [type] $sector_tid
   * @param  string $type_resp
   * @return JsonResponse
   */
  public function get_categories_leve2($sector_tid, $type_resp = 'json') {
    $opts = array();

    $lang = \Drupal::languageManager()->getCurrentLanguage(LanguageInterface::TYPE_CONTENT)->getId();
    $opts[] = t('- Select -', ['langcode' => $lang]);

    $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
    $query->join('taxonomy_term__parent', 'tp', 'tp.entity_id = tfd.tid');
    $query->addField('tfd', 'tid');
    $query->addField('tfd', 'name');
    $query->condition('tp.bundle', 'categorization');
    $query->condition('tp.parent_target_id', $sector_tid);
    $query->condition('tfd.langcode', $lang);
    $result = $query->execute()->fetchAll();
    if (!empty($result)) {
      $opts['options'] = [];
      foreach ($result as $key => $value) {
        $opts['options'][$value->tid] = $value->name;
      }
    }
    if ($type_resp != 'json') {
      return $opts;
    }
    return new JsonResponse($opts);
  }


  public function get_company_categories() {
    $opts = array();
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
    $query->addField('tfd', 'tid');
    $query->addField('tfd', 'name');
    $query->condition('tfd.vid', 'categories_flow_semaphore');
    /*$query->condition('tfd.langcode', $lang);*/
    $result = $query->execute()->fetchAll();
    if (!empty($result)) {
      foreach ($result as $key => $value) {
        $opts[$value->tid] = $value->name;
      }
    }
    return $opts;
  }

  public function autocomplete_export_markets($name_country) {
    $opts = array();
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'tfd');
    $query->addField('tfd', 'tid');
    $query->addField('tfd', 'name');
    $query->condition('tfd.vid', 'locations');
    $query->condition('tfd.status', 1);
    $query->condition('tfd.langcode', $lang);
    $query->condition('tfd.name', \Drupal::database()->escapeLike($name_country) . "%", 'LIKE');
    $result = $query->execute()->fetchAll();
    if (!empty($result)) {
      foreach ($result as $key => $value) {
        $opts[] = array(
          'label' => $value->name,
          'id' => $value->tid
        );
      }
    }
    return new JsonResponse($opts);
  }


  public function _cp_core_get_company_nid_by_user($uid) {
    $nid = NULL;
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $query = \Drupal::database()->select('node_field_data', 'nfd');
    $query->addField('nfd', 'nid');
    $query->addField('nfd', 'uid');
    $query->condition('nfd.type', 'company');
    $query->condition('nfd.uid', $uid);
    $query->condition('nfd.langcode', $lang);
    $result = $query->execute()->fetchAssoc();
    if (!empty($result)) {
      $nid = $result['nid'];
    }
    return $nid;
  }


  public function _cp_core_send_mail($email, $key, $msg, $subject) {
    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'cp_core';
    $to = $email;
    $params['message'] = $msg;
    $params['title'] = $subject;
    $langcode = \Drupal::currentUser()->getPreferredLangcode();
    $send = TRUE;
    $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);

    if ($result['result'] != TRUE) {
      $message = t('There was a problem sending your email notification to @email.', array('@email' => $to));
      \Drupal::logger('mail-log')->error($message);
      return;
    }
    $message = t('An email notification has been sent to @email ', array('@email' => $to));
    \Drupal::logger('mail-log')->notice($message);
  }


  /**
   * _cp_core_get_body_and_subject_mail
   * @param  [type] $prmtrs [description]
   * @return [type]         [description]
   */
  public function _cp_core_get_body_and_subject_mail($prmtrs) {
    extract($prmtrs);
    $body = $subject = NULL;
    if (isset($key, $user_type)) {
      $suf_sub = 'en el Catálogo Oferta Exportable de ProColombia';
      $pre_str = '';
      $foot_body = '<p>Saludos,<br>';
      $foot_body .= 'Equipo catálogo procolombia</p>';

      $foot_body_thanks = '<p>Gracias,<br>';
      $foot_body_thanks .= 'Equipo catálogo procolombia</p>';

      switch ($key) {
        case 'company_create':
          if (isset($company_name)) {
            if ($user_type == 'exporter' && isset($exporter_mail)) {
              $subject = '¡Acaba de crear una empresa ' . $suf_sub .'!';
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Le notificamos que acaba de crear la empresa "' . $company_name . '". ';
              $body .= 'en el Catálogo de Oferta Exportable de ProColombia. ';
              $body .= 'Alguno de nuestros asesores se encargará de revisar la información ';
              $body .= 'suministrada y, en caso de tener toda la información correcta, ';
              $body .= 'su empresa quedará aprobada y publicada en el Catálogo Oferta Exportable. </p>';
              $body .= '<p>En el caso de no ser aprobada, se le estará notificando para que pueda ';
              $body .= 'actualizar el perfil de su empresa dentro del portal.</p>';
              $body .= $foot_body_thanks;
            }
            elseif ($user_type == 'asesor') {
              $subject = '¡Se acaba de crear una empresa ' . $suf_sub .'!';
              $body .= '<p>Asesor</p>';
              $body .= '<p>Se acaba de crear la empresa "' . $company_name . '". En el Catálogo ';
              $body .= 'de Oferta Exportable de ProColombia. Por favor ';
              $body .= 'revisar su contenido y hacer el correspondiente flujo de estados.</p>';
              $enlaces = get_url_nodo($company_name);
              $body .= $enlaces;
              $body .= $foot_body;
            }
          }
          break;

        case 'company_edit':
          if (isset($company_name, $exporter_mail)) {
            $subject = 'Acaba de editar la información de su empresa ' . $suf_sub;
            if ($user_type == 'exporter') {
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Le notificamos que acaba de editar el contenido ';
              $body .= 'de su empresa "' . $company_name . '".</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'company_edit_disabled':
          if (isset($company_name, $exporter_mail)) {
            if ($user_type == 'exporter') {
              $subject = 'Su empresa está sin publicar ' . $suf_sub;
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Acaba de editar uno o varios campos obligatorios';
              $body .= ' de la empresa "' . $company_name . '".';
              $body .= '</p>';
              $body .= '<p>Por lo tanto su empresa y productos han quedado <strong>DESPUBLICADOS ';
              $body .= 'temporalmente</strong>. Uno de nuestros asesores revisará los cambios ';
              $body .= 'y luego de verificar que la información sea correcta, quedarán ';
              $body .= 'aprobados.</p>';
              $body .= $foot_body;
            }
            elseif ($user_type == 'asesor' && isset($exporter_mail)) {
              $subject = 'Empresa despublicada '. $suf_sub;
              $body .= '<p>Asesor</p>';
              $body .= '<p>El exportador con mail '. $exporter_mail .' acaba de editar ';
              $body .= 'uno o varios campos obligatorios de la empresa "' . $company_name . '".';
              $body .= '</p>';
              $body .= '<p>Por favor recuerde hacer el flujo de estados para revisar, ';
              $body .= 'aprobar o desaprobar los nuevos cambios.</p>';
              $enlaces = get_url_nodo($company_name);
              $body .= $enlaces;
              $body .= $foot_body;
            }
          }
          break;

        case 'company_edit_enabled':
          if (isset($company_name, $exporter_mail)) {
            if ($user_type == 'exporter') {
              $subject = '¡Su empresa ha sido aprobada ' . $suf_sub .'!';
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Nuestros asesores han revisado la información de su empresa y ';
              $body .= '<strong>APROBARON</strong> el contenido de ';
              $body .= '"' . $company_name . '".</p>';
              $body .= '<p>Por lo tanto, su empresa ha quedado <strong>PUBLICADA</strong>, ';
              $body .= 'en el Catálogo Oferta Exportable de ProColombia.</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'company_chg_state':
          if (isset($company_name) && isset($new_state)) {
            if ($user_type == 'exporter') {
              $subject = '¡Su empresa ha cambiado de estado ' . $suf_sub .'!';
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>El estado de su empresa "' . $company_name . '" ha ';
              $body .= 'cambiado a <strong>' . $new_state . '</strong>.</p>';
              $body .= '<p>Cualquier cambio de estado que se presente le estaremos informando.</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'product_create':
          if (isset($product_name_es, $product_name_en)) {
            if ($user_type == 'exporter' && isset($exporter_mail)) {
              $subject = '¡Acaba de crear un producto ' . $suf_sub .'!';
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Le notificamos que acaba de crear un producto en la plataforma, ';
              $body .= 'tanto en inglés como en español con los siguientes nombres: </p>';
              $body .= '<p>Nombre en español: ' . $product_name_es . '<br>';
              $body .= 'Nombre en inglés: '. $product_name_en .'</p>';
              $body .= $foot_body;
            }
            elseif ($user_type == 'asesor') {
              $subject = '¡Se acaba de crear un producto ' . $suf_sub .'!';
              $body .= '<p>Asesor</p>';
              $body .= '<p>Se acaba de crear un producto en el Catálogo Oferta ';
              $body .= 'Exportable de ProColombia. Por favor revisar el correspondiente ';
              $body .= 'flujo de estados en el producto que tiene los siguientes nombres:</p>';
              $body .= '<p>Nombre en español: ' . $product_name_es . '<br>';
              $body .= 'Nombre en inglés: '. $product_name_en .'</p>';
              $enlaces = get_enlaces_producto($product_name_en, $product_name_es);
              $body .= $enlaces;
              $body .= $foot_body;
            }
          }
          break;

        case 'product_edit':
          if (isset($product_name_es, $product_name_en, $exporter_mail)) {
            $subject = 'Acaba de editar un producto ' . $suf_sub;
            if ($user_type == 'exporter') {
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Le notificamos que acaba de editar en el Catálogo Oferta ';
              $body .= 'Exportable, el producto que tiene ';
              $body .= 'los siguientes nombres: </p>';
              $body .= '<p>Nombre en español: ' . $product_name_es . '<br>';
              $body .= 'Nombre en inglés: '. $product_name_en .'</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'product_edit_disable':
          if (isset($product_name_es, $product_name_en, $exporter_mail, $idNodo)) {
            global $base_url;
            if ($user_type == 'exporter') {
              $subject = 'Acaba de editar la información de un producto ' . $suf_sub;
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Le notificamos que acaba de editar ' . $suf_sub . ' ';
              $body .= 'uno o varios campos sensibles del producto para ambos idiomas, los nombres del producto editado son: ';
              $body .= '</p>';
              $body .= '<p>Nombre en español: ' . $product_name_es . '<br>';
              $body .= 'Nombre en inglés: '. $product_name_en .'</p>';
              $body .= '<p>Por lo tanto su producto en ambos idiomas ha quedado ';
              $body .= '<strong>DESPUBLICADO temporalmente</strong>. Uno de ';
              $body .= 'nuestros asesores revisara los cambios realizados y  ';
              $body .= 'si no hay errores lo aprobara posteriormente.</p>';
              $body .= $foot_body;
            }
            elseif ($user_type == 'asesor' && isset($exporter_mail)) {
              $subject = 'Producto despublicado '. $suf_sub;
              $body .= '<p>Asesor</p>';
              $body .= '<p>El exportador con mail '. $exporter_mail .' acaba de editar ';
              $body .= 'uno o varios campos sensibles del producto en ambos idiomas. Los ';
              $body .= 'nombres del producto editado son:';
              $body .= '<p>Nombre en español: ' . $product_name_es . '<br>';
              $body .= 'Nombre en inglés: '. $product_name_en .'</p>';
              $body .= '</p>';
              $body .= '<p>Recuerde, por favor hacer el flujo de estados para revisar, aprobar o ';
              $body .= 'desaprobar los nuevos cambios.</p>';
              $enlaces = "<p>Obtenga más informcaión en: </p>".$base_url ."/es/node/". $idNodo."<br><br><p>Obtenga más informcaión en: </p>".$base_url ."/en/node/".$idNodo;
              $body .= $enlaces;
              $body .= $foot_body;
            }
          }
          break;

        case 'product_edit_title_disable':
          if (isset($prod_name_chg, $labelChLang, $idNodo)) {
            if ($user_type == 'exporter') {
              $subject = 'Su producto en '. $labelChLang .' ha sido desaprobado  ' . $suf_sub;
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Acaba de editar un campo sensible (Título) ';
              $body .= 'de un producto en el idioma '. $labelChLang .', el nombre del producto ';
              $body .= 'editado es "' . $prod_name_chg . '".';
              $body .= '</p>';
              $body .= '<p>Por lo tanto el producto en idioma '. $labelChLang .' ha ';
              $body .= 'quedado <strong>DESPUBLICADO temporalmente.</strong> ';
              $body .= 'Nuestros asesores revisaran los cambios realizados y si no hay errores ';
              $body .= 'lo aprobaran posteriormente.</p>';
              $body .= $enlaces;
              $body .= $foot_body;
            }
            elseif ($user_type == 'asesor' && isset($exporter_mail)) {
              $subject = 'Producto despublicado un solo idioma '. $suf_sub;
              $body .= '<p>Asesor</p>';
              $body .= '<p>El exportador con mail '. $exporter_mail .' acaba de editar ';
              $body .= 'el campo "título" del producto "'. $prod_name_chg .'" ';
              $body .= 'en el idioma '. $labelChLang . '.</p>';
              $body .= '<p>Recuerde por favor hacer el flujo de estados para revisar, ';
              $body .= 'aprobar o desaprobar los nuevos cambios</p>';
              if ($labelChLang=='inglés') {
                $idioma = 'en';
              }else{
                $idioma = 'es';
              }
              $enlaces = "<p>Obtenga más informcaión en: </p>".$base_url ."/".$idioma."/node/". $idNodo;
              $body .= $foot_body;
            }
          }
          break;

        case 'product_chg_state':
          if (isset($prod_name, $label_lang, $new_state)) {
            if ($user_type == 'exporter') {
              $subject = 'Ha cambiado el estado de su producto ' . $suf_sub;
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>El estado de su producto "' . $prod_name . '" en ';
              $body .= $label_lang . ' a cambiado a <strong>' . $new_state . '</strong>.</p>';
              $body .= '<p>Cualquier cambio de estado que se presente le estaremos informando.</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'product_edit_enabled':
          if (isset($prod_name, $label_lang, $new_state, $exporter_mail)) {
            if ($user_type == 'exporter') {
              $subject = 'Quedó aprobado su producto ' . $suf_sub .'!';
              $body .= '<p>Hola ' . $exporter_mail .'</p>';
              $body .= '<p>Nuestros asesores revisaron y <strong>APROBARON</strong> ';
              $body .= 'el contenido de su producto "' . $prod_name . '" en el ';
              $body .= 'idioma '. $label_lang .'.</p><p>Por lo tanto ';
              $body .= 'su producto en ese idioma ha quedado <strong>PUBLICADO</strong> ';
              $body .= 'en el Catálogo de Oferta Exportable de ProColombia.</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'company_change_automatic_state':
          if (isset($user_type, $count_companies)) {
            if ($user_type == 'asesor') {
              $label_count = 'Se cambiaron de estado';
              if ($count_companies == 1) {
                $label_count = 'Se cambio de estado';
              }
              $subject = 'Cambio automático de estado ' . $suf_sub .'!';
              $body .= '<p>Asesor</p>';
              $body .= '<p>'. $label_count .' <strong>En espera</strong> ';
              $body .= 'a <strong>Sin respuesta</strong><strong> ' . $count_companies . ' ';
              $body .= 'empresa(s)</strong> en el Catálogo Oferta Exportable de ProColombia.';
              $body .= '<p>Por favor revisar el correspondiente ';
              $body .= 'flujo de estados de empresas</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'product_change_automatic_state':
          if (isset($user_type, $count_companies)) {
            if ($user_type == 'asesor') {
              $label_count = 'Se cambiaron de estado';
              if ($count_companies == 1) {
                $label_count = 'Se cambio de estado';
              }
              $subject = 'Cambio automático de estado ' . $suf_sub . '!';
              $body .= '<p>Asesor</p>';
              $body .= '<p>'. $label_count .' <strong>En espera</strong> ';
              $body .= 'a <strong>Sin respuesta</strong>';

              if (!empty($count_es)) {
                $body .= '<strong> ' . $count_es . ' producto(s) en español</strong> ';
              }
              if (!empty($count_es) && !empty($count_en)) {
                $body .= ' y ';
              }
              if (!empty($count_en)) {
                $body .= '<strong> ' . $count_en . ' producto(s) en ingles</strong> ';
              }

              $body .= ' en el Catálogo Oferta Exportable de ProColombia.';
              $body .= '<p>Por favor revisar el correspondiente ';
              $body .= 'flujo de estados de productos</p>';
              $body .= $foot_body;
            }
          }
          break;

        case 'buyer_register_interest':
          if (isset($user_type)) {
            if ($user_type == 'asesor') {
              $subject = 'Comprador interesado !';
              $body .= '<p>Asesor</p>';
              $body .= '<p>Comprador interesado</p>';
              $body .= $foot_body;
            }
          }
          break;
      }
    }
    return array(
      'body' => $body,
      'subject' => $subject,
    );
  }


  /**
   * Function accessExporterRole
   * @return AccessResult value
   */
  public function accessExporterRole() {
    $current_uri = \Drupal::request()->getRequestUri();
    $current_uri = substr($current_uri, 3);
    $currentUser = \Drupal::currentUser();
    if (!$currentUser->isAnonymous()) {
      if ($current_uri == '/dashboard/company-add') {
        $uid = $currentUser->id();
        $nid_company = $this->_cp_core_get_company_nid_by_user($uid);
        if ($nid_company && is_numeric($nid_company)) {
          return AccessResult::forbidden();
        }
      }
      $currentUserRoles = $currentUser->getRoles();

      // Allowed roles to change info
      $allowedRoles = [
        'administrator',
        'exportador',
        'buyer',
      ];
      if (count(array_intersect($currentUserRoles, $allowedRoles))) {
        return AccessResult::allowed();
      }
    }
    return AccessResult::forbidden();
  }


  public function accessOwnerContent($nid) {
    $currentUser = \Drupal::currentUser();
    if (!$currentUser->isAnonymous()) {
      $currentUserRoles = $currentUser->getRoles();
      if (in_array("administrator", $currentUserRoles) or in_array("exportador", $currentUserRoles)) {
        $nodeLoad = \Drupal\node\Entity\Node::load($nid);
        if ($nodeLoad instanceof \Drupal\node\NodeInterface) {
          $uidOwn = $nodeLoad->getOwnerId();
          $currentUid = $currentUser->id();
          if ($currentUid == $uidOwn) {
            return AccessResult::allowed();
          }
        }
      }
    }
    return AccessResult::forbidden();
  }


  public function removeImageProduct() {
    $fid = \Drupal::request()->request->get('fid');
    $nid = \Drupal::request()->request->get('nid');
    $msg = t('Image has been deleted');
    $flag = TRUE;

    if (!empty($fid) && is_numeric($fid) && !empty($nid) && is_numeric($nid)) {
      $node = Node::load($nid);
      $images = $node->get('field_images')->getValue();
      $files = array();
      foreach ($images as $key => $value) {
        if ($value['target_id'] != $fid) {
          $files[] = $value;
        }
      }
      $node->field_images = $files;
      $node->save();
      $flag_save = TRUE;

      $file = \Drupal\file\Entity\File::load($fid);
      $file->delete();
      $flag_save = TRUE;
    }

    $response = [
      'message' => $msg,
      'flag' => $flag,
      'images' => $images,
      'files' => $files
    ];

    return new JsonResponse($response);
  }


  public function unpublish_products_by_company_nid($comp_nid) {
    $prods_ids = $this->get_products_by_company_nid($comp_nid);
    if (!empty($prods_ids)) {
      foreach ($prods_ids as $key => $pid) {
        $productLoadEn = Node::load($pid);
        if ($productLoadEn->hasTranslation('en')) {
          $productLoadEn = $productLoadEn->getTranslation('en');
          $productLoadEn->setPublished(FALSE);
          $productLoadEn->save();
        }
        if ($productLoadEn->hasTranslation('es')) {
          $productLoadSp = $productLoadEn->getTranslation('es');
          $productLoadSp->setPublished(FALSE);
          $productLoadSp->save();
        }
      }
    }
  }


  public function publish_products_by_company_nid($comp_nid) {
    $prods_ids = $this->get_products_by_company_nid($comp_nid);

    if (!empty($prods_ids)) {
      foreach ($prods_ids as $key => $pid) {
        $productLoadEn = Node::load($pid);
        if ($productLoadEn->hasTranslation('en')) {
          $productLoadEn = $productLoadEn->getTranslation('en');
        }
        if (!empty($productLoadEn->get('field_dependent_state')->getValue())) {
          $depen_state_en = $productLoadEn->get('field_dependent_state')->getValue()[0]['value'];
          if ($depen_state_en) {
            $productLoadEn->setPublished(TRUE);
            $productLoadEn->save();
          }
        }
        if ($productLoadEn->hasTranslation('es')) {
          $productLoadSp = $productLoadEn->getTranslation('es');
          if (!empty($productLoadSp->get('field_dependent_state')->getValue())) {
            $depen_state_sp = $productLoadSp->get('field_dependent_state')->getValue()[0]['value'];
            if ($depen_state_sp) {
              $productLoadSp->setPublished(TRUE);
              $productLoadSp->save();
            }
          }
        }
      }
    }
  }


  public function get_products_by_company_nid($comp_nid) {
    $prods_ids = array();
    $query = \Drupal::database()->select('node__field_pr_ref_company', 'nfrc');
    $query->addField('nfrc', 'entity_id', 'product_nid');
    $query->addField('nfrc', 'field_pr_ref_company_target_id', 'company_nid');
    $query->condition('nfrc.bundle', 'product');
    $query->condition('nfrc.field_pr_ref_company_target_id', $comp_nid);
    $result = $query->execute()->fetchAll();

    if (!empty($result)) {
      foreach ($result as $key => $value) {
        $prods_ids[] = $value->product_nid;
      }
    }
    return $prods_ids;
  }

  /**
   * Function get_label_by_state
   * @param  [string] $machine_state
   * @return [string] $label_state
   */
  public function get_label_by_state($machine_state) {
    $label_state = NULL;
    switch ($machine_state) {
      case 'approved':
        $label_state = 'Aprobado';
        break;

      case 'waiting':
        $label_state = 'En espera';
        break;

      case 'no_resp':
        $label_state = 'Sin respuesta';
        break;

      case 'incomp_info':
        $label_state = 'Información incompleta';
        break;
    }
    return $label_state;
  }


  /**
   * Function get_nid_by_type_data_policy
   * @param  [type] $type_data [description]
   * @return [int] $nid
   */
  public function get_nid_by_type_data_policy($type_data) {
    $nid = NULL;
    $query = \Drupal::database()->select('node__field_type_data_policy', 'nftdp');
    $query->addField('nftdp', 'entity_id', 'nid');
    $query->condition('nftdp.bundle', 'page');
    $query->condition('nftdp.field_type_data_policy_value', $type_data);
    $result = $query->execute()->fetchAssoc();
    if (!empty($result)) {
      $nid = $result['nid'];
    }
    return $nid;
  }


  /**
   * [get_link_data_policy_by_type_data_policy description]
   * @param  [type] $type_data [description]
   * @return [type]            [description]
   */
  public function get_link_data_policy_by_type_data_policy($type_data) {
    $link_data = NULL;
    if ($type_data) {
      $label = NULL;
      switch ($type_data) {
        case 'data_protection':
          $label = t('personal data processing policy');
          break;

        case 'habeas_data':
          $label = t('management Habeas data');
          break;

        case 'terms_of_use':
          $label = t('terms of use');
          break;
      }
      $opts_link = ['absolute' => TRUE, 'attributes' => ['target' => '_blank']];
      $urlRoute = Url::fromRoute('<front>', [], $opts_link);
      $nid_data = $this->get_nid_by_type_data_policy($type_data);
      if (is_numeric($nid_data)) {
        $urlRoute = Url::fromRoute('entity.node.canonical', ['node' => $nid_data], $opts_link);
      }
      $ObjLink = Link::fromTextAndUrl($label, $urlRoute);
      $ObjLinkStr = $ObjLink->toString();
      $link_data = $ObjLinkStr->getGeneratedLink();
    }

    return $link_data;
  }


  /**
   * [get_redirect_registers_301_by_source description]
   * @return [type] [description]
   */
  public function get_redirect_registers_301_by_source($source_uri, $lang) {
    $query = \Drupal::database()->select('redirect', 'rd');
    $query->addField('rd', 'rid');
    $query->condition('rd.redirect_source__path', $source_uri);
    $query->condition('rd.language', $lang);
    $check_source = $query->execute()->fetchAssoc();
    return $check_source;
  }


  /**
   * get_redirect_register_301
   * @return [type] [description]
   */
  public function get_redirect_register_301($source_uri, $redirect_uri, $lang) {
    $query = \Drupal::database()->select('redirect', 'rd');
    $query->addField('rd', 'rid');
    $query->condition('rd.redirect_source__path', $source_uri);
    $query->condition('rd.redirect_redirect__uri', $redirect_uri);
    $query->condition('rd.language', $lang);
    $check_source_dest = $query->execute()->fetchAssoc();
    return $check_source_dest;
  }


  /**
   * create_node_path_alias
   * @param  [type] $source [description]
   * @param  [type] $alias  [description]
   * @param  [type] $lang   [description]
   * @return [type]         [description]
   */
  public function create_node_path_alias($node, $lang) {
    if (!empty($node) && !empty($lang)) {
      $mod_handler = \Drupal::service('module_handler');

      if ($mod_handler->moduleExists('pathauto')) {
        $alias = NULL;
        $src_alias = '/node/' . $node->id();
        $alias = $this->get_name_alias_for_company_or_product($node, $lang, 'new');

        if (!empty($src_alias) && !empty($alias)) {
          $path_alias = $this->get_path_alias_by_source_lang($src_alias, $lang);
          if (empty($path_alias)) {
            $this->save_path_alias($src_alias, $alias, $lang);
          }
        }
      }
    }
  }

  /**
   * get_name_alias_for_company_or_product
   * @param  [type] $node [description]
   * @param  [type] $lang [description]
   * @return [type]       [description]
   */
  public function get_name_alias_for_company_or_product($node, $lang, $format) {
    $serv_clr = \Drupal::service('pathauto.alias_cleaner');
    $node_name = $node->getTitle();

    switch ($node->getType()) {
      case 'company':
        $alias = '/' . $serv_clr->cleanString($node_name);
        if ($format == 'new') {
          $alias .= '-' . $node->id();
        }
        break;

      case 'product':
        $cat_name = $subcat_name = NULL;
        $fld_name = 'field_categorization_parent';
        if (!empty($node->get($fld_name)->getValue())) {
          $tid_cat = $node->get($fld_name)->getValue()[0]['target_id'];
          $cat = Term::load($tid_cat);
          if (!empty($cat)) {
            if ($cat->hasTranslation($lang)) {
              $cat = $cat->getTranslation($lang);
              $cat_name = $cat->getName();
            }
          }
        }

        $fld_name = 'field_categorization';
        if (!empty($node->get($fld_name)->getValue())) {
          $tid_subcat = $node->get($fld_name)->getValue()[0]['target_id'];
          $subcat = Term::load($tid_subcat);
          if (!empty($subcat)) {
            if ($subcat->hasTranslation($lang)) {
              $subcat = $subcat->getTranslation($lang);
              $subcat_name = $subcat->getName();
            }
          }
        }

        if ($cat_name && $subcat_name) {
          $alias = '/' . $serv_clr->cleanString($cat_name);
          $alias .= '/' . $serv_clr->cleanString($subcat_name);
          $alias .= '/' . $serv_clr->cleanString($node_name);
          if ($format == 'new') {
            $alias .= '-' . $node->id();
          }
        }
        break;
    }
    return $alias;
  }

  /**
   * save_path_alias
   * @param  [type] $source [description]
   * @param  [type] $alias  [description]
   * @param  [type] $lang   [description]
   * @return [type]         [description]
   */
  public function save_path_alias($source, $alias, $lang) {
    $mod_handler = \Drupal::service('module_handler');
    if ($mod_handler->moduleExists('path')) {
      \Drupal::service('path_alias.repository')->save(
        $source,
        $alias,
        $lang
      );
    }
  }


  /**
   * get_path_alias_urls_by_alias
   * @param  [type] $alias [description]
   * @param  [type] $lang  [description]
   * @return [type]        [description]
   */
  private function get_path_alias_by_source_lang($source, $lang) {
    return \Drupal::service('path_alias.repository')->lookupBySystemPath($source, $lang);
  }


  /**
   * get_dashboard_path_by_user_role
   * @return [string] $path_dsbd
   */
  public function get_dashboard_path_by_user_role() {
    $account = \Drupal::currentUser();
    $currUserRoles = $account->getRoles();
    $path_dsbd = NULL;
    if (in_array("exportador", $currUserRoles)) {
      $path_dsbd = '/dashboard';
    }
    elseif (in_array("buyer", $currUserRoles)) {
      $path_dsbd = '/dashboard-buyer';
    }
    return $path_dsbd;
  }


  /**
   * execute_redirect_301_for_taxonomies
   * @param  [type] $uri_search [description]
   * @param  [type] $parent_tid [description]
   * @param  [type] $lang       [description]
   * @return [type]             [description]
   */
  public function execute_redirect_301_for_taxonomies($uri_search, $parent_tid, $lang) {
    $pref_red_uri = $lang == 'es' ? 'internal:/sectores/' : 'internal:/sectors/';
    if ($parent_tid == 0) {
      $source_uri = $uri_search . '.aspx';
      $redirect_uri = $pref_red_uri . $uri_search;
    }
    else {
      $sector = Term::load(intval($parent_tid));
      if (!empty($sector)) {
        if ($sector->hasTranslation($lang)) {
          $sector = $sector->getTranslation($lang);
        }
        if (!empty($sector->get('field_uri_search')->getValue()[0])) {
          $st_search_uri = $sector->get('field_uri_search')->getValue()[0]['value'];
          $source_uri = $st_search_uri . '/' . $uri_search . '.aspx';
          $redirect_uri = $pref_red_uri . $st_search_uri . '/' . $uri_search;
        }
      }
    }
    $this->create_redirect_301($source_uri, $redirect_uri, $lang);
  }


  /**
   * execute_redirect_301_for_nodes
   * @param  [type] $title [description]
   * @param  [type] $lang  [description]
   * @return [type]        [description]
   */
  public function execute_redirect_301_for_nodes($type, $alias, $lang, $new_alias) {
    if ($type && $alias && $lang) {
      switch ($type) {
        case 'company':
          if (!empty($new_alias)) {
            $pref_sour_uri = $lang == 'es' ? 'empresa' : 'company';
            $source_uri = $pref_sour_uri . '/' . $alias;
            $redirect_uri = 'internal:' . $new_alias;
            $this->create_redirect_301($source_uri, $redirect_uri, $lang);
          }
          break;

        case 'product':
          if (!empty($new_alias)) {
            $source_uri = ltrim($alias, '/');
            $redirect_uri = 'internal:' . $new_alias;
            $this->create_redirect_301($source_uri, $redirect_uri, $lang);
          }
          break;

        default:
          break;
      }
    }
  }


  /**
   * create_redirect_301
   * @param  [type] $source_uri   [description]
   * @param  [type] $redirect_uri [description]
   * @param  [type] $lang         [description]
   * @return [type]               [description]
   */
  public function create_redirect_301($source_uri, $redirect_uri, $lang) {
    $module_handler = \Drupal::service('module_handler');
    $bool_module_redirect = $module_handler->moduleExists('redirect');

    if ($bool_module_redirect && !empty($source_uri) && !empty($redirect_uri) && !empty($lang)) {
      $check_redirect = $this->get_redirect_register_301(
        $source_uri,
        $redirect_uri,
        $lang
      );

      if (empty($check_redirect)) {
        $check_source = $this->get_redirect_registers_301_by_source($source_uri, $lang);
        if (!empty($check_source)) {
          $redirect = redirect_repository()->load($check_source['rid']);
          $redirect->delete();
        }
        Redirect::create([
          'redirect_source' => $source_uri,
          'redirect_redirect' => $redirect_uri,
          'status_code' => 301,
          'language' => $lang,
        ])->save();

      }
    }
  }


  /**
   * Get products, based on user selection
   * @return array
   */
  public function buyerCategories() {
    $user = \Drupal::currentUser();
    $account = User::load($user->id());

    $category_list = $subcategory_list = [];
    for ($i = 1; $i <= 4; $i++) {
      $category = 'field_cat_interest_' . $i;
      $sub_category = 'field_subcat_interest_' . $i;

      if (!empty($account->$category) && $account->$category->target_id !== null) {
        $category_list[] = $account->$category->target_id;
      }
      if (!empty($account->$sub_category) && $account->$sub_category->target_id !== null) {
        $subcategory_list[] = $account->$sub_category->target_id;
      }
    }

    return [
      'categories' => $category_list,
      'subcategories' => $subcategory_list,
    ];
  }

  /**
   * Pre Register block
   *
   * @return array
   */
  public function preRegister() {
    $build['pre_register'] = \Drupal::service('plugin.manager.block')
      ->createInstance('pre_register_block')
      ->build();

    return $build;
  }
}
/*Obtener url de empresa para enviar email*/
function get_url_nodo($nombre)
{

    global $base_url;
    $nodoC = \Drupal::entityTypeManager()->getStorage('node')
        ->loadByProperties(['type' => 'company','title'=>$nombre]);
    $nodoC = reset($nodoC);
    $nodoC_url = $nodoC->toUrl()->toString();
    $urlBaseCompany = "<p>Obtenga más informcaión en: </p>".$base_url . $nodoC_url."<br>";
    return $urlBaseCompany;

}

/*obtener enlaces de productos para envio de mail*/
function get_enlaces_producto($ingles, $espanol)
{
  /*Url contenido creado*/
    global $base_url;

    $nodoEN = \Drupal::entityTypeManager()->getStorage('node')
        ->loadByProperties(['type' => 'product','title'=>$espanol]);
    if ($nodoEN != FALSE) {
      $nodoEN = reset($nodoEN);
      $nodoEN_url = $nodoEN->id();
      $urlBaseCompany = "<p>Obtenga más informcaión en: </p>".$base_url ."/es/node/". $nodoEN_url."<br><br><p>Obtenga más informcaión en: </p>".$base_url ."/en/node/".$nodoEN_url;
      return $urlBaseCompany;
    }
    else{
      $nodoES = \Drupal::entityTypeManager()->getStorage('node')
          ->loadByProperties(['type' => 'product','title'=>$ingles]);
      $nodoES = reset($nodoES);

      $nodoES_url = $nodoES->id();
      $urlBaseCompany = "<p>Obtenga más informcaión en: </p>".$base_url ."/es/node/". $nodoES_url."<br><br><p>Obtenga más informcaión en: </p>".$base_url ."/en/node/".$nodoES_url;
      return $urlBaseCompany;
    }
}

