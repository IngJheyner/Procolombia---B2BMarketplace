<?php
/**
 * @file
 * Administrative form to config change states 
 * companies and products
 */

namespace Drupal\cp_core\Form;


use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

Class ConfigChangeStates extends ConfigFormBase {

	/**
   * {@inheritdoc}
   */
  public function getEditableConfigNames() {
    return [  
      'cp_core.change_state_settings',  
    ];  
  }

	/**
   * {@inheritdoc}
   */
  public function getFormId() {
    // Nombre del formulario.
    return 'change_state_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $nid = NULL) {
  	$config = $this->config('cp_core.change_state_settings');
    
    $title = 'Configuration change of states in companies and products';
    $form['title'] = array(
	  	'#markup' => '<h1>' . $this->t($title) . '</h1>', 
		);

    $descrip = 'Here you can activate or deactivate the dynamic change of states that applies to companies and products. <br>The status change is made from "on hold" => "no response" as long as the content has not been modified after the configured days.';
		$form['description'] = array(
	  	'#markup' => '<p>' . $this->t($descrip) . '</p>', 
		);

    $title_chg_status = 'Active change dynamically companies and products states';
    $form['bool_chg_status'] = array(
	  	'#type' => 'checkbox', 
	  	'#title' => $this->t($title_chg_status),
	  	'#default_value' => $config->get('bool_chg_status'),
		);

    $form['num_days'] = [
      '#title' => $this->t('Number of days'),
      '#type' => 'textfield',
      '#size' => 3,
      '#default_value' => $config->get('num_days'),
      '#maxlength' => 2,
      '#states' => array(
	      'invisible' => array(
					':input[name="bool_chg_status"]' => array(
						'checked' => FALSE
					),
	      ),
	      'required' => array(
					':input[name="bool_chg_status"]' => array(
						'checked' => TRUE
					),
	      ),
	    ),
    ];


    return parent::buildForm($form, $form_state);
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);  

    $this->config('cp_core.change_state_settings')  
      ->set('bool_chg_status', $form_state->getValue('bool_chg_status'))
      ->set('num_days', $form_state->getValue('num_days'))    
      ->save(); 
  }


}