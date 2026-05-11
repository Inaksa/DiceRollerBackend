"use strict";

class Utilities {
    static convertURL(request) {
        const retValue = new Object();
        const elems = request.url.toLowerCase().replace('/', '').split('?');
        switch (elems.length) {
            case 0:
                return null;
                break
            case 1:
                retValue["path"] = elems[0].toLowerCase();
                break
            case 2:
                retValue["path"] = elems[0].toLowerCase()
                elems[1].split(',').forEach(element => {
                    const parameters = element.split('=')
                    switch (parameters.length) {
                        case 1:
                            retValue[parameters[0].toLowerCase()] = ""
                            break
                        case 2:
                            retValue[parameters[0].toLowerCase()] = parameters[1]
                            break
                        default:
                            break
                    }
                });
            default:
                break
        }

        retValue["method"] = request.method
        return retValue;
    }
}
export default Utilities;