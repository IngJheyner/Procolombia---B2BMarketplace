<?php
namespace Drupal\cp_core\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\taxonomy\Entity\Term;
use Drupal\user\Entity\User;


class ForgetMail extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'register_forget_mail';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['content'] = array(
      '#prefix' => '<div class="row prepend-messages"><div class="col-md-12">',
      '#suffix' => '</div>',
    );

    $form['#attached']['library'][] = 'cp_core/form_validation_messages';

    $step = 1;
    $strg = $form_state->getStorage();
    $urlHome = Url::fromRoute('<front>');
    if (isset($strg['step'])) {
      $step = $strg['step'];
    }
    $form_state->setStorage(array('step' => $step));

    $form['content']['step1']['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ]
    ];

    switch ($step) {
      case 1:
        $form['content']['step1']['title'] = array(
          '#prefix' => '<h3 class="title">',
          '#suffix' => '</h3>',
          '#markup' => '<span>'. t('Forgot ') .'</span>' . t('your mail?')
        );

        $form['content']['step1']['subtitle'] = array(
          '#prefix' => '<h4 class="subtitle">',
          '#suffix' => '</h4>',
          '#markup' => t('Enter the company ID of your company then we will show you the email associated with the account')
        );

        $form['content']['step1']['nit'] = array(
          '#type' => 'textfield',
          '#title' => t('Nit'),
          '#size' => 60,
          '#maxlength' => 128,
          '#required' => TRUE,
        );

        $form['content']['step1']['save'] = array(
          '#type' => 'submit',
          '#name' => 'retrieve',
          '#value' => t('Recover your mail'),
        );

        $linkHome = \Drupal\Core\Link::fromTextAndUrl(t('Cancel'), $urlHome);
        $form['content']['step1']['cancel'] = array(
          '#markup' => $linkHome
        );
        break;

      case 2:
        if (isset($strg['mail'])) {
          $mail = $strg['mail'];
          $form['content']['step2']['title'] = array(
            '#prefix' => '<h3 class="title">',
            '#suffix' => '</h3>',
            '#markup' => '<span>'. t('Recover ') .'</span>' . t('your information')
          );

          $urlForgetPass = Url::fromRoute('cp_core.recoverPass');
          $linkForgetPass = \Drupal\Core\Link::fromTextAndUrl(t('here'), $urlForgetPass);
          $form['content']['step2']['subtitle'] = array(
            '#prefix' => '<h4 class="subtitle">',
            '#suffix' => '</h4>',
            '#markup' => t('With the following email you can recover your password by clicking ') . $linkForgetPass
          );

          $form['content']['step2']['email_markup'] = array(
            '#prefix' => '<p">',
            '#suffix' => '</p>',
            '#markup' => $mail
          );

          $linkHome = \Drupal\Core\Link::fromTextAndUrl(t('Go back to start'), $urlHome);
          $form['content']['step1']['link_home'] = array(
            '#markup' => $linkHome
          );

        }
        break;
    }

    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $nit = $form_state->getValue('nit');
    $cpRegister = new CpCoreController;
    if (!is_numeric($nit)) {
      $form_state->setErrorByName('nit', t('This field must be numeric'));
    }
    elseif (strlen($nit) < 8) {
      $form_state->setErrorByName('nit', t('This field requires a minimum of 8 digits'));
    }
    else {
      $mail = NULL;
      if ($user = user_load_by_name($nit)) {
        $mail = $user->getEmail();
      }
      if (empty($mail)) {
        $form_state->setErrorByName('nit', t('The NIT is not valid'));
      }
    }

    if ($errors = $form_state->getErrors()) {
      $form['content']['step1']['error_messages']['#value'] = json_encode($errors);
    }
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
    $strg = $form_state->getStorage();
    $step = $strg['step'];
    $triger = $form_state->getTriggeringElement();
    $click = $triger['#name'];
    $cpRegister = new CpCoreController;
    switch ($click) {
      case 'retrieve':
        $nit = $form_state->getValue('nit');
        if ($user = user_load_by_name($nit)) {
          $mail = $user->getEmail();
        }
        
        if (!empty($mail)) {
          $step++;
          $form_state->setStorage(
            array(
              'step' => $step,
              'mail' => $mail,
            )
          );
        }
        break;

      case 'back':
        break;
    }
  }
}
