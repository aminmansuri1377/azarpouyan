interface Props {
  messages: any;
}

export function Footer({ messages }: Props) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          {messages.footer}
        </p>
      </div>
    </footer>
  );
}
