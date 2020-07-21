export default class Helper {
    static toCamelCaseFirstUpper (incoming) {
        if (!incoming) {
            return "";
        }

        if (incoming.includes("-")) {
            const strParts = incoming.split("-");
            return strParts.reduce((acc, curr) => Helper.toCamelCaseIndividual(acc) + Helper.toCamelCaseIndividual(curr));
        }
        return Helper.toCamelCaseIndividual(incoming);
    }

    static toCamelCase (incoming) {
        if (!incoming) {
            return "";
        }

        if (incoming.includes("-")) {
            const strParts = incoming.split("-");
            let accumulated = "";
            const first = Helper.toCamelCaseIndividual(strParts[0], true);
            if (strParts.length > 1) {
                accumulated = strParts.slice(1).reduce((acc, curr) => Helper.toCamelCaseIndividual(acc) + Helper.toCamelCaseIndividual(curr));
            }
            return first + accumulated;
        }
        return Helper.toCamelCaseIndividual(incoming);
    }

    static toCamelCaseIndividual (part, isFirstLower) {
        if (!part) {
            return "";
        }
        if (part.length === 1) {
            return part.toUpperCase();
        }

        const strFirst = isFirstLower ? part.substring(0, 1).toLowerCase() : part.substring(0, 1).toUpperCase();
        const strRest = part.substring(1).toLowerCase();
        return strFirst + strRest;
    }
}
