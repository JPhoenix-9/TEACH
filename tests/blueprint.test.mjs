import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BLUEPRINT_MODULES,BLUEPRINT_BUNDLE,BLUEPRINT_SAVINGS_CENTS,blueprintProduct,blueprintPrice,hasBlueprintProduct} from '../app/lib/blueprint-catalog.mjs';

test('six module offers and package retain the approved totals and lesson counts',()=>{
 assert.equal(BLUEPRINT_MODULES.length,6);assert.equal(new Set(BLUEPRINT_MODULES.map(m=>m.key)).size,6);
 assert.equal(BLUEPRINT_MODULES.reduce((sum,m)=>sum+m.videos,0),44);
 assert.equal(BLUEPRINT_MODULES.reduce((sum,m)=>sum+m.priceCents,0),17994);
 assert.equal(BLUEPRINT_BUNDLE.priceCents,14999);assert.equal(BLUEPRINT_SAVINGS_CENTS,2995);
 assert.equal(blueprintPrice(2999),'$29.99');
});
test('module selection never substitutes the bundle or an arbitrary product',()=>{
 for(const module of BLUEPRINT_MODULES){assert.equal(blueprintProduct(module.key),module);assert.equal(module.priceCents,2999);}
 for(const key of ['',undefined,'gap-k2','blueprint-module-7','blueprint-module-1&price=1'])assert.equal(blueprintProduct(key),undefined);
});
test('ownership display respects the bundle and exact module without expanding access',()=>{
 for(const module of BLUEPRINT_MODULES){
   assert.equal(hasBlueprintProduct(['blueprint'],module.key),true);
   assert.equal(hasBlueprintProduct([module.key],module.key),true);
   assert.equal(hasBlueprintProduct([module.key],'blueprint'),false);
   for(const other of BLUEPRINT_MODULES.filter(other=>other.key!==module.key))assert.equal(hasBlueprintProduct([module.key],other.key),false);
 }
 assert.equal(hasBlueprintProduct([],'blueprint'),false);
 assert.equal(hasBlueprintProduct(['blueprint'],'gap-k2'),false);
 assert.equal(hasBlueprintProduct(['blueprint'],'blueprint-module-7'),false);
});
