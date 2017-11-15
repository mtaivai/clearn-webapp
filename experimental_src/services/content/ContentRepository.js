
class ContentItem {
    contentClass;
    id;
    //version;
    contentType;
    contentLength;
    //contentBody;

    getContentBody = function() {
        return new Promise((resolve, reject) => {
            reject("getContentBody() is not implemented for abstract ContentItem");
        });
    }
}

class ContentRepository {

    getContentItem(contentClass, id) {
        throw new Error("getContentItem is not implemented")
    }
}


export {ContentItem, ContentRepository}
export default ContentRepository
