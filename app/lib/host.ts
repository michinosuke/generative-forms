export const getHost = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://gf.michinosuke.com";
