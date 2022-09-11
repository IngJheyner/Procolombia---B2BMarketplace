<?php

namespace Drupal\cp_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;

/**
 * Defines a form that configures forms module settings.
 */
class CpCoreNotificationsSettings extends ConfigFormBase {

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */

  /**
   * Constructs a \Drupal\system\ConfigFormBase object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ModuleHandlerInterface $module_handler) {
    $this->setConfigFactory($config_factory);
    $this->moduleHandler = $module_handler;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('module_handler')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cp_core_notifications_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'cp_core.notifications',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('cp_core.notifications');

    $form['notifications_email'] = [
      '#type' => 'email',
      '#title' => $this->t('Notifications email'),
      '#default_value' => $config->get('notifications_email'),
      '#required' => TRUE,
    ];

    $form['email'] = [
      '#type' => 'vertical_tabs',
      '#title' => $this->t('Emails'),
    ];

    $email_token_help = $this->t('You can use tokens in the subject and the body of each email. The custom replacements are only available on the body and them will be specified on each mail body.');

    // SELLER.
    $form['seller'] = [
      '#type' => 'details',
      '#title' => $this->t('Seller emails'),
      '#group' => 'email',
      '#description' => $email_token_help,
    ];

    // ->set('product_seller_publish_mail_active', $form_state->getValue('product_seller_publish_mail_active'))
    // ->set('product_seller_publish_mail.subject', $form_state->getValue('product_seller_publish_mail_subject'))
    // ->set('product_seller_publish_mail.body', $form_state->getValue('product_seller_publish_mail_body'))
    $form['seller']['product_seller_publish_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active product publish mail'),
      '#default_value' => $config->get('product_seller_publish_mail_active'),
    ];
    $form['seller']['product_seller_publish_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('product_seller_publish_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="product_seller_publish_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_publish_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['product_seller_publish_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('product_seller_publish_mail.body'),
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ product_list }}']
      ),
      '#rows' => 3,
      '#states' => [
        'visible' => [
          'input[name="product_seller_publish_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_publish_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('product_seller_edit_mail_active', $form_state->getValue('product_seller_edit_mail_active'))
    // ->set('product_seller_edit_mail.subject', $form_state->getValue('product_seller_edit_mail_subject'))
    // ->set('product_seller_edit_mail.body', $form_state->getValue('product_seller_edit_mail_body'))
    $form['seller']['product_seller_edit_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active product edit mail'),
      '#default_value' => $config->get('product_seller_edit_mail_active'),
    ];
    $form['seller']['product_seller_edit_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('product_seller_edit_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="product_seller_edit_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_edit_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['product_seller_edit_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('product_seller_edit_mail.body'),
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ product_list }}']
      ),
      '#rows' => 3,
      '#states' => [
        'visible' => [
          'input[name="product_seller_edit_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_edit_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('product_seller_approbation_mail_active', $form_state->getValue('product_seller_approbation_mail_active'))
    // ->set('product_seller_approbation_mail.subject', $form_state->getValue('product_seller_approbation_mail_subject'))
    // ->set('product_seller_approbation_mail.body', $form_state->getValue('product_seller_approbation_mail_body'))
    $form['seller']['product_seller_approbation_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active product approbation mail'),
      '#default_value' => $config->get('product_seller_approbation_mail_active'),
    ];
    $form['seller']['product_seller_approbation_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('product_seller_approbation_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="product_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['product_seller_approbation_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('product_seller_approbation_mail.body'),
      '#rows' => 3,
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ product_name }}']
      ),
      '#states' => [
        'visible' => [
          'input[name="product_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('product_seller_reject_mail_active', $form_state->getValue('product_seller_reject_mail_active'))
    // ->set('product_seller_reject_mail.subject', $form_state->getValue('product_seller_reject_mail_subject'))
    // ->set('product_seller_reject_mail.body', $form_state->getValue('product_seller_reject_mail_body'))
    $form['seller']['product_seller_reject_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active product reject mail'),
      '#default_value' => $config->get('product_seller_reject_mail_active'),
    ];
    $form['seller']['product_seller_reject_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('product_seller_reject_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="product_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['product_seller_reject_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('product_seller_reject_mail.body'),
      '#rows' => 3,
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ product_name }}']
      ),
      '#states' => [
        'visible' => [
          'input[name="product_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="product_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('company_seller_approbation_mail_active', $form_state->getValue('company_seller_approbation_mail_active'))
    // ->set('company_seller_approbation_mail.subject', $form_state->getValue('company_seller_approbation_mail_subject'))
    // ->set('company_seller_approbation_mail.body', $form_state->getValue('company_seller_approbation_mail_body'))
    $form['seller']['company_seller_approbation_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active company approbation mail'),
      '#default_value' => $config->get('company_seller_approbation_mail_active'),
    ];
    $form['seller']['company_seller_approbation_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('company_seller_approbation_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="company_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['company_seller_approbation_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('company_seller_approbation_mail.body'),
      '#rows' => 3,
      '#states' => [
        'visible' => [
          'input[name="company_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_seller_approbation_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('company_seller_reject_mail_active', $form_state->getValue('company_seller_reject_mail_active'))
    // ->set('company_seller_reject_mail.subject', $form_state->getValue('company_seller_reject_mail_subject'))
    // ->set('company_seller_reject_mail.body', $form_state->getValue('company_seller_reject_mail_body'))
    $form['seller']['company_seller_reject_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active company reject mail'),
      '#default_value' => $config->get('company_seller_reject_mail_active'),
    ];
    $form['seller']['company_seller_reject_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('company_seller_reject_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="company_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['company_seller_reject_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('company_seller_reject_mail.body'),
      '#rows' => 3,
      '#states' => [
        'visible' => [
          'input[name="company_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_seller_reject_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('verification_seller_token_mail_active', $form_state->getValue('verification_seller_token_mail_active'))
    // ->set('verification_seller_token_mail.subject', $form_state->getValue('verification_seller_token_mail_subject'))
    // ->set('verification_seller_token_mail.body', $form_state->getValue('verification_seller_token_mail_body'))
    $form['seller']['verification_seller_token_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active verification seller token mail'),
      '#default_value' => $config->get('verification_seller_token_mail_active'),
    ];
    $form['seller']['verification_seller_token_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('verification_seller_token_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="verification_seller_token_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="verification_seller_token_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['seller']['verification_seller_token_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('verification_seller_token_mail.body'),
      '#rows' => 3,
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ company_name }}, {{ pin }}, {{ confirm_link }}']
      ),
      '#states' => [
        'visible' => [
          'input[name="verification_seller_token_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="verification_seller_token_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // BUYER.
    $form['buyer'] = [
      '#type' => 'details',
      '#title' => $this->t('Buyer emails'),
      '#group' => 'email',
    ];

    // ->set('company_buyer_approbation_mail_active', $form_state->getValue('company_buyer_approbation_mail_active'))
    // ->set('company_buyer_approbation_mail.subject', $form_state->getValue('company_buyer_approbation_mail_subject'))
    // ->set('company_buyer_approbation_mail.body', $form_state->getValue('company_buyer_approbation_mail_body'))
    $form['buyer']['company_buyer_approbation_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active company approbation email'),
      '#default_value' => $config->get('verification_seller_token_mail_active'),
    ];
    $form['buyer']['company_buyer_approbation_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('company_buyer_approbation_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="company_buyer_approbation_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_buyer_approbation_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['buyer']['company_buyer_approbation_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('company_buyer_approbation_mail.body'),
      '#rows' => 3,
      '#states' => [
        'visible' => [
          'input[name="company_buyer_approbation_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_buyer_approbation_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('company_buyer_reject_mail_active', $form_state->getValue('company_buyer_reject_mail_active'))
    // ->set('company_buyer_reject_mail.subject', $form_state->getValue('company_buyer_reject_mail_subject'))
    // ->set('company_buyer_reject_mail.body', $form_state->getValue('company_buyer_reject_mail_body'))
    $form['buyer']['company_buyer_reject_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active company reject mail'),
      '#default_value' => $config->get('verification_seller_token_mail_active'),
    ];
    $form['buyer']['company_buyer_reject_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('company_buyer_reject_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="company_buyer_reject_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_buyer_reject_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['buyer']['company_buyer_reject_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('company_buyer_reject_mail.body'),
      '#rows' => 3,
      '#states' => [
        'visible' => [
          'input[name="company_buyer_reject_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="company_buyer_reject_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // ->set('verification_buyer_token_mail_active', $form_state->getValue('verification_buyer_token_mail_active'))
    // ->set('verification_buyer_token_mail.subject', $form_state->getValue('verification_buyer_token_mail_subject'))
    // ->set('verification_buyer_token_mail.body', $form_state->getValue('verification_buyer_token_mail_body'))
    $form['buyer']['verification_buyer_token_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active verification buyer token mail'),
      '#default_value' => $config->get('verification_buyer_token_mail_active'),
    ];
    $form['buyer']['verification_buyer_token_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('verification_buyer_token_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="verification_buyer_token_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="verification_buyer_token_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['buyer']['verification_buyer_token_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('verification_buyer_token_mail.body'),
      '#rows' => 3,
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ buyer_name }}, {{ pin }}, {{ confirm_link }}']
      ),
      '#states' => [
        'visible' => [
          'input[name="verification_buyer_token_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="verification_buyer_token_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['moderator'] = [
      '#type' => 'details',
      '#title' => $this->t('Moderator emails'),
      '#group' => 'email',
    ];

    // ->set('daily_activity_mail_active', $form_state->getValue('daily_activity_mail_active'))
    // ->set('daily_activity_mail.subject', $form_state->getValue('daily_activity_mail_subject'))
    // ->set('daily_activity_mail.body', $form_state->getValue('daily_activity_mail_body'))
    $form['moderator']['daily_activity_mail_active'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Active daily activity mail'),
      '#default_value' => $config->get('daily_activity_mail_active'),
    ];
    $form['moderator']['daily_activity_mail_hour'] = [
      '#type' => 'number',
      '#title' => $this->t('Active daily activity hour of send'),
      '#default_value' => $config->get('daily_activity_mail_hour'),
      '#min' => 0,
      '#max' => 23,
      '#step' => 1,
      '#description' => $this->t('Use a 24 hours format, the min value is 0 and the max value is 23 hours.'),
      '#states' => [
        'visible' => [
          'input[name="daily_activity_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="daily_activity_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['moderator']['daily_activity_mail_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#default_value' => $config->get('daily_activity_mail.subject'),
      '#maxlength' => 180,
      '#states' => [
        'visible' => [
          'input[name="daily_activity_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="daily_activity_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['moderator']['daily_activity_mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Body'),
      '#default_value' => $config->get('daily_activity_mail.body'),
      '#rows' => 3,
      '#description' => $this->t(
        'You can use the next special replacements in the mail body: @replacements',
        ['@replacements' => '{{ company_list_approval }}, {{ company_list_opportunity }}, {{ company_list_achievement }}']
      ),
      '#states' => [
        'visible' => [
          'input[name="daily_activity_mail_active"]' => ['checked' => TRUE],
        ],
        'required' => [
          'input[name="daily_activity_mail_active"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // Token support.
    if ($this->moduleHandler->moduleExists('token')) {
      $form['tokens'] = [
        '#title' => $this->t('Tokens'),
        '#type' => 'container',
      ];
      $form['tokens']['help'] = [
        '#theme' => 'token_tree_link',
        '#token_types' => 'all',
        '#global_types' => FALSE,
        '#dialog' => TRUE,
      ];
    }

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('cp_core.notifications')
      ->set('notifications_email', $form_state->getValue('notifications_email'))

      ->set('product_seller_publish_mail_active', $form_state->getValue('product_seller_publish_mail_active'))
      ->set('product_seller_publish_mail.subject', $form_state->getValue('product_seller_publish_mail_subject'))
      ->set('product_seller_publish_mail.body', $form_state->getValue('product_seller_publish_mail_body'))

      ->set('product_seller_edit_mail_active', $form_state->getValue('product_seller_edit_mail_active'))
      ->set('product_seller_edit_mail.subject', $form_state->getValue('product_seller_edit_mail_subject'))
      ->set('product_seller_edit_mail.body', $form_state->getValue('product_seller_edit_mail_body'))

      ->set('product_seller_approbation_mail_active', $form_state->getValue('product_seller_approbation_mail_active'))
      ->set('product_seller_approbation_mail.subject', $form_state->getValue('product_seller_approbation_mail_subject'))
      ->set('product_seller_approbation_mail.body', $form_state->getValue('product_seller_approbation_mail_body'))

      ->set('product_seller_reject_mail_active', $form_state->getValue('product_seller_reject_mail_active'))
      ->set('product_seller_reject_mail.subject', $form_state->getValue('product_seller_reject_mail_subject'))
      ->set('product_seller_reject_mail.body', $form_state->getValue('product_seller_reject_mail_body'))

      ->set('company_seller_approbation_mail_active', $form_state->getValue('company_seller_approbation_mail_active'))
      ->set('company_seller_approbation_mail.subject', $form_state->getValue('company_seller_approbation_mail_subject'))
      ->set('company_seller_approbation_mail.body', $form_state->getValue('company_seller_approbation_mail_body'))

      ->set('company_seller_reject_mail_active', $form_state->getValue('company_seller_reject_mail_active'))
      ->set('company_seller_reject_mail.subject', $form_state->getValue('company_seller_reject_mail_subject'))
      ->set('company_seller_reject_mail.body', $form_state->getValue('company_seller_reject_mail_body'))

      ->set('verification_seller_token_mail_active', $form_state->getValue('verification_seller_token_mail_active'))
      ->set('verification_seller_token_mail.subject', $form_state->getValue('verification_seller_token_mail_subject'))
      ->set('verification_seller_token_mail.body', $form_state->getValue('verification_seller_token_mail_body'))

      ->set('company_buyer_approbation_mail_active', $form_state->getValue('company_buyer_approbation_mail_active'))
      ->set('company_buyer_approbation_mail.subject', $form_state->getValue('company_buyer_approbation_mail_subject'))
      ->set('company_buyer_approbation_mail.body', $form_state->getValue('company_buyer_approbation_mail_body'))

      ->set('company_buyer_reject_mail_active', $form_state->getValue('company_buyer_reject_mail_active'))
      ->set('company_buyer_reject_mail.subject', $form_state->getValue('company_buyer_reject_mail_subject'))
      ->set('company_buyer_reject_mail.body', $form_state->getValue('company_buyer_reject_mail_body'))

      ->set('verification_buyer_token_mail_active', $form_state->getValue('verification_buyer_token_mail_active'))
      ->set('verification_buyer_token_mail.subject', $form_state->getValue('verification_buyer_token_mail_subject'))
      ->set('verification_buyer_token_mail.body', $form_state->getValue('verification_buyer_token_mail_body'))

      ->set('daily_activity_mail_active', $form_state->getValue('daily_activity_mail_active'))
      ->set('daily_activity_mail_hour', $form_state->getValue('daily_activity_mail_hour'))
      ->set('daily_activity_mail.subject', $form_state->getValue('daily_activity_mail_subject'))
      ->set('daily_activity_mail.body', $form_state->getValue('daily_activity_mail_body'))

      ->save();
    parent::submitForm($form, $form_state);
  }

}
