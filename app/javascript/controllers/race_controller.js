import { Controller } from "@hotwired/stimulus"
import * as Phaser from "phaser"
import consumer from "channels/consumer"

export default class extends Controller {
    connect() {
        this.element.replaceChildren()

        const passage = this.element.dataset.passage
        const raceId = this.element.dataset.raceId

        const controller = this

        this.raceChannel = consumer.subscriptions.create(
          {
            channel: "RaceChannel",
            race_id: raceId
          },
          {
            connected() {
              console.log(`Connected to race ${raceId}`)
            },

            disconnected() {
              console.log(`Disconnected from race ${raceId}`)
            },

            received(data) {
              console.log("WebSocket received:", data)

              if (data.progress !== undefined) {
                window.dispatchEvent(
                  new CustomEvent("race:progress", {
                    detail: data
                  })
                )
              }
            }
          }
        )
        console.log("Joining race:", raceId)

        this.playerId = sessionStorage.getItem("typingRacePlayerId")

        if (!this.playerId) {
          this.playerId = crypto.randomUUID()
          sessionStorage.setItem("typingRacePlayerId", this.playerId)
        }

        this.handleProgress = (event) => {
          const { player_id, progress } = event.detail

          if (player_id === this.playerId) {
            return
          }

          this.updateOpponent(progress)
        }

        window.addEventListener("race:progress", this.handleProgress)

        this.game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: this.element,
            width: 800,
            height: 300,
            backgroundColor: "#182332",

            scene: {
                create() {
                    const road = this.add.rectangle(400, 150, 760, 140, 0x374151)

                    road.setStrokeStyle(4, 0xffffff)

                    for (let x= 50; x < 730; x += 60) {
                      this.add.rectangle(x, 150, 30, 4, 0xffffff)
                    }

                    this.add.rectangle(740, 150, 6, 140, 0xffffff)

                    this.car = this.add.rectangle(80, 185, 48, 24, 0x38bdf8)
                    this.car.setStrokeStyle(2, 0xffffff)

                    this.opponentCar = this.add.rectangle(80, 115, 48, 24, 0xfb7185)
                    this.opponentCar.setStrokeStyle(2, 0xffffff)

                    let typedCount = 0

                    const startX = this.car.x
                    const finishX = 740 - this.car.width / 2

                    this.input.keyboard.on("keydown", (event) => {
                      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
                        return
                      }

                      if (event.key.length !== 1 || typedCount >= passage.length) {
                        return
                      }

                      event.preventDefault()

                      const expectedCharacter = passage[typedCount]

                      if (event.key !== expectedCharacter) {
                        return
                      }

                      typedCount += 1

                      const progress = typedCount / passage.length

                      this.car.x = startX + (finishX - startX) * progress

                      controller.sendProgress(progress)

                      if (typedCount === passage.length) {
                        this.add.text(20, 250, "Finished!", {
                          fontSize: "24px",
                          color: "#38bdf8"
                        })
                      }
                    })
                }
            }
        })
    }

    sendProgress(progress) {
      if (!this.raceChannel) return

      this.raceChannel.perform("update_progress", {
        player_id: this.playerId,
        progress: Math.round(progress * 100)
      })
    }

    updateOpponent(progress) {
      const scene = this.game?.scene.scenes[0]

      if (!scene?.opponentCar) return

      const startX = 80
      const finishX = 740 - scene.opponentCar.width / 2

      scene.opponentCar.x = startX + (finishX - startX) * (progress / 100)
    }

    disconnect() {
      window.removeEventListener("race:progress", this.handleProgress)

      if (this.raceChannel) {
        consumer.subscriptions.remove(this.raceChannel)
        this.raceChannel = null
      }

      this.game?.destroy(true)
      this.game = null
    }
}