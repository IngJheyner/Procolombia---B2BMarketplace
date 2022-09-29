<?php

namespace Drupal\cp_structured_features\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\cp_structured_features\StructuredFeatureInterface;

/**
 * Defines the structured_feature entity type.
 *
 * @ConfigEntityType(
 *   id = "structured_feature",
 *   label = @Translation("Structured Feature"),
 *   label_collection = @Translation("Structured Features"),
 *   label_singular = @Translation("Structured Feature"),
 *   label_plural = @Translation("Structured Features"),
 *   label_count = @PluralTranslation(
 *     singular = "@count structured feature",
 *     plural = "@count structured features",
 *   ),
 *   handlers = {
 *     "list_builder" = "Drupal\cp_structured_features\StructuredFeatureListBuilder",
 *     "form" = {
 *       "add" = "Drupal\cp_structured_features\Form\StructuredFeatureForm",
 *       "edit" = "Drupal\cp_structured_features\Form\StructuredFeatureForm",
 *       "delete" = "Drupal\Core\Entity\EntityDeleteForm"
 *     }
 *   },
 *   config_prefix = "structured_feature",
 *   admin_permission = "administer structured_feature",
 *   links = {
 *     "collection" = "/admin/structure/structured-feature",
 *     "add-form" = "/admin/structure/structured-feature/add",
 *     "edit-form" = "/admin/structure/structured-feature/{structured_feature}",
 *     "delete-form" = "/admin/structure/structured-feature/{structured_feature}/delete"
 *   },
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   config_export = {
 *     "id",
 *     "label",
 *     "description"
 *   }
 * )
 */
class StructuredFeature extends ConfigEntityBase implements StructuredFeatureInterface {

  /**
   * The structured_feature ID.
   *
   * @var string
   */
  protected $id;

  /**
   * The structured_feature label.
   *
   * @var string
   */
  protected $label;

  /**
   * The structured_feature status.
   *
   * @var bool
   */
  protected $status;

  /**
   * The structured_feature description.
   *
   * @var string
   */
  protected $description;


  /**
   * The structured_feature type.
   *
   * @var string
   */
  protected $type;

  /**
   * The structured_feature references.
   *
   * @var array
   */
  protected $references;

  /**
   * The structured_feature properties.
   *
   * @var array
   */
  protected $properties;

}
