export const GAP_FIRST_PRICE_CENTS = 5999;
export const GAP_ADDITIONAL_PRICE_CENTS = 4999;
export const GAP_PACKAGES = Object.freeze([
  {key:'gap-k2',grades:'K–2',label:'Kindergarten through second grade',id:'k-2',image:'a869c008bf84480991c85f9fa18fd141',pages:21},
  {key:'gap-35',grades:'3–5',label:'Third through fifth grade',id:'3-5',image:'cffd2456ab344d298227d346207c1e20',pages:29},
  {key:'gap-68',grades:'6–8',label:'Sixth through eighth grade',id:'6-8',image:'45df80b439d445ba83acd18c19c26da6',pages:29},
  {key:'gap-912',grades:'9–12',label:'Ninth through twelfth grade',id:'9-12',image:'12ec34124c4f41ae9c3bc914ca76c241',pages:25},
].map(item=>Object.freeze({...item,title:`GAP Curriculum · Grades ${item.grades}`})));
export function gapProduct(key){return GAP_PACKAGES.find(item=>item.key===key);}
export function gapPrice(cents){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);}
// Call with current, trusted product_access rows only. Checkout must recompute
// this quote on the server before creating a payment session.
export function gapQuote(productKey,accessRows=[]){
  if(!gapProduct(productKey))return null;
  const owned=new Set(accessRows.filter(row=>!row.revoked_at&&gapProduct(row.product_key)).map(row=>row.product_key));
  if(owned.has(productKey))return {owned:true,priceCents:null,discountCents:0};
  const discountCents=owned.size?GAP_FIRST_PRICE_CENTS-GAP_ADDITIONAL_PRICE_CENTS:0;
  return {owned:false,priceCents:GAP_FIRST_PRICE_CENTS-discountCents,discountCents};
}
