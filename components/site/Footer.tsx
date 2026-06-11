interface Props {
  messages: any;
}

export function Footer({ messages }: Props) {
  return (
    <footer
      style={{
        marginTop: 60,
        borderTop: "1px solid #ddd",
        padding: 20,
      }}
    >
      {messages.footer}
    </footer>
  );
}
