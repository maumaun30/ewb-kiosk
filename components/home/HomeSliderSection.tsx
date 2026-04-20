import { getSlides } from "@/lib/slides";
import Slider from "./Slider";

export default async function HomeSliderSection() {
  const slides = await getSlides();
  return (
    <header className="flex-none">
      <Slider slides={slides} />
    </header>
  );
}
