import * as React from 'react';
import omit from 'omit.js';
import RcSelect, { Option, OptGroup, SelectProps as RcSelectProps } from 'rc-select';
import { Down, Check } from '@ant-design/icons';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

type RawValue = string | number;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: React.ReactNode;
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];

interface InternalSelectProps<VT> extends RcSelectProps<VT> {
  suffixIcon: React.ReactNode;
}

export type SelectProps<VT> = Omit<InternalSelectProps<VT>, 'inputIcon'>;

// We still use class here since `forwardRef` not support generic in typescript
class Select<ValueType extends SelectValue = SelectValue> extends React.Component<
  SelectProps<ValueType>
> {
  static Option = Option;
  static OptGroup = OptGroup;

  static defaultProps = {
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
  };

  renderSelect = ({ getPrefixCls }: ConfigConsumerProps) => {
    const { prefixCls: customizePrefixCls, suffixIcon, mode, menuItemSelectedIcon, loading } = this
      .props as InternalSelectProps<ValueType>;

    const prefixCls = getPrefixCls('select', customizePrefixCls);

    const isMultiple = mode === 'multiple' || mode === 'tags';

    // ===================== Icons =====================
    // Arrow item icon
    let mergedSuffixIcon;
    if (suffixIcon !== undefined) {
      mergedSuffixIcon = suffixIcon;
    } else if (loading) {
      mergedSuffixIcon = <Down />;
    } else {
      mergedSuffixIcon = <Down />;
    }

    // Checked item icon
    let mergedItemIcon;
    if (menuItemSelectedIcon !== undefined) {
      mergedItemIcon = menuItemSelectedIcon;
    } else if (isMultiple) {
      mergedItemIcon = <Check />;
    } else {
      mergedItemIcon = null;
    }

    const selectProps = omit(this.props, ['prefixCls', 'suffixIcon']);

    return (
      <RcSelect<ValueType>
        {...selectProps}
        prefixCls={prefixCls}
        inputIcon={mergedSuffixIcon}
        menuItemSelectedIcon={mergedItemIcon}
      />
    );
  };

  render() {
    return <ConfigConsumer>{this.renderSelect}</ConfigConsumer>;
  }
}

export default Select;
