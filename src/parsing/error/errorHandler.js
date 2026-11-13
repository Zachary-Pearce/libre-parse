export default class ErrorHandler {
    recover() {
        throw new Error("Interface not implemented!");
    }

    sync() {
        throw new Error("Interface not implemented!");
    }
}