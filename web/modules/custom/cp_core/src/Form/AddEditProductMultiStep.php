<?php

namespace Drupal\cp_core\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\Core\File\FileSystemInterface;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\user\Entity\User;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Drupal\file\Entity\File as EntityFiLe;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountInterface;

/**
 *
 */
class AddEditProductMultiStep extends FormBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

    /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $termStorage;

    /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $userStorage;

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $fileStorage;


  /**
   * The config_factory object.
   *
   * @var \Drupal\Core\Config\ConfigFactory
   */
  protected $configFactory;

  /**
   * Current Account Interface.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $account;

  /**
   * Step value.
   *
   * @var int
   */
  protected $step;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    ConfigFactoryInterface $config_factory,
    AccountInterface $account
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->nodeStorage = $entity_type_manager->getStorage('node');
    $this->termStorage = $entity_type_manager->getStorage('taxonomy_term');
    $this->userStorage = $entity_type_manager->getStorage('user');
    $this->fileStorage = $entity_type_manager->getStorage('file');
    $this->configFactory = $config_factory;
    $this->account = $account;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('config.factory'),
      $container->get('current_user')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'add_edit_product_multistep_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $nid = NULL) {
    $type = 'add';
    $disable = FALSE;
    if (!empty($nid) && is_numeric($nid)) {
      $productLoadEn = $this->nodeStorage->load($nid);
      $productLoadSp = $productLoadEn->getTranslation('es');
      if ($productLoadEn->hasTranslation('en')) {
        $productLoadEn = $productLoadEn->getTranslation('en');
      }
      $type = 'edit';
    }

    $currentUser = \Drupal::currentUser();
    $uid = $currentUser->id();
    $CpCoreController = new CpCoreController();
    $company_nid = $CpCoreController->_cp_core_get_company_nid_by_user($uid);
    if (empty($company_nid)) {
      $markup = '<h3>' . $this->t('Notice') . '</h3>';
      $markup .= '<p class="error-not-company">' . $this->t('You need to create a company to create your products.') . '</p>';
      $form = [
        '#prefix' => '<div class="ctn-error-not-company">',
        '#suffix' => '</div>',
        '#markup' => $markup,
      ];
      return $form;
    }

    if (empty($this->step)) {
      $this->step = 1;
    }

    switch($step) {
      case 1:
        break;

      case 2:
        break;

      case 3:
        break;

      case 4:
        break;

      case 5:
        break;

      case 6:
        break;

      case 1:
        break;

    }

    if ($type == 'edit') {
      global $base_url;
      $alias = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $nid);
      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $url_comp = $base_url . '/' . $lang . $alias;
    }

    $heading = '<div class="component_heading">';
    $heading .= '<div class="container prepen-messages">';
    $heading .= '<h3 class="col-md-12">';
    $heading .= t('<b>Product</b> information');
    $heading .= '<a href="/dashboard">' . t('Dashboard') . '</a>';
    if ($type == 'edit') {
      $heading .= '<a href="' . $url_comp . '" target="_blank">' . t('View product') . '</a>';
    }
    $heading .= '<a class="btn btn-cancel" href="/dashboard">' . t('Cancel') . '</a>';
    $heading .= '</h3></div></div>';

    // In line messages.
    $prep_msg = '<div class="container prepend-messages"></div>';

    $class = '';
    if ($type == 'edit') {
      $class = 'action-edit';
    }
    $form = [
      '#prefix' => $heading . '<div class="ctn-add-edit-product ctn-form container ' . $class . '">',
      '#suffix' => '</div>',
      '#attributes' => [
        'enctype' => 'multipart/form-data',
        'data-val-type' => 'product',
        'class' => ['form-prod-hs'],
      ],
    ];

    $form['#attached']['library'][] = 'cp_core/cp_core_jquery_validate';
    $form['#attached']['library'][] = 'cp_core/cp_core';

    // Hidden fields.
    $form['type_form'] = ['#type' => 'hidden', '#value' => $type];
    $form['nid'] = ['#type' => 'hidden', '#value' => $nid];
    $form['company_nid'] = ['#type' => 'hidden', '#value' => $company_nid];

    // **********************
    // **** Sp/En fields ****
    // **********************
    // Product info.
    $form['prod_info_sp_en'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['ctn-product-info row'],
      ],
    ];

    $form['prod_info_sp_en']['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ],
    ];

    // ------------
    // Left fields
    // ------------
    $form['prod_info_sp_en']['left'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $title_es_fields = '<h3 class="col-md-12">';
    $title_es_fields .= 'Información en Español';
    $title_es_fields .= '</h3>';
    $form['prod_info_sp_en']['left']['title'] = [
      '#markup' => $title_es_fields,
    ];

    $name_es = '';
    if ($type == 'edit') {
      $name_es = $productLoadSp->get('title')->getString();
    }
    $form['prod_info_sp_en']['left']['product_name_es'] = [
      '#type' => 'textfield',
      '#size' => 60,
      '#title' => 'Nombre producto en Español',
      '#default_value' => $name_es,
      '#required' => TRUE,
    ];

    $default = NULL;
    if ($type == 'edit' && !empty($productLoadSp->get('field_body')->getValue())) {
      $default = $productLoadSp->get('field_body')->getValue()[0]['value'];
    }
    $form['prod_info_sp_en']['left']['descp_es'] = [
      '#title' => 'Descripción producto en Español',
      '#type' => 'textarea',
      '#default_value' => $default,
      '#required' => TRUE,
      '#disabled' => $disable,
    ];

    $default = [];
    if ($type == 'edit') {
      $files = $productLoadSp->get('field_file')->getValue();
      foreach ($files as $value) {
        $default[] = $value['target_id'];
      }
    }
    $form['prod_info_sp_en']['left']['technique_file_es'] = [
      '#type' => 'managed_file',
      '#name' => 'technique_file_es',
      '#title' => 'Ficha técnica en Español',
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx'],
        'file_validate_size' => [(1 * 1024 * 1024) / 2],
      ],
      '#description' => 'Solo se permiten los formatos pdf, doc, docx con un peso máximo de 500K.',
      '#upload_location' => 'public://products/',
      // '#disabled' => $disable,
      '#default_value' => $default,
    ];

    $default = [];
    if ($type == 'edit') {
      $files = $productLoadSp->get('field_file_certifications')->getValue();
      foreach ($files as $value) {
        $default[] = $value['target_id'];
      }
    }
    $form['prod_info_sp_en']['left']['certificate_es'] = [
      '#type' => 'managed_file',
      '#name' => 'certificate_es',
      '#title' => 'Certificado en Español',
      '#multiple' => TRUE,
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Solo se permiten los formatos pdf, doc, docx con un peso máximo de 2MB.',
      '#upload_location' => 'public://certificates/',
      '#default_value' => $default,
    ];

    // ------------
    // Right fields
    // ------------
    $form['prod_info_sp_en']['right'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $title_en_fields = '<h3 class="col-md-12">';
    $title_en_fields .= 'Información en Inglés';
    $title_en_fields .= '</h3>';
    $form['prod_info_sp_en']['right']['title'] = [
      '#markup' => $title_en_fields,
    ];

    $name_en = '';
    if ($type == 'edit') {
      $name_en = $productLoadEn->get('title')->getString();
    }
    $form['prod_info_sp_en']['right']['product_name_en'] = [
      '#type' => 'textfield',
      '#size' => 60,
      '#title' => 'Nombre del producto en Inglés',
      '#default_value' => $name_en,
      '#required' => TRUE,
    ];

    $default = NULL;
    if ($type == 'edit' && !empty($productLoadEn->get('field_body')->getValue())) {
      $default = $productLoadEn->get('field_body')->getValue()[0]['value'];
    }
    $form['prod_info_sp_en']['right']['descp_en'] = [
      '#title' => 'Descripción producto en Inglés',
      '#type' => 'textarea',
      '#default_value' => $default,
      '#required' => TRUE,
      '#disabled' => $disable,
    ];

    $default = [];
    if ($type == 'edit') {
      $files = $productLoadEn->get('field_file')->getValue();
      foreach ($files as $value) {
        $default[] = $value['target_id'];
      }
    }
    $form['prod_info_sp_en']['right']['technique_file_en'] = [
      '#type' => 'managed_file',
      '#name' => 'technique_file_en',
      '#title' => 'Ficha técnica en Inglés',
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx'],
        'file_validate_size' => [(1 * 1024 * 1024) / 2],
      ],
      '#description' => 'Solo se permiten los formatos pdf, doc, docx con un peso máximo de 500K.',
      '#upload_location' => 'public://products/',
      '#default_value' => $default,
    ];

    $default = [];
    if ($type == 'edit') {
      $files = $productLoadEn->get('field_file_certifications')->getValue();
      foreach ($files as $value) {
        $default[] = $value['target_id'];
      }
    }

    $form['prod_info_sp_en']['right']['certificate_en'] = [
      '#type' => 'managed_file',
      '#name' => 'certificate_en',
      '#title' => 'Certificado en Inglés',
      '#multiple' => TRUE,
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['pdf doc docx'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Solo se permiten los formatos pdf, doc, docx con un peso máximo de 2MB.',
      '#upload_location' => 'public://certificates/',
      '#default_value' => $default,
    ];

    // ************************
    // **** General fields ****
    // ************************
    // Product info.
    $form['prod_info_all_lang'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['ctn-product-info-all-lang row'],
      ],
    ];

    $title_all_lang_fields = '<h3 class="col-md-12">';
    $title_all_lang_fields .= 'Campos para ambos idiomas';
    $title_all_lang_fields .= '</h3>';
    $form['prod_info_all_lang']['title_all_lang_fields'] = [
      '#markup' => $title_all_lang_fields,
    ];

    $form['prod_info_all_lang']['left'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6 ctn-hs'],
      ],
    ];

    $default = '';
    if ($type == 'edit') {
      $default = $productLoadEn->get('field_product_type')->getString();
    }
    $form['prod_info_all_lang']['left']['prod_type'] = [
      '#type' => 'select',
      '#title' => 'Seleccione si es un producto o servicio',
      '#required' => TRUE,
      '#default_value' => !empty($default) ? $default : NULL,
      '#options' => [
        'product' => 'Producto',
        'service' => 'Servicio',
      ],
    ];

    /*


    $default = '';
    if ($type == 'edit') {
    $default = $productLoadSp->get('field_tariff_heading')->getString();
    }
    $form['prod_info_all_lang']['left']['tariff_position'] = array(
    '#type' => 'textfield',
    '#size' => 60,
    '#minlength' => 6,
    '#maxlength' => 10,
    '#title' => 'Partida arancelaria',
    '#default_value' => $default,
    '#states' => array(
    'visible' => array(
    ':input[name="prod_type"]' => array('value' => 'product'),
    ),
    ),
    );*/

    $default = [];
    if ($type == 'edit') {
      $relations = $productLoadEn->get('field_partida_arancelaria_tax')->getValue();
      if (!empty($relations)) {
        foreach ($relations as $key => $value) {
          $term = Term::load($value['target_id']);
          if (!empty($term)) {
            $default[] = $term;
          }
        }
      }
    }

    $form['prod_info_all_lang']['left']['partida_arancelaria_tax'] = [
      '#type' => 'entity_autocomplete',
      '#maxlength' => 400,
      '#title' => 'Partida arancelaria',
      '#target_type' => 'taxonomy_term',
      '#description' => 'Seleccione la partida arancelaria que mas se ajuste',
      '#tags' => TRUE,
      // '#required' => TRUE,
      '#default_value' => $default,
      '#selection_settings' => [
        'include_anonymous' => TRUE,
        'target_bundles' => ['partida_arancelaria'],
      ],
      '#states' => [
        'visible' => [
          ':input[name="prod_type"]' => ['value' => 'product'],
        ],
      ],
    ];

    $tid_parent = NULL;
    if ($type == 'edit') {
      if (!empty($productLoadEn->get('field_categorization_parent')->getValue())) {
        $tid_parent = $productLoadEn->get('field_categorization_parent')->getValue()[0]['target_id'];
      }
    }
    $CpCoreController = new CpCoreController();
    $opts_catgs = $CpCoreController->get_categories_leve1();
    $form['prod_info_all_lang']['left']['sector'] = [
      '#type' => 'select',
      '#required' => TRUE,
      '#title' => 'Categoría',
      '#default_value' => $tid_parent,
      '#disabled' => $disable,
      '#options' => $opts_catgs,
      '#attributes' => [
        'class' => ['sl-sector'],
      ],
    ];

    $tid_child = NULL;
    $opts_sub_catgs = [];
    if ($type == 'edit') {
      if ($tid_parent && is_numeric($tid_parent)) {
        $opts_sub_catgs = $CpCoreController->get_categories_leve2($tid_parent, 'array');
      }
      if (!empty($productLoadEn->get('field_categorization')->getValue())) {
        $tid_child = $productLoadEn->get('field_categorization')->getValue()[0]['target_id'];
      }
    }
    $form['prod_info_all_lang']['left']['subsector'] = [
      '#prefix' => '<div class="ctn-sl-sub-sector">',
      '#suffix' => '</div>',
    ];
    $form['prod_info_all_lang']['left']['subsector'] = [
      '#type' => 'select',
      '#title' => 'Subcategoría',
      '#validated' => TRUE,
      '#required' => TRUE,
      '#default_value' => $tid_child,
      '#options' => $opts_sub_catgs,
      '#attributes' => [
        'class' => ['sl-sub-sector'],
      ],
    ];

    $form['prod_info_all_lang']['right'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $default = [];
    if ($type == 'edit') {
      $relations = $productLoadSp->get('field_export_markets')->getValue();
      if (!empty($relations)) {
        foreach ($relations as $key => $value) {
          $term = Term::load($value['target_id']);
          if (!empty($term)) {
            $default[] = $term;
          }
        }
      }
    }
    $form['prod_info_all_lang']['right']['export_markets'] = [
      '#type' => 'entity_autocomplete',
      '#maxlength' => 200,
      '#title' => 'Mercados donde ha exportado',
      '#target_type' => 'taxonomy_term',
      '#description' => 'Agregar países separados por comas',
      '#tags' => TRUE,
      '#default_value' => $default,
      '#selection_settings' => [
        'include_anonymous' => FALSE,
        'target_bundles' => ['countries'],
      ],
    ];

    // ########################
    // ###  Images product  ###
    // ########################
    if ($type == 'edit') {
      $imgs = $productLoadEn->get('field_images')->getValue();
    }
    $form['product_images'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['ctn-product-images row'],
      ],
    ];

    $form['product_images']['title'] = [
      '#markup' => '<h3 class="col-md-12">' . 'Agregar imágenes de producto' . '</h3><p style="padding-left:30px;">' . 'Se recomienda cargar fotografías reales del producto en buena calidad para mejorar el posicionamiento de su producto dentro del Catálogo.' . '</p>',
    ];

    $form['product_images']['left'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $form['product_images']['right'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-6'],
      ],
    ];

    $default = [];
    if ($type == 'edit' && isset($imgs[0])) {
      $default = [$imgs[0]['target_id']];
    }
    $form['product_images']['left']['img_1'] = [
      '#prefix' => '<div class="ctn-img-validate">',
      '#suffix' => '</div>',
      '#type' => 'managed_file',
      '#name' => 'img_1',
      '#required' => TRUE,
      '#title' => 'Imagen 1 - Principal',
      '#upload_validators' => [
        'file_validate_extensions' => ['jpg jpeg'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Unicamente son permitidos formatos en jpg jpeg con un peso máximo de 2MB
        y unas dimensiones mínimas de 560x540 px',
      '#upload_location' => 'public://images_products/',
      '#theme' => 'image_widget',
      '#preview_image_style' => 'medium',
      '#default_value' => $default,
      '#field_suffix' => '<span class="msg"></span>',
    ];

    $default = [];
    if ($type == 'edit' && isset($imgs[1])) {
      $default = [$imgs[1]['target_id']];
    }
    $form['product_images']['left']['img_2'] = [
      '#type' => 'managed_file',
      '#name' => 'img_2',
      '#title' => 'Imagen 2',
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['png jpg jpeg'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Unicamente son permitidos formatos en jpg jpeg con un peso máximo de 2MB
        y unas dimensiones mínimas de 560x540 px',
      '#upload_location' => 'public://images_products/',
      '#theme' => 'image_widget',
      '#preview_image_style' => 'medium',
      '#default_value' => $default,
    ];

    $default = [];
    if ($type == 'edit' && isset($imgs[2])) {
      $default = [$imgs[2]['target_id']];
    }
    $form['product_images']['left']['img_3'] = [
      '#type' => 'managed_file',
      '#name' => 'img_3',
      '#title' => 'Imagen 3',
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['png jpg jpeg'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Unicamente son permitidos formatos en jpg jpeg con un peso máximo de 2MB
        y unas dimensiones mínimas de 560x540 px',
      '#upload_location' => 'public://images_products/',
      '#theme' => 'image_widget',
      '#preview_image_style' => 'medium',
      '#default_value' => $default,
    ];

    $default = [];
    if ($type == 'edit' && isset($imgs[3])) {
      $default = [$imgs[3]['target_id']];
    }
    $form['product_images']['right']['img_4'] = [
      '#type' => 'managed_file',
      '#name' => 'img_4',
      '#title' => 'Imagen 4',
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['png jpg jpeg'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Unicamente son permitidos formatos en jpg jpeg con un peso máximo de 2MB
        y unas dimensiones mínimas de 560x540 px',
      '#upload_location' => 'public://images_products/',
      '#theme' => 'image_widget',
      '#preview_image_style' => 'medium',
      '#default_value' => $default,
    ];

    $default = [];
    if ($type == 'edit' && isset($imgs[4])) {
      $default = [$imgs[4]['target_id']];
    }
    $form['product_images']['right']['img_5'] = [
      '#type' => 'managed_file',
      '#name' => 'img_5',
      '#title' => 'Imagen 5',
      '#size' => 20,
      '#upload_validators' => [
        'file_validate_extensions' => ['png jpg jpeg'],
        'file_validate_size' => [2 * 1024 * 1024],
      ],
      '#description' => 'Unicamente son permitidos formatos en jpg jpeg con un peso máximo de 2MB
        y unas dimensiones mínimas de 560x540 px',
      '#upload_location' => 'public://images_products/',
      '#theme' => 'image_widget',
      '#preview_image_style' => 'medium',
      '#default_value' => $default,
    ];

    $form['buttons'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['col-md-12'],
      ],
    ];

    $form['buttons']['save'] = [
      '#type' => 'submit',
      '#value' => t('Save'),
    ];

    $form['buttons']['cancel'] = [
      '#markup' => '<a href="/dashboard">' . t('Cancel') . '</a>',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $product_name_en = $form_state->getValue('product_name_en');
    $product_name_es = $form_state->getValue('product_name_es');
    $descp_en = $form_state->getValue('descp_en');
    $descp_es = $form_state->getValue('descp_es');
    /*$tariff_position = $form_state->getValue('tariff_position');*/

    // Nombre producto.
    if (strlen($product_name_es) > 150) {
      $form_state->setErrorByName('product_name_es', $this->t('The "Nombre producto" field can not be longer than 150 characters'));
    }
    // Product name.
    if (strlen($product_name_en) > 150) {
      $form_state->setErrorByName('product_name_en', 'The "Product name" field can not be longer than 150 characters');
    }
    // Descripción producto.
    if (strlen($descp_en) > 1000) {
      $form_state->setErrorByName('descp_en', 'The "Descripción producto" field can not be longer than 1000 characters');
    }
    // Product description.
    if (strlen($descp_es) > 1000) {
      $form_state->setErrorByName('descp_es', $this->t('The "Product description" field can not be longer than 1000 characters'));
    }
    // Partida arancelaria.
    /*    if (!empty($tariff_position) && strlen($tariff_position) < 6) {
    $form_state->setErrorByName('tariff_position', $this->t('The "Partida arancelaria" field can not have less than 6 characters'));
    }
    if (!empty($tariff_position) && strlen($tariff_position) > 10) {
    $form_state->setErrorByName('tariff_position', $this->t('The "Partida arancelaria" field can not be longer than 10 characters'));
    }
    if (!empty($tariff_position) && is_integer($tariff_position)) {
    $form_state->setErrorByName('tariff_position', $this->t('The "Partida arancelaria" field must be an number'));
    }*/
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $img_product = $form_state->getValue('img_product');
    $product_name_en = $form_state->getValue('product_name_en');
    $product_name_es = $form_state->getValue('product_name_es');
    $sector = $form_state->getValue('sector');
    $subsector = $form_state->getValue('subsector');
    $export_markets = $form_state->getValue('export_markets');
    $type_form = $form_state->getValue('type_form');
    $descp_en = $form_state->getValue('descp_en');
    $descp_es = $form_state->getValue('descp_es');
    $type_form = $form_state->getValue('type_form');
    $nid = $form_state->getValue('nid');
    $company_nid = $form_state->getValue('company_nid');
    $partida_arancelaria_tax = $form_state->getValue('partida_arancelaria_tax');
    /* $tariff_position = $form_state->getValue('tariff_position');*/
    /*$prod_type = $form_state->getValue('prod_type');*/
    $currentUser = \Drupal::currentUser();
    $CpCoreController = new CpCoreController();

    /*die(var_dump($partida_arancelaria_tax));*/

    if ($product_name_en) {
      $altImagenes = $product_name_en . ' Image';
    }
    else {
      $altImagenes = $product_name_es . ' Imagen';
    }

    // Data sheet En.
    $technique_file_en = $form_state->getValue('technique_file_en');
    if (!empty($technique_file_en)) {
      $technique_file_load_en = EntityFiLe::load($technique_file_en[0]);
      $technique_file_load_en->setPermanent();
      $technique_file_load_en->save();
      $fid_technique_file_en = $technique_file_load_en->id();
    }

    // Data sheet Es.
    $technique_file_es = $form_state->getValue('technique_file_es');
    if (!empty($technique_file_es)) {
      $technique_file_load_es = EntityFiLe::load($technique_file_es[0]);
      $technique_file_load_es->setPermanent();
      $technique_file_load_es->save();
      $fid_technique_file_es = $technique_file_load_es->id();
    }

    // Certifications En.
    $certificate_file_en = $form_state->getValue('certificate_en');
    $bool_exist_cert_en = FALSE;
    $fid_certificate_file_en = [];
    if (!empty($certificate_file_en)) {
      foreach ($certificate_file_en as $fid) {
        $certificate_file_load_en = EntityFiLe::load($fid);
        $certificate_file_load_en->setPermanent();
        $certificate_file_load_en->save();
        $fid_certificate_file_en[] = ['target_id' => $certificate_file_load_en->id(), 'alt' => $certificate_file_load_en->getFilename()];
        $bool_exist_cert_en = TRUE;
      }
    }

    // Certifications Es.
    $certificate_file_es = $form_state->getValue('certificate_es');
    $bool_exist_cert_es = FALSE;
    $fid_certificate_file_es = [];
    if (!empty($certificate_file_es)) {
      foreach ($certificate_file_es as $fid) {
        $certificate_file_load_es = EntityFiLe::load($fid);
        $certificate_file_load_es->setPermanent();
        $certificate_file_load_es->save();
        $fid_certificate_file_es[] = ['target_id' => $certificate_file_load_es->id(), 'alt' => $certificate_file_load_es->getFilename()];
        $bool_exist_cert_es = TRUE;
      }
    }

    // Images
    // $destination = \Drupal::config('system.file')->get('default_scheme') . '://products';
    // prepareDirectory($destination, CREATE_DIRECTORY | MODIFY_PERMISSIONS);.
    $destination = \Drupal::config('file_system')->get('default_scheme') . '://products';
    $file_system = \Drupal::service('file_system');
    $file_system->prepareDirectory($destination, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS);
    $images_product = [];
    for ($i = 1; $i < 6; $i++) {
      $img_fid = $form_state->getValue('img_' . $i);
      if (!empty($img_fid)) {
        $img_load = EntityFiLe::load($img_fid[0]);
        $img_load->setPermanent();
        $img_load->save();
        $images_product[] = [
          'target_id' => $img_load->id(),
          'alt' => $altImagenes,
        ];
      }
    }

    $admin_asesor_mail = NULL;
    $companyLoad = Node::load($company_nid);
    if (!empty($companyLoad)) {
      if (!empty($companyLoad->get('field_semaphore_category')->getValue()[0])) {
        $sector_id = $companyLoad->get('field_semaphore_category')->getValue()[0]['target_id'];
        if (is_numeric($sector_id)) {
          $sectorLoad = Term::load($sector_id);
          if (!empty($sectorLoad->get('field_admin_advisor')->getValue())) {
            $uidAsesor = $sectorLoad->get('field_admin_advisor')->getValue()[0]['target_id'];
            if ($uidAsesor && is_numeric($uidAsesor)) {
              $asesorLoad = User::load($uidAsesor);
              if (!empty($asesorLoad)) {
                $admin_asesor_mail = $asesorLoad->getEmail();
              }
            }
          }
        }

      }
    }

    $exporter_mail = NULL;
    if (!empty($currentUser->getEmail())) {
      $exporter_mail = $currentUser->getEmail();
    }

    switch ($type_form) {
      case 'add':
        // English node.
        $node = Node::create([
          'type' => 'product',
          'langcode' => 'en',
          'created' => \Drupal::time()->getRequestTime(),
          'changed' => \Drupal::time()->getRequestTime(),
          'uid' => $currentUser->id(),
          'title' => $product_name_en,
          'field_body' => [
            'value' => $descp_en,
          ],
          /*          'field_tariff_heading' => $prod_type != 'product' ? [] : [
            'value' => $tariff_position,
          ],*/
          'field_file' => !empty($fid_technique_file_en) ? [
            'target_id' => $fid_technique_file_en,
            'alt' => $altImagenes,
          ] : [],
          'field_categorization_parent' => [
            'target_id' => $sector,
          ],
          'field_categorization' => [
            'target_id' => $subsector,
          ],
          'field_partida_arancelaria_tax' => $partida_arancelaria_tax,
          'field_export_markets' => !empty($export_markets) ? $export_markets : [],
          'field_file_certifications' => $fid_certificate_file_en,
          'field_exist_certifications' => [
            'value' => $bool_exist_cert_en,
          ],
          'field_pr_ref_company' => [
            'target_id' => $company_nid,
          ],
          /*          'field_product_type' => [
            'value' => $prod_type,
          ],*/
        ]);
        $node->set('field_images', $images_product);
        $node->setPublished(FALSE);
        $node->save();

        // Spanish node translation.
        $node_es = $node->addTranslation('es');
        $node_es->title = $product_name_es;
        $node_es->field_body->value = $descp_es;
        if (!empty($technique_file_load_es)) {
          $node_es->field_file->target_id = $fid_technique_file_es;
          $node_es->field_file->alt = $technique_file_load_es->getFilename();
        }
        $node_es->set('field_file_certifications', $fid_certificate_file_es);
        $node_es->field_exist_certifications->value = $bool_exist_cert_es;
        $node_es->setPublished(FALSE);
        $node_es->save();

        // Path alias.
        $CpCoreController->create_node_path_alias($node, 'en');
        $CpCoreController->create_node_path_alias($node_es, 'es');

        // Set message node create.
        if (!empty($node) && !empty($node_es)) {
          addMessage(t('Product content has been created correctly.'), 'status');
          $url = Url::fromRoute('view.dashboard_user.page_1');
          $form_state->setRedirectUrl($url);

          // Mail Notifications.
          $key = 'product_create';
          $prmsts = [
            'key' => $key,
            'product_name_en' => $product_name_en,
            'product_name_es' => $product_name_es,
          ];

          // Asesor.
          if (!empty($admin_asesor_mail)) {
            $prmsts['user_type'] = 'asesor';
            $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $CpCoreController->_cp_core_send_mail($admin_asesor_mail, $key, $info['body'], $info['subject']);
          }

          // Exporter.
          if (!empty($exporter_mail)) {
            $prmsts['user_type'] = 'exporter';
            $prmsts['exporter_mail'] = $exporter_mail;
            $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $CpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
          }
        }
        break;

      case 'edit':
        $node = Node::load($nid);
        if ($node->hasTranslation('en')) {
          $node = $node->getTranslation('en');
        }
        $node_es = $node->getTranslation('es');
        $bool_gen_flds_chg = FALSE;

        // *****************
        // *** Workflow ****
        // *****************
        // Title (English - Spanish)
        $old_title_en = $node->get('title')->getString();
        $new_title_en = $product_name_en;
        $prod_name_chg = NULL;
        $labelChLang = NULL;
        $count_ch_title = 0;
        if ($old_title_en != $new_title_en) {
          $node->field_states->value = 'waiting';
          $node->setPublished(FALSE);
          $node->field_dependent_state->value = FALSE;
          $prod_name_chg = $new_title_en;
          $labelChLang = 'inglés';
          $count_ch_title++;
        }
        $old_title_sp = $node_es->get('title')->getString();
        $new_title_sp = $product_name_es;
        if ($old_title_sp != $new_title_sp) {
          $node_es->field_states->value = 'waiting';
          $node_es->setPublished(FALSE);
          $node_es->field_dependent_state->value = FALSE;
          $prod_name_chg = $new_title_sp;
          $labelChLang = 'español';
          $count_ch_title++;
        }

        if ($count_ch_title == 2) {
          $bool_gen_flds_chg = TRUE;
        }
        elseif ($count_ch_title > 0) {
          // Mail Notifications title.
          $key = 'product_edit_title_disable';
          $prmsts = [
            'idNodo' => $nid,
            'key' => $key,
            'prod_name_chg' => $prod_name_chg,
            'labelChLang' => $labelChLang,
          ];

          // Asesor.
          if (!empty($admin_asesor_mail) && !empty($exporter_mail)) {
            $prmsts['user_type'] = 'asesor';
            $prmsts['exporter_mail'] = $exporter_mail;
            $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $CpCoreController->_cp_core_send_mail($admin_asesor_mail, $key, $info['body'], $info['subject']);
          }

          // Exporter.
          if (!empty($exporter_mail)) {
            $prmsts['user_type'] = 'exporter';
            $prmsts['exporter_mail'] = $exporter_mail;
            $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $CpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
          }
        }

        // Sector and subsector (All languages)
        /*        $old_tid_parent = $node->get('field_categorization_parent')->getValue()[0]['target_id'];
        $new_tid_parent = $sector;
        $old_tid_child = $node->get('field_categorization')->getValue()[0]['target_id'];
        $new_tid_child = $subsector;
        if ($old_tid_parent != $new_tid_parent || $old_tid_child != $new_tid_child) {
        $bool_gen_flds_chg = TRUE;
        }*/

        // Tariff position (All languages)
        /*      $old_tariff = $node->get('field_tariff_heading')->getString();
        $new_tariff = $tariff_position;
        if ($old_tariff != $new_tariff) {
        $bool_gen_flds_chg = TRUE;
        }*/

        // Images (All languages)
        if (!empty($node->get('field_images')->getValue())) {
          $arr_old_imgs = $node->get('field_images')->getValue();
          $arr_new_imgs = $images_product;
          if (count($arr_old_imgs) != count($arr_new_imgs)) {
            $bool_gen_flds_chg = TRUE;
          }
          else {
            $tids_old_imgs = [];
            foreach ($arr_old_imgs as $key => $value) {
              $tids_old_imgs[] = $value['target_id'];
            }
            foreach ($arr_new_imgs as $key => $value) {
              if (!in_array($value['target_id'], $tids_old_imgs)) {
                $bool_gen_flds_chg = TRUE;
                break;
              }
            }
          }
        }

        if ($bool_gen_flds_chg) {
          $node->field_states->value = 'waiting';
          $node->field_dependent_state->value = FALSE;
          $node->setPublished(FALSE);
          $node_es->field_states->value = 'waiting';
          $node_es->field_dependent_state->value = FALSE;
          $node_es->setPublished(FALSE);

          // Mail Notifications.
          $key = 'product_edit_disable';
          $prmsts = [
            'idNodo' => $nid,
            'key' => $key,
            'product_name_en' => $product_name_en,
            'product_name_es' => $product_name_es,
          ];

          // Asesor.
          if (!empty($admin_asesor_mail) && !empty($exporter_mail)) {
            $prmsts['user_type'] = 'asesor';
            $prmsts['exporter_mail'] = $exporter_mail;
            $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $CpCoreController->_cp_core_send_mail($admin_asesor_mail, $key, $info['body'], $info['subject']);
          }

          // Exporter.
          if (!empty($exporter_mail)) {
            $prmsts['user_type'] = 'exporter';
            $prmsts['exporter_mail'] = $exporter_mail;
            $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
            $CpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
          }
        }

        // *********************
        // *** Save product ****
        // *********************
        $node->set('field_body', $descp_en);
        $node->set('title', $product_name_en);
        $node->set('field_tariff_heading', NULL);
        /*if ($prod_type == 'product') {
        $node->set('field_tariff_heading', $tariff_position);
        }*/
        if (!empty($images_product)) {
          $node->set('field_images', $images_product);
        }
        $node->set('field_file_certifications', $fid_certificate_file_en);
        $node->set('field_file', []);
        if (!empty($fid_technique_file_en)) {
          $file = [
            'target_id' => $fid_technique_file_en,
            'alt' => $altImagenes,
          ];
          $node->set('field_file', $file);
        }
        $node->set('field_partida_arancelaria_tax', $partida_arancelaria_tax);
        $node->set('field_export_markets', $export_markets);
        $node->set('field_exist_certifications', $bool_exist_cert_en);
        $node->set('field_categorization', ['target_id' => $subsector]);
        /* $node->set('field_product_type', $prod_type);*/
        $node->save();

        $node_es->set('title', $product_name_es);
        $node_es->set('field_body', $descp_es);
        $node_es->set('field_file', []);
        if (!empty($fid_technique_file_es)) {
          $file = [
            'target_id' => $fid_technique_file_es,
            'alt' => $altImagenes,
          ];
          $node_es->set('field_file', $file);
        }
        $node_es->set('field_file_certifications', $fid_certificate_file_es);
        $node_es->field_exist_certifications->value = $bool_exist_cert_es;
        $node_es->save();

        // Path alias
        // $CpCoreController->create_node_path_alias($node, 'en');
        // $CpCoreController->create_node_path_alias($node_es, 'es');
        // Set message update node.
        if (!empty($node) && !empty($node)) {
          addMessage(t('Product content has been updated correctly.'), 'status');
          $form_state->setRedirect('cp_core.editProduct', ['nid' => $node->id()]);

          // Mail Notifications.
          if (!$bool_gen_flds_chg) {
            $key = 'product_edit';
            $prmsts = [
              'key' => $key,
              'product_name_en' => $product_name_en,
              'product_name_es' => $product_name_es,
            ];

            // Exporter.
            if (!empty($exporter_mail)) {
              $prmsts['user_type'] = 'exporter';
              $prmsts['exporter_mail'] = $exporter_mail;
              $info = $CpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
              $CpCoreController->_cp_core_send_mail($exporter_mail, $key, $info['body'], $info['subject']);
            }
          }
        }

        break;
    }
  }

}
