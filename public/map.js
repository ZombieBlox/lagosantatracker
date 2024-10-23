function GetTimeInCurrentYear(v) {
    let yearDiff = new Date().getUTCFullYear() - 2019

    return v + (31556926000 * yearDiff)
}

var map = L.map('map').setView([0,0], 4);

let santaIcon = L.icon({
    iconUrl: "santa.png",
    iconSize: [320, 258]
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

let marker = L.marker([51.5, -0.09], {icon: santaIcon})
marker.addTo(map)
marker.bindPopup('A pretty CSS popup.<br> Easily customizable.')
marker.openPopup()

var bounds = L.bounds(
    L.point(-8.704895, 18.92874), 
    L.point(12.03598, 37.77284)
)

// Set the max bounds
map.setMaxBounds(bounds)

let start
let end

let startPos
let endPos

let destinations = await GetDestinations()
destinations = destinations["destinations"]

async function recalculate() {
    var now = new Date(new Date().toUTCString()).getTime()

    start = null
    end = null
    startPos = null
    endPos = null

    for (let i = 0; i < destinations.length; i++) {
        let dest = destinations[i]

        let startPart
        let startCoord

        if (i > 0) {
            startPart = GetTimeInCurrentYear(destinations[i - 1]["departure"])
            startCoord = destinations[i - 1]["location"]
        } else {
            startPart = GetTimeInCurrentYear(dest["departure"])
            startCoord  = dest["location"]
        }

        let endPart = GetTimeInCurrentYear(dest["arrival"])
        let endCoord = dest["location"]
        
        if (now < endPart && now >= startPart) {
            
            end = endPart
            start = startPart

            startPos = [startCoord["lat"], startCoord["lng"]]
            endPos = [endCoord["lat"], endCoord["lng"]]
        }
    }
}

async function upd() {
    setTimeout(await upd, 10)

    if (startPos == null) {
        await recalculate()
        return
    }

    let now = new Date(Date.now()).getTime()

    let prop = (now - start) / (end - start)

    var A = startPos[0] + ((endPos[0] - startPos[0]) * prop)
    var B = startPos[1] + ((endPos[1] - startPos[1]) * prop)

    marker.setLatLng([A, B])

    if (prop >= 1) {
        await recalculate()
    }
}

await upd()

async function GetDestinations() {
    let response = await fetch("https://firebasestorage.googleapis.com/v0/b/santa-api.appspot.com/o/route%2Fsanta.json?alt=media&token=x")
    var now = new Date(new Date().toUTCString()).getTime()
    return response.json() /*{
        destinations: [
            {
                id: "takeoff",
                arrival: now,
                departure: now,
                city: "Santa's Village",
                region: "North Pole",
                location: {
                    lat: 84.6,
                    lng: 168
                }
            },
            {
                id:"provideniya",
                arrival: now + 10000,
                departure: now + 20000,
                city: "Provideniya",
                region: "Russia",
                location: {
                    lat: 64.436249,
                    lng: -173.233337
                }
            },
            {
                id: "anadyr",
                arrival: now + 50000,
                departure: now + 60000,
                city: "Anadyr",
                region: "Russia",
                location: {
                    lat: 64.736656,
                    lng: 177.477371
                }
            }
        ]
    }*/ 
}

if (destinations) {
    for (let i = 0; i < destinations.length; i++) {
        let dest = destinations[i]
        let marker = L.marker([dest["location"]["lat"], dest["location"]["lng"]])
        marker.addTo(map)
        marker.bindPopup(`
            <div style="background-color: lightgrey; border-radius: 20px; padding: 10px; margin: 0px; font-size: 15px"><b>Destination:</b> ${dest["city"]}, ${dest["region"]} </div>
            <br/>
            <div style="background-color: lightgrey; border-radius: 20px; padding: 10px; margin: 0px; font-size: 15px"><b>Arrival:</b> ${dest["arrival"]} </div>
            `)
    }
    await recalculate()
}