function GetTimeInCurrentYear(v) {
    let yearDiff = new Date().getUTCFullYear() - 2019

    return v + (31556926000 * yearDiff)
}

class Countdown extends HTMLElement {
    constructor() {
        super()

        this.christmas = GetTimeInCurrentYear(1577181600000)
        this.time = 0
        
        this.startTicking()
    }

    render() {
        var days = Math.floor(this.time / (1000 * 60 * 60 * 24));
        var hours = Math.floor((this.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((this.time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((this.time % (1000 * 60)) / 1000);

        let text = days.toString().padStart(2, "0") + ":" + hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0")

        this.innerHTML =  "<div class='countdown'>" + days.toString().padStart(2, "0") + "<div style='width: 4px; height: 95%; background-color: white; margin-left: 10px; margin-right: 10px; border-radius: 10px'> </div>" + hours.toString().padStart(2, "0") + "<div style='width: 4px; height: 95%; background-color: white; margin-left: 10px; margin-right: 10px; border-radius: 10px'> </div>" + minutes.toString().padStart(2, "0") + "<div style='width: 4px; height: 95%; background-color: white; margin-left: 10px; margin-right: 10px; border-radius: 10px'> </div>" + seconds.toString().padStart(2, "0") + "</div>"
    }
    
    tick() {
        var now = new Date();
        let distance = (this.christmas - now)

        if (distance < 0) {
            distance = 0
            this.setAttribute("hidden", "")
            if (document.querySelector("#map-container")) {
                document.querySelector("#map-container").removeAttribute("hidden")
            }
        } else {
            this.removeAttribute("hidden")
            if (document.querySelector("#map-container")) {
                document.querySelector("#map-container").setAttribute("hidden", "")
            }
        }

        this.time = distance

        this.render()
    }

    startTicking() {
        this.tick()
        setTimeout(this.startTicking.bind(this), 500)
    }
}

customElements.define("santa-countdown", Countdown)

class SceneButton extends HTMLElement {
    constructor() {
        super()

        this.innerHTML = `<a href='/scenes/${this.getAttribute("href")}'>Hey!</a>`
    }
}

customElements.define("santa-scene-button", SceneButton)

class Button extends HTMLElement {
    constructor() {
        super()

        this.innerHTML = `<div class="round-button"> ${this.getAttribute("href") != undefined ? ` <a href="${this.getAttribute("href")}"> <svg width="50" height="50"> <path stroke-width="${this.getAttribute("stroke-width")}" fill=${this.getAttribute("fill")} stroke="${this.getAttribute("stroke")}" d="${this.getAttribute("d")}"> </svg> </a> ` : `<button onclick="${this.getAttribute("onclick")}"> <svg> <path stroke-width="5" stroke="white" d="${this.getAttribute("d")}"> </svg> </button>`} </div>`
    }
}

customElements.define("santa-button", Button)