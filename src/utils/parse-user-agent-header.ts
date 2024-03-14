import "server-only";

import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const parseUserAgentHeader = () => {
  const headersList = headers();
  const ua = headersList.get("user-agent") ?? undefined;

  const parser = new UAParser(ua);
  const parserResults = parser.getOS()?.name;

  const isAppleDevice = Boolean(parserResults?.match(/iOS|Mac OS/)?.[0]);

  return { isAppleDevice };
};
