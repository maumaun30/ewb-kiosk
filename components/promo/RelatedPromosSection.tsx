import { getPromo, getPromos } from "@/lib/promos";
import RelatedPromos from "./RelatedPromos";

interface Props {
  nid: string;
}

export default async function RelatedPromosSection({ nid }: Props) {
  const [promo, allPromos] = await Promise.all([getPromo(nid), getPromos()]);
  return <RelatedPromos current={promo} all={allPromos} />;
}
