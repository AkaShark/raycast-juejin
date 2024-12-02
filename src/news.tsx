import { Detail, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { recommendApi } from "./api/recommend";
import { ArticleData, RecommendFeedRespDto } from "./Dto/recommendRespDto";
import { RecommendNews } from "./model/recommendNews";
import { RecommendFeedCategory } from "./utils/recommendFeedCategory";

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
          console.log(`request juejin recommend feed error: ${data.err_msg}`);
        } else {
          console.log(data.data);
          parseRecommendNews(data.data);
        }
      } catch (error) {
        console.log(`request juejin recommend feed error: ${error}`);
      }
    })

    function parseRecommendNews(data: ArticleData[]) {

    }
  }

  return (
    <List isLoading={isLoading}>
      {list.list.length === 0 ? <List.EmptyView /> : 
        list.list.map((item) => {
          return <List.Item title={item.title} />
        })
      }
    </List>
  );
}
