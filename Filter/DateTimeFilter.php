<?php

namespace Rz\DoctrineORMAdminBundle\Filter;

use Sonata\DoctrineORMAdminBundle\Filter\DateTimeFilter as BaseDateTimeFilter;

class DateTimeFilter extends BaseDateTimeFilter
{
    /**
     * {@inheritdoc}
     */
    public function getRenderSettings()
    {
        $name = 'sonata_type_filter_date';

        if ($this->time) {
            $name .= 'time';
        }

        if ($this->range) {
            $name .= '_range';
        }

        return array($name, array(
            'field_type'    => $this->getFieldType(),
            'field_options' => $this->getFieldOptions(),
            'label'         => $this->getLabel(),
            'operator_options' => $this->getOption('operator_options') ? $this->getOption('operator_options'): array(),
        ));
    }
}
