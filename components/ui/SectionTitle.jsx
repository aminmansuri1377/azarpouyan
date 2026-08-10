const SectionTitle = ({ children }) => {
  return (
    <div className="flex items-center w-full gap-4 md:my-20 my-5">
      <div className="h-px flex-1 bg-black" />

      <h2 className="text-outline md:text-6xl text-4xl whitespace-nowrap">
        {children}
      </h2>

      <div className="h-px flex-1 bg-black" />
    </div>
  );
};

export default SectionTitle;
