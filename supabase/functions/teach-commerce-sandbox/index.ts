import Stripe from 'npm:stripe@23.0.0';
import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createHandler} from '../teach-commerce/handler.mjs';

const projectUrl = Deno.env.get('SUPABASE_URL')!;
const productionHost = 'jhooodlcvcpnzcpreqmu.supabase.co';
const accountId = Deno.env.get('TEACH_SANDBOX_STRIPE_ACCOUNT_ID');
const previewOrigin = Deno.env.get('TEACH_SANDBOX_PREVIEW_ORIGIN');

if (new URL(projectUrl).hostname === productionHost) throw new Error('Use a separate Supabase project for test orders.');
if (!accountId || !previewOrigin || new URL(previewOrigin).origin !== previewOrigin) {
  throw new Error('Configure the sandbox account and exact preview origin.');
}

const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const admin = createClient(projectUrl, keys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: {persistSession: false, autoRefreshToken: false},
});

Deno.serve(createHandler({
  admin,
  Stripe,
  env: name => Deno.env.get(name),
  sandbox: {accountId, origin: previewOrigin},
}));
