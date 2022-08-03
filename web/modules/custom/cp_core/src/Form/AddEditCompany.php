<?php

namespace Drupal\cp_core\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\user\Entity\User;
use Drupal\Core\File\File;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Drupal\image\Entity\ImageStyle;
use Drupal\file\Entity\File as EntityFiLe;

/**
 * AddEditCompany.
 */
class AddEditCompany extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario.
    return 'add_edit_company_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $nid = NULL) {

    $type = 'add';
    if (!empty($nid) && is_numeric($nid)) {
      $companyLoadEn = Node::load($nid);
      if ($companyLoadEn->hasTranslation('en')) {
        $companyLoadEn = $companyLoadEn->getTranslation('en');
      }
      $companyLoadSp = $companyLoadEn->getTranslation('es');
      $type = 'edit';
    }

    $company_name = NULL;
    $company_nit = NULL;
    $fid_logo = 0;
    $url = NULL;
    // $url_ecommerce = '';
    $sector = NULL;
    $desc_es = NULL;
    $desc_en = NULL;
    $contact_name = NULL;
    $location = NULL;
    $charge = NULL;
    $phone = NULL;
    $cellphone = NULL;
    $email = NULL;
    $loc_name = NULL;
    $ciiu_code = NULL;

    if ($type == 'add' && !\Drupal::currentUser()->isAnonymous()) {
      $currentUser = \Drupal::currentUser();
      $currentUser = User::load($currentUser->id());
      $currentUserRoles = \Drupal::currentUser()->getRoles();
      if (!empty($currentUser) && in_array("exportador", $currentUserRoles)) {
        $company_nit = $currentUser->getDisplayName();
      }
    }
    elseif ($type == 'edit') {

      $company_name = $companyLoadEn->get('title')->getValue()[0]['value'];
      $company_nit = $companyLoadEn->get('field_nit')->getValue()[0]['value'];
      if (!empty($companyLoadEn->get('field_logo')->getValue()[0])) {
        $fid_logo = $companyLoadEn->get('field_logo')->getValue()[0]['target_id'];
      }

      if (!empty($companyLoadEn->get('field_web')->getValue()[0])) {
        $url = $companyLoadEn->get('field_web')->getValue()[0]['uri'];
      }

      // if (!empty($companyLoadEn->get('field_url_ecommerce')->getValue()[0]['value'])) {
      //   $url_ecommerce = $companyLoadEn->get('field_url_ecommerce')->getValue()[0]['value'];
      // }

      if (!empty($companyLoadEn->get('field_semaphore_category')->getValue()[0])) {
        $sector = $companyLoadEn->get('field_semaphore_category')->getValue()[0]['target_id'];
      }

      if (!empty($companyLoadSp->get('field_body')->getValue())) {
        $desc_es = $companyLoadSp->get('field_body')->getValue()[0]['value'];
      }

      if (!empty($companyLoadEn->get('field_body')->getValue())) {
        $desc_en = $companyLoadEn->get('field_body')->getValue()[0]['value'];
      }

      $contact_name = $companyLoadEn->get('field_contact_name')->getValue()[0]['value'];

      if (!empty($companyLoadEn->get('field_ubication_city')->getValue())) {
        $tid_loc = $companyLoadEn->get('field_ubication_city')->getValue()[0]['target_id'];
        if (!empty($tid_loc) && is_numeric($tid_loc)) {
          $locLoad = Term::load($tid_loc);
          $loc_name = $locLoad->getName();
          $loc_name .= ' (' . $tid_loc . ')';
        }
      }

      // CIIU codes
      if (!empty($companyLoadEn->get('field_ciiu_code')->getValue())) {
        $codes = $companyLoadEn->get('field_ciiu_code')->getValue();
        if (count($codes) > 0) {
          $ciiu_code = $hd_ciiu_code = [];
          for ($i = 0; $i < count($codes); $i++) {
            if ($codes[$i]['target_id'] != 0) {
              $ciiu = Term::load($codes[$i]['target_id']);
              $ciiu_code[$i] = $hd_ciiu_code[$i] = $ciiu->field_ciiu_code->value
                . ' - '
                . $ciiu->description->value;
              $hd_ciiu_code[$i] .= ' (' . $ciiu->tid->value . ')';
            }
          }
        }
      }

      if (!empty($companyLoadEn->get('field_charge')->getValue()[0])) {
        $charge = $companyLoadEn->get('field_charge')->getValue()[0]['value'];
      }
      if (!empty($companyLoadEn->get('field_phone')->getValue()[0])) {
        $phone = $companyLoadEn->get('field_phone')->getValue()[0]['value'];
      }
      if (!empty($companyLoadEn->get('field_cellphone')->getValue()[0])) {
        $cellphone = $companyLoadEn->get('field_cellphone')->getValue()[0]['value'];
      }
      if (!empty($companyLoadEn->get('field_email')->getValue()[0])) {
        $email = $companyLoadEn->get('field_email')->getValue()[0]['value'];
      }
    }

    $form = [
      '#prefix' => '<div class="ctn-add-edit-company ctn-form">',
      '#suffix' => '</div>',
      '#attributes' => [
        'enctype' => 'multipart/form-data',
        'data-val-type' => 'company'
      ],
    ];

    $form['#attached']['library'][] = 'cp_core/cp_core_jquery_validate';
    $form['#attached']['library'][] = 'cp_core/cp_core';

    // Form type.
    $form['type_form'] = ['#type' => 'hidden', '#value' => $type];

    // Nid.
    $form['nid'] = ['#type' => 'hidden', '#value' => $nid];

    // Company info.
    $form['company_info'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['ctn-company-info'],
      ],
    ];

    $form['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ]
    ];

    if ($type == 'edit') {
      global $base_url;
      $alias = \Drupal::service('path_alias.manager')->getAliasByPath('/node/'. $nid);
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $url_comp = $base_url . '/' . $lang . $alias;
    }

    $title = '<div class="component_heading">';
    $title .= '<h3 class="col-md-12">' . t('<b>Company</b> information') . '';
    $title .= '<a class="btn btn-cancel" href="/dashboard">' . t('Cancel') . '</a>';
    if ($type == 'edit') {
      $title .= '<a href="'. $url_comp .'" target="_blank">' . t('View company') . '</a>';
    }
    $title .= '<a href="/dashboard">' . t('Dashboard') . '</a>';
    $title .= '</h3>';
    $title .= '</div>';

    // Title
    $form['company_info']['title'] = [
      '#markup' => $title,
    ];

    $form['company_info']['head'] = [
      '#markup' => '<div class="container"><div class="row">',
    ];

    $form['company_info']['left'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $form['company_info']['left']['img_comp'] = [
      '#type' => 'managed_file',
      '#title' => t('Company logo'),
      '#name' => 'img_comp',
      '#required' => TRUE,
      '#size' => 20,
      '#upload_validators' => array(
        'file_validate_extensions' => array('png jpg jpeg'),
        'file_validate_size' => array(2*1024*1024),
      ),
      '#description' => 'Solo se permiten formatos png con un peso máximo de 2 MB y unas dimensiones mínimas de 200x200 px',
      '#upload_location' => 'public://companies/',
      '#theme' => 'image_widget',
      '#default_value' => !empty($fid_logo) ? [$fid_logo] : [],
      '#preview_image_style' => 'medium',
      '#field_suffix' => '<span class="msg"></span>',
    ];

    $form['company_info']['left']['company_name'] = [
      '#title' => t('Company name'),
      '#type' => 'textfield',
      '#size' => 60,
      '#default_value' => $company_name,
      '#required' => TRUE,
    ];

    $form['company_info']['left']['url'] = [
      '#title' => t('Company url website'),
      '#type' => 'textfield',
      '#default_value' => $url,
      '#placeholder' => 'http://www.example.com',
      '#required' => TRUE,
      '#size' => 60,
    ];

    /** URL Ecommerce disable for  */
    // $form['company_info']['left']['url_ecommerce'] = [
    //   '#title' => t('Company url ecommerce website'),
    //   '#type' => 'textfield',
    //   '#default_value' => $url_ecommerce,
    //   '#placeholder' => 'http://www.amazon.com',
    //   '#required' => FALSE,
    //   '#size' => 60,
    // ];

    $cpCoreController = new CpCoreController();
    $opts_catgs = $cpCoreController->get_company_categories();
    $form['company_info']['left']['sector'] = [
      '#type' => 'select',
      '#required' => TRUE,
      '#title' => t('Sector'),
      '#default_value' => $sector,
      '#options' => $opts_catgs,
    ];

    $form['company_info']['left']['nit'] = [
      '#type' => 'textfield',
      '#title' => t('NIT:'),
      '#size' => 60,
      '#required' => TRUE,
      '#default_value' => $company_nit,
      '#disabled' => TRUE,
    ];

    $form['company_info']['right'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    for ($i = 0; $i < 3; $i++) {
      $form['company_info']['right']['ciiu_code_' . $i] = [
        '#type' => 'textfield',
        '#required' => ($i === 0) ? TRUE : FALSE,
        '#description' => t(' Indique el código CIIU o la actividad ecónomica a la que pertenece su empresa.'),
        '#autocomplete_route_name' => 'cp_core.autocomplete_ciiu',
        '#default_value' => !empty($ciiu_code[$i]) ? $ciiu_code[$i] : NULL,
        '#maxlength' => NULL,
        '#attributes' => array(
          'class' => array('hide-autocomplete-id')
        )
      ];
      $form['company_info']['right']['hd_ciiu_code_' . $i] = [
        '#type' => 'hidden',
        '#default_value' => !empty($hd_ciiu_code[$i]) ? $hd_ciiu_code[$i] : NULL,
        '#attributes' => array(
          'class' => array('ciiu_code_' . $i)
        )
      ];
      switch ($i) {
        case 0:
          $form['company_info']['right']['ciiu_code_' . $i]['#title'] = t('Código CIIU principal o actividad ecónomica.');
          break;
        case 1:
          $form['company_info']['right']['ciiu_code_' . $i]['#title'] = t('Código CIIU secundario o actividad ecónomica.');
          break;
        case 2:
          $form['company_info']['right']['ciiu_code_' . $i]['#title'] = t('Código CIIU terciario o actividad ecónomica.');
          break;
      }

    }

    $form['company_info']['right']['descp_es'] = [
      '#title' => 'Descripción empresa en Español',
      '#type' => 'textarea',
      '#rows' => 7,
      '#default_value' => $desc_es,
      '#required' => TRUE,
    ];

    $form['company_info']['right']['descp_en'] = [
      '#title' => 'Descripción empresa en Inglés',
      '#type' => 'textarea',
      '#rows' => 7,
      '#default_value' => $desc_en,
      '#required' => TRUE,
    ];

    // Contact info.
    $form['contact_info'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['ctn-company-info'],
      ],
    ];

    $form['company_info']['foot'] = [
      '#markup' => '</div></div>',
    ];

    $title = '<div class="component_heading">';
    $title .= '<div class="container">';
    $title .= '<h3 class="col-md-12">' . t("<b>Contact</b> information") . '';
    $title .= '</div>';
    $title .= '</div>';
    $form['contact_info']['title'] = [
      '#markup' => $title,
    ];

    $form['contact_info']['head'] = [
      '#markup' => '<div class="container"><div class="row">',
    ];

    $form['contact_info']['description'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-12'],
      ],
    ];
    $form['contact_info']['description']['markup'] = [
      '#markup' => '<p><strong>! Tenga presente lo siguiente!</strong><br>La información diligenciada en estos campos es la que sera utilizada para enviar todas las notificaciones que surjan del formulario de "contactar empresa".<p>',
    ];

    $form['contact_info']['left'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $form['contact_info']['left']['contact_name'] = [
      '#type' => 'textfield',
      '#title' => t('Contact name'),
      '#required' => TRUE,
      '#default_value' => $contact_name,
      '#size' => 60,
      '#maxlength' => 130,
    ];

    $form['contact_info']['left']['contact_city'] = [
      '#type' => 'textfield',
      '#title' => t('City'),
      '#required' => TRUE,
      '#size' => 60,
      '#default_value' => $loc_name,
      '#autocomplete_route_name' => 'cp_core.autocompleteCities',
      '#autocomplete_route_parameters' => ['field_name' => 'city', 'count' => 10],
    ];

    $form['contact_info']['left']['contact_charge'] = [
      '#type' => 'textfield',
      '#title' => t('Charge'),
      '#default_value' => $charge,
      '#required' => TRUE,
      '#size' => 60,
      '#maxlength' => 130,
    ];

    $form['contact_info']['right'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $form['contact_info']['right']['contact_phone'] = [
      '#type' => 'textfield',
      '#title' => t('Phone'),
      '#default_value' => $phone,
      '#size' => 60,
      '#maxlength' => 10,
    ];

    $form['contact_info']['right']['contact_cellphone'] = [
      '#type' => 'textfield',
      '#title' => t('Cellphone'),
      '#default_value' => $cellphone,
      '#required' => TRUE,
      '#size' => 60,
      '#maxlength' => 10,
    ];

    $form['contact_info']['right']['contact_email'] = [
      '#type' => 'email',
      '#title' => t('Email'),
      '#default_value' => $email,
      '#required' => TRUE,
      '#size' => 60,
    ];

    $form['contact_info']['buttons']['head'] = [
      '#markup' => '<div class="col-md-12 buttons">',
    ];
    $form['contact_info']['buttons']['save_contact_info'] = [
      '#type' => 'submit',
      '#value' => t('Save'),
    ];

    $form['contact_info']['buttons']['cancel'] = [
      '#markup' => '<a href="/dashboard">'. t('Cancel') .'</a>',
    ];
    $form['contact_info']['buttons']['footer'] = [
      '#markup' => '</div>',
    ];

    $form['contact_info']['foot'] = [
      '#markup' => '</div></div>',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // Validate company name.
    $company_name = $form_state->getValue('company_name');
    if (is_numeric($company_name)) {
      $form_state->setErrorByName('company_name', $this->t('This field can not be numeric'));
    }
    if (strlen($company_name) > 50) {
      $form_state->setErrorByName('company_name', $this->t('The "Nombre de la Empresa" field can not be longer than 50 characters'));
    }

    // Validate url.
    $url = $form_state->getValue('url');
    if (!empty($url) && !filter_var($url, FILTER_VALIDATE_URL)) {
      $form_state->setErrorByName('url', t('Format url not valid'));
    }

    // Validate url ecommerce.
    // $url_ecommerce = $form_state->getValue('url_ecommerce');
    // if (!empty($url_ecommerce) && !filter_var($url_ecommerce, FILTER_VALIDATE_URL)) {
    //   $form_state->setErrorByName('url_ecommerce', t('Format url not valid'));
    // }

    // Descripción empresa
    $descp_es = $form_state->getValue('descp_es');
    if (strlen($descp_es) > 1000) {
      $form_state->setErrorByName('descp_es', $this->t('The "Descripción empresa" field can not be longer than 1000 characters'));
    }

    // Company description
    $descp_en = $form_state->getValue('descp_en');
    if (strlen($descp_en) > 1000) {
      $form_state->setErrorByName('descp_en', $this->t('The "Company description" field can not be longer than 1000 characters'));
    }

    // Validate mail.
    $email = $form_state->getValue('contact_email');
    if (!empty($email) && !\Drupal::service('email.validator')->isValid($email)) {
      $form_state->setErrorByName('contact_email', t('Format email not valid'));
    }

    // Validate contact name
    $contact_name = $form_state->getValue('contact_name');
    if (is_numeric($contact_name)) {
      $form_state->setErrorByName('contact_name', t('This field can not be numeric'));
    }

    // Validate charge
    $contact_charge = $form_state->getValue('contact_charge');
    if (is_numeric($contact_charge)) {
      $form_state->setErrorByName('contact_charge', t('This field can not be numeric'));
    }

    // Validate contact phone
    if ( !empty($form_state->getValue('contact_phone')) ) {
      $contact_phone = $form_state->getValue('contact_phone');
      if (strlen($contact_phone) < 7) {
        $form_state->setErrorByName('contact_phone', t('This field must have a minimum of 7 characters'));
      }
    }

    // Validate cellphone
    $contact_cellphone = $form_state->getValue('contact_cellphone');
    if (!is_numeric($contact_cellphone)) {
      $form_state->setErrorByName('contact_cellphone', t('This field must be numeric'));
    }

    if ($errors = $form_state->getErrors()) {
      $form['error_messages']['#value'] = json_encode($errors);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $company_name = $form_state->getValue('company_name');
    $url = $form_state->getValue('url');
    // $url_ecommerce = $form_state->getValue('url_ecommerce');
    $nit = $form_state->getValue('nit');
    $descp_es = $form_state->getValue('descp_es');
    $descp_en = $form_state->getValue('descp_en');
    $sector = $form_state->getValue('sector');
    $type_form = $form_state->getValue('type_form');
    $currentUser = \Drupal::currentUser();

    $cpCoreController = new CpCoreController();

    // Img company.
    $img_logo = $form_state->getValue('img_comp');
    if (!empty($img_logo)) {
      $img_logo_load = EntityFiLe::load($img_logo[0]);
      $img_logo_load->setPermanent();
      $img_logo_load->save();
      $fid_logo = $img_logo_load->id();
    }

    $contact_name = $form_state->getValue('contact_name');
    $str_contact_city = $form_state->getValue('contact_city');
    $city_contact_arr = explode("(", $str_contact_city);
    $tid_contact_city = NULL;
    if (count($city_contact_arr) > 1) {
      $tid_contact_city = rtrim($city_contact_arr[1], ")");
    }
    $tid_contact_state = NULL;
    $parent = \Drupal::entityTypeManager()
            ->getStorage('taxonomy_term')
            ->loadParents($tid_contact_city);
    if (!empty($parent)) {
      $parent = reset($parent);
      $tid_contact_state = $parent->id();
    }

    $contact_charge = $form_state->getValue('contact_charge');
    $contact_phone = $form_state->getValue('contact_phone');
    $contact_cellphone = $form_state->getValue('contact_cellphone');
    $contact_email = $form_state->getValue('contact_email');


    $admin_asesor_mail = NULL;
    $sectorLoad = Term::load($sector);
    if (!empty($sectorLoad->get('field_admin_advisor')->getValue())) {
      $uidAsesor = $sectorLoad->get('field_admin_advisor')->getValue()[0]['target_id'];
      if ($uidAsesor && is_numeric($uidAsesor)) {
        $asesorLoad = User::load($uidAsesor);
        if (!empty($asesorLoad)) {
          $admin_asesor_mail = $asesorLoad->getEmail();
        }
      }
    }

    $exporter_mail = NULL;
    if (!empty($currentUser->getEmail())) {
      $exporter_mail = $currentUser->getEmail();
    }

    $ciiu_codes = [];
    for ($i = 0; $i < 3; $i++) {
      $code = $form_state->getValue('hd_ciiu_code_' . $i);
      if (!empty($code)) {
        $ciiu_codes[] = str_replace(')', '', \array_reverse(explode(' (', $code))[0]);
      }
    }

    switch ($type_form) {
      case 'add':
        // English node.
        $node = Node::create([
          'type' => 'company',
          'langcode' => 'en',
          'created' => \Drupal::time()->getRequestTime(),
          'changed' => \Drupal::time()->getRequestTime(),
          'uid' => $currentUser->id(),
          'title' => $company_name,
          'field_body' => [
            'value' => $descp_en,
          ],
          'field_logo' => !empty($fid_logo) ? [
            'target_id' => $fid_logo,
            'alt' => $img_logo_load->getFilename(),
          ] : [],
          'field_web' => [
            'uri' => $url,
          ],
          // 'field_url_ecommerce' => [
          //   'value' => $url_ecommerce,
          // ],
          'field_nit' => [
            'value' => $nit,
          ],
          'field_semaphore_category' => [
            'target_id' => $sector,
          ],
          'field_ubication_city' => !empty($tid_contact_city) ? [
            'target_id' => $tid_contact_city,
          ] : [],
          'field_ubication_state' => !empty($tid_contact_state) ? [
            'target_id' => $tid_contact_state,
          ] : [],
          'field_contact_name' => [
            'value' => $contact_name,
          ],
          'field_charge' => [
            'value' => $contact_charge,
          ],
          'field_cellphone' => [
            'value' => $contact_cellphone,
          ],
          'field_phone' => [
            'value' => $contact_phone,
          ],
          'field_email' => [
            'value' => $contact_email,
          ],
        ]);
        $node->setPublished(FALSE);
        for ($i = 0; $i < count($ciiu_codes); $i++) {
          $node->field_ciiu_code[$i] = [
            'target_id' => $ciiu_codes[$i],
          ];
        }
        $node->save();


        // Spanish node translation.
        $node_es = $node->addTranslation('es');
        $node_es->title = $company_name;
        $node_es->field_body->value = $descp_es;
        $node_es->setPublished(FALSE);
        $node_es->save();


        // Path alias
        $cpCoreController->create_node_path_alias($node, 'en');
        $cpCoreController->create_node_path_alias($node_es, 'es');


        // Set message node create.
        if (!empty($node) && !empty($node_es)) {
          \Drupal\Core\Messenger\MessengerInterface::addMessage(t('Company content has been created correctly.'), 'status');
          $url = Url::fromRoute('view.dashboard_user.page_1');
          $form_state->setRedirectUrl($url);

          // Mail Notifications
          $key = 'company_create';
          $prmsts = array(
            'key' => $key,
            'company_name' => $company_name,
          );

          // Asesor
          if (!empty($admin_asesor_mail)) {
            $prmsts['user_type'] = 'asesor';
            $info = $cpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $cpCoreController->_cp_core_send_mail($admin_asesor_mail, $key, $info['body'], $info['subject']);
          }

          // Exporter
          if (!empty($exporter_mail)) {
            $prmsts['user_type'] = 'exporter';
            $prmsts['exporter_mail'] = $exporter_mail;
            $info = $cpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $cpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
          }
        }
        break;

      case 'edit':
        $nid = $form_state->getValue('nid');
        $companyLoadEn = Node::load($nid);
        if ($companyLoadEn->hasTranslation('en')) {
          $companyLoadEn = $companyLoadEn->getTranslation('en');
        }
        $companyLoadSp = $companyLoadEn->getTranslation('es');


        //*****************
        //*** Workflow ****
        //*****************

        $current_state = NULL;
        if (!empty($companyLoadEn->field_states->getValue())) {
          $current_state = $companyLoadEn->field_states->getValue()[0]['value'];
        }

        $bool_fields_change = FALSE;
        $bool_main_changes = FALSE;

        // Logo (All languages)
        if (!empty($companyLoadEn->field_logo->target_id)) {
          $old_logo = $companyLoadEn->field_logo->target_id;
          if ($old_logo != $fid_logo) {
            $bool_fields_change = TRUE;
          }
        }

        // Title (All languages)
        $old_title = $companyLoadEn->get('title')->getString();
        $new_title = $company_name;
        if ($old_title != $new_title) {
          $bool_fields_change = TRUE;
          $bool_main_changes = TRUE;
        }

        // Url (All languages)
        $old_url = $companyLoadEn->get('field_web')->getString();
        $new_url = $url;
        if ($old_url != $new_url) {
          $bool_fields_change = TRUE;
          $bool_main_changes = TRUE;
        }

        // Url Ecommerce (All languages)
        // $old_url_ecomm = $companyLoadEn->get('field_url_ecommerce')->getString();
        // $new_url_ecomm = $url_ecommerce;
        // if ($old_url_ecomm != $new_url_ecomm) {
        //   $bool_fields_change = TRUE;
        //   $bool_main_changes = TRUE;
        // }

        // Sector (All languages)
        if (!empty($companyLoadEn->field_semaphore_category->target_id)) {
          $old_tid_sector = $companyLoadEn->field_semaphore_category->target_id;
          if ($old_tid_sector != $sector) {
            $bool_fields_change = TRUE;
          }
        }

        // Codes CIIU (All languages)
        if (!empty($companyLoadEn->field_ciiu_code->getValue())) {
          $old_ciiu_codes = $companyLoadEn->field_ciiu_code->getValue();
          if (count($ciiu_codes) != count($old_ciiu_codes)) {
            $bool_fields_change = TRUE;
          }
          else {
            foreach ($old_ciiu_codes as $key => $val) {
              if ($val['target_id'] != $ciiu_codes[$key]) {
                $bool_fields_change = TRUE;
                break;
              }
            }
          }
        }

        // Description EN
        if (!empty($companyLoadEn->field_body->getValue()[0])) {
          $old_descp_en = $companyLoadEn->field_body->getValue()[0]['value'];
          if ($descp_en != $old_descp_en) {
            $bool_fields_change = TRUE;
          }
        }

        // Description SP
        if (!empty($companyLoadSp->field_body->getValue()[0])) {
          $old_descp_es = $companyLoadSp->field_body->getValue()[0]['value'];
          if ($descp_es != $old_descp_es) {
            $bool_fields_change = TRUE;
          }
        }

        // Contact name (All languages)
        if (!empty($companyLoadEn->field_contact_name->getValue()[0])) {
          $old_contact_name = $companyLoadEn->field_contact_name->getValue()[0]['value'];
          if ($contact_name != $old_contact_name) {
            $bool_fields_change = TRUE;
          }
        }

        // City (All languages)
        if (!empty($companyLoadEn->field_ubication_city->target_id)) {
          $old_city_tid = $companyLoadEn->field_ubication_city->target_id;
          if ($tid_contact_city != $old_city_tid) {
            $bool_fields_change = TRUE;
          }
        }

        // Charge (All languages)
        if (!empty($companyLoadEn->field_charge->getValue()[0])) {
          $old_charge = $companyLoadEn->field_charge->getValue()[0]['value'];
          if ($contact_charge != $old_charge) {
            $bool_fields_change = TRUE;
          }
        }

        // Phone (All languages)
        if (!empty($companyLoadEn->field_phone->getValue()[0])) {
          $old_phone = $companyLoadEn->field_phone->getValue()[0]['value'];
          if ($contact_phone != $old_phone) {
            $bool_fields_change = TRUE;
          }
        }

        // Cellphone (All languages)
        if (!empty($companyLoadEn->field_cellphone->getValue()[0])) {
          $old_cellphone = $companyLoadEn->field_cellphone->getValue()[0]['value'];
          if ($contact_cellphone != $old_cellphone) {
            $bool_fields_change = TRUE;
          }
        }

        // Email (All languages)
        if (!empty($companyLoadEn->field_email->getValue()[0])) {
          $old_email = $companyLoadEn->field_email->getValue()[0]['value'];
          if ($contact_email != $old_email) {
            $bool_fields_change = TRUE;
          }
        }

        // Check if have changes
        if ($bool_fields_change && !empty($current_state)) {
          $bool_stat_incomp_info = $current_state == 'incomp_info';
          $bool_stat_approv_with_chgs = $current_state == 'approved' && $bool_main_changes;

          if ($bool_stat_incomp_info || $bool_stat_approv_with_chgs)  {
            $companyLoadEn->field_states->value = 'waiting';
            $companyLoadEn->setPublished(FALSE);
            $companyLoadSp->field_states->value = 'waiting';
            $companyLoadSp->setPublished(FALSE);
            $cpCoreController->unpublish_products_by_company_nid($nid);

            // Mail Notifications
            $key = 'company_edit_disabled';
            $prmsts = array(
              'key' => $key,
              'company_name' => $company_name,
            );

            // Asesor
            if (!empty($admin_asesor_mail) && !empty($exporter_mail)) {
              $prmsts['user_type'] = 'asesor';
              $prmsts['exporter_mail'] = $exporter_mail;
              $info = $cpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
              $cpCoreController->_cp_core_send_mail($admin_asesor_mail, $key, $info['body'], $info['subject']);
            }

            // Exporter
            if (!empty($exporter_mail)) {
              $prmsts['user_type'] = 'exporter';
              $prmsts['exporter_mail'] = $exporter_mail;
              $info = $cpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
              $cpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
            }
          }
        }


        //********************
        //*** Save Company ***
        //********************

        $companyLoadEn->title->value = $company_name;
        $companyLoadEn->field_body->value = $descp_en;
        if (!empty($fid_logo)) {
          $companyLoadEn->field_logo->target_id = $fid_logo;
        }
        $companyLoadEn->field_web->uri = $url;
        // $companyLoadEn->field_url_ecommerce->value = $url_ecommerce;
        $companyLoadEn->field_nit->value = $nit;
        $companyLoadEn->field_semaphore_category->target_id = $sector;
        if (!empty($tid_contact_city)) {
          $companyLoadEn->field_ubication_city->target_id = $tid_contact_city;
        }
        if (!empty($tid_contact_state)) {
          $companyLoadEn->field_ubication_state->target_id = $tid_contact_state;
        }
        $companyLoadEn->field_contact_name->value = $contact_name;
        $companyLoadEn->field_charge->value = $contact_charge;
        $companyLoadEn->field_cellphone->value = $contact_cellphone;
        $companyLoadEn->field_phone->value = $contact_phone;
        $companyLoadEn->field_email->value = $contact_email;

        $companyLoadEn->field_ciiu_code = array();
        for ($i = 0; $i < count($ciiu_codes); $i++) {
          $companyLoadEn->field_ciiu_code[$i] = [
            'target_id' => $ciiu_codes[$i],
          ];
        }
        $companyLoadEn->save();


        $companyLoadSp = $companyLoadEn->getTranslation('es');
        $companyLoadSp->title = $company_name;
        $companyLoadSp->field_body->value = $descp_es;
        $companyLoadSp->save();



        // Set message update node.
        if (!empty($companyLoadEn) && !empty($companyLoadSp)) {
          \Drupal\Core\Messenger\MessengerInterface::addMessage(t('Company content has been update correctly.'), 'status');

          // Mail Notifications
          if (!$bool_fields_change) {
            $key = 'company_edit';
            $prmsts = array(
              'key' => $key,
              'company_name' => $company_name,
            );

            // Exporter
            if (!empty($exporter_mail)) {
              $prmsts['user_type'] = 'exporter';
              $prmsts['exporter_mail'] = $exporter_mail;
              $info = $cpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
              $cpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
            }
          }
        }
        break;
    }
  }

}
