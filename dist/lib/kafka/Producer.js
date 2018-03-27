"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const sinek_1 = require("sinek");
class Producer extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.timeout = null;
        this.producer = new sinek_1.NProducer(config, null, config.producerPartitionCount || 1);
        this.handleError = this.handleError.bind(this);
    }
    /**
     * Initially connect to producer
     */
    async connect() {
        try {
            await this.producer.connect();
        }
        catch (error) {
            this.handleError(error);
        }
        this.producer.on("error", this.handleError);
    }
    /**
     * Produce a new message
     */
    async produce(key, message) {
        try {
            // With version = 1
            await this.producer.buffer(this.config.produceTo, key, message, null, 1);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Closes the producer
     */
    close() {
        if (this.producer) {
            this.producer.close();
        }
    }
    /**
     * If there is an error, please report it
     */
    handleError(error) {
        super.emit("error", error);
    }
}
exports.default = Producer;
//# sourceMappingURL=Producer.js.map