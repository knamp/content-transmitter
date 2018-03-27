"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const Promise = require("bluebird");
const NodeCrawler = require("crawler");
class Crawler extends EventEmitter {
    constructor(config) {
        super();
        this.spider = new NodeCrawler(config.crawler);
    }
    crawl(url) {
        return new Promise((resolve, reject) => {
            this.spider.queue({
                callback: (error, result, done) => {
                    done();
                    if (error) {
                        return reject(error);
                    }
                    const payload = {
                        content: result.body,
                        url,
                    };
                    resolve(payload);
                },
                jQuery: false,
                uri: url,
            });
        });
    }
    close() {
        // empty
    }
    handleError(error) {
        super.emit("error", error);
    }
}
exports.default = Crawler;
//# sourceMappingURL=Crawler.js.map