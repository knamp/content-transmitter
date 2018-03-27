"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const sinek_1 = require("sinek");
class Consumer extends EventEmitter {
    constructor(config, process) {
        super();
        this.config = config;
        this.process = process;
        const { consumeFrom } = config;
        this.consumer = new sinek_1.NConsumer(consumeFrom, config);
        this.consume = this.consume.bind(this);
        this.handleError = this.handleError.bind(this);
    }
    /**
     * Initially connect to Consumer
     */
    async connect() {
        try {
            await this.consumer.connect();
        }
        catch (error) {
            this.handleError(error);
        }
        // Consume as JSON with callback
        try {
            // Do not await this (it only fires after first message)
            this.consumer.consume(this.consume.bind(this), true, true, this.config.consumerOptions).catch((error) => this.handleError(error));
        }
        catch (error) {
            this.handleError(error);
        }
        this.consumer.on("error", this.handleError.bind(this));
    }
    /**
     * Closes the consumer
     */
    close() {
        if (this.consumer) {
            this.consumer.close();
        }
    }
    /**
     * Handle consuming messages
     */
    async consume(message, callback) {
        let error;
        try {
            await this.handleMessage(message);
            error = null;
        }
        catch (producedError) {
            this.handleError(producedError);
            error = producedError;
        }
        // Return this callback to receive further messages
        callback(error);
    }
    /**
     * Handle newly created messages
     */
    async handleMessage(message) {
        const messageContent = {
            key: message.key,
            url: message.value.url,
        };
        await this.process(messageContent);
    }
    /**
     * If there is an error, please report it
     */
    handleError(error) {
        super.emit("error", error);
    }
}
exports.default = Consumer;
//# sourceMappingURL=Consumer.js.map