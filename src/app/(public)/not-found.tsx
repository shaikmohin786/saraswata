import { HomeBackLink } from "@/components/public/shared/HomeBackLink";

export default function PublicNotFound() {
  return (
    <section className="site-container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-serif text-3xl font-semibold text-primary">Page not found</h1>
      <p className="max-w-md text-muted">The page you are looking for does not exist.</p>
      <HomeBackLink className="btn-primary">Back to home</HomeBackLink>
    </section>
  );
}
