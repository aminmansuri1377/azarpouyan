import { Text } from "../typography/Text";

export interface FieldErrorProps {
  /** Error message; renders nothing when falsy. */
  children?: React.ReactNode;
  id?: string;
}

/** Inline error text for a single field. Renders nothing unless given text. */
export function FieldError({ children, id }: FieldErrorProps) {
  if (!children) return null;
  return (
    <Text id={id} variant="destructive" size="sm" role="alert">
      {children}
    </Text>
  );
}
