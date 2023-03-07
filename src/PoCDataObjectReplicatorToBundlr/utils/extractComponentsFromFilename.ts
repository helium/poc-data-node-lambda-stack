const UNIX_MS_REGEX = /^\d{13}$/;

export const extractComponentsFromFilename = (filename: string) => {
  const filenameComponents = filename.split(".");

  const fileType = filenameComponents[0];
  const unixMsTs: string | undefined = filenameComponents.filter(
    (component: string) => UNIX_MS_REGEX.test(component)
  )[0];

  const date = unixMsTs ? new Date(parseInt(unixMsTs)) : new Date();
  const iso = date.toISOString();
  const isoDate = iso.split("T")[0];
  const isoDateComponents = isoDate.split("-");

  if (isoDateComponents.length != 3) {
    console.log(isoDateComponents);
    throw new Error("dis date look weird");
  }

  return { fileType, isoDateComponents };
};
