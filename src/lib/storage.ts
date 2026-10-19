import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

let _storage: Files | null = null;

export function getStorage(): Files {
  if (!_storage) {
    const endpoint = process.env.AWS_ENDPOINT_URL_S3 || "https://storage.neon.tech";
    _storage = new Files({
      adapter: neon({
        bucket: "assets",
        endpoint,
      }),
    });
  }
  return _storage;
}

export const storage = new Proxy({} as Files, {
  get(_target, prop, receiver) {
    const instance = getStorage();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

