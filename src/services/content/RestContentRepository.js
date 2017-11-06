
import ContentRepository from './ContentRepository'


class RestContentRepository extends ContentRepository {
    getContentItem(contentClass, id) {
        var item = new ContentItem();
        item.id = id;
        item.getContentBody = function() {
            var url = "http://localhost:8080/document/" + id + "/content";
            return fetch(url)
                .then(function(response) {
                    //console.log("OK? " + response.ok);
                    return response.text();
                }).then(text => {
                    //console.log("Text: " + text);
                    //this.setState({content: text});
                    return text;
                });
        }



        return item;
    }
}

export default RestContentRepository
