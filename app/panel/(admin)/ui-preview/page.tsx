"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Combobox,
  Dropdown,
  EmptyState,
  Heading,
  Input,
  type ButtonSize,
  type ButtonVariant,
  type DropdownOption,
  List,
  ListItem,
  Modal,
  MultiSelect,
  Pagination,
  Radio,
  RadioGroup,
  RadioGroupItem,
  SearchInput,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  ThemeToggle,
  Tooltip,
  CheckIcon,
  PlusIcon,
  SearchIcon,
  InboxIcon,
} from "@/components/ui";

const log = (label: string, value?: unknown) => {
  // eslint-disable-next-line no-console
  console.log(`[UI Preview] ${label}`, value ?? "");
};

export default function UIPreviewPage() {
  return (
    <div className="space-y-10">
      <div>
        <Heading level={1}>UI Design System Preview</Heading>
        <Text variant="muted" className="mt-1">
          Every component, every variant. Interact with them — open your console
          (F12) to see the live event output. Use the theme toggle to test dark
          mode.
        </Text>
        <div className="mt-3">
          <ThemeToggle />
        </div>
      </div>

      <ButtonsSection />
      <FormSection />
      <SelectionSection />
      <FeedbackSection />
      <LayoutSection />
      <OverlaySection />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable section wrapper                                                  */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <Heading level={2} className="mb-1">
        {title}
      </Heading>
      {description ? (
        <Text variant="muted" size="sm" className="mb-4">
          {description}
        </Text>
      ) : null}
      <Card>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Buttons                                                                   */
/* -------------------------------------------------------------------------- */

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
  "outline",
  "ghost",
  "link",
];

const SIZES: ButtonSize[] = ["xs", "sm", "md", "lg"];

function ButtonsSection() {
  return (
    <Section
      id="buttons"
      title="Buttons"
      description="Click any button — its variant and size are logged to the console."
    >
      <div className="space-y-6 bg-red-400">
        {/* Variants */}
        <div>
          <Text weight="semibold" size="sm" className="mb-3">
            Variants
          </Text>
          <div className="flex flex-wrap gap-3">
            {VARIANTS.map((variant) => (
              <Button
                key={variant}
                variant={variant}
                onClick={() => log("Button clicked", { variant })}
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sizes */}
        <div>
          <Text weight="semibold" size="sm" className="mb-3">
            Sizes
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            {SIZES.map((size) => (
              <Button
                key={size}
                size={size}
                onClick={() => log("Button clicked", { size })}
              >
                {size}
              </Button>
            ))}
            <Button
              size="icon"
              aria-label="icon button"
              onClick={() => log("Button clicked", { size: "icon" })}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>

        <Separator />

        {/* States */}
        <div>
          <Text weight="semibold" size="sm" className="mb-3">
            States
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => log("Default")}>Default</Button>
            <Button
              loading
              onClick={() => log("Loading (won't fire while loading)")}
            >
              Loading
            </Button>
            <Button disabled onClick={() => log("Disabled (won't fire)")}>
              Disabled
            </Button>
            <Button fullWidth={false} onClick={() => log("With icon")}>
              <PlusIcon />
              With Icon
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form controls                                                             */
/* -------------------------------------------------------------------------- */

function FormSection() {
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [textarea, setTextarea] = useState("");
  const [select, setSelect] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);
  const [radio, setRadio] = useState("option-a");

  return (
    <Section
      id="forms"
      title="Form Controls"
      description="Type / change values — each interaction logs to the console."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Input
          </Text>
          <Input
            value={text}
            placeholder="Type something..."
            onChange={(e) => {
              setText(e.target.value);
              log("Input onChange", e.target.value);
            }}
          />
          <Text variant="muted" size="sm" className="mt-1">
            Current: {text || "—"}
          </Text>
        </div>

        {/* Password */}
        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Input (password toggle)
          </Text>
          <Input
            type="password"
            withPasswordToggle
            placeholder="Password"
            onChange={(e) => log("Password onChange", e.target.value)}
          />
        </div>

        {/* Search input */}
        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Search Input (with clear)
          </Text>
          <SearchInput
            value={search}
            placeholder="Search..."
            onChange={(e) => {
              setSearch(e.target.value);
              log("Search onChange", e.target.value);
            }}
            onClear={() => {
              setSearch("");
              log("Search cleared");
            }}
          />
        </div>

        {/* Textarea */}
        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Textarea
          </Text>
          <Textarea
            value={textarea}
            placeholder="Write a message..."
            rows={3}
            onChange={(e) => {
              setTextarea(e.target.value);
              log("Textarea onChange", e.target.value);
            }}
          />
        </div>

        {/* Native Select */}
        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Select (native)
          </Text>
          <Select
            value={select}
            placeholder="Choose a fruit"
            onChange={(e) => {
              setSelect(e.target.value);
              log("Select onChange", e.target.value);
            }}
          >
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
          </Select>
        </div>

        {/* Checkbox + Switch */}
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={checkbox}
              onChange={(e) => {
                setCheckbox(e.target.checked);
                log("Checkbox onChange", e.target.checked);
              }}
            />
            <Text size="sm">
              Checkbox — {checkbox ? "checked" : "unchecked"}
            </Text>
          </label>

          <div className="flex items-center gap-2">
            <Switch
              checked={switchVal}
              onChange={(e) => {
                setSwitchVal(e.target.checked);
                log("Switch onChange", e.target.checked);
              }}
            />
            <Text size="sm">Switch — {switchVal ? "on" : "off"}</Text>
          </div>
        </div>

        {/* Radio group */}
        <div className="md:col-span-2">
          <Text weight="semibold" size="sm" className="mb-2">
            Radio Group — selected:{" "}
            <span className="text-primary">{radio}</span>
          </Text>
          <RadioGroup
            name="demo-radio"
            value={radio}
            onChange={(v) => {
              setRadio(v);
              log("Radio onChange", v);
            }}
            orientation="horizontal"
          >
            <label className="flex items-center gap-2">
              <RadioGroupItem value="option-a" />
              <Text size="sm">Option A</Text>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="option-b" />
              <Text size="sm">Option B</Text>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="option-c" />
              <Text size="sm">Option C</Text>
            </label>
          </RadioGroup>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Selection components                                                      */
/* -------------------------------------------------------------------------- */

const SELECT_OPTIONS: DropdownOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik", disabled: true },
];

function SelectionSection() {
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [combo, setCombo] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);

  return (
    <Section
      id="selection"
      title="Selection Components"
      description="Dropdown, Combobox (searchable), and MultiSelect (chips)."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Dropdown
          </Text>
          <Dropdown
            options={SELECT_OPTIONS}
            value={dropdown}
            placeholder="Pick a framework"
            onChange={(v) => {
              setDropdown(v);
              log("Dropdown onChange", v);
            }}
          />
        </div>

        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            Combobox (searchable)
          </Text>
          <Combobox
            options={SELECT_OPTIONS}
            value={combo}
            placeholder="Search frameworks"
            onChange={(v) => {
              setCombo(v);
              log("Combobox onChange", v);
            }}
          />
        </div>

        <div>
          <Text weight="semibold" size="sm" className="mb-2">
            MultiSelect
          </Text>
          <MultiSelect
            options={SELECT_OPTIONS}
            value={multi}
            placeholder="Select many"
            onChange={(v) => {
              setMulti(v);
              log("MultiSelect onChange", v);
            }}
          />
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feedback components                                                       */
/* -------------------------------------------------------------------------- */

function FeedbackSection() {
  return (
    <Section
      id="feedback"
      title="Feedback & Status"
      description="Alerts, badges, spinners, skeletons, avatars."
    >
      <div className="space-y-6">
        {/* Alerts */}
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="info">
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>This is an informational alert.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes were saved.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>This action cannot be undone.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
        </div>

        <Separator />

        {/* Badges */}
        <div>
          <Text weight="semibold" size="sm" className="mb-3">
            Badges
          </Text>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">
              <CheckIcon /> Success
            </Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <Separator />

        {/* Spinners + Skeletons + Avatar */}
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              Spinners
            </Text>
            <div className="flex items-center gap-4">
              <Spinner className="size-4" />
              <Spinner className="size-6" />
              <Spinner className="size-8" />
            </div>
          </div>

          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              Skeletons
            </Text>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              Avatars
            </Text>
            <div className="flex items-center gap-2">
              <Avatar size="sm" fallback="RC" />
              <Avatar size="md" fallback="AB" />
              <Avatar size="lg" fallback="CD" />
              <Avatar
                size="md"
                src="https://i.pravatar.cc/100?img=12"
                alt="User"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout components                                                         */
/* -------------------------------------------------------------------------- */

function LayoutSection() {
  const [tab, setTab] = useState("account");
  const [page, setPage] = useState(1);

  return (
    <Section
      id="layout"
      title="Layout Components"
      description="Tabs, tables, lists, pagination, tooltip, boxes."
    >
      <div className="space-y-8">
        {/* Tabs */}
        <div>
          <Text weight="semibold" size="sm" className="mb-3">
            Tabs
          </Text>
          <Tabs
            value={tab}
            defaultValue="account"
            onValueChange={(v) => {
              setTab(v);
              log("Tab changed", v);
            }}
          >
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Text size="sm" variant="muted">
                Account settings panel content.
              </Text>
            </TabsContent>
            <TabsContent value="password">
              <Text size="sm" variant="muted">
                Change your password here.
              </Text>
            </TabsContent>
            <TabsContent value="team">
              <Text size="sm" variant="muted">
                Manage your team members.
              </Text>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        {/* Table */}
        <div>
          <Text weight="semibold" size="sm" className="mb-3">
            Table
          </Text>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Alice</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bob</TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>
                  <Badge variant="warning">Pending</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Carol</TableCell>
                <TableCell>Viewer</TableCell>
                <TableCell>
                  <Badge variant="destructive">Inactive</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* List + Empty state */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              List
            </Text>
            <List divide className="rounded-lg border border-border">
              <ListItem className="p-3">First item in the list</ListItem>
              <ListItem className="p-3">Second item in the list</ListItem>
              <ListItem className="p-3">Third item in the list</ListItem>
            </List>
          </div>
          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              Empty State
            </Text>
            <EmptyState
              icon={<InboxIcon className="size-8" />}
              title="No messages"
              description="You don't have any messages yet."
              action={
                <Button size="sm" onClick={() => log("Empty state action")}>
                  <PlusIcon /> New message
                </Button>
              }
            />
          </div>
        </div>

        <Separator />

        {/* Pagination + Tooltip */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              Pagination
            </Text>
            <Pagination
              page={page}
              totalPages={10}
              onPageChange={(p) => {
                setPage(p);
                log("Page changed", p);
              }}
            />
          </div>

          <div>
            <Text weight="semibold" size="sm" className="mb-3">
              Tooltip
            </Text>
            <Tooltip content="I am a tooltip!">
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Overlays — Modal                                                          */
/* -------------------------------------------------------------------------- */

function OverlaySection() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <Section
      id="overlay"
      title="Overlays — Modal"
      description="Open the modal, type a name, and submit. Everything is logged."
    >
      <Box display="flex" gap="4" align="center">
        <Button
          onClick={() => {
            setOpen(true);
            log("Modal opened");
          }}
        >
          Open Modal
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setOpen(true);
            setName("");
            log("Modal reset + opened");
          }}
        >
          Reset & Open
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          log("Modal closed");
        }}
        title="Create new item"
        description="Fill in the name below. Closes on Escape or backdrop click."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                log("Modal cancelled");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                log("Modal submitted", { name });
                setOpen(false);
              }}
              disabled={!name.trim()}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Text weight="semibold" size="sm" className="mb-2">
              Item name
            </Text>
            <Input
              value={name}
              placeholder="e.g. Premium Plan"
              onChange={(e) => {
                setName(e.target.value);
                log("Modal input onChange", e.target.value);
              }}
            />
          </div>
          <Alert variant="info" hideIcon>
            <AlertDescription>
              You typed: <strong>{name || "nothing yet"}</strong>
            </AlertDescription>
          </Alert>
        </div>
      </Modal>
    </Section>
  );
}
