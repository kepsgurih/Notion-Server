import dotenv from 'dotenv'
import {Client} from '@notionhq/client';

dotenv.config()
const authToken = process.env.NOTION_TOKEN;
const notionDbID = process.env.DATABASE_ID;
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
    const getTags = (tags) => {
      const allTags = tags.map((tag) => {
        return tag.name;
      });
  
      return allTags;
    };

    const getFiles = (imgs) => {
      const allImg = imgs.map((img)=> {
        return img.file.url
      })
      return allImg
    }
  
    return {
      id: post.id,
      title: post.properties.Name.title[0].plain_text,
      tags: getTags(post.properties.Tags.multi_select),
      description: post.properties.Description.rich_text[0].plain_text,
      date: getToday(post.properties.Date.last_edited_time),
      images:getFiles(post.properties.Images.files),
      slug: post.properties.Slug.formula.string,
    };
  };

  function getToday (datestring) {
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    let date = new Date();
  
    if (datestring) {
      date = new Date(datestring);
    }
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let today = `${month} ${day}, ${year}`;
  
    return today;
  };
