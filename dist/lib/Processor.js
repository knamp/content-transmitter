"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const Consumer_1 = require("./kafka/Consumer");
const Producer_1 = require("./kafka/Producer");
const Crawler_1 = require("./web/Crawler");
class Processor extends EventEmitter {
    constructor(config) {
        super();
        this.consumer = new Consumer_1.default(config, this.handleConsumerMessage.bind(this));
        this.producer = new Producer_1.default(config);
        this.crawler = new Crawler_1.default(config);
        this.consumer.on("error", this.handleError.bind(this));
        this.producer.on("error", this.handleError.bind(this));
        this.crawler.on("error", this.handleError.bind(this));
    }
    async start() {
        await this.producer.connect();
        await this.consumer.connect();
    }
    close() {
        if (this.consumer) {
            this.consumer.close();
        }
        if (this.producer) {
            this.producer.close();
        }
        if (this.crawler) {
            this.crawler.close();
        }
    }
    async handleConsumerMessage(message) {
        const payload = await this.crawler.crawl(message.url);
        await this.producer.produce(message.key, payload);
    }
    handleError(error) {
        super.emit("error", error);
    }
}
exports.default = Processor;
//# sourceMappingURL=Processor.js.map