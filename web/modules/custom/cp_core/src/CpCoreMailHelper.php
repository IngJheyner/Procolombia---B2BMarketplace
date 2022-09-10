<?php

namespace Drupal\cp_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\Core\Logger\LoggerChannelInterface;

/**
 * Defines a form that configures forms module settings.
 */
class CpCoreMailHelper implements CpCoreMailHelperInterface {

  /**
   * The config factory.
   *
   * Subclasses should use the self::config() method, which may be overridden to
   * address specific needs when loading config, rather than this property
   * directly. See \Drupal\Core\Form\ConfigFormBase::config() for an example of
   * this.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * Mail manager service.
   *
   * @var \Drupal\Core\Mail\MailManagerInterface
   */
  protected $mailManager;

  /**
   * Language manager service.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * Logger service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $logger;

  /**
   * Constructs a \Drupal\system\ConfigFormBase object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   THe module handler.
   * @param \Drupal\Core\Mail\MailManagerInterface $mail_manager
   *   Mail manager service.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   Language manager service.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   */
  public function __construct(
    ConfigFactoryInterface $config_factory,
    ModuleHandlerInterface $module_handler,
    MailManagerInterface $mail_manager,
    LanguageManagerInterface $language_manager,
    LoggerInterface $logger
  ) {
    $this->configFactory = $config_factory;
    $this->moduleHandler = $module_handler;
    $this->mailManager = $mail_manager;
    $this->languageManager = $language_manager;
    $this->logger = $logger;
  }

  public function send($key, $to, $from = NULL, $langcode = NULL, $params = []) {
    $config = $this->configFactory->get('cp_core.notifications');
    if ($config->get($key . '_active')) {
      $params['subject'] = $config->get($key . '.subject');
      $params['body'] = $config->get($key . '.body');
      if (!empty($from)) {
        $params['from'] = $from;
      }
      $langcode = ($langcode) ?: $this->languageManager->getCurrentLanguage();
      $result = $this->mailManager->mail($key, $to, $langcode, $params, NULL; TRUE);
      if (!$result) {
        $this->logger->error('Error sending mail with key %key', [
          '%key' => $key,
        ]);
      }
    }
  }

}
