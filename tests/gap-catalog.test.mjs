import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GAP_PACKAGES,gapProduct,gapQuote} from '../app/lib/gap-catalog.mjs';

test('first package costs $59.99 and later distinct packages keep the $10 discount',()=>{
  for(const product of GAP_PACKAGES){
    assert.equal(gapQuote(product.key).priceCents,5999);
    const other=GAP_PACKAGES.find(item=>item.key!==product.key);
    assert.equal(gapQuote(product.key,[{product_key:other.key,granted_at:'2025-01-01'}]).priceCents,4999);
  }
});
test('discount never increases with number of packages and owned packages cannot be repurchased',()=>{
  const rows=GAP_PACKAGES.slice(0,3).map(item=>({product_key:item.key}));
  assert.equal(gapQuote('gap-912',rows).priceCents,4999);
  assert.equal(gapQuote('gap-k2',rows).owned,true);
  assert.equal(gapQuote('gap-k2',rows).priceCents,null);
  assert.equal(5999+3*4999,20996);
});
test('unrelated and revoked entitlements cannot qualify; unknown selections are rejected',()=>{
  assert.equal(gapQuote('gap-35',[{product_key:'blueprint'},{product_key:'gap-k2',revoked_at:'2026-11-01'}]).priceCents,5999);
  assert.equal(gapQuote('gap-family-bundle'),null);
  assert.equal(gapProduct('gap-3-5'),undefined);
});
