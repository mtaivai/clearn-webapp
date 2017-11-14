
class StringUtils {
    static toCamelCase (str, decorate) {
        if (!str) {
            return str;
        }

        str = str.trim();

        // Quoted strings:
        if (str.match(/^(?:(?:'(.*)')|(?:"(.*)"))$/)) {
            return str.substring(1, str.length - 1);
        }


        const converted = str.toLowerCase().replace(/(?:(?:-)|^)([^-])/g, function (ch, firstChar) {
            return firstChar.toUpperCase();
        }).replace(/-/g, '_');

        return decorate ? decorate(converted) : converted;
    }


    static ensureSuffix(name, suffix) {
        if (suffix && !name.endsWith(suffix)) {
            name = name + suffix;
        }
        return name;
    };
    static ensurePrefix(name, prefix) {
        if (prefix && !name.startsWith(prefix)) {
            name = prefix + name;
        }
        return name;
    };
}

export default StringUtils;
