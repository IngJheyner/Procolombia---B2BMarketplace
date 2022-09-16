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
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\mfd\MfdFieldManager;
use Drupal\cp_core\CpCoreMailHelperInterface;

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
   * The notification system.
   *
   * @var \Drupal\cp_core\CpCoreMailHelperInterface
   */
  protected $notification;

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
    AccountProxyInterface $account,
    CpCoreMailHelperInterface $notification
  ) {
    $this->tempStoreFactory = $temp_store_factory;
    $this->mailManager = $mail_manager;
    $this->languageManager = $language_manager;
    $this->entityFormBuilder = $entityFormBuilder;
    $this->entityTypeManager = $entityTypeManager;
    $this->messenger = $messenger;
    $this->account = $account;
    $this->notification = $notification;
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
      $container->get('current_user'),
      $container->get('cp_core.mail_helper')
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
   * Function builds the form based the base entity and the current display.
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

    $bundle = 'product';
    if (empty($form_state->get('entity'))) {
      $this->step = 1;
      $form_state->set('language_values_en', []);
      if (empty($nid) || !empty($this->getRequest()->query->get('store-entities'))) {
        $entity = $this->entityTypeManager->getStorage('node')->create($request->query->all() + [
          'type' => $bundle,
          'status' => 0,
          'uid' => $this->account->id(),
          'langcode' => 'es',
        ]);
      }
      else {
        $entity = $this->entityTypeManager->getStorage('node')->load($nid);
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
        $this->messenger()->addMessage($this->t('No existe ningún paso configurado para este tipo de contenido'), 'error');

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
      $form['#attributes']['class'][] = 'cp-core-multistep-form';

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
        $form['#action'] = str_replace('&ajax_form=1', '', $form['#action']);
        $form['#action'] = str_replace('ajax_form=1', '', $form['#action']);
        $form['#action'] = str_replace('&_wrapper_format=drupal_ajax', '', $form['#action']);
        $form['#action'] = str_replace('_wrapper_format=drupal_ajax', '', $form['#action']);
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

      if (isset($form['field_body']['widget']['0']['value'])){
        $form['field_body']['widget']['0']['value']['#placeholder'] = t('Descripción del producto / Servicio');
      }
      if (isset($form['field_pr_multilingual_step1']['widget'][0]['value']['en']['title']['widget'][0]['value']['#title'])) {
        $form['field_pr_multilingual_step1']['widget'][0]['value']['en']['title']['widget'][0]['value']['#title'] = 'Product/service';
      }
      if (isset($form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_body']['widget'][0]['value']['#title'])) {
        $form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_body']['widget'][0]['value']['#title'] = 'Description';
      }
      if (isset($form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_body']['widget'][0]['value']['#description'])) {
        $form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_body']['widget'][0]['value']['#description'] = 'Please include a summary description of the product/service with its main features and/or attributes. main features and/or attributes.';
      }
      if (isset($form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_file']['widget'][0]['#title'])) {
        $form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_file']['widget'][0]['#title'] = 'Technical specifications';
      }
      if (isset($form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_file']['widget'][0]['#description'])) {
        $form['field_pr_multilingual_step1']['widget'][0]['value']['en']['field_file']['widget'][0]['#description'] = 'Only files in pdf format with a maximum size of 500K are allowed.';
      }
      if (isset($form['field_pr_multilingual_step2']['widget'][0]['value']['en']['field_aditional_information']['widget'][0]['value']['#title'])) {
        $form['field_pr_multilingual_step2']['widget'][0]['value']['en']['field_aditional_information']['widget'][0]['value']['#title'] = 'Additional or complementary product information';
      }

      if (isset($form['field_pr_video_description_1']['widget'][0]['value'])) {
        $form['field_pr_video_description_1']['widget'][0]['value']['#states'] = [
          'visible' => [
            'input#edit-field-pr-video-0-value' => ['empty' => FALSE],
          ],
          'required' => [
            'input#edit-field-pr-video-0-value' => ['empty' => FALSE],
          ],
        ];
      }
      if (isset($form['field_pr_video_description_2']['widget'][0]['value'])) {
        $form['field_pr_video_description_2']['widget'][0]['value']['#states'] = [
          'visible' => [
            'input[name="field_pr_video_2[0][value]"]' => ['empty' => FALSE],
          ],
          'required' => [
            'input[name="field_pr_video_2[0][value]"]' => ['empty' => FALSE],
          ],
        ];
        $form['field_pr_video_2']['#attributes'] = ['style' => 'display: none'];
      }

      if (isset($form['field_categorization'])) {
        $categorization_terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties([
          'parent' => 0,
          'vid' => 'categorization',
        ]);
        $newcategorization_options = [key($form['field_categorization']['widget']['#options']) => reset($form['field_categorization']['widget']['#options'])];
        foreach ($categorization_terms as $categorization_term) {
          $newcategorization_options[$categorization_term->id()] = $categorization_term->label();
        }
        $form['field_categorization']['widget']['#options'] = $newcategorization_options;
        $form['field_categorization']['widget']['#ajax'] = [
          'callback' => '::reloadSubCategorization',
          'wrapper' => 'dependency-fieldcategorization',
        ];
        $form['field_categorization_parent']['#prefix'] = '<div id="dependency-fieldcategorization">';
        $form['field_categorization_parent']['#suffix'] = '</div>';
      }

      if (($this->entity->field_categorization->target_id || !empty($form_state->getValue('field_categorization'))) && isset($form['field_categorization_parent'])) {
        $categorization_terms_id = !empty($form_state->getValue('field_categorization')) ? $form_state->getValue('field_categorization')[0]['target_id'] : $this->entity->field_categorization->target_id;
        $categorization_terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties([
          'parent' => $categorization_terms_id,
          'vid' => 'categorization',
        ]);
        $newsubcategorization_options = [key($form['field_categorization_parent']['widget']['#options']) => reset($form['field_categorization_parent']['widget']['#options'])];
        foreach ($categorization_terms as $categorization_term) {
          $newsubcategorization_options[$categorization_term->id()] = $categorization_term->label();
        }
        $form['field_categorization_parent']['widget']['#options'] = !empty($newsubcategorization_options) ? $newsubcategorization_options : [0 => ''];
      }
      elseif (isset($form['field_categorization_parent'])) {
        $form['field_categorization_parent']['widget']['#options'] = [key($form['field_categorization_parent']['widget']['#options']) => reset($form['field_categorization_parent']['widget']['#options'])];
      }

      if ($this->entity->field_categorization->target_id && isset($form['field_pr_type_certifications'])) {
        $categorization_terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties([
          'parent' => $this->entity->field_categorization->target_id,
          'vid' => 'categorization',
        ]);
        $newcertification_options = [key($form['field_pr_type_certifications']['widget']['#options']) => reset($form['field_pr_type_certifications']['widget']['#options'])];
        foreach ($categorization_terms as $categorization_term) {
          $newcertification_options[$categorization_term->id()] = $categorization_term->label();
        }
        $form['field_pr_type_certifications']['widget']['#options'] = $newcertification_options;
      }

      if ($this->entity->field_categorization->target_id && isset($form['field_pr_sales_channel'])) {
        $categorization_terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties([
          'parent' => $this->entity->field_categorization->target_id,
          'vid' => 'categorization',
        ]);
        $newcertification_options = [key($form['field_pr_sales_channel']['widget']['#options']) => reset($form['field_pr_sales_channel']['widget']['#options'])];
        foreach ($categorization_terms as $categorization_term) {
          $newcertification_options[$categorization_term->id()] = $categorization_term->label();
        }
        $form['field_pr_sales_channel']['widget']['#options'] = $newcertification_options;
      }

      if ($this->entity->field_product_type->value == 'service' && isset($form['field_partida_arancelaria_tax'])) {
        $form['field_partida_arancelaria_tax']['widget']['#required'] = FALSE;
        $form['field_partida_arancelaria_tax']['widget']['#access'] = FALSE;
        $form['#fieldgroups']['group_tooltip_ancelaria']->format_settings['markup']['value'] = '';
        $form['#fieldgroups']['group_tooltip_ancelaria']->format_settings['classes'] = 'form-wrapper';
      }

      if ($this->step == 1) {
        $form['legal_terms'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'legal-modal',
          '#autoload' => TRUE,
          '#title' => $this->t('Add product / service'),
          '#message' => $this->t('All uploaded content must comply with the <a href="/en/information/terms-use" target="_BLANK">publishing policy.</a>'),
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
          '#value' => $this->t('Previous'),
          '#submit' => [
            '::previousPage',
          ],
          '#limit_validation_errors' => [],
        ];
      }

      if ($this->step < ($this->maxStep - 1)) {
        $form['footer_form']['actions']['cancel'] = [
          '#type' => 'submit',
          '#value' => $this->t('Cancel'),
          '#submit' => [
            '::cancelForm',
          ],
          '#limit_validation_errors' => [],
          '#attributes' => ['class' => ['visually-hidden', 'cancel-confirm-submit']],
        ];
        $form['footer_form']['actions']['cancel_link'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Cancel'),
          '#attributes' => [
            'class' => ['cancel-confirm-link', 'button', 'btn'],
            'href' => '#',
          ],
        ];
        $form['footer_form']['actions']['modal_cancel'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'cancel-confirm-question-modal',
          '#autoload' => FALSE,
          '#title' => $this->t('Cancel process'),
          '#message' => $this->t('You are about to cancel the "Upload product or service" process.'),
          '#question' => $this->t('Do you wish to continue?'),
          '#button_text' => $this->t('Yes'),
          '#button_link' => '#',
          '#button_no_text' => $this->t('No'),
          '#button_no_link' => '#',
        ];
        $form['footer_form']['actions']['next'] = [
          '#type' => 'submit',
          '#value' => $this->t('Next'),
        ];
      }
      elseif ($this->step == ($this->maxStep - 1)) {
        $form['footer_form']['actions']['insert_video'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Insert video'),
          '#attributes' => [
            'class' => ['insert-video', 'btn', 'button'],
            'href' => '#',
          ],
        ];
        $form['footer_form']['actions']['cancel'] = [
          '#type' => 'submit',
          '#value' => $this->t('Cancel'),
          '#submit' => [
            '::cancelForm',
          ],
          '#limit_validation_errors' => [],
          '#attributes' => [
            'class' => ['visually-hidden', 'cancel-confirm-submit'],
          ],
        ];
        $form['footer_form']['actions']['cancel_link'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Cancel'),
          '#attributes' => [
            'class' => ['cancel-confirm-link', 'btn', 'button'],
            'href' => '#',
          ],
        ];
        $form['footer_form']['actions']['modal_cancel'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'cancel-confirm-question-modal',
          '#autoload' => FALSE,
          '#title' => $this->t('Cancel process'),
          '#message' => $this->t('You are about to cancel the "Upload product or service" process.'),
          '#question' => $this->t('Do you wish to continue?'),
          '#button_text' => $this->t('Yes'),
          '#button_link' => '#',
          '#button_no_text' => $this->t('No'),
          '#button_no_link' => '#',
        ];
        $form['footer_form']['actions']['submit'] = [
          '#type' => 'submit',
          '#value' => $this->t('Next'),
        ];
        $form['#submit'][] = '::saveForm';
        $form['#submit'][] = '::mfdSaveForm';
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
        $productTitles = [];
        foreach ($nodes as $nid => $node) {
          $options[$nid] = $view_builder->view($node, 'product_service_presave_list');
          $productTitles[] = $node->label();
        }

        $form['product_list'] = [
          '#type' => 'container',
          '#attributes' => ['class' => ['product-list']],
        ];
        $form['product_list']['product_list_links'] = [
          '#type' => 'container',
          '#attributes' => ['class' => ['product-list-links']],
        ];
        $form['product_list']['product_list_links']['select_all'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Select All'),
          '#attributes' => [
            'class' => ['button', 'btn', 'select-all'],
            'href' => '#',
          ],
        ];
        $form['product_list']['product_list_links']['unselect_all'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Unselect All'),
          '#attributes' => [
            'class' => ['button', 'btn', 'unselect-all'],
            'href' => '#',
          ],
        ];

        $form['product_list']['product_list_items'] = [
          '#title' => NULL,
          '#type' => 'checkboxes',
          '#options' => $options,
        ];
        $options = ['query' => ['store-entities' => implode('+', $saved_entities)]];
        $url = Url::fromRoute('<current>', [], $options);
        $form['footer_form']['actions']['add_other'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Load another product'),
          '#attributes' => [
            'class' => ['button', 'btn', 'add-other'],
            'href' => '#',
          ],
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
          '#value' => $this->t('Cancel'),
          '#submit' => [
            '::cancelForm',
          ],
          '#limit_validation_errors' => [],
          '#attributes' => ['class' => ['visually-hidden', 'cancel-confirm-submit']],
        ];
        $form['footer_form']['actions']['cancel_link'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Cancel'),
          '#attributes' => [
            'class' => ['cancel-confirm-link', 'btn', 'button'],
            'href' => '#',
          ],
        ];
        $form['footer_form']['actions']['modal_cancel'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'cancel-confirm-question-modal',
          '#autoload' => FALSE,
          '#title' => $this->t('Cancel process'),
          '#message' => $this->t('You are about to cancel the "Upload product or service" process.'),
          '#question' => $this->t('Do you wish to continue?'),
          '#button_text' => $this->t('Yes'),
          '#button_link' => '#',
          '#button_no_text' => $this->t('No'),
          '#button_no_link' => '#',
        ];

        $form['footer_form']['actions']['save_publish_modal'] = [
          '#theme' => 'cp_core_node_multistep_generic_modal',
          '#class' => 'save-publish-question-modal',
          '#autoload' => FALSE,
          '#title' => $this->t('Send to aprobation'),
          '#message' => $this->t('Do you want send to aprobation the loaded product/services?<br /><strong>@products</strong>', ['@products' => implode(', ', $productTitles)]),
          '#question' => $this->t('Do you wish to continue?'),
          '#button_text' => $this->t('Yes'),
          '#button_link' => '#',
          '#button_no_text' => $this->t('No'),
          '#button_no_link' => '#',
        ];

        $form['footer_form']['actions']['save_publish'] = [
          '#type' => 'submit',
          '#value' => $this->t('Save and publish'),
          '#submit' => ['::saveAndPublishSubmit'],
          '#attributes' => ['class' => ['visually-hidden', 'save-and-publish']],
        ];

        $form['footer_form']['actions']['save_publish_link'] = [
          '#type' => 'html_tag',
          '#tag' => 'a',
          '#value' => $this->t('Save and publish'),
          '#attributes' => [
            'class' => ['button', 'btn', 'save-publish-button'],
            'href' => '#',
          ],
        ];

        if ($form_state->get('sent_publish_entities')) {
          $elements = [];
          $sent_publish_entities = $form_state->get('sent_publish_entities');
          $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($sent_publish_entities);
          foreach ($nodes as $node) {
            $elements[] = $node->label();
          }
          $form['modal_save_publish_correct'] = [
            '#theme' => 'cp_core_node_multistep_generic_modal',
            '#class' => 'save-publish-correct-modal',
            '#autoload' => TRUE,
            '#title' => $this->t('Successful process'),
            '#message' => $this->t('Your products <strong>"@elements"</strong> are in pending status for approval by ProColombia.<br /><br />Products without selection have been successfully saved in the system. If you want to publish them, you must go to the user dashboard and select the Edit option.', ['@elements' => implode(', ', $elements)]),
            '#button_text' => $this->t('I got it'),
            '#button_link' => Url::fromUri('internal:/dashboard')->toString(),

          ];
        }
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
    if ($nids) {
      $nids = array_unique($nids);
      $nodeStorage = $this->entityTypeManager->getStorage('node');
      $nodes = $nodeStorage->loadMultiple($nids);
      $nodeStorage->delete($nodes);
    }

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
   * Submit form.
   */
  public function mfdSaveForm(&$form, FormStateInterface $form_state) {
    $form_values = $form_state->getValues();
    $form_object = $form_state->getFormObject();

    // If entity is not translatable, there is nothing for us to do.
    $entity = $form_object->getEntity();
    if (!$entity->isTranslatable()) {
      return;
    }
    $entity->save();

    // Does this entity have a mfd field?
    $mfd_field_manager = new MfdFieldManager();

    if ($mfd_field_manager->hasMfdField($entity)) {

      $current_language = $this->languageManager->getCurrentLanguage()->getId();

      $available_langcodes = array_flip(array_keys($this->languageManager->getLanguages()));
      ksort($available_langcodes);

      // Store the field translations.
      foreach ($available_langcodes as $langcode => $value) {
        if ($langcode !== $current_language) {
          $translated_fields = [];

          foreach ($entity->getFieldDefinitions() as $field_name => $definition) {
            if ($definition->isTranslatable()) {
              $field_name_unique = $field_name . '_' . $langcode;
              if (isset($form_values[$field_name_unique])) {
                if (!empty($form_values[$field_name_unique][0]['fids'])) {
                  $newTargetIds = [];
                  foreach ($form_values[$field_name_unique][0]['fids'] as $fid) {
                    $newTargetIds[] = ['target_id' => $fid];
                  }
                  $translated_fields[$field_name] = $newTargetIds;
                }
                else {
                  $translated_fields[$field_name] = $form_values[$field_name_unique];
                }
              }
            }
          }

          if (!$entity->hasTranslation($langcode)) {
            continue;
          }

          $translation = $entity->getTranslation($langcode);
          foreach ($translated_fields as $field => $field_value) {

            if (!is_numeric(array_key_first($field_value))) {
              $first_field_value = reset($field_value);
              if (is_array($first_field_value) && is_numeric(array_key_first($first_field_value))) {
                $translation->set($field, $first_field_value);
              }
            }
            else {
              $translation->set($field, $field_value);
            }
          }
          $translation->save();
        }
      }
    }
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
    $product_list = $form_state->getValue('product_list_items');
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $entity = $form_state->get('entity');
    if (count($product_list)) {
      $product_list = array_filter($product_list);
      $product_list = array_keys($product_list);
    }
    $available_langcodes = array_keys($this->languageManager->getLanguages());
    $product_list_names = [];
    $edit_list_names = [];
    $edit_nid = isset($form_state->getBuildInfo()['args'][2]) ? $form_state->getBuildInfo()['args'][2] : FALSE;
    foreach ($product_list as $nid) {
      if ($nid) {
        // Set wait status.
        $node = $nodeStorage->load($nid);
        $node->field_states = 'waiting';
        $node->setPublished();
        $node->save();
        if ($nid == $edit_nid) {
          $edit_list_names[] = $node->label();
        }
        else {
          $product_list_names[] = $node->label();
        }
        if ($entity->id() == $nid) {
          $form_state->set('entity', $node);
        }
        foreach ($available_langcodes as $langcode) {
          if ($node->hasTranslation($langcode)) {
            $translation = $node->getTranslation($langcode);
            $translation->setPublished();
            $translation->save();
          }
        }
      }
    }
    if (!empty($product_list_names)) {
      $custom_replacements = ['{{ product_list }}' => implode(", ", $product_list_names)];
      $key = 'product_seller_publish_mail';
      $to = $this->account->getEmail();
      $from = NULL;
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
      $params = [];
      $this->notification->send($key, $to, $from, $langcode, $params, $custom_replacements);
    }
    if (!empty($edit_list_names)) {
      $custom_replacements = ['{{ product_list }}' => implode(", ", $edit_list_names)];
      $key = 'product_seller_edit_mail';
      $to = $this->account->getEmail();
      $from = NULL;
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
      $params = [];
      $this->notification->send($key, $to, $from, $langcode, $params, $custom_replacements);
    }
    if (empty($product_list)) {
      $form_state->setRebuild();
    }
    else {

      $form_state->setRebuild();
      $form_state->set('sent_publish_entities', $product_list);
    }
  }

  /**
   * Categorization ajax callback.
   */
  public function reloadSubCategorization(&$form, FormStateInterface $form_state) {
    return $form['field_categorization_parent'];
  }

  /**
   * Get Entity method.
   */
  public function getEntity() {
    return $this->entity;
  }

}
