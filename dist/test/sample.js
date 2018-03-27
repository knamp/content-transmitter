"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../");
(async () => {
    // tslint:disable-next-line
    console.log("Content-Transmitter starting..");
    const processor = await _1.default({
        clientName: "transmitter-client",
        consumeFrom: "transmitter-consume",
        groupId: "transmitter-group",
        produceTo: "generator-consume",
    });
    processor.on("error", (error) => {
        // tslint:disable-next-line
        console.error(error);
    });
    // tslint:disable-next-line
    console.log("Content-Transmitter running.");
})();
//# sourceMappingURL=sample.js.map