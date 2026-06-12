export function getSafeNextPath(
  value: string | string[] | undefined | null,
  fallback = "/dashboard",
) {
  const nextPath = Array.isArray(value) ? value[0] : value;

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}
