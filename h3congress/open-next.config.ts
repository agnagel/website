import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Default config is enough for this app. If you later add ISR / cached
  // routes, wire up an incremental cache (R2/KV) here.
});
