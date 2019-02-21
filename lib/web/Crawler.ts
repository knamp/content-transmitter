import EventEmitter from "events";

import Promise from "bluebird";
import NodeCrawler from "crawler";

import ConfigInterface from "./../interfaces/ConfigInterface";
import ProducerPayloadInterface from "./../interfaces/ProducerPayloadInterface";

export default class Crawler extends EventEmitter {

  private spider: NodeCrawler;

  constructor(config: ConfigInterface) {
    super();

    this.spider = new NodeCrawler(config.crawler);
  }

  public transform(body: string): string {
    return body.replace(/\r?\n|\r/g, " ").trim();
  }

  public crawl(url: string): Promise<ProducerPayloadInterface> {
    return new Promise((resolve, reject) => {
      this.spider.queue({
        callback: (error, result, done) => {
          done();

          if (error) {
            return reject(error);
          }

          const payload: ProducerPayloadInterface = {
            content: this.transform(result.body),
            url,
          };

          resolve(payload);
        },
        jQuery: false,
        uri: url,
      });
    });
  }

  public close(): void {
    // empty
  }

  private handleError(error: Error): void {
    super.emit("error", error);
  }
}
