export const R2_BASE_URL = "https://pub-83a913df401b4cf5bb93369c52dd58c4.r2.dev";

export const getDownloadUrl = (r2Path: string): string => {
  return `${R2_BASE_URL}/${r2Path}`;
};
