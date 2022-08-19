<?php

namespace Drupal\cp_core\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\Core\Mail\MailManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Entity\EntityFormBuilderInterface;
use Drupal\Core\TempStore\PrivateTempStoreFactory;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\Entity\EntityFormDisplay;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Component\Utility\Html;
use Drupal\field_group\FormatterHelper;
use Drupal\cp_core\CpCoreMultiStepHelper;

/**
 * Implements an example form.
 */
class CpCoreMultiStepForm extends FormBase {

  /**
   * The mail manager.
   *
   * @var \Drupal\Core\TempStore\PrivateTempStoreFactory
   */
  protected $tempStoreFactory;

  /**
   * The mail manager.
   *
   * @var \Drupal\Core\Mail\MailManagerInterface
   */
  protected $mailManager;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   *
   * @var \Drupal\Core\Entity\EntityFormBuilderInterface
   */
  protected $entityFormBuilder;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity.
   *
   * @var \Drupal\Core\Entity\EntityInterface
   */
  protected $entity;

  /**
   * Control vars
   *
   * @var int
   */
  protected $step = 1;

  /**
   * Control vars
   *
   * @var int
   */
  protected $max_step = 0;

  /**
   * Control vars
   *
   * @var array
   */
  protected $steps = [];

  /**
   * Control vars
   *
   * @var string
   */
  protected $mode_form_pattern;

  /**
   * Constructs a new EmailExampleGetFormPage.
   *
   * @param \Drupal\Core\TempStore\PrivateTempStoreFactory $temp_store_factory
   *   The private tempstore factory.
   * @param \Drupal\Core\Mail\MailManagerInterface $mail_manager
   *   The mail manager.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\Core\Entity\EntityFormBuilderInterface $entityFormBuilder
   *   The language manager.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   */
  public function __construct(
    PrivateTempStoreFactory $temp_store_factory,
    MailManagerInterface $mail_manager,
    LanguageManagerInterface $language_manager,
    EntityFormBuilderInterface $entityFormBuilder,
    EntityTypeManagerInterface $entityTypeManager
  ) {
    $this->tempStoreFactory = $temp_store_factory;
    $this->mailManager = $mail_manager;
    $this->languageManager = $language_manager;
    $this->entityFormBuilder = $entityFormBuilder;
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
    $container->get('tempstore.private'),
    $container->get('plugin.manager.mail'),
    $container->get('language_manager'),
    $container->get('entity.form_builder'),
    $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return "cp_core_multistep_form";
  }

  /**
   * Initialize the form state and the entity before the first form build.
   */
  protected function init(FormStateInterface $form_state, EntityInterface $entity, $mode_form_pattern) {
    $this->mode_form_pattern = $mode_form_pattern;
    $form_state->set('entity', $entity);
    $form_state->set('original_entity', $entity);

    for ($i = $this->step;; $i++) {
      // If a view mode called step_N exists we will aggregate it to show to the
      // form.
      if ($this->entityTypeManager->getStorage('entity_form_display')->load($entity->getEntityTypeId() . '.' . $entity->bundle() . '.' . "{$mode_form_pattern}_{$i}")) {
        $this->steps[$i] = $this->t($this->entityTypeManager->getStorage('entity_form_mode')->load($entity->getEntityTypeId() . '.' . "{$mode_form_pattern}_{$i}")->label());
        $this->max_step++;
      }
      else {
        break;
      }
    }

  }

  /**
   * Returns a cloned entity containing updated field values.
   *
   * Calling code may then validate the returned entity, and if valid, transfer
   * it back to the form state and save it.
   */
  protected function buildEntity(array $form, FormStateInterface $form_state) {
    /** @var $entity \Drupal\Core\Entity\EntityInterface */
    $entity = clone $form_state->get('entity');
    $form_state->get('form_display')->extractFormValues($entity, $form, $form_state);
    return $entity;
  }

  /**
   *
   */
  protected function buildFormDisplay(FormStateInterface $form_state) {
    // Fetch the display used by the form. It is the display for the 'default'
    // form mode, with only the current field visible.
    $display = EntityFormDisplay::collectRenderDisplay($form_state->get('entity'), "{$this->mode_form_pattern}_{$this->step}");
    $display->removeComponent('revision_log');
    $form_state->set('form_display', $display);
  }

  /**
   * {@inheritdoc} Builds a form for a single entity field.
   */
  public function buildForm(array $form, FormStateInterface $form_state, $request = [], $mode_form_pattern = 'step') {
    $bundle = 'product';
    $triggered_element = $form_state->getTriggeringElement();
    if ($triggered_element && $triggered_element['#name'] == 'element_bundle') {
      $storage = $form_state->getStorage();
      unset($storage['entity']);
      unset($storage['original_entity']);
      $form_state->setStorage($storage);
      $bundle = $form_state->getValue('element_bundle');
    }
    if (!$form_state->has('entity')) {
      $entity = $this->entityTypeManager->getStorage('node')->create($request->query->all() + [
        'type' => $bundle,
        'status' => 0,
      ]);
      $this->init($form_state, $entity, $mode_form_pattern);

      if (!$this->max_step) {
        \Drupal::messenger()->addMessage(t('No existe ningún paso configurado para este tipo de contenido'), 'error');
        return [];
      }
    }

    $entity = $form_state->get('entity');
    $this->entity = $entity;
    if ($this->step <= $this->max_step) {
      $this->buildFormDisplay($form_state);

      $display = $form_state->get('form_display');

      // Add the field form.
      $display->buildForm($entity, $form, $form_state);

      $form['#attributes']['class'][] = $display->getMode();
      $form['#attributes']['id'] = 'cp-core-multistep-form';

      $context = [
        'entity_type' => $entity->getEntityTypeId(),
        'bundle' => $entity->bundle(),
        'entity' => $entity,
        'context' => 'form',
        'display_context' => 'form',
        'mode' => $display->getMode(),
      ];

      field_group_attach_groups($form, $context);
      $form['#process'][] = [FormatterHelper::class, 'formProcess'];
      $form['#process'][] = [CpCoreMultiStepHelper::class, 'formProcess'];
      $input = $form_state->getUserInput();
      if ((!isset($input['_triggering_element_name']) || strpos($input['_triggering_element_name'], 'upload_button') === FALSE)) {
        $query = $this->getRequest()->query->all();
        $submittedValues = $form_state->getValues();
        foreach ($submittedValues as $qk => &$qv) {
          if (!empty($query[$qk])) {
            if (is_array($qv)) {
              $qv = array_shift($qv);
              if (is_array($qv)) {
                $qv = array_shift($qv);
              }
            }
            $query[$qk] = $qv;
          }
        }
        $form['#action'] = Url::fromRoute('<current>', $query, [
          'fragment' => Html::getId($this->getFormId()),
          '_no_path' => TRUE,
        ])->toString();
      }
      $form['#attributes']['novalidate'] = 'novalidate';

      $form['sidebar'] = [
        '#theme' => [
          'cp_core_node_multistep_sidebar',
        ],
        '#current' => $this->step,
        '#steps' => $this->steps,
        '#weight' => -10,
      ];

      $build['status_messages'] = [
        '#type' => 'status_messages',
        '#weight' => -9,
      ];

      if ($this->step == 1) {
        $form['legal_terms'] = [
          '#theme' => 'cp_core_node_multistep_legal_modal',
          '#weight' => -11,
        ];
        $form['element_bundle'] = [
          '#type' => 'select',
          '#title' => $this->t('Type'),
          '#name' => 'element_bundle',
          '#default_value' => $bundle,
          '#options' => [
            'product' => $this->t('Product'),
            'service' => $this->t('Service'),
          ],
          '#ajax' => [
            'callback' => '::changeProductType',
            'wrapper' => 'cp-core-multistep-form',
          ],
          '#weight' => -8,
        ];
      }

      $form['footer_form'] = [
        '#type' => 'container',
        '#attributes' => [
          'class' => [
            'row',
          ],
        ],
        '#weight' => 50,
      ];

      $form['footer_form']['actions'] = [
        '#type' => 'actions',
        '#theme_wrappers' => [
          'container' => [
            '#attributes' => [
              'class' => [
                'col-sm-3',
              ],
            ],
          ],
        ],
      ];

      if ($this->step > 1) {
        $form['footer_form']['actions']['previous'] = [
          '#type' => 'submit',
          '#value' => t('Previous'),
          '#submit' => [
            '::previousPage',
          ],
          '#limit_validation_errors' => [],
        ];
      }

      if ($this->step < $this->max_step) {
        $form['footer_form']['actions']['cancel'] = [
          '#type' => 'submit',
          '#value' => t('Cancel'),
          '#submit' => [
            '::cancelForm',
          ],
          '#limit_validation_errors' => [],
        ];
        $form['footer_form']['actions']['next'] = [
          '#type' => 'submit',
          '#value' => t('Next'),
        ];
      }
      else {
        $form['footer_form']['actions']['submit'] = [
          '#type' => 'submit',
          '#value' => t('Send'),
        ];

      }

    }
    $form['#cache']['contexts'][] = 'url.query_args';

    return $form;
  }

  /**
   *
   */
  public function previousPage(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
    $this->step--;
  }

  /**
   *
   */
  public function cancelForm(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
    $this->step--;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $entity = $this->buildEntity($form, $form_state);
    $input = $form_state->getUserInput();
    if ($this->step <= $this->max_step && (!isset($input['_triggering_element_name']) || strpos($input['_triggering_element_name'], 'upload_button') === FALSE)) {
      $form_state->get('form_display')->validateFormValues($entity, $form, $form_state);
    }
  }

  /**
   * {@inheritdoc} Saves the entity with updated values for the edited field.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $entity = $this->buildEntity($form, $form_state);
    $form_state->set('entity', $entity);
    if ($this->step < $this->max_step) {
      $form_state->setRebuild();
      $this->step++;
    }
    else {
      if (!$entity->label()) {
        $entity->name = 'Generated el: ' . date('d/m/Y H:i');
      }
      $entity->save();
      \Drupal::messenger()->addMessage(t('Se ha enviado el formulario correctamente'));
    }
  }

  /**
   * Ajax callback.
   */
  public function changeProductType(array &$form, FormStateInterface $form_state) {
    return $form;
  }

  /**
   * Get Entity method.
   */
  public function getEntity() {
    return $this->entity;
  }

}
