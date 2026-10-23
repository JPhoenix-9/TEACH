import Header from '../components/Header';
import SiteFooter from '../components/SiteFooter';
import LibraryExperience from './LibraryExperience';
import articles from './articles.json';

export const metadata = {
  title: 'Free Homeschool Library | TEACH',
  description: 'Step inside the TEACH Library. Read free articles by Jana Sheridan on homeschooling, teaching confidence and family relationships. No account required.'
};

export default function Library() {
  return <><div className="atmosphere-band" aria-hidden="true"/><Header/><LibraryExperience articles={articles}/><SiteFooter/></>;
}
