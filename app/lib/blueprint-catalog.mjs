export const BLUEPRINT_MODULES = [
  {key:'blueprint-module-1',number:1,title:'Getting Your Head Around Homeschooling',description:'Find your footing, rethink familiar assumptions, and build confidence for the work ahead.',videos:7},
  {key:'blueprint-module-2',number:2,title:'Let’s Get Legal',description:'Understand the legal questions to address as you begin homeschooling and prepare for possible challenges.',videos:7},
  {key:'blueprint-module-3',number:3,title:'Teaching Methods You Can Use Today',description:'Explore practical teaching approaches you can use across subjects and adapt to your family.',videos:8},
  {key:'blueprint-module-4',number:4,title:'Choosing the Right Curriculum',description:'Make thoughtful curriculum choices that fit your children, your goals, and your circumstances.',videos:8},
  {key:'blueprint-module-5',number:5,title:'Best Practices Keep Things Running Right',description:'Develop everyday practices that help your homeschool run with greater purpose and consistency.',videos:7},
  {key:'blueprint-module-6',number:6,title:'Getting the Support You Need to Succeed',description:'Consider the encouragement, relationships, and practical support that help you keep going.',videos:7},
].map(module=>Object.freeze({...module,priceCents:2999}));
export const BLUEPRINT_BUNDLE = Object.freeze({key:'blueprint',title:'Complete Homeschool Success Blueprint',priceCents:14999,videos:44});
export const BLUEPRINT_SAVINGS_CENTS = BLUEPRINT_MODULES.reduce((sum,module)=>sum+module.priceCents,0)-BLUEPRINT_BUNDLE.priceCents;
export const BLUEPRINT_SALES_VIDEO = Object.freeze({
  src:'https://video.wixstatic.com/video/d65cd2_c671eb8e28c44dfb91c563c83fa768f7/720p/mp4/file.mp4',
  poster:'https://static.wixstatic.com/media/d65cd2_c671eb8e28c44dfb91c563c83fa768f7f000.jpg',
});
export function blueprintProduct(key){return key===BLUEPRINT_BUNDLE.key?BLUEPRINT_BUNDLE:BLUEPRINT_MODULES.find(module=>module.key===key);}
export function isBlueprintProduct(key){return Boolean(blueprintProduct(key));}
export function blueprintPrice(cents){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);}
export function hasBlueprintProduct(keys,key){return isBlueprintProduct(key)&&(keys.includes('blueprint')||keys.includes(key));}
