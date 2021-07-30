const topics = Object.create(null);

const pubsub = {
  subscribe(topic, fn) {
    if (!(topic in topics)) {
      topics[topic] = [];
    }
    topics[topic].push(fn);
  },

  unsubcribe(topic, fn) {
    topics[topic] = topics[topic].filter((f) => f !== fn);
    if (topics[topic].length === 0) {
      delete topics[topic];
    }
  },

  publish(topic, event) {
    topics[topic].forEach((fn) => fn(event));
  },
};

export default pubsub;
