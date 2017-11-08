function ObjectUtils() {}

ObjectUtils.getProperty = function(obj, propertyPath) {
    if (!propertyPath) {
        return obj;
    }
    if (typeof(propertyPath) === 'string') {
        // split to array
        propertyPath = propertyPath.split('.');
    }
    if (propertyPath.length === 0) {
        // the object itself
        return obj;
    } else {
        // Nested property
        var childPropertyName = propertyPath.shift().trim();

        // Do we have index notation "object[index]":
        // const indexRegex = /(?:\s*([^\s]+)\s*)?\[\s*(?:(\d+)|(?:'(.*)')|(?:"(.*)"))\s*]/;
        const indexRegex = /(?:\s*([^\s[]+)\s*)?(?:\[\s*(?:(\d+)|(?:'(.*?)')|(?:"(.*?)"))\s*])/;

        var childObjResolved ;

        for (var indexMatch; ;indexMatch = childPropertyName.match(indexRegex)) {
            if (!indexMatch) {
                break;
            }
            const indexTargetName = indexMatch[1];
            if (indexTargetName) {
                obj = obj[indexTargetName];
            }
            const index = indexMatch[2] || indexMatch[3] || indexMatch[4];
            obj = obj[index];
            childObjResolved = true;
            childPropertyName = childPropertyName.substring(indexMatch[0].length);

        }

        const childObj = childObjResolved ? obj : obj[childPropertyName];
        return childObj &&  ObjectUtils.getProperty(childObj, propertyPath);
    }
};
ObjectUtils.setProperty = function(obj, propertyPath, value) {
    if (!propertyPath) {
        return obj;
    }
    if (typeof(propertyPath) === 'string') {
        // split to array
        propertyPath = propertyPath.split('.');
    }
    if (propertyPath.length > 0) {
        // Nested property
        var childPropertyName = propertyPath.shift().trim();

        if (propertyPath.length === 0) {
            // No more remaining children
            obj[childPropertyName] = value;
            return;
        } else {

            // Do we have index notation "object[index]":
            // const indexRegex = /(?:\s*([^\s]+)\s*)?\[\s*(?:(\d+)|(?:'(.*)')|(?:"(.*)"))\s*]/;
            const indexRegex = /(?:\s*([^\s[]+)\s*)?(?:\[\s*(?:(\d+)|(?:'(.*?)')|(?:"(.*?)"))\s*])/;

            var childObjResolved;

            for (var indexMatch = null; ; indexMatch = childPropertyName.match(indexRegex)) {
                if (!indexMatch) {
                    break;
                }
                const indexTargetName = indexMatch[1];
                if (indexTargetName) {
                    obj = obj[indexTargetName];
                }
                const index = indexMatch[2] || indexMatch[3] || indexMatch[4];
                obj = obj[index];
                childObjResolved = true;
                childPropertyName = childPropertyName.substring(indexMatch[0].length);

            }

            const childObj = childObjResolved ? obj : obj[childPropertyName];
            if (childObj) {
                ObjectUtils.setProperty(childObj, propertyPath, value);
            }
        }
    }
};

ObjectUtils._assign = function(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        ObjectUtils._assign(obj[e] =
                Object.prototype.toString.call(obj[e]) === "[object Object]"
                    ? obj[e]
                    : {},
            prop,
            value);
    } else
        obj[prop[0]] = value;
};

export default ObjectUtils