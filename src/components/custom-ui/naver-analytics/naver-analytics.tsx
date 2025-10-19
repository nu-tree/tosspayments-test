import Script from 'next/script';

type Props = { naId: string };

export const NaverAnalytics = ({ naId }: Readonly<Props>) => {
  if (!naId) return null;

  return (
    <>
      <Script src="//wcs.naver.net/wcslog.js" strategy="beforeInteractive" />
      <Script
        id="naver-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "${naId}";
            if(window.wcs) {
              wcs_do();
            }
          `,
        }}
      />
    </>
  );
};
