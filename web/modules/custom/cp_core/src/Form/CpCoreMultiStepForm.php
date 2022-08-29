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
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\field_group\FormatterHelper;
use Drupal\cp_core\Controller\CpCoreController;
use Drupal\Core\Session\AccountProxyInterface;

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
   * The entity form builder.
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
   * The messenger service.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * The entity.
   *
   * @var \Drupal\Core\Entity\EntityInterface
   */
  protected $entity;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $account;

  /**
   * Control vars.
   *
   * @var int
   */
  protected $step = 1;

  /**
   * Max step to control the last step.
   *
   * @var int
   */
  protected $maxStep = 0;

  /**
   * All the step names and control.
   *
   * @var array
   */
  protected $steps = [];

  /**
   * Control var to save the form mode pattern as "step_".
   *
   * @var string
   */
  protected $formModePattern;

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
   *   The entity type manager.
   * @param Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger service.
   * @param \Drupal\Core\Session\AccountProxyInterface $account
   *   The current user.
   */
  public function __construct(
    PrivateTempStoreFactory $temp_store_factory,
    MailManagerInterface $mail_manager,
    LanguageManagerInterface $language_manager,
    EntityFormBuilderInterface $entityFormBuilder,
    EntityTypeManagerInterface $entityTypeManager,
    MessengerInterface $messenger,
    AccountProxyInterface $account
  ) {
    $this->tempStoreFactory = $temp_store_factory;
    $this->mailManager = $mail_manager;
    $this->languageManager = $language_manager;
    $this->entityFormBuilder = $entityFormBuilder;
    $this->entityTypeManager = $entityTypeManager;
    $this->messenger = $messenger;
    $this->account = $account;
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
      $container->get('entity_type.manager'),
      $container->get('messenger'),
      $container->get('current_user')
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
    $this->formModePattern = $mode_form_pattern;
    $form_state->set('entity', $entity);
    $form_state->set('original_entity', $entity);

    for ($i = $this->step;; $i++) {
      // If a view mode called step_N exists we will aggregate it to show to the
      // form.
      if ($this->entityTypeManager->getStorage('entity_form_display')->load($entity->getEntityTypeId() . '.' . $entity->bundle() . '.' . "{$mode_form_pattern}_{$i}")) {
        $label = $this->entityTypeManager->getStorage('entity_form_mode')->load($entity->getEntityTypeId() . '.' . "{$mode_form_pattern}_{$i}")->label();
        $this->steps[$i] = $this->t((string) $label);
        $this->maxStep++;
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
   * This function builds the form based the base entity and the current
   * display.
   */
  protected function buildFormDisplay(FormStateInterface $form_state) {
    // Fetch the display used by the form. It is the display for the 'default'
    // form mode, with only the current field visible.
    $display = EntityFormDisplay::collectRenderDisplay($form_state->get('entity'), "{$this->formModePattern}_{$this->step}");
    $display->removeComponent('revision_log');
    $form_state->set('form_display', $display);
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $request = NULL, $mode_form_pattern = 'step', $nid = NULL) {

    $CpCoreController = new CpCoreController();
    $company_nid = $CpCoreController->_cp_core_get_company_nid_by_user($this->account->id());
    if (empty($company_nid)) {
      $this->messenger()->addMessage($this->t('You need to create a company to create your products.'));
      $this->redirect('view.product_dashboard.page_1');
    }

    $bundle = 'product';
    if (empty($form_state->get('entity'))) {
      $form_state->set('language_values_en', []);
      if (empty($nid)) {
        $entity = $this->entityTypeManager->getStorage('node')->create($request->query->all() + [
          'type' => $bundle,
          'status' => 0,
          'field_pr_ref_company' => ['target_id' => $company_nid],
        ]);
      }
      else {

        $entity = $this->entityTypeManager->getStorage('node')->load($nid);
        $entity->field_pr_ref_company->target_id = $company_nid;
        $entity->setUnpublished();
      }
      $this->init($form_state, $entity, $mode_form_pattern);
      if (!empty($this->getRequest()->query->get('store-entities'))) {
        $saved_entities = $this->getRequest()->query->get('store-entities');
        $form_state->set('saved_entities', explode('+', $saved_entities));
      }
      if (!empty($this->getRequest()->query->get('saved-entities'))) {
        $this->step = $this->maxStep;
        $saved_entities = explode(' ', $this->getRequest()->query->get('saved-entities'));
        $form_state->set('saved_entities', $saved_entities);
      }
      if (!$this->maxStep) {
        $this->mesesenger->addMessage(t('No existe ningún paso configurado para este tipo de contenido'), 'error');

        return [];
      }
    }
    $form['#cache']['max-age'] = 0;
    $entity = $form_state->get('entity');
    $this->entity = $entity;
    // We must iterate on every step.
    if ($this->step <= $this->maxStep) {
      $this->buildFormDisplay($form_state);

      $display = $form_state->get('form_display');

      // Build the form based on the entity.
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
      // $form['#process'][] = [CpCoreMultiStepHelper::class, 'formProcess'];
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
        unset($query['saved-entities']);
        $form['#action'] = Url::fromRoute('<current>', $query, [
          'fragment' => Html::getId($this->getFormId()),
          '_no_path' => TRUE,
        ])->toString();
      }
      $form['#attributes']['novalidate'] = 'novalidate';

      $form['header'] = [
        '#theme' => 'cp_core_node_multistep_header',
        '#weight' => -99,
      ];

      $form['sidebar'] = [
        '#theme' => 'cp_core_node_multistep_sidebar',
        '#current' => $this->step,
        '#steps' => $this->steps,
        '#weight' => -10,
      ];

      $build['status_messages'] = [
        '#type' => 'status_messages',
        '#weight' => -9,
      ];

      if ($this->step == 1) {
        // $form['legal_terms'] = [
        //   '#theme' => 'cp_core_node_multistep_legal_modal',
        //   '#weight' => -11,
        // ];
        $form['legal_terms'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'legal-modal',
          '#autoload' => TRUE,
          '#title' => $this->t('Add product / service'),
          '#message' => $this->t('All uploaded content must comply with the <a href="/cp-core-legal" target="_BLANK">publishing policy.</a>'),
          '#button_text' => $this->t('I agree'),
          '#weight' => -11,
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

      if ($this->step <= $this->maxStep) {
        $form['footer_form']['actions']['previous'] = [
          '#type' => 'submit',
          '#value' => t('Previous'),
          '#submit' => [
            '::previousPage',
          ],
          '#limit_validation_errors' => [],
        ];
      }

      if ($this->step < ($this->maxStep - 1)) {
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
      elseif ($this->step == ($this->maxStep - 1)) {
        $form['footer_form']['actions']['cancel'] = [
          '#type' => 'submit',
          '#value' => t('Cancel'),
          '#submit' => [
            '::cancelForm',
          ],
          '#limit_validation_errors' => [],
        ];
        $form['footer_form']['actions']['submit'] = [
          '#type' => 'submit',
          '#value' => t('Next'),
        ];
        $form['#submit'][] = '::saveForm';
        $form['#submit'][] = 'mfd_form_submit';
      }
      else {
        // Show view with product presaving.
        $saved_entities = $form_state->get('saved_entities');
        if (empty($saved_entities)) {
          $saved_entities = [];
        }
        $saved_entities = array_unique($saved_entities);
        $options = [];
        $view_builder = $this->entityTypeManager->getViewBuilder('node');
        $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($saved_entities);
        foreach ($nodes as $nid => $node) {
          $options[$nid] = $view_builder->view($node, 'product_service_presave_list');
        }

        $form['product_list_links'] = [
          '#type' => 'container',
        ];
        $form['product_list_links']['select_all'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => t('Select All'),
          '#attributes' => ['class' => ['button', 'btn', 'select-all'], 'href' => '#'],
        ];
        $form['product_list_links']['unselect_all'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => t('Unselect All'),
          '#attributes' => ['class' => ['button', 'btn', 'unselect-all'], 'href' => '#'],
        ];

        $form['product_list'] = [
          '#title' => NULL,
          '#type' => 'checkboxes',
          '#options' => $options,
        ];
        $options = ['query' => ['store-entities' => implode('+', $saved_entities)]];
        $url = Url::fromRoute('<current>', [], $options);
        $form['footer_form']['actions']['add_other'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => t('Load another product'),
          '#attributes' => ['class' => ['button', 'btn', 'add-other']],
        ];
        $form['footer_form']['actions']['add_other_modal'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'add-other-question-modal',
          '#autoload' => FALSE,
          '#title' => $this->t('Add product / service'),
          '#message' => $this->t('You are about to upload another product/service, you must start the <strong>"Product or service information"</strong> process to add a new product.'),
          '#question' => $this->t('Do you wish to continue?'),
          '#button_text' => $this->t('Yes'),
          '#button_link' => $url->toString(),
          '#button_no_text' => $this->t('No'),
          '#button_no_link' => '#',
          '#weight' => -11,
        ];
        $form['footer_form']['actions']['cancel'] = [
          '#type' => 'submit',
          '#value' => t('Cancel'),
          '#submit' => [
            '::cancelForm',
          ],
          '#limit_validation_errors' => [],
        ];
        $form['footer_form']['actions']['save_publish'] = [
          '#type' => 'submit',
          '#value' => t('Save and send for aprobation'),
          '#submit' => ['::saveAndPublishSubmit'],
        ];
      }
    }
    $form['#cache']['contexts'][] = 'url.query_args';

    return $form;
  }

  /**
   * Submit function that return to previous page.
   */
  public function previousPage(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
    $this->step--;
  }

  /**
   * Cancel button must delete all saved entities and go to dashboard.
   */
  public function cancelForm(array &$form, FormStateInterface $form_state) {
    // We must delete all created at the moment.
    $nids = $form_state->get('saved_entities');
    $nids = array_unique($nids);
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $nodes = $nodeStorage->loadMultiple($nids);
    $nodeStorage->delete($nodes);

    $url = Url::fromUri('internal:/dashboard');
    $form_state->setRedirectUrl($url);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $entity = $this->buildEntity($form, $form_state);
    $input = $form_state->getUserInput();
    if ($this->step <= $this->maxStep && (!isset($input['_triggering_element_name']) || strpos($input['_triggering_element_name'], 'upload_button') === FALSE)) {
      $form_state->get('form_display')->validateFormValues($entity, $form, $form_state);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $entity = $this->buildEntity($form, $form_state);
    $form_state->set('entity', $entity);
    $values = $form_state->getValues();
    $language_values = $form_state->get('language_values_en');
    foreach ($values as $k => $v) {
      if (strpos($k, '_en') !== FALSE) {
        $language_values[$k] = $v;
      }
    }
    $form_state->set('language_values_en', $language_values);

    // The last step is an empty step to show product list. The saving must be
    // an previous step.
    if ($this->step <= ($this->maxStep - 1)) {
      $form_state->setRebuild();
      $this->step++;
    }
    else {
      // Show the last step.
    }
  }

  /**
   * Saves the entity with updated values for the edited field.
   */
  public function saveForm(array &$form, FormStateInterface $form_state) {
    $entity = $this->buildEntity($form, $form_state);
    $language_values = $form_state->get('language_values_en');
    foreach ($language_values as $k => $v) {
      if (strpos($k, '_en') !== FALSE) {
        $form_state->setValue($k, $v);
      }
    }
    $form_state->setValue('status_en', [0 => FALSE]);
    if (!$entity->label()) {
      $entity->title = 'Generated el: ' . date('d/m/Y H:i');
    }
    $entity->save();
    $saved_entities = $form_state->get('saved_entities');
    if (empty($saved_entities)) {
      $saved_entities = [];
    }
    $saved_entities[] = $entity->id();
    $form_state->set('entity', $entity);
    $this->entity = $entity;
    $form_state->set('saved_entities', $saved_entities);
    $form_state->set('saved', TRUE);
    $options = ['query' => ['saved-entities', implode('+', $saved_entities)]];
    $url = Url::fromRoute('<current>', [], $options);
    $form_state->setRedirectUrl($url);
  }

  /**
   * Return to first step with saved entities array.
   */
  public function addOtherSubmit(array &$form, FormStateInterface $form_state) {
    $this->entity = NULL;
    $form_state->set('entity', NULL);
    $form_state->set('saved', FALSE);
    if (!empty($this->getRequest()->query->get('saved-entities'))) {
      $saved_entities = $this->getRequest()->query->get('saved-entities');
      $form_state->set('saved_entities', explode('+', $saved_entities));
    }
    $form_state->setRebuild();
    $this->step = NULL;
  }

  /**
   * Allow to save and publish all nodes.
   */
  public function saveAndPublishSubmit(array &$form, FormStateInterface $form_state) {
    $product_list = $form_state->getValue('product_list');
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    foreach ($product_list as $nid) {
      if ($nid) {
        // Set wait status.
        $node = $nodeStorage->load($nid);
        $node->field_states = 'waiting';
        $node->setPublished();
        $node->save();
      }
    }
    $url = Url::fromUri('internal:/dashboard');
    $form_state->setRedirectUrl($url);
  }

  /**
   * Get Entity method.
   */
  public function getEntity() {
    return $this->entity;
  }

}
