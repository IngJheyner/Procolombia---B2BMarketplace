<?php

namespace Drupal\cp_core\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\user\Entity\User;
use Drupal\Core\File\File;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class EditUser extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'edit_user_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $nid = NULL) {
    $currentUser = \Drupal::currentUser();
    $name = NULL;
    $mail = NULL;
    /*if (!empty($currentUser)) {
      $name = $currentUser->getUsername();
      if ($currentUser->hasRole('buyer')) {
        $name = $currentUser->get('field_complete_name')->getValue();
        echo '<pre>';
        var_dump($name);
        echo '</pre>';
      }
      $mail = $currentUser->getEmail();
    }*/
    $form = array(
      '#prefix' => '<div class"content-form row">',
      '#suffix' => '</div>',
    );

    $form['#attached']['library'][] = 'cp_core/form_validation_messages';
    $form['title'] = array(
      '#markup' => '<h3>' . t('Infor user') . '</h3>',
    );

    $form['error_messages'] = [
      '#type' => 'hidden',
      '#attributes' => [
        'class' => 'error_messages',
      ]
    ];

    $form['user_name'] = array(
      '#prefix' => '<div class"col-md-6 prepend-messages">',
      '#suffix' => '</div>',
      '#type' => 'textfield',
      '#default_value' => $name,
      '#title' => t('User name'),
      '#size' => 22,
    );

    $form['email'] = array(
      '#prefix' => '<div class"col-md-6">',
      '#suffix' => '</div>',
      '#type' => 'email',
      '#default_value' => $mail,
      '#title' => t('Mail'),
      '#size' => 22,
    );
    
    $form['save'] = array(
      '#type' => 'submit',
      '#value' => t('Save'),
    );

    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if ($errors = $form_state->getErrors()) {
      $form['fields']['error_messages']['#value'] = json_encode($errors);
    }
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
    $user_name = $form_state->getValue('user_name');
    $email = $form_state->getValue('email');

    /*echo '<pre>';
    var_dump($user_name);
    var_dump($email);
    echo '</pre>';*/

  }
}
