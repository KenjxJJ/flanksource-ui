import { useField } from "formik";
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import Select from "react-select";
import { components } from "react-select";

type Option = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  options?: Option[];
} & Omit<ComponentProps<typeof Select>, "option">;

export default function FormikSelectDropdown({
  name,
  label,
  required = false,
  hint,
  options,
  ...props
}: Props) {
  const [isTouched, setIsTouched] = useState(false);

  const [field, meta] = useField<string | string[]>({
    name,
    type: "text",
    required,
    validate: useCallback(
      (value: string) => {
        if (required && !value) {
          return "This field is required";
        }
      },
      [required]
    )
  });

  const value = useMemo(() => {
    if (props.isMulti && Array.isArray(field.value)) {
      const x = options?.filter((item) => field.value.includes(item.value));
      return x;
    }
    return options?.filter((item) => item.value === field.value);
  }, [field.value, options, props.isMulti]);

  useEffect(() => {
    setIsTouched(isTouched || meta.touched || meta.initialTouched);
  }, [isTouched, meta.initialTouched, meta.touched]);

  return (
    <div className="flex flex-col space-y-2 py-2">
      {label && <label className="form-label">{label}</label>}
      <Select
        name={name}
        className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
        options={options}
        value={value}
        onChange={(value: any) => {
          field.onChange({
            target: {
              name: field.name,
              value: Array.isArray(value)
                ? value.map((item) => item.value)
                : value.value
            }
          });
        }}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPosition={"fixed"}
        menuShouldBlockScroll={true}
        onBlur={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        onFocus={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        components={{
          Option: ({ children, ...props }) => {
            return (
              <components.Option {...props}>
                <div className="flex flex-row gap-2 items-center">
                  {(props.data as any).icon && (
                    <div>{(props.data as any).icon}</div>
                  )}
                  <div className="flex-1">{children}</div>
                </div>
              </components.Option>
            );
          },
          SingleValue: ({ children, ...props }) => {
            return (
              <components.SingleValue {...props}>
                <div className="flex flex-row gap-2 items-center">
                  {(props.data as any).icon && (
                    <div>{(props.data as any).icon}</div>
                  )}
                  <div className="flex-1">{children}</div>
                </div>
              </components.SingleValue>
            );
          }
        }}
        {...props}
      />
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
      {isTouched && meta.error ? (
        <p className="text-sm text-red-500 w-full py-1">{meta.error}</p>
      ) : null}
    </div>
  );
}
