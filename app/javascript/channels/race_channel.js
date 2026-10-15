import consumer from "channels/consumer"

window.raceChannel = consumer.subscriptions.create("RaceChannel", {
  connected() {
    console.log("RaceChannel connected")
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("Message from rails: ", data.message)
  }
});
