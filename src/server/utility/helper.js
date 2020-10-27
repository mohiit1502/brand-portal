export default class Helper {
    getName() {
        const funcNameRegex = /function (.{1,})\(/;
        if (!this) {
            return this;
        }
        const results = (funcNameRegex).exec((this).constructor.toString());
        return (results && results.length > 1) ? results[1] : results;
    }
}