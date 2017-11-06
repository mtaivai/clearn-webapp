
/// TODO this is not used (is deprecated)
class DocumentContent {
    documentId;
    version;
    contentType;
    contentLength;
    contentBody;

    getContentBody = function() {}
}

class DocumentRepository {


    getDocumentContent(documentId) {

        var dc = new DocumentContent();
        dc.documentId = documentId;
        dc.version = 0;
        dc.contentType = "text/html; charset=UTF-8";
        dc.contentBody = "<p>Content of document #" + documentId + "</p>";
        dc.contentLength = dc.contentBody.length;

        return dc;

        // var url = "http://localhost:8080/document/${documentId}/content";
        // fetch(url)
        //     .then(function(response) {
        //         //console.log("OK? " + response.ok);
        //         return response.text();
        //     }).then(text => {
        //     //console.log("Text: " + text);
        //     this.setState({content: text});
        // });
    }

}

export default DocumentRepository;
