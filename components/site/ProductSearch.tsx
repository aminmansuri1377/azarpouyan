type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function ProductSearch({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search product..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 300,
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 6,
      }}
    />
  );
}
