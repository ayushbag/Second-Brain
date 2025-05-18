const MasonrySkeleton = ({ count = 6 }) => {
  const cards = Array.from({ length: count });

  return (
    <div className="p-6 min-h-screen">
      <div className="columns-1 sm:columns-2 md:columns-3 gap-8 space-y-4">
        {cards.map((_, index) => (
          <div
            key={index}
            className="break-inside-avoid animate-pulse bg-zinc-900 rounded-lg w-64 h-[276px] mx-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default MasonrySkeleton;
