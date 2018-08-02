/**
 * Created by aliziwa on 3/31/17.
 */

module.exports = {
    returnMessage : function(status, message, content){
        return {
            status: status,
            message: message,
            content: content
        }
    }
};