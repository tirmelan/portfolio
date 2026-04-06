interface InfoField {
  label: string;
  value?: string;
  isLink?: boolean;
  displayValue?: string;
}

interface ProjectIntroProps {
  ingress?: string;
  kundeLabel?: string;
  kunde?: string;
  samarbeid?: string;
  leveranse?: string;
  periode?: string;
  lenke?: string;
  lenkeTittel?: string;
}

function InfoRow({ label, value, isLink, displayValue }: InfoField) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="font-sans text-[16px] md:text-[20px] leading-[26px] text-bla">{label}</span>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-medium text-[16px] md:text-[20px] leading-[26px] text-bla underline hover:opacity-70 transition-opacity"
        >
          {displayValue ?? value}
        </a>
      ) : (
        <span className="font-sans font-medium text-[16px] md:text-[20px] leading-[26px] text-bla">{displayValue ?? value}</span>
      )}
    </div>
  );
}

export default function ProjectIntro({
  ingress,
  kundeLabel = "Kunde",
  kunde,
  samarbeid,
  leveranse,
  periode,
  lenke,
  lenkeTittel,
}: ProjectIntroProps) {
  const hasInfo = kunde || samarbeid || leveranse || periode || lenke;
  if (!ingress && !hasInfo) return null;

  return (
    <section className="px-6 md:px-[176px] py-[48px] md:py-[106px]">
      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-12 text-bla">
        {/* Ingress */}
        {ingress && (
          <p className="font-sans text-[18px] md:text-[24px] leading-[1.5] md:leading-[34px] md:max-w-[677px]">
            {ingress}
          </p>
        )}

        {/* Info-felt */}
        {hasInfo && (
          <div className="flex flex-col gap-[22px] md:w-[313px] shrink-0">
            <InfoRow label={kundeLabel} value={kunde} />
            <InfoRow label="Samarbeid" value={samarbeid} />
            <InfoRow label="Leveranse" value={leveranse} />
            <InfoRow label="Periode" value={periode} />
            <InfoRow label="Lenke" value={lenke} isLink displayValue={lenkeTittel} />
          </div>
        )}
      </div>
    </section>
  );
}
