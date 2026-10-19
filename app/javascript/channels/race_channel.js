import consumer from "channels/consumer"

const raceId = new URLSearchParams(window.location.search).get("race_id") || "123"

window.raceChannel = consumer.subscriptions.create({channel: "RaceChannel", race_id: raceId}, 
  {
  connected() {
    console.log("RaceChannel connected")
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("Recieved data: ", data)

    if (data.progress !== undefined) {
      window.dispatchEvent(
        new CustomEvent("race:progress", {
          detail: {
            player_id: data.player_id,
            progress: data.progress
          }
        })
      )
      console.log(`Player ${data.player_id} progress: ${data.progress}%`)
    } else if (data.message !== undefined) {
      console.log("Message from Rails:", data.message)
    }
  }
});
