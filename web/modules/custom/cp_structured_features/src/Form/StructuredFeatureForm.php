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
    $form['#attached']['library'][] = 'cp_structured_features/structured_feature_form';

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
        'source' => ['label'],
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
      '#default_value' => $this->entity->get('reference_type'),
      '#required' => TRUE,
      '#options' => ['product' => $this->t('Product'), 'service' => $this->t('Service')],
      '#ajax' => [
        'callback' => '::reloadReferences',
        'wrapper' => 'reload-references',
      ],
    ];

    $vid = '';
    // $options = [];
    if (empty($form_state->getValue('reference_type'))) {
      if (!empty($this->entity->get('reference_type'))) {
        $vid = $this->entity->get('reference_type') == 'product' ? 'partida_arancelaria' : 'categorization';
      }
    }
    else {
      $vid = $this->entity->get('reference_type') == 'product' ? 'partida_arancelaria' : 'categorization';
      $input = $form_state->getUserInput();
      unset($input['reference_terms']['agregate']['term']);
      $form_state->setUserInput($input);
      $form_state->set('references', NULL);
    }

    $references = $form_state->get('references');
    $terms = [];
    if (!$references) {
      if ($this->entity->get('references')) {
        $references = array_combine($this->entity->get('references'), $this->entity->get('references'));
        if (!$references) {
          $references = [];
        }
        $references_removed = $form_state->get('references_removed');
        if (!$references_removed) {
          $references_removed = [];
        }
        $references = array_diff_key($references, $references_removed);
        $form_state->set('references', $references);
        $query = \Drupal::database()->select('taxonomy_term_data', 't');
        $query->addField('t', 'tid');
        $query->condition('t.uuid', $this->entity->get('references'), 'IN');
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
    $form['reference_terms']['agregate'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['container-inline', 'reference-add']],
    ];
    $form['reference_terms']['agregate']['term'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('References'),
      '#description' => $this->t('Select the tariff items or subcategories that applies this structure'),
      '#required' => FALSE,
      '#target_type' => 'taxonomy_term',
      '#default_value' => '',
      '#tags' => TRUE,
      // '#selection_settings' => [
      //   'target_bundles' => [$vid],
      // ],
      '#selection_handler' => 'views',
      '#selection_settings' => [
        'view' => [
          'view_name' => 'structured_feature_references',
          'display_name' => 'entity_reference_1',
          'arguments' => [$vid]
        ],
        'match_operator' => 'CONTAINS'
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
    $form['reference_terms']['list'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['reference-list']],
    ];
    foreach ($terms as $term) {
      $form['reference_terms']['list'][$term->id()] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['container-inline']],
      ];
      $form['reference_terms']['list'][$term->id()]['term'] = [
        '#markup' => '<div class="term-label">' . $term->label() . '</div> ',
      ];
      $form['reference_terms']['list'][$term->id()]['remove'] = [
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

    $properties = $form_state->get('properties');
    if (!$properties) {
      $properties = $this->entity->get('properties');
      if (!$properties) {
        $properties = [];
      }
      $properties_removed = $form_state->get('properties_removed');
      if (!$properties_removed) {
        $properties_removed = [];
      }
      $properties = array_diff_key($properties, $properties_removed);
      $form_state->set('properties', $properties);
    }

    $editProperty = $form_state->get('edit_property');
    if ($editProperty) {
      $editDefaults = $properties[$editProperty];
    }


    $form['properties_elements'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('Properties'),
      '#prefix' => '<div id="reload-properties">',
      '#suffix' => '</div>',
    ];
    $form['properties_elements']['agregate'] = [
      '#type' => 'container',
      '#description' => $this->t("You must add the property before save. If you don't add it the property will not be saved."),
      '#attributes' => ['class' => ['properties-elements-add']],
    ];
    $form['properties_elements']['agregate']['description'] = [
      '#markup' => $this->t("You must add the property before save. If you don't add it the property will not be saved."),
    ];
    $form['properties_elements']['agregate']['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#required' => FALSE,
      '#default_value' => isset($editDefaults['label']) ? $editDefaults['label'] : NULL,
      '#description' => $this->t('If the field is assigned to specific language this value will not be translated. You must fill it in the end language.'),
    ];
    $form['properties_elements']['agregate']['id'] = [
      '#type' => 'machine_name',
      '#disabled' => isset($editDefaults['id']),
      '#default_value' => isset($editDefaults['id']) ? $editDefaults['id'] : NULL,
      '#machine_name' => [
        'exists' => '\Drupal\cp_structured_features\Form\StructuredFeatureForm::propertyCheckMachineName',
        'source' => ['properties_elements', 'agregate', 'label'],
      ],
    ];

    $form['properties_elements']['agregate']['status'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Status'),
      '#default_value' => isset($editDefaults['status']) ? $editDefaults['status'] : NULL,
    ];
    $form['properties_elements']['agregate']['type'] = [
      '#type' => 'select',
      '#title' => $this->t('Type'),
      '#required' => TRUE,
      '#default_value' => isset($editDefaults['type']) ? $editDefaults['type'] : NULL,
      '#options' => [
        'select' => $this->t('Select'),
        'radios' => $this->t('Radios'),
        'checkbox' => $this->t('Checkbox'),
        'checkboxes' => $this->t('Checkboxes'),
        'textfield' => $this->t('Textfield'),
        'textarea' => $this->t('Textarea'),
      ]
    ];
    $form['properties_elements']['agregate']['multiple'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Multiple'),
      '#default_value' => isset($editDefaults['multiple']) ? $editDefaults['multiple'] : NULL,
    ];
    $form['properties_elements']['agregate']['required'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Required'),
      '#default_value' => isset($editDefaults['required']) ? $editDefaults['required'] : NULL,
    ];
    $form['properties_elements']['agregate']['help'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Help'),
      '#default_value' => isset($editDefaults['help']) ? $editDefaults['help'] : NULL,
      '#description' => $this->t('If the field is assigned to specific language this value will not be translated. You must fill it in the end language.'),
    ];
    $form['properties_elements']['agregate']['help_lamp'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Light bulb help'),
      '#default_value' => isset($editDefaults['help_lamp']) ? $editDefaults['help_lamp'] : NULL,
      '#description' => $this->t('If the field is assigned to specific language this value will not be translated. You must fill it in the end language.'),
    ];
    $form['properties_elements']['agregate']['maxlength'] = [
      '#type' => 'number',
      '#title' => $this->t('Maxlength'),
      '#default_value' => isset($editDefaults['maxlength']) ? $editDefaults['maxlength'] : NULL,
      '#states' => [
        'visible' => [
          ':input[name="properties_elements[agregate][type]"]' => ['value' => 'textfield'],
        ],
      ],
    ];
    $form['properties_elements']['agregate']['size'] = [
      '#type' => 'number',
      '#title' => $this->t('Size'),
      '#default_value' => isset($editDefaults['size']) ? $editDefaults['size'] : NULL,
      '#states' => [
        'visible' => [
          ':input[name="properties_elements[agregate][type]"]' => ['value' => 'textfield'],
        ],
      ],
    ];
    $form['properties_elements']['agregate']['placeholder'] = [
      '#type' => 'textfield',
      '#title' => 'Placeholder',
      '#default_value' => isset($editDefaults['placeholder']) ? $editDefaults['placeholder'] : NULL,
      '#description' => $this->t('For select fields this is the equivalent to the empty value.') . '<br />' . $this->t('If the field is assigned to specific language this value will not be translated. You must fill it in the end language.'),
      '#states' => [
        'visible' => [
          ':input[name="properties_elements[agregate][type]"]' => [
            ['value' => 'textfield'],
            'or',
            ['value' => 'textarea'],
            'or',
            ['value' => 'select'],
          ],
        ],
      ],
    ];
    $languages = \Drupal::languageManager()->getLanguages();
    $optLang = ['all' => $this->t('All languages')];
    foreach ($languages as $language) {
      $optLang[$language->getId()] = $language->getName();
    }
    $form['properties_elements']['agregate']['language'] = [
      '#type' => 'select',
      '#title' => $this->t('Language'),
      '#required' => TRUE,
      '#options' => $optLang,
      '#description' => $this->t('If a field is set to a specific language it will be repeated for each language.'),
      '#default_value' => isset($editDefaults['language']) ? $editDefaults['language'] : NULL,
    ];
    $form['properties_elements']['agregate']['apply'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Apply option'),
      '#default_value' => isset($editDefaults['apply']) ? $editDefaults['apply'] : NULL,
      '#description' => $this->t('Show a checkbox on the property to enable or disable it if not apply.'),
      '#states' => [
        'visible' => [
          ':input[name="properties_elements[agregate][type]"]' => [
            ['value' => 'select'],
          ],
        ],
      ],
    ];
    $form['properties_elements']['agregate']['options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Options'),
      '#description' => $this->t('You must introduce a option for each line. The structure of each option must be key|Label, for example: first_key|First element') . '<br />' . $this->t('If the field is assigned to specific language this value will not be translated. You must fill it in the end language.'),
      '#default_value' => isset($editDefaults['options']) ? $editDefaults['options'] : NULL,
      '#states' => [
        'visible' => [
          ':input[name="properties_elements[agregate][type]"]' => [
            ['value' => 'select'],
            'or',
            ['value' => 'radios'],
            'or',
            ['value' => 'selcheckboxesect'],
          ],
        ],
        'required' => [
          ':input[name="properties_elements[agregate][type]"]' => [
            ['value' => 'select'],
            'or',
            ['value' => 'radios'],
            'or',
            ['value' => 'selcheckboxesect'],
          ],
        ],
      ],
    ];
    $form['properties_elements']['agregate']['default_value'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Default Value'),
      '#description' => $this->t('For elements with options (select, radios, ...) the default value must be the key instead the label.'),
      '#default_value' => isset($editDefaults['default_value']) ? $editDefaults['default_value'] : NULL,
    ];
    $form['properties_elements']['agregate']['class'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Class'),
      '#default_value' => isset($editDefaults['class']) ? $editDefaults['class'] : NULL,
      '#description' => $this->t('Classes can give additional layout properties.')
    ];
    $form['properties_elements']['agregate']['position'] = [
      '#type' => 'select',
      '#title' => $this->t('Position'),
      '#required' => TRUE,
      '#options' => [
        'top' => $this->t('Top'),
        'left' => $this->t('Left'),
        'right' => $this->t('Right'),
        'bottom' => $this->t('Bottom'),
      ],
      '#description' => $this->t('Top and Bottom elements will be displayed full width.'),
      '#default_value' => isset($editDefaults['position']) ? $editDefaults['position'] : NULL,
    ];
    $form['properties_elements']['agregate']['order'] = [
      '#type' => 'number',
      '#title' => $this->t('Weight'),
      '#required' => TRUE,
      '#default_value' => isset($editDefaults['order']) ? $editDefaults['order'] : 0,
      '#description' => $this->t('Position of the element in the form, the higher the number, the lower it will appear.'),
    ];
    $form['properties_elements']['agregate']['add'] = [
      '#type' => 'submit',
      '#value' => isset($editDefaults['id']) ? $this->t('Update') : $this->t('Add'),
      '#submit' => ['::addProperty'],
      '#limit_validation_errors' => [['properties_elements']],
      '#ajax' => [
        'callback' => '::reloadProperties',
        'wrapper' => 'reload-properties',
      ],
      '#name' => 'properties_aggregate_add',
    ];
    $form['properties_elements']['list'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['properties-elements-list']],
    ];
    $form['properties_elements']['list']['list_all'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['properties-elements-list-lang-all']],
    ];
    $form['properties_elements']['list']['list_all']['lang_title'] = [
      '#markup' => $this->t('<h2>Fields for both languages</h2>'),
    ];
    $form['properties_elements']['list']['list_es'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['properties-elements-list-lang-es']],
    ];
    $form['properties_elements']['list']['list_es']['lang_title'] = [
      '#markup' => $this->t('<h2>Fields for Spanish language</h2>'),
    ];
    $form['properties_elements']['list']['list_en'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['properties-elements-list-lang-en']],
    ];
    $form['properties_elements']['list']['list_en']['lang_title'] = [
      '#markup' => $this->t('<h2>Fields for English language</h2>'),
    ];

    $form['properties_elements']['list']['list_all']['top'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['top']],
    ];
    $form['properties_elements']['list']['list_all']['left'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['left']],
    ];
    $form['properties_elements']['list']['list_all']['right'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['right']],
    ];
    $form['properties_elements']['list']['list_all']['bottom'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['bottom']],
    ];

    $form['properties_elements']['list']['list_es']['top'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['top']],
    ];
    $form['properties_elements']['list']['list_es']['left'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['left']],
    ];
    $form['properties_elements']['list']['list_es']['right'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['right']],
    ];
    $form['properties_elements']['list']['list_es']['bottom'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['bottom']],
    ];

    $form['properties_elements']['list']['list_en']['top'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['top']],
    ];
    $form['properties_elements']['list']['list_en']['left'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['left']],
    ];
    $form['properties_elements']['list']['list_en']['right'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['right']],
    ];
    $form['properties_elements']['list']['list_en']['bottom'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['bottom']],
    ];

    usort($properties, function($a, $b) {
      $a['order'] = isset($a['order']) ? $a['order'] : 0;
      $b['order'] = isset($b['order']) ? $b['order'] : 0;
      if ($a['order'] < $b['order']) {
        return -1;
      }
      elseif ($a['order'] > $b['order']) {
        return 1;
      }
      else {
        return 0;
      }
    });
    foreach ($properties as $property) {
      $property_key = $property['id'];
      $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['container-inline']],
      ];
      $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property'] = [
        '#type' => 'details',
        '#title' => $property['label'] . ' (' . $property['id'] . ')',
      ];
      foreach ($form['properties_elements']['agregate'] as $pk => $pf) {
        if (1
          && strpos($pk, '#') === FALSE
          && isset($pf['#type'])
          && isset($form['properties_elements']['agregate'][$pk])
          && !in_array($pk, ['id', 'label'])
        ) {
          switch($pf['#type']) {
            case 'select':
              $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property'][$pk] = [
                '#markup' => '<strong>Type: </strong>: ' . $form['properties_elements']['agregate'][$pk]['#options'][$property[$pk]] . '<br />',
              ];
              break;

            case 'textfield':
            case 'number':
              $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property'][$pk] = [
                '#markup' => '<strong>' . $pf['#title'] . '</strong>: ' . $property[$pk] . '<br />',
              ];
              break;

              case 'textarea':
                $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property'][$pk] = [
                '#markup' => '<strong>' . $pf['#title'] . '</strong>: <br /><pre>' . $property[$pk] . '</pre><br />',
              ];
              break;

            case 'checkbox':
              $showvalue = $property[$pk] ? $this->t('Yes') : $this->t('No');
              $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property'][$pk] = [
                '#markup' => '<strong>' . $pf['#title'] . '</strong>: ' . $showvalue . '<br />',
              ];
              break;

          }
        }
      }
      $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property']['actions'] = [
        '#type' => 'actions',
      ];
      $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property']['actions']['edit'] = [
        '#type' => 'submit',
        '#value' => $this->t('Edit'),
        '#submit' => ['::editProperty'],
        '#limit_validation_errors' => [],
        '#ajax' => [
          'callback' => '::reloadProperties',
          'wrapper' => 'reload-properties',
        ],
        '#name' => 'properties_elements_edit_' . $property_key,
      ];
      $form['properties_elements']['list']['list_' . $property['language']][$property['position']][$property_key]['property']['actions']['remove'] = [
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
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);
    $form['actions']['submit']['#limit_validation_errors'] = [['label'], ['status'], ['description'], ['id'], ['reference_type']];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();

    unset($values['reference_terms']);
    $references = $form_state->get('references');
    $values['references'] = array_values($references);

    unset($values['properties_elements']);
    $properties = $form_state->get('properties');
    $values['properties'] = $properties;

    $form_state->setValues($values);

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
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
    $newReference = $form_state->getValue([
      'reference_terms',
      'agregate',
      'term',
      0,
      'target_id',
    ]);
    if ($newReference) {
      $input = $form_state->getUserInput();
      unset($input['reference_terms']['agregate']['term']);
      $form_state->setUserInput($input);
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
      $input = $form_state->getUserInput();
      unset($input['reference_terms']['agregate']['term']);
      $form_state->setUserInput($input);
      $storage = $this->entityTypeManager->getStorage('taxonomy_term');
      $term = $storage->load($tid);
      $references = $form_state->get('references');
      $references_removed = $form_state->get('references_removed');
      $references_removed[$term->uuid()] = $term->uuid();
      $form_state->set('references_removed', $references_removed);
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
      $input = $form_state->getUserInput();
      unset($input['properties_elements']['agregate']);
      $form_state->setUserInput($input);
      $form_state->set('edit_property', NULL);
      unset($newProperty['add']);
      $properties[$newProperty['id']] = $newProperty;
      $form_state->set('properties', $properties);
      $form_state->setRebuild();
    }
  }


  /**
   * Ajax removeReferenceTerm.
   */
  public function editProperty(&$form, FormStateInterface $form_state) {
    $elementTriggered = $form_state->getTriggeringElement();
    $id = str_replace('properties_elements_edit_', '', $elementTriggered['#name']);
    $editProperty = $form_state->getValue(['properties_elements','agregate']);
    if ($id) {
      $input = $form_state->getUserInput();
      $input['properties_elements']['agregate'] = $editProperty;
      $form_state->setUserInput($input);
      $form_state->set('edit_property', $id);
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
      $input = $form_state->getUserInput();
      unset($input['properties_elements']['agregate']);
      $form_state->setUserInput($input);
      $form_state->set('edit_property', NULL);
      $properties = $form_state->get('properties');
      $properties_removed = $form_state->get('properties_removed');
      $properties_removed[$id] = $id;
      $form_state->set('properties_removed', $properties_removed);
      unset($properties[$id]);
      $form_state->set('properties', $properties);
      $form_state->setRebuild();
    }
  }

  /**
   * Check the machine name.
   */
  public static function propertyCheckMachineName($value, array $element, FormStateInterface $form_state) {
    $properties = $form_state->get('properties');
    $edit_property = $form_state->get('edit_property');
    return isset($properties[$value]) && $edit_property != $value ? $value : NULL;
  }

}
