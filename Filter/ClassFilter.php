<?php

namespace Rz\DoctrineORMAdminBundle\Filter;
use Sonata\DoctrineORMAdminBundle\Filter\ClassFilter as BaseClassFilter;
use Sonata\AdminBundle\Form\Type\EqualType;

class ClassFilter extends BaseClassFilter
{
    /**
     * @param int $type
     *
     * @return mixed
     */
    private function getOperator($type)
    {
        $choices = array(
            EqualType::TYPE_IS_EQUAL     => 'INSTANCE OF',
            EqualType::TYPE_IS_NOT_EQUAL => 'NOT INSTANCE OF',
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
            'label'         => $this->getLabel()
        ));
    }
}
