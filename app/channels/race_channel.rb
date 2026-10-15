class RaceChannel < ApplicationCable::Channel
  def subscribed
    stream_from "race_demo"
  end

  def speak(data)
    ActionCable.server.broadcast(
      "race_demo",
      { message: data["message"] }
    )
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
