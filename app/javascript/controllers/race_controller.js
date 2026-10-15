import { Controller } from "@hotwired/stimulus"
import * as Phaser from "phaser"

export default class extends Controller {
    connect() {
        this.element.replaceChildren()

        const passage = this.element.dataset.passage

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

                      const progress = typedCount/passage.length

                      this.car.x = startX + (finishX -startX) * progress

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

    disconnect() {
        this.game?.destroy(true)
        this.game = null
    }
}