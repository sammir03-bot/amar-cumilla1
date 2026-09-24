import SeoTopicPage,{topicMetadata} from '../../components/seo-topic-page';
import {seoTopicBySlug} from '../../lib/seo-topics';
const topic=seoTopicBySlug['cumilla-1-jamaat'];
export const metadata=topicMetadata(topic);
export default function Page(){return <SeoTopicPage topic={topic}/>;}
