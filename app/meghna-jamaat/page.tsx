import SeoTopicPage,{topicMetadata} from '../../components/seo-topic-page';
import {seoTopicBySlug} from '../../lib/seo-topics';
const topic=seoTopicBySlug['meghna-jamaat'];
export const metadata=topicMetadata(topic);
export default function Page(){return <SeoTopicPage topic={topic}/>;}
