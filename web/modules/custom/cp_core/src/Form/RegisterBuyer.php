<?php
namespace Drupal\cp_core\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\cp_search\Controller\CpSearchController;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\taxonomy\Entity\Term;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\ReplaceCommand;


class RegisterBuyer extends FormBase {

  protected $cpCoreController;

  /**
  * {@inheritdoc}
  */
  public function __construct(){
    $this->cpCoreController = new CpCoreController;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario
    return 'register_buyer_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form_state_values = $form_state->cleanValues()->getValues();
    $triggerdElement = $form_state->getTriggeringElement();

    $form['#attributes'] = array('class' => 'form-prod-hs');
    /**
     * Commented for redesign 2020-10-29
     */
    // $CpSearch = new CpSearchController();
    // $uri_img = $CpSearch->_cp_search_get_img_block_type_banner(2);
    // $real_uri_img = file_create_url($uri_img);
    // $form['image'] = array(
    //   '#prefix' => '<div class="img-bg col-md-12">',
    //   '#suffix' => '</div>',
    //   '#markup' => !empty($real_uri_img) ? '<img src="'. $real_uri_img .'">' : NULL,
    // );

    $form['fields'] = array(
      '#prefix' => '<div class="row"><div class="fields col-md-12 row">',
      '#suffix' => '</div>',
    );

    $form['#attached']['library'][] = 'cp_core/cp_core_jquery_validate';
    $form['#attached']['library'][] = 'cp_core/cp_core';
    // Add the core AJAX library.
    $form['#attached']['library'][] = 'core/drupal.ajax';

    $form['fields']['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ]
    ];

    $form['fields']['h1'] = array(
      '#markup' => '<h1 class="col-md-12">' . t('Explore Colombian Export Opportunities') . '</h1>',
    );

    $form['fields']['description'] = array(
      '#prefix' => '<div class="subtitle col-md-12">',
      '#suffix' => '</div>',
      '#markup' => t('Find the best products and services from Colombian origin, contact companies and save your favorite products, services or companies.'),
    );

    $form['fields']['complete_name'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'textfield',
      '#title' => t('Name and Lastname'),
      '#size' => 60,
      '#maxlength' => 60,
      '#required' => TRUE,
    );

    $form['fields']['mail'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'email',
      '#title' => t('E-mail'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $vid = 'countries';
    $terms =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
    $countries = [];
    // $countries[0]= t('- Select -');
    foreach ($terms as $term) {
      $countries[$term->tid] = $term->name ;
    }
    $form['fields']['country'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#title' => t('Country'),
      '#type' => 'select2',
      '#required' => TRUE,
      '#default_value' => 0,
      '#options' => $countries,
      '#select2' => [
        'allowClear' => FALSE,
        'placeholder' => t('- Select -'),
      ],
    );

    $form['fields']['company'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'textfield',
      '#title' => t('Company Name'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['categories'] = [
      '#type' => 'container',
      '#attributes' => [
        'id' => 'container-form-categories',
      ],
    ];

    $CpCoreController = new CpCoreController;
    $opts_catgs = $CpCoreController->get_categories_leve1();

    for ($i = 1; $i < 4; $i++) {
      $opts_catgs_not_req = array($this->t('- Select -'));
      $opts_catgs_not_req += $opts_catgs;

      if ($i == 1) {
        $cat_title = t("I'm interested in");
        $subcat_title = t("Particulary in");
      }
      else {
        $cat_title = t("Category Interest") . ' #' . $i;
        $subcat_title = t("Subcategory Interest") . ' #' . $i;
      }

      $form['fields']['categories']['interest_cat_' . $i] = array(
        '#prefix' => '<div class="col-md-4">',
        '#suffix' => '</div>',
        '#title' => $cat_title,
        '#index' => $i,
        '#type' => 'select',
        '#options' => $i > 1 ? $opts_catgs_not_req : $opts_catgs,
        '#required' => $i > 1 ? FALSE : TRUE,
        '#attributes' => array(
          'class' => array('sl-sector')
        ),
        '#ajax' => [
          'callback' => '::AjaxBuyerFormCallback', // don't forget :: when calling a class method.
          //'callback' => [$this, 'myAjaxCallback'], //alternative notation
          'disable-refocus' => FALSE, // Or TRUE to prevent re-focusing on the triggering element.
          // 'event' => 'change',
          'wrapper' => 'container-form-categories', // This element is updated with this AJAX callback.
          'progress' => [
            'type' => 'none',
            // 'message' => $this->t('Verifying entry...'),
          ],
        ]
      );
      /** On callback update subcat */
      $subcategorias = [$this->t('- Select -')];
      $tid_subcat = 0;
      // Default Value subcategory
      if(isset($form_state_values) && !empty($form_state_values['interest_cat_'.$i])){
        $tid_subcat = $form_state_values['interest_subcat_'.$i];
      }
      // Get interest category
      $tid_cat = 0;
      if(isset($form_state_values) && !empty($form_state_values['interest_cat_'.$i])){
        $tid_cat = $form_state_values['interest_cat_'.$i];
      }
      // Get subcategory options
      if(isset($form_state_values) && !empty($form_state_values['interest_cat_'.$i])){
        $subcategorias = $this->get_subcategorias($tid_cat);
      }
      $form['fields']['categories']['interest_subcat_'.$i] = array(
        '#prefix' => '<div class="col-md-4">',
        '#suffix' => '</div>',
        '#title' => $subcat_title,
        '#default_value' => $tid_subcat,
        '#type' => 'select',
        '#validated' => TRUE,
        '#options' => $subcategorias,
        '#attributes' => array(
          'class' => array('sl-sub-sector')
        )
      );
    }

    $form['fields']['pass'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'password',
      '#title' => t('Password'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['save'] = array(
      '#prefix' => '<div class="col-md-12 text-center justify-content-center align-items-center">',
      '#suffix' => '</div>',
      '#type' => 'submit',
      '#value' => t('Continue'),
    );

    // add honneypot antispam
    honeypot_add_form_protection($form, $form_state, array('honeypot', 'time_restriction'));
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function AjaxBuyerFormCallback(array &$form, FormStateInterface $form_state) {
    return $form['fields']['categories'];
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $complete_name = $form_state->getValue('complete_name');
    $mail = $form_state->getValue('mail');
    $company = $form_state->getValue('company');

    if (user_load_by_mail($mail)) {
      $form_state->setErrorByName('mail', $this->t('This email is already registered on the platform'));
    }
    if (strlen($complete_name) < 4) {
      $form_state->setErrorByName('complete_name', $this->t('The value of the complete name field is very short '));
    }
    if ($errors = $form_state->getErrors()) {
      $form['fields']['error_messages']['#value'] = json_encode($errors);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $complete_name = $form_state->getValue('complete_name');
    $mail = $form_state->getValue('mail');
    $company = $form_state->getValue('company');
    $pass = $form_state->getValue('pass');
    $country = $form_state->getValue('country');

    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $user = \Drupal\user\Entity\User::create();
    $user->setPassword($pass);
    $user->enforceIsNew();
    $user->setEmail($mail);
    $user->setUsername($mail);
    $user->set('init', $mail);
    $user->set('preferred_langcode', $lang);
    $user->addRole('buyer');
    $user->activate();
    $user->field_complete_name->value = $complete_name;
    $user->field_company->value = $company;
    $user->field_country->value = $country;

    $category_list = [];
    for ($i = 1; $i < 4; $i++) {
      $field_cat = 'field_cat_interest_' . $i;
      $field_subcat = 'field_subcat_interest_' . $i;
      if (!empty($form_state->getValue('interest_cat_'. $i))) {
        $category_list[] = $form_state->getValue('interest_cat_'. $i);
        $user->{$field_cat} = [
          'target_id' => $form_state->getValue('interest_cat_'. $i)
        ];
      }
      if (!empty($form_state->getValue('interest_subcat_'. $i))) {
        $user->{$field_subcat} = [
          'target_id' => $form_state->getValue('interest_subcat_'. $i)
        ];
      }
    }
    $user->save();
    _user_mail_notify('status_activated', $user);

    // Notify assesor
    foreach($category_list as $cat) {
      $category = \Drupal\taxonomy\Entity\Term::load($cat);
      // If category has assesor
      if ($category->field_asesor[0]) {
        $user = $category->field_asesor[0]->target_id;
        $asesor_mail = User::load($user)->mail->value;
        $prmsts['user_type'] = 'asesor';
        $prmsts['key'] = 'buyer_register_interest';
        $cpCoreController = new CpCoreController;
        $info = $cpCoreController->_cp_core_get_body_and_subject_mail($prmsts);
        $cpCoreController->_cp_core_send_mail($asesor_mail, 'buyer_register_interest', $info['body'], $info['subject']);
      }
    }

    \Drupal::messenger()->addMessage(t('You have successfully registered a confirmation has been sent by mail.'), 'status');
  }

  public function get_subcategorias( $tid_categoria = 0){
    $subcategorias = [$this->t('- Select -')];
    if(!empty($tid_categoria)){
      $coreController = $this->cpCoreController;
      $lvl2 = $coreController->get_categories_leve2($tid_categoria, "array");
      $subcategorias += $lvl2['options'];
    }
    return $subcategorias;
  }
}
