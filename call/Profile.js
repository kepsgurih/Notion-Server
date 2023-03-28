import dotenv from 'dotenv'
import {Client} from '@notionhq/client';

dotenv.config()
const authToken = process.env.NOTION_TOKEN;
const notionDbID = process.env.PROFILE_ID;
const notion = new Client({ auth: authToken });
export default async function Posting() {
    const posts = await notion.databases.query({
        database_id: notionDbID,
        filter: {
            property: "Published",
            checkbox: {
                equals: true,
            },
        },
        sorts: [
            {
                property: "Date",
                direction: "descending",
            },
        ],
    });
    const allPosts = posts.results;

    return allPosts.map((post) => {
        return getPageMetaData(post);
    });
}
const getPageMetaData = (post) => {
    return {
      id: post.id,
      title: post.properties.Name.title[0].plain_text,
    };
  };
