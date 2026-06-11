import { HeroSlider } from "@/components/public/home/HeroSlider";
import { HomeGalleryShowcase } from "@/components/public/home/HomeGalleryShowcase";
import {
  IntroSection,
  StatsBar,
  HomeCta,
  LegacySection,
  FeaturedCollections,
  NewsPreview,
  VideoPreview,
  AchievementsSection,
} from "@/components/public/home/ContentSection";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import { getLatestPosts } from "@/lib/db/queries/posts";
import { getAllGalleriesForHome } from "@/lib/db/queries/gallery";
import { getLatestVideos } from "@/lib/db/queries/videos";
import { getSliders, parseSliderSlides } from "@/lib/db/queries/sliders";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { youtubeThumbUrl } from "@/lib/youtube";
import { siteConfig } from "@/config/site";
import type { CmsGallery, CmsPost, CmsVideo } from "@/types/cms";
import Link from "next/link";

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function HomePage() {
  try {
    const [settings, sliderRow, posts, galleries, videos] = await Promise.all([
      getGlobalSettings(),
      getSliders(),
      getLatestPosts(5),
      getAllGalleriesForHome(),
      getLatestVideos(5),
    ]);

    const slides = parseSliderSlides(sliderRow).map((slide) => ({
      ...slide,
      imageUrl: resolveMediaUrl("sliders", slide.image)!,
    }));

    const siteName = settings?.ConfigSiteName?.trim() || siteConfig.name;

    const postItems = posts.map((post: CmsPost) => ({
      id: post.PostID,
      title: post.PostTitle,
      href: `/${post.PostTitleAlias}`,
      imageUrl: resolveMediaUrl("posts", post.PostImage),
      excerpt: post.PostDescription?.replace(/<[^>]+>/g, "").slice(0, 120),
      date: post.PostPublishedDate || undefined,
    }));

    const galleryItems = galleries.map((item: CmsGallery) => ({
      id: item.GalleryID,
      title: item.GalleryTitle,
      href: `/gallery/view/${encodeURIComponent(item.GalleryTitleAlias)}`,
      imageUrl: resolveMediaUrl("gallery", item.GalleryImage),
    }));

    const videoItems = videos.map((item: CmsVideo) => ({
      id: item.VideoID,
      title: item.VideoTitle,
      href: `/videos/view/${item.VideoTitleAlias}`,
      imageUrl: youtubeThumbUrl(item.VideoYoutubeURL),
      excerpt: item.VideoDescription?.replace(/<[^>]+>/g, "").slice(0, 100),
    }));

    return (
      <>
        <HeroSlider slides={slides} siteName={siteName} />
        <StatsBar />
        <IntroSection title={siteName} />
        <LegacySection />
        <FeaturedCollections />
        <NewsPreview
          heading="Latest Updates"
          subtitle="News, press features and announcements"
          viewAllHref="/posts/presscoverages"
          items={postItems}
        />
        <HomeGalleryShowcase items={galleryItems} viewAllHref="/gallery" />
        <VideoPreview items={videoItems} viewAllHref="/videos" />
        <AchievementsSection />
        <HomeCta />
      </>
    );
  } catch {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-primary">{siteConfig.name}</h1>
        <p className="text-muted">
          Start WAMP MySQL, import the database, then run{" "}
          <code className="rounded bg-secondary px-2 py-1 text-sm">npm run db:import</code>
        </p>
        <Link href="/admin/login" className="btn-primary">
          Admin Login
        </Link>
      </section>
    );
  }
}
