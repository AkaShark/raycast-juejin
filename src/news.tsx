import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { recommendApi } from "./api/recommend";
import { ArticleData, RecommendFeedRespDto } from "./Dto/recommendRespDto";
import { RecommendNews } from "./model/recommendNews";
import { RecommendFeedCategory } from "./utils/recommendFeedCategory";
import { RecommendFeedItem } from "./components/recommendFeedItem";

interface RecommendList {
  list: RecommendNews[];
}

export default function Command() {
  const [list, setList] = useState<RecommendList>({ list: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestRecommendFeed();
  }, []);


  function requestRecommendFeed() {
    recommendApi.recommendFeed({
      uuid: "7293568760983307826",
      aid: "6587"
    }, {
      limit: 10,
      client_type: 6587,
      cursor: "0",
      id_type: 1,
      cate_id: RecommendFeedCategory.iOS,
      sort_type: 200
    }).then((res) => {
      try {
        const data = res.data as RecommendFeedRespDto
        if (data.err_no !== 0) {
          showToast({
            title: "请求失败",
            message: data.err_msg,
            style: Toast.Style.Failure
          })
          console.log(`request juejin recommend feed error: ${data.err_msg}`);
        } else {
          console.log(data.data);
          parseRecommendNews(data.data);
        }
      } catch (error) {
        showToast({
          title: "请求失败",
          message: error as string,
          style: Toast.Style.Failure
        })
        console.log(`request juejin recommend feed error: ${error}`);
      }
    })

    function parseRecommendNews(data: ArticleData[]) {
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
      setList({list: list})
    }
  }

  return (
    <List isLoading={isLoading}>
      {list.list.length === 0 ? <List.EmptyView /> : 
        list.list.map((item) => {
          return <RecommendFeedItem aritcleId={item.articleId} title={item.title} readTime={item.readTime} viewCount={item.viewCount.toString()} commentCount={item.commentCount.toString()}/>
        })
      }
    </List>
  );
}
