import AdSenseAutoAds from "../components/AdSenseAutoAds";

export default function TemplatesLayout({ children }) {
  return (
    <>
      <AdSenseAutoAds />
      {children}
    </>
  );
}
