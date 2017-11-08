
## SASS Support

https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc



## ContentBlock
 
 
 ContentRepository
 
 contentClass
   Document (text/html, text/plain)
   
 
    blocks: [
    {
        type: "ContentBlock",
        id: 123,
        layout: {
            targetZone: "main",
            span: 12
        },
        configuration: {
            contentClass: "Document",
            contentId: "6"
        }
    },
    {
        type: "ContentPublisher",
        id: 5959,
        layout: {
            targetZone: "news",
            span: 12
        },
        configuration: {
            filters: [
                {
                    op: "AND",
                    args: [
                        {
                            op: "EQ",
                            args: ["contentClass", "Document"]
                        },
                        {
                            op: "CONTAINS",
                            args: ["tags", "News"]
                        },
                        {
                            op: "EQ",
                            args: ["status", "Published"]
                        }
                    ]
                }
                
            ]
        }
    }]
    
    //
    contentClass.eq("Document") and tags.contains("News") and status.eq("Published")