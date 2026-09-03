type ModuleSectionProps = {
  title: string;
  order: number;
  youtubeId: string;
};

export default function ModuleSection({ title, order, youtubeId }: ModuleSectionProps) {
  return (
    <div
      data-testid={`module-section-${order}`}
      className="mb-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4"
    >
      <h4
        data-testid={`module-title-${order}`}
        className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
      >
        <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          {order}
        </span>
        {title}
      </h4>
      <div className="aspect-video w-full overflow-hidden rounded-md bg-black shadow-inner">
        <iframe
          data-testid={`module-video-${order}`}
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
