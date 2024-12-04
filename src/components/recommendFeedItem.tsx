import { Color, List } from "@raycast/api";
import { RecommendFeedAction } from "./recommendFeedAction";

export function RecommendFeedItem({articleId, title, readTime, viewCount, commentCount}: {articleId: string, title: string, readTime: string, viewCount: string, commentCount: string}) {
    return (
        <List.Item
            title={title}
            subtitle={readTime}
            accessories={[
               {
                text: {
                    value: `👀 ${viewCount}`,
                    color: Color.SecondaryText
                }
               }, 
               {
                text: {
                    value: `💬 ${commentCount}`,
                    color: Color.SecondaryText
                }
               }
            ]}
            actions={<RecommendFeedAction articleId={articleId} />}
        />
    );
}