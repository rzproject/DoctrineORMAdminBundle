<?php
namespace Rz\DoctrineORMAdminBundle\Filter;
use Sonata\DoctrineORMAdminBundle\Filter\BooleanFilter as BaseBooleanFilter;
use Sonata\AdminBundle\Form\Type\BooleanType;

class BooleanFilter extends BaseBooleanFilter
{
    /**
     * {@inheritdoc}
     */
    public function getRenderSettings()
    {
        return array('sonata_type_filter_default', array(
            'field_type'    => $this->getFieldType(),
            'field_options' => $this->getFieldOptions(),
            'operator_type' => 'hidden',
            'operator_options' => $this->getOption('operator_options') ? $this->getOption('operator_options'): array(),
            'label'         => $this->getLabel()
        ));
    }
}
