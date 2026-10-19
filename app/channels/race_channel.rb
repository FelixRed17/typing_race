class RaceChannel < ApplicationCable::Channel
  def subscribed
    @race_id = params[:race_id]

    reject unless @race_id.present?

    stream_from "race_#{@race_id}"
  end

  def speak(data)
    return unless @race_id

    ActionCable.server.broadcast(
      "race_#{@race_id}",
      { message: data["message"] }
    )
  end

  def update_progress(data)
    return unless @race_id

    ActionCable.server.broadcast(
      "race_#{@race_id}",
      {
        player_id: data["player_id"],
        progress: data["progress"]
      }
    )
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
