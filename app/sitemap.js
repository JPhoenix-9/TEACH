import articles from './library/articles.json';
export default function sitemap(){const collection=Array.isArray(articles)?articles:articles.articles||[];return ['','/about','/start','/library','/webinars','/blueprint','/curriculum/gap','/planner','/contact','/privacy','/terms',...collection.map(a=>`/library/${a.slug}`)].map(path=>({url:`https://teach-mocha.vercel.app${path}`}));}
