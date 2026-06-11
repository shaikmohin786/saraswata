import { queryOne } from "@/lib/db/connection";

export type SliderRow = {
  SliderID: number;
  SliderImage1: string;
  SliderText1: string;
  SliderImage2: string;
  SliderText2: string;
  SliderImage3: string;
  SliderText3: string;
  SliderImage4: string;
  SliderText4: string;
  SliderImage5: string;
  SliderText5: string;
};

export async function getSliders() {
  return queryOne<SliderRow>(
    "SELECT * FROM sliders WHERE SliderDelete = 0 ORDER BY SliderID ASC LIMIT 1"
  );
}

export type SliderSlide = {
  image: string;
  text: string;
};

export function parseSliderSlides(
  slider: Awaited<ReturnType<typeof getSliders>>
): SliderSlide[] {
  if (!slider) return [];

  const slots = [
    { image: slider.SliderImage1, text: slider.SliderText1 },
    { image: slider.SliderImage2, text: slider.SliderText2 },
    { image: slider.SliderImage3, text: slider.SliderText3 },
    { image: slider.SliderImage4, text: slider.SliderText4 },
    { image: slider.SliderImage5, text: slider.SliderText5 },
  ];

  return slots.filter((slot) => slot.image && slot.image.trim() !== "");
}
