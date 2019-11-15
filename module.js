/* data structure for the interface that gets the url from the videos*/
class GetVideosResponse{
    constructor(infos){
        this.infos = infos;
    }
}

class infos{

    constructor(url1, url2, url3, url4, author1, author2, author3, author4){
        this.url1 = url1;
        this.url2 = url2;
        this.url3 = url3;
        this.url4 = url4;
        
        this.author1 = author1;
        this.author2 = author2;
        this.author3 = author3;
        this.author4 = author4;
    }
}

/* interfaces to send response to the client */

class JoinSessionResponse{
    constructor(result){
        this.result = result;
    }
}

class StatusRegistered{
    /**
     * 
     * @param {*} result OK or KO 
     * @param {*} errorFields list of name of the fields that has errors [fieldError1, fieldError2]
     */
    constructor(result, errorFields){
        this.result = result;
        this.errorFields = errorFields;
    }
}

module.exports = {
    instanceSessionResponse : function(result){
        return new JoinSessionResponse(result);
    },
    instanceStatusRegistered : function(result, errorFields){
        return new StatusRegistered(result, errorFields);
    }
}