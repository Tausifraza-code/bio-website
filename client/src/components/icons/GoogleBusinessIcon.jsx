import gmbIcon from "../../assets/google-my-business.png";

export default function GoogleBusinessIcon({
  size = 18,
  className = "",
  style = {},
  ...props
}) {
  const dimension =
    typeof size === "number" ? `${size}px` : size || undefined;

  const inlineStyles = dimension
    ? {
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        ...style,
      }
    : style;

  return (
    <img
      src={gmbIcon}
      alt="Google My Business"
      style={inlineStyles}
      className={`inline-block object-contain shrink-0 select-none ${className}`}
      loading="eager"
      decoding="async"
      {...props}
    />
  );
}
