import { recommendApi } from "../api/recommend";
import { ArticleData, RecommendFeedRespDto } from "../Dto/recommendRespDto";
import { RecommendNews } from "../model/recommendNews";
import { RecommendFeedCategory } from "../utils/recommendFeedCategory";

export function requestRecommendFeed(
  categoryId: RecommendFeedCategory,
  onSuccess: (data: RecommendNews[]) => void,
  onError: (error: string) => void,
) {
  recommendApi
    .recommendFeed(
      {
        uuid: "7293568760983307826",
        aid: "6587",
      },
      {
        limit: 15,
        client_type: 6587,
        cursor: "0",
        id_type: 1,
        cate_id: categoryId,
        sort_type: 200,
      },
    )
    .then((res) => {
      try {
        const data = res.data as RecommendFeedRespDto;
        if (data.err_no !== 0 || !data.data) {
          console.log(`request juejin recommend feed error: ${data.err_msg}`);
          onError("请求失败");
        } else {
          console.log(data.data);
          const list = parseRecommendNews(data.data);
          onSuccess(list);
        }
      } catch (error) {
        console.log(`request juejin recommend feed error: ${error}`);
        onError("请求失败");
      }
    });

    function parseRecommendNews(data: ArticleData[]): RecommendNews[] {
        let list: RecommendNews[] = [];
        data.forEach((item) => {
          let news = {
            articleId: item.article_id,
            title: item.article_info.title,
            subTitle: item.article_info.brief_content,
            readTime: item.article_info.read_time,
            viewCount: item.article_info.view_count,
            collectCount: item.article_info.collect_count,
            diggCount: item.article_info.digg_count,
            commentCount: item.article_info.comment_count,
            userName: item.author_user_info.user_name,
            categoryName: item.category.category_name,
          }
          list.push(news);
        })
        return list;
      }
}
