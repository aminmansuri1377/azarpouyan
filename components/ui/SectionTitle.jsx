const SectionTitle = ({ children }) => {
  return (
    <div className="flex items-center w-full gap-4 my-20">
      <div className="h-px flex-1 bg-black" />

      <h2 className="text-outline text-6xl whitespace-nowrap">{children}</h2>

      <div className="h-px flex-1 bg-black" />
    </div>
  );
};

export default SectionTitle;
