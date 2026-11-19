import { getPromo } from "@/lib/promos";
import MechanicsCollapse from "./MechanicsCollapse";

interface Props {
  nid: string;
}

// The CMS body often opens with its own "Promo Mechanics" line, duplicating our heading.
const LEADING_MECHANICS_HEADING =
  /^\s*<(p|h[1-6]|div)[^>]*>\s*(?:<(?:strong|b)>\s*)?promo mechanics:?\s*(?:<\/(?:strong|b)>\s*)?<\/\1>/i;

export default async function PromoMechanicsSection({ nid }: Props) {
  const promo = await getPromo(nid);
  const html = (promo.body ?? "").replace(LEADING_MECHANICS_HEADING, "");

  if (!html.trim()) {
    return null;
  }

  return (
    <section className="promo-mechanics">
      <div className="max-w-6xl mx-auto pb-20 px-5">
        <h2 className="mb-5">Promo Mechanics</h2>
        <MechanicsCollapse html={html} />
      </div>
    </section>
  );
}
