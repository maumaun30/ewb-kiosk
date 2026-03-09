import type { Data } from "@/lib/settings";

interface SettingsProps {
  settings: Data;
}
const Footer: React.FC<SettingsProps> = ({ settings }) => {
  const footerImg =
    settings?.footer?.fields?.footer_logo_url?.value ?? "/footer.png";

  return (
    <footer>
      <div className="max-w-6xl mx-auto">
        <img
          src={footerImg}
          className="w-full"
          alt="EastWest footer"
          width={0}
          height={0}
          sizes="100vw"
        />
      </div>
    </footer>
  );
};

export default Footer;
