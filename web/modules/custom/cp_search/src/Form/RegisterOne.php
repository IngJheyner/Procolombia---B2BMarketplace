<?php
namespace Drupal\cp_search\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\cp_search\Controller\CpSearchController;
use Drupal\taxonomy\Entity\Term;
use Drupal\user\Entity\User;


class RegisterOne extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario
    return 'register_one_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['fields'] = array(
      '#prefix' => '<div class="row"><div class="fields col-md-12">',
      '#suffix' => '</div></div>',
    );

    // $CpSearch = new CpSearchController();
    // $uri_img = $CpSearch->_cp_search_get_img_block_type_banner(2);
    // $real_uri_img = file_create_url($uri_img);
    // $form['image'] = array(
    //   '#prefix' => '<div class="img col-md-6">',
    //   '#suffix' => '</div>',
    //   '#markup' => !empty($real_uri_img) ? '<img src="'. $real_uri_img .'">' : NULL,
    // );

    $form['fields']['description'] = array(
      '#prefix' => '<div class="col-md-12">',
      '#suffix' => '</div>',
      '#markup' => 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    );

    $form['fields']['company_name'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'textfield',
      '#title' => t('Company name'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['nit'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'textfield',
      '#title' => t('Nit'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['mail'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'email',
      '#title' => t('Mail'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['pass'] = array(
      '#prefix' => '<div class="col-md-4">',
      '#suffix' => '</div>',
      '#type' => 'password',
      '#title' => t('Password'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['fields']['data_protection'] = array(
      '#prefix' => '<div class="col-md-12 text-center justify-content-center align-items-center">',
      '#suffix' => '</div>',
      '#type' => 'radio',
      '#title' => t('I accept the data protection law.'),
      '#required' => TRUE,
    );

    $form['fields']['habeas_data'] = array(
      '#prefix' => '<div class="col-md-12 text-center justify-content-center align-items-center">',
      '#suffix' => '</div>',
      '#type' => 'radio',
      '#title' => t('I accept personal information management Habeas data.'),
      '#required' => TRUE,
    );

    $form['fields']['save'] = array(
      '#prefix' => '<div class="col-md-12 text-center justify-content-center align-items-center">',
      '#suffix' => '</div>',
      '#type' => 'submit',
      '#value' => t('Continue'),
    );

    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $company_name = $form_state->getValue('company_name');
    $nit = $form_state->getValue('nit');
    $mail = $form_state->getValue('mail');
    $pass = $form_state->getValue('pass');
    if (!is_numeric($nit)) {
      $form_state->setErrorByName('nit', t('The field must be numeric'));
    }
    /*echo '<pre>';
    var_dump('Valores validate');
    var_dump($company_name);
    var_dump($nit);
    var_dump($mail);
    var_dump($pass);
    echo '</pre>';*/
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
    $company_name = $form_state->getValue('company_name');
    $nit = $form_state->getValue('nit');
    $mail = $form_state->getValue('mail');
    $pass = $form_state->getValue('pass');

    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $user = \Drupal\user\Entity\User::create();
    $user->setPassword($pass);
    $user->enforceIsNew();
    $user->setEmail($mail);
    $user->setUsername($mail);
    $user->set('init', $mail);
    $user->set('langcode', $lang);
    $user->activate();
    $user->save();


    /*echo '<pre>';
    var_dump('Valores submit');
    var_dump($company_name);
    var_dump($nit);
    var_dump($mail);
    var_dump($pass);
    echo '</pre>';*/
  }
}
