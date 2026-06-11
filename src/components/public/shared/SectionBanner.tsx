import Image from "next/image";

export function SectionBanner({
  src,
  alt,
  title,
}: {
  src: string | null;
  alt: string;
  title?: string;
}) {
  if (!src) {
    return (
      <div className="relative bg-primary py-20 md:py-28">
        {title && (
          <div className="site-container text-center">
            <h1 className="font-serif text-3xl font-semibold text-white md:text-5xl">{title}</h1>
            <div className="mx-auto mt-5 accent-line accent-line-center" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-56 w-full overflow-hidden bg-primary sm:h-72 md:h-80">
      <Image src={src} alt={alt} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/40 to-primary/20" />
      {title && (
        <div className="absolute inset-0 flex items-center">
          <div className="site-container">
            <h1 className="font-serif text-3xl font-semibold text-white md:text-5xl">{title}</h1>
            <div className="mt-5 accent-line" />
          </div>
        </div>
      )}
    </div>
  );
}
