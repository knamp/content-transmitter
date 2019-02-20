import EventEmitter from "events";

import ConfigInterface from "./interfaces/ConfigInterface";
import ConsumerPayloadInterface from "./interfaces/ConsumerPayloadInterface";
import LoggerInterface from "./interfaces/LoggerInterface";
import ProducerPayloadInterface from "./interfaces/ProducerPayloadInterface";

import Consumer from "./kafka/Consumer";
import Producer from "./kafka/Producer";
import Crawler from "./web/Crawler";

import NullLogger from "./NullLogger";

export default class Processor extends EventEmitter {

  private consumer: Consumer;
  private producer: Producer;
  private crawler: Crawler;
  private logger: LoggerInterface;

  constructor(public config: ConfigInterface) {
    super();

    this.consumer = new Consumer(config, this.handleConsumerMessage.bind(this));
    this.producer = new Producer(config);
    this.crawler = new Crawler(config);

    this.consumer.on("error", this.handleError.bind(this));
    this.producer.on("error", this.handleError.bind(this));
    this.crawler.on("error", this.handleError.bind(this));

    this.logger = config.logger || NullLogger;
  }

  public async start(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  public close(): void {

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

  private async handleConsumerMessage(message: ConsumerPayloadInterface): Promise<void> {
    const logPayload = {identifier: message.key.toString(), url: message.url};

    this.logger.info("starting crawling", logPayload);

    const startTime = new Date().getTime();
    const payload: ProducerPayloadInterface = await this.crawler.crawl(message.url);
    const executionTime = new Date().getTime() - startTime;

    this.logger.info("finished crawling", {...logPayload, executionTime});

    await this.producer.produce(message.key, payload);

    this.logger.info("added content to queue", {...logPayload, topic: this.config.produceTo});
  }

  private handleError(error: Error): void {
    super.emit("error", error);
  }
}
