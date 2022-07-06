import { message } from "antd";

export default async function fetcher<JSON = unknown>(
  url: string,
  options?: RequestInit
): Promise<any> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const res = (await response.json()) || response.statusText;
      console.error(typeof res === "string" ? res : res["error"]);
      throw new Error(typeof res === "string" ? res : res["message"]);
    }

    return await response.json();
  } catch (e) {
    message.error(`Unexpected error: ${e}`);
    return null;
  }
}
