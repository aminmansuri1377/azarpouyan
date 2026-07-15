/*
 * ============================================================================
 *  UI DESIGN SYSTEM  —  public entry point
 * ----------------------------------------------------------------------------
 *  Import any primitive from here:
 *    import { Button, Input, Card, useTheme } from "@/components/ui";
 *
 *  Everything is dependency-free (only clsx + tailwind-merge) and built on
 *  Tailwind v4 semantic tokens — so dark mode + RTL work automatically.
 * ============================================================================
 */

// Utilities
export { cn } from "@/lib/cn";

// Core primitives
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button";
export { Spinner, type SpinnerProps } from "./Spinner";
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from "./Badge";
export { Slot } from "./Slot";

// Typography
export { Text, Heading, type TextProps, type HeadingProps } from "./typography/Text";

// Icons
export * from "./icon";

// Layout primitives
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
export { Box, type BoxProps } from "./Box";
export { Separator, type SeparatorProps } from "./Separator";
export { Skeleton } from "./Skeleton";
export { Avatar, type AvatarProps } from "./Avatar";
export { Tooltip, type TooltipProps } from "./Tooltip";
export {
  List,
  ListItem,
  EmptyState,
  type ListProps,
  type EmptyStateProps,
} from "./List";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table";
export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps } from "./Tabs";
export { Modal, type ModalProps } from "./Modal";
export {
  Alert,
  AlertTitle,
  AlertDescription,
  type AlertProps,
} from "./Alert";
export {
  Pagination,
  type PaginationProps,
} from "./Pagination";

// Form primitives (re-export the full form barrel)
export * from "./form";

// Selection primitives
export {
  Dropdown,
  type DropdownProps,
  type DropdownOption,
} from "./Dropdown";
export { Combobox, type ComboboxProps } from "./Combobox";
export { MultiSelect, type MultiSelectProps } from "./MultiSelect";

// Theme
export {
  ThemeProvider,
  useTheme,
  themeInitScript,
  type Theme,
} from "./theme/theme-provider";
export { ThemeToggle } from "./theme/theme-toggle";
export { LocaleDirSync } from "./theme/locale-dir-sync";
