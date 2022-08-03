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
 
class TestForm extends FormBase {
 
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario
    return 'test_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $nid = NULL) {
    
    $form['upload'] = array(
      '#name' => 'test',
      '#type' => 'plupload',
      '#title' => t('Choose a file'),
      '#title_display' => 'invisible',
      '#size' => 22,
      '#theme_wrappers' => array(),
      '#weight' => -10,
    );

    $form['buttons']['save'] = array(
      '#type' => 'submit',
      '#value' => t('Save'),
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
    $form_state->setRebuild();
    $upload = $form_state->getValue('upload');
    echo '<pre>';
    var_dump($upload);
    echo '</pre>';

  }
}