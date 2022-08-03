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


class RecoverPass extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'register_recover_pass';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $langcode = \Drupal::languageManager()->getCurrentLanguage()->getId();

    $form['content'] = array(
      '#prefix' => '<div class="row prepend-messages"><div class="col-md-12">',
      '#suffix' => '</div>',
    );

    $form['#attached']['library'][] = 'cp_core/form_validation_messages';

    $form['content']['step1']['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ]
    ];

    $urlHome = Url::fromRoute('<front>');
    $form['content']['step1']['title'] = array(
      '#prefix' => '<h3 class="title">',
      '#suffix' => '</h3>',
      '#markup' => '<span>' . t('Forgot ') . '</span>' . t('your pass?')
    );

    $form['content']['step1']['subtitle'] = array(
      '#prefix' => '<h4 class="subtitle">',
      '#suffix' => '</h4>',
      '#markup' => t('Enter your company email and we will send you a secure link to reset your password')
    );

    $form['content']['step1']['email'] = array(
      '#type' => 'email',
      '#title' => t('Email'),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
    );

    $form['content']['step1']['save'] = array(
      '#type' => 'submit',
      '#name' => 'retrieve',
      '#value' => t('Recover password'),
    );

    $linkHome = \Drupal\Core\Link::fromTextAndUrl(t('Cancel'), $urlHome);
    $form['content']['step1']['cancel'] = array(
      '#markup' => $linkHome,
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $email = $form_state->getValue('email');
    if (!\Drupal::service('email.validator')->isValid($email)) {
      $form_state->setErrorByName('email', t('Format email not valid'));
    }
    elseif (\Drupal::service('email.validator')->isValid($email) && !user_load_by_mail($email)) {
      $form_state->setErrorByName('email', t('User mail not found'));
    }
    if ($errors = $form_state->getErrors()) {
      $form['content']['step1']['error_messages']['#value'] = json_encode($errors);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $email = $form_state->getValue('email');
    $account = user_load_by_mail($email);
    $langcode = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $form_state->setRebuild();
    \Drupal::configFactory()->getEditable('system.site')->set('default_langcode', $langcode)->save();
    if (!empty($account) && !empty($langcode)) {
      $info_notify = _user_mail_notify('password_reset', $account, $langcode);
      if (!empty($info_notify)) {
        \Drupal::messenger()->addMessage(t('Your recovery email has been sent.'), 'status');
      }
    }
  }

}
