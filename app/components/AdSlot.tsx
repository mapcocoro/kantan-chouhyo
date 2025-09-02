type Props = {
  html: string;
  width: number;
  height: number;
  className?: string;
  ariaLabel?: string;
};

export default function AdSlot({ html, width, height, className, ariaLabel = "広告" }: Props) {
  return (
    <div
      aria-label={ariaLabel}
      className={className}
      style={{ width, height, maxWidth: "100%" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}