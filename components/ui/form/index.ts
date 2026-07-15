// Bare controls (forward ref + spread props → work with register() & Controller)
export { Label, type LabelProps } from "./Label";
export { Input, type InputProps } from "./Input";
export { Textarea, type TextareaProps } from "./Textarea";
export { Select, type SelectProps } from "./Select";
export { Checkbox, type CheckboxProps } from "./Checkbox";
export { Switch, type SwitchProps } from "./Switch";
export {
  Radio,
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioProps,
} from "./Radio";

// Layout helpers
export { FormField, type FormFieldProps } from "./FormField";
export { FieldError } from "./FieldError";
export { SearchInput, type SearchInputProps } from "./SearchInput";

// react-hook-form integration (optional — only when you opt into <Form>)
export {
  Form,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormContextSafe,
  type FormProps,
} from "./Form";
