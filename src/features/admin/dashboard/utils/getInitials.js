function getInitials(name, fallback = "A") {
  if (!name) return fallback;

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default getInitials;