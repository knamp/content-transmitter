"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Processor_1 = require("./lib/Processor");
const defaultOptions = {
    "batch.num.messages": 1000000,
    "compression.codec": "snappy",
    "consumeWithBackpressure": true,
    "dr_cb": true,
    "event_cb": true,
    "kafkaHost": "127.0.0.1:9092",
    "message.send.max.retries": 10,
    "options": {
        ackTimeoutMs: 100,
        autoCommit: true,
        autoCommitIntervalMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        fetchMaxWaitMs: 10,
        fetchMinBytes: 1,
        fromOffset: "earliest",
        heartbeatInterval: 250,
        partitionerType: 3,
        protocol: ["roundrobin"],
        requireAcks: 1,
        retryMinTimeout: 250,
        sessionTimeout: 8000,
        ssl: false,
    },
    "produceFlushEveryMs": 1000,
    "queue.buffering.max.messages": 100000,
    "queue.buffering.max.ms": 1000,
    "retry.backoff.ms": 200,
    "socket.keepalive.enable": true,
    "workerPerPartition": 1,
};
exports.default = async (options) => {
    const config = lodash_1.merge(defaultOptions, options);
    const processor = new Processor_1.default(config);
    await processor.start();
    return processor;
};
//# sourceMappingURL=index.js.map