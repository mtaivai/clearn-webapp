
import {ContentRepository, ContentItem} from './ContentRepository'

class MockContentRepository extends ContentRepository {

    items = {}
    contentBodies = {}

    constructor() {
        super()
        this.items = {}
        this.contentBodies = {}
        for (var i = 0; i < 10; i++) {
            var item = new ContentItem();
            item.contentClass = "Document";
            item.id = i;
            item.contentType = "text/html; charset=UTF-8";
            this.items[item.id] = item;
            this.contentBodies[item.id] = ( "<p>Content of document #" + item.id + "</p>");
        }
    }


    getContentItem(contentClass, id) {

        var item = this.items[id];

        // item.contentLength = contentBody.length;
        var contentBodies = this.contentBodies;

        item.getContentBody = function() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(contentBodies[id]);
                    //reject("Foo");
                }, 300);
            });
        }

        return item;


    }

}


//export default ContentRepository
export default MockContentRepository

