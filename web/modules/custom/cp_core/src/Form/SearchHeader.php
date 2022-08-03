<?php

namespace Drupal\cp_core\Form;

use Drupal;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\user\Entity\User;
use Drupal\Core\File\File;

class SearchHeader extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario
    return 'search_top_header_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $nid = NULL) {

    $form['search'] = array(
      '#type' => 'textfield',
      '#size' => 60,
      '#maxlength' => 100,
      '#placeholder' => t('Search...'),
      '#attributes' => array(
        'class' => array('is-desktop', 'header-top__search'),
      )
    );

    $form['save'] = array(
      '#type' => 'submit',
      '#value' => t('Search')
    );

    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $search = $form_state->getValue('search');
    $response = new TrustedRedirectResponse('http://www.procolombia.co/search?s=' . $search);
    $form_state->setResponse($response);

  }
}
