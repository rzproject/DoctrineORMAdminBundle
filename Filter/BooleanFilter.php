<?php

/*
 * This file is part of the RzDoctrineORMAdminBundle package.
 *
 * (c) mell m. zamora <mell@rzproject.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Rz\DoctrineORMAdminBundle\Filter;
use Sonata\DoctrineORMAdminBundle\Filter\BooleanFilter as BaseBooleanFilter;

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
