<?php

namespace Rz\DoctrineORMAdminBundle\Filter;

use Sonata\DoctrineORMAdminBundle\Filter\ChoiceFilter as BaseChoiceFilter;
use Doctrine\ORM\QueryBuilder;
use Sonata\AdminBundle\Form\Type\Filter\ChoiceType;

class ChoiceFilter extends BaseChoiceFilter
{
//    /**
//     * {@inheritdoc}
//     */
//    public function getOperatorOptions()
//    {
//        $options = $this->getOptions();
//        return array_key_exists('operator_options', $options) ? $options['operator_options'] : array();
//    }
    /**
     * @param string $type
     *
     * @return bool
     */
    private function getOperator($type)
    {
        $choices = array(
            ChoiceType::TYPE_CONTAINS         => 'IN',
            ChoiceType::TYPE_NOT_CONTAINS     => 'NOT IN',
            ChoiceType::TYPE_EQUAL            => '=',
        );

        return isset($choices[$type]) ? $choices[$type] : false;
    }

    /**
     * {@inheritdoc}
     */
    public function getRenderSettings()
    {
        return array('sonata_type_filter_default', array(
            'operator_type' => 'sonata_type_equal',
            'operator_options' => $this->getOption('operator_options') ? $this->getOption('operator_options'): array(),
            'field_type'    => $this->getFieldType(),
            'field_options' => $this->getFieldOptions(),
            'label'         => $this->getLabel(),
        ));
    }
}
