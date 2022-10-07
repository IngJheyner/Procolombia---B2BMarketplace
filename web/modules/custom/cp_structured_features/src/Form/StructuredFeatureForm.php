<?php

namespace Drupal\cp_structured_features\Form;

use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Structure feature form.
 *
 * @property \Drupal\cp_structured_features\StructuredFeatureInterface $entity
 */
class StructuredFeatureForm extends EntityForm {

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {

    $form = parent::form($form, $form_state);

    $form['#tree'] = TRUE;

    $form['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#maxlength' => 255,
      '#default_value' => $this->entity->label(),
      '#description' => $this->t('Label for the structured feature.'),
      '#required' => TRUE,
    ];

    $form['id'] = [
      '#type' => 'machine_name',
      '#default_value' => $this->entity->id(),
      '#machine_name' => [
        'exists' => '\Drupal\cp_structured_features\Entity\StructuredFeature::load',
      ],
      '#disabled' => !$this->entity->isNew(),
    ];

    $form['status'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enabled'),
      '#default_value' => $this->entity->status(),
    ];

    $form['description'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Description'),
      '#default_value' => $this->entity->get('description'),
      '#description' => $this->t('Description of the structured feature.'),
    ];

    $form['reference_type'] = [
      '#type' => 'radios',
      '#title' => $this->t('Choose type'),
      '#default_value' => $this->entity->get('type'),
      '#required' => TRUE,
      '#options' => ['product' => $this->t('Product'), 'service' => $this->t('Service')],
      '#ajax' => [
        'callback' => '::reloadReferences',
        'wrapper' => 'reload-references',
      ],
    ];

    $vid = 'partida_arancelaria';
    // $options = [];
    if (empty($form_state->getValue('type'))) {
      if (!empty($this->entity->get('type'))) {
        $vid = $this->entity->get('type') == 'product' ? 'partida_arancelaria' : 'categorization';
      }
    }
    else {
      $vid = $this->entity->get('type') == 'product' ? 'partida_arancelaria' : 'categorization';
    }

    $references = $form_state->get('references');
    $terms = [];
    if (!$references) {
      if ($this->entity->get('references')) {
        $form_state->set('references', $this->entity->get('references'));
        $references = array_combine($this->entity->get('references'), $this->entity->get('references'));
        $query = \Drupal::database()->select('taxonomy_term_data', 't');
        $query->addField('td', 'tid');
        $query->condition('td.uuid', $this->entity->get('references'), 'IN');
        $elements = $query->execute()->fetchAllKeyed(0, 0);
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadMultiple($elements);
      }
    }
    else {
      $query = \Drupal::database()->select('taxonomy_term_data', 't');
      $query->addField('t', 'tid');
      $query->condition('t.uuid', $references, 'IN');
      $elements = $query->execute()->fetchAllKeyed(0, 0);
      $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadMultiple($elements);
    }

    $form['reference_terms'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('References'),
      '#prefix' => '<div id="reload-references">',
      '#suffix' => '</div>',
    ];
    foreach ($terms as $term) {
      $form['reference_terms'][$term->id()] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['container-inline']],
      ];
      $form['reference_terms'][$term->id()]['term'] = [
        '#markup' => '<span>' . $term->label() . '</span> ',
      ];
      $form['reference_terms'][$term->id()]['remove'] = [
        '#type' => 'submit',
        '#value' => $this->t('Remove'),
        '#submit' => ['::removeReferenceTerm'],
        '#limit_validation_errors' => [],
        '#ajax' => [
          'callback' => '::reloadReferences',
          'wrapper' => 'reload-references',
        ],
        '#name' => 'reference_terms_remove_' . $term->id(),
      ];
    }
    $form['reference_terms']['agregate'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['container-inline']],
    ];
    $form['reference_terms']['agregate']['term'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('References'),
      '#description' => $this->t('Select the tariff items or subcategories that applies this structure'),
      '#required' => TRUE,
      '#target_type' => 'taxonomy_term',
      '#tags' => TRUE,
      '#selection_settings' => [
        'target_bundles' => [$vid],
      ],
    ];
    $form['reference_terms']['agregate']['add'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add'),
      '#submit' => ['::addReferenceTerm'],
      '#limit_validation_errors' => [['reference_terms']],
      '#ajax' => [
        'callback' => '::reloadReferences',
        'wrapper' => 'reload-references',
      ],
      '#name' => 'reference_terms_aggregate_add',
    ];

    $properties = $form_state->get('properties');
    if (!$properties) {
      $properties = $this->entity->get('properties');
    }

    $form['properties_elements'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('Properties'),
      '#prefix' => '<div id="reload-properties">',
      '#suffix' => '</div>',
    ];
    $form['properties_elements']['agregate'] = [
      '#type' => 'details',
      '#open' => TRUE,
    ];
    $form['properties_elements']['agregate']['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#required' => TRUE,
    ];
    $form['properties_elements']['agregate']['type'] = [
      '#type' => 'select',
      '#title' => $this->t('Type'),
      '#required' => TRUE,
      '#options' => [
        'select' => 'Select',
        'radios' => 'Radios',
        'checkbox' => 'Checkbox',
        'checkboxes' => 'Checkboxes',
        'textfield' => 'Textfield',
        'textarea' => 'Textarea',
      ]
    ];
    $form['properties_elements']['agregate']['multiple'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Multiple'),
    ];
    $form['properties_elements']['agregate']['required'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Required'),
    ];
    $form['properties_elements']['agregate']['add'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add'),
      '#submit' => ['::addProperty'],
      '#limit_validation_errors' => [['properties_elements']],
      '#ajax' => [
        'callback' => '::reloadProperties',
        'wrapper' => 'reload-properties',
      ],
      '#name' => 'properties_aggregate_add',
    ];
    foreach ($properties as $property_key => $property) {
      $form['properties_elements'][$property_key] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['container-inline']],
      ];
      $form['properties_elements'][$property_key]['property'] = [
        '#type' => 'details',
        '#title' => $property['label'],
      ];
      $form['properties_elements'][$property_key]['property']['type'] = [
        '#markup' => '<strong>Type: </strong>: ' . $property['type'] . '<br />',
      ];
      $multiple = $property['multiple'] ? 'Yes' : 'No';
      $form['properties_elements'][$property_key]['property']['multiple'] = [
        '#markup' => '<strong>Multiple: </strong>: ' . $multiple . '<br />',
      ];
      $required = $property['required'] ? 'Yes' : 'No';
      $form['properties_elements'][$property_key]['property']['required'] = [
        '#markup' => '<strong>Required: </strong>: ' . $required . '<br />',
      ];
      $form['properties_elements'][$property_key]['remove'] = [
        '#type' => 'submit',
        '#value' => $this->t('Remove'),
        '#submit' => ['::removeProperty'],
        '#limit_validation_errors' => [],
        '#ajax' => [
          'callback' => '::reloadProperties',
          'wrapper' => 'reload-properties',
        ],
        '#name' => 'properties_elements_remove_' . $property_key,
      ];
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $references = [];
    if (!empty($values['reference_terms']['aggregate']['term'])) {
      foreach ($values['reference_terms']['aggregate']['term'] as $reference) {
        $references[] = $reference['target_id'];
      }
    }

    unset($values['reference_terms']);
    $values['references'] = $references;

    // if (!empty($values['reference_terms']['aggregate']['term'])) {
    //   foreach ($values['reference_terms']['aggregate']['term'] as $reference) {
    //     $references[] = $reference['target_id'];
    //   }
    // }


    $form_state->setValues($values);
    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $form_state->cleanValues();
    $values = $form_state->getValues();

    $this->entity->set('reference_type', $values['reference_type']);

    // $references = [];
    // if (!empty($values['reference_terms']['aggregate']['term'])) {
    //   foreach ($values['reference_terms']['aggregate']['term'] as $reference) {
    //     $references[] = $reference['target_id'];
    //   }
    // }


    // if (!empty($values['reference_terms']['aggregate']['term'])) {
    //   foreach ($values['reference_terms']['aggregate']['term'] as $reference) {
    //     $references[] = $reference['target_id'];
    //   }
    // }


    $result = parent::save($form, $form_state);
    $message_args = ['%label' => $this->entity->label()];
    $message = $result == SAVED_NEW
      ? $this->t('Created new structured feature %label.', $message_args)
      : $this->t('Updated structured feature %label.', $message_args);
    $this->messenger()->addStatus($message);
    $form_state->setRedirectUrl($this->entity->toUrl('collection'));
    return $result;
  }

  /**
   * Ajax Callback.
   */
  public function reloadReferences(&$form, FormStateInterface $form_state) {
    return $form['reference_terms'];
  }

  /**
   * Ajax addReferenceTerm.
   */
  public function addReferenceTerm(&$form, FormStateInterface $form_state) {
    $references = $form_state->get('references');
    $newReference = $form_state->getValue(['reference_terms','agregate','term', 0, 'target_id']);
    if ($newReference) {
      $storage = $this->entityTypeManager->getStorage('taxonomy_term');
      $term = $storage->load($newReference);
      $references[$term->uuid()] = $term->uuid();
      $form_state->set('references', $references);
      $form_state->setRebuild();
    }
  }

  /**
   * Ajax removeReferenceTerm.
   */
  public function removeReferenceTerm(&$form, FormStateInterface $form_state) {
    $elementTriggered = $form_state->getTriggeringElement();
    $tid = (int) str_replace('reference_terms_remove_', '', $elementTriggered['#name']);
    if ($tid && is_numeric($tid) && $tid > 0) {
      $storage = $this->entityTypeManager->getStorage('taxonomy_term');
      $term = $storage->load($tid);
      $references = $form_state->get('references');
      unset($references[$term->uuid()]);
      $form_state->set('references', $references);
      $form_state->setRebuild();
    }
  }

  /**
   * Ajax Callback.
   */
  public function reloadProperties(&$form, FormStateInterface $form_state) {
    return $form['properties_elements'];
  }

  /**
   * Ajax addReferenceTerm.
   */
  public function addProperty(&$form, FormStateInterface $form_state) {
    $properties = $form_state->get('properties');
    $newProperty = $form_state->getValue(['properties_elements','agregate']);
    if ($newProperty) {
      unset($newProperty['add']);
      $id = str_replace(' ', '_',  strtolower($newProperty['label']));
      $newProperty['id'] = $id;
      $properties[$id] = $newProperty;
      $form_state->set('properties', $properties);
      $form_state->setRebuild();
    }
  }

  /**
   * Ajax removeReferenceTerm.
   */
  public function removeProperty(&$form, FormStateInterface $form_state) {
    $elementTriggered = $form_state->getTriggeringElement();
    $id = str_replace('properties_elements_remove_', '', $elementTriggered['#name']);
    if ($id) {
      $properties = $form_state->get('properties');
      unset($properties[$id]);
      $form_state->set('properties', $properties);
      $form_state->setRebuild();
    }
  }

}
