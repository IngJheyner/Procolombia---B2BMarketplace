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


class RegisterExporter extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario
    return 'register_step_one_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['fields'] = array(
      '#prefix' => '<div class="row"><div class="fields row">',
      '#suffix' => '</div>',
    );

    $form['#attached']['library'][] = 'cp_core/cp_core_jquery_validate';

    $form['fields']['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ]
    ];

  /*   $CpSearch = new CpSearchController();
    $uri_img = $CpSearch->_cp_search_get_img_block_type_banner(2);
    $real_uri_img = file_create_url($uri_img);
    $form['image'] = array(
      '#prefix' => '<div class="img-bg col-md-6">',
      '#suffix' => '</div>',
      '#markup' => !empty($real_uri_img) ? '<img src="'. $real_uri_img .'">' : NULL,
    ); */

    $form['fields']['h1'] = array(
      '#markup' => '<h1 class="col-md-12">' . t('Register') . '</h1>',
    );

    $form['fields']['description'] = array(
      '#prefix' => '<div class="subtitle col-md-12">',
      '#suffix' => '</div>',
      '#markup' => t('Sign up to the Colombia’s Export Catalog to expand your offer to international markets. Remember that you must be a ProColombia account in order to sign up'),
      /*'#markup' => t('Register in the Colombia Exportable Offer Catalog to expand your offer to international markets. Remember that to register you must be a procolombia account.'),*/
    );

    $form['fields']['nit'] = array(
      '#prefix' => '<div class="row"><div class="col-md-6">',
      '#suffix' => '</div>',
      '#type' => 'textfield',
      '#title' => t('Nit'),
      '#description' => t('Write the tax identification number corresponding to your company'),
      '#size' => 60,
      '#maxlength' => 12,
      '#required' => TRUE,
      '#attributes' => [
        'class' => ['d-block'],
      ],
    );

    $form['fields']['mail'] = array(
      '#prefix' => '<div class="col-md-6">',
      '#suffix' => '</div>',
      '#type' => 'email',
      '#title' => t('Mail'),
      '#description' => t('Write the institutional email where the correspondence from this website will be sent'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['pass'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div></div>',
      '#type' => 'hidden',
      '#title' => t('Password'),
      '#size' => 60,
      '#maxlength' => 128,
      // '#required' => TRUE,
    );

    $CpCoreController = new CpCoreController();
    $link_data = $CpCoreController->get_link_data_policy_by_type_data_policy('data_protection');
    $form['fields']['data_protection'] = array(
      '#prefix' => '<div class="col-md-12 text-center justify-content-center align-items-center">',
      '#suffix' => '</div>',
      '#type' => 'checkbox',
      '#title' => $this->t('I have read and accept') . ' ' . $link_data,
      '#required' => TRUE,
    );

    $link_data = $CpCoreController->get_link_data_policy_by_type_data_policy('terms_of_use');
    $form['fields']['habeas_data'] = array(
      '#prefix' => '<div class="col-md-12 text-center justify-content-center align-items-center">',
      '#suffix' => '</div>',
      '#type' => 'checkbox',
      '#title' => $this->t('I have read and accept ') . ' ' . $link_data,
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
  public function validateForm(array &$form, FormStateInterface $form_state) {
    \Drupal::moduleHandler()->loadInclude('cp_core', 'inc', 'sf/servicios.sf');
    $bool_cp_in_neo = FALSE;

    $contact_name = $form_state->getValue('contact_name');
    $nit = $form_state->getValue('nit');
    $mail = $form_state->getValue('mail');
    // $pass = $form_state->getValue('nit').'-'$form_state->getValue('mail');

    if (!is_numeric($nit)) {
      $form_state->setErrorByName('nit', $this->t('The registration has not been completed correctly'));
    }
    elseif (strlen($nit) < 8) {
      $form_state->setErrorByName('nit', $this->t('The registration has not been completed correctly'));
    }
    elseif (!empty($nit)) {
      $empresas = ConsultaNIT($nit);
      if (!empty($empresas)) {
        $comp_neo = reset($empresas);
        if (isset($comp_neo['nit'])) {
          $bool_cp_in_neo = TRUE;
        }
      }
$bool_cp_in_neo = TRUE;
      if (!$bool_cp_in_neo) {
        $form_state->setErrorByName('nit', $this->t('Your company isn’t registered as a ProColombia account. Please, send a request to abustos@procolombia.co'));
      }
      elseif (user_load_by_name($nit)) {
/*        $form_state->setErrorByName('nit', $this->t('Your company is already registered in the Exportable Offer Catalogue.'));*/
        $form_state->setErrorByName('nit', $this->t('Your company is alredy registered at Colombian Export Catalog. Please LOG IN, <a href=":userLogin">Here</a>', array(':userLogin' => Url::fromRoute('user.login'))));
      }
      elseif (user_load_by_mail($mail)) {
        $form_state->setErrorByName('mail', $this->t('Your company is alredy registered at Colombian Export Catalog. Please LOG IN, <a href=":userLogin">Here</a>', array(':userLogin' => Url::fromRoute('user.login'))));
      }
    }

    if ($errors = $form_state->getErrors()) {
      $form['fields']['error_messages']['#value'] = json_encode($errors);
    }
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $contact_name = $form_state->getValue('contact_name');
    $nit = $form_state->getValue('nit');
    $mail = $form_state->getValue('mail');
    $pass = $form_state->getValue('nit').'-'.$form_state->getValue('mail');

    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $user = \Drupal\user\Entity\User::create();
    $user->setPassword($pass);
    $user->enforceIsNew();
    $user->setEmail($mail);
    $user->setUsername($nit);
    $user->set('init', $mail);
    $user->set('preferred_langcode', $lang);
    $user->addRole('exportador');
    $user->activate();
    $user->save();
    _user_mail_notify('status_activated', $user);
    \Drupal::messenger()->addMessage(t('You have successfully registered and a notification has been sent by mail.'), 'status');

  }
}
