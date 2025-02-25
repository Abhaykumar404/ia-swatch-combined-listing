import { Select as PSelect } from "@shopify/polaris";

interface ISelect {
  options: Array<any>;
  label?: string;
  onChange: (selected: string, id: string) => void;
  value: string;
  lableHidden?: boolean;
  disabled?: boolean;
}
export const Select: React.FC<ISelect> = ({
  options,
  label,
  onChange,
  value,
  lableHidden = false,
  disabled,
}) => {
  return (
    <PSelect
      label={label}
      options={options}
      onChange={onChange}
      value={value}
      labelHidden={lableHidden}
      disabled={disabled}
    />
  );
};
