// Public connection details. Authentication and row-level policies protect private data.
const productionUrl = "https://jhooodlcvcpnzcpreqmu.supabase.co";
const productionKey = "sb_publishable_p7jhF0mOMKFvQmN4Kkp3ng_VxvaHECD";

const sandboxUrl = process.env.NEXT_PUBLIC_TEACH_SANDBOX_SUPABASE_URL;
const sandboxKey = process.env.NEXT_PUBLIC_TEACH_SANDBOX_SUPABASE_PUBLISHABLE_KEY;
if (Boolean(sandboxUrl) !== Boolean(sandboxKey) ||
    (sandboxUrl && new URL(sandboxUrl).hostname === new URL(productionUrl).hostname)) {
  throw new Error('Configure both preview credentials for a separate TEACH test database.');
}
export const supabaseProjectUrl = sandboxUrl || productionUrl;
export const supabasePublishableKey = sandboxKey || productionKey;
export const teachSandbox = Boolean(sandboxUrl);
