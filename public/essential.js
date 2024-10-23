let header = document.querySelector("header")

let html = `
    <div>
        <santa-button stroke="white" stroke-width="${document.location.pathname == "/" ? "5" : "1"}" fill="${document.location.pathname == "/" ? "none" : "white"}"  ${document.location.pathname == "/" ? "onclick='document.toggleMenu(); event.stopPropagation();'" : 'href="/"'} d="${document.location.pathname == "/" ? "M5 12.5 h30 M5 25 h30 M5 37.5 h30" : "M 13 27 L 25 15 L 37 27 L 33 27 L 33 40 H 28 V 32 H 22 V 40 L 17 40 L 17 27 z"}">
</svg>">
    </div>
    <div>
        <santa-countdown></santa-countdown>
    </div>
    <link rel="stylesheet" href="/header.css">
    <link rel="stylesheet" href="/style.css">
`

if (header) {
    document.toggleMenu = () => {
        let menu = document.querySelector(".menu-container")

        if (menu) {
            if (menu.classList.contains("menu-closed")) {
                menu.classList.remove("menu-closed")
                menu.classList.add("menu-open")
            } else {
                menu.classList.add("menu-closed")
                menu.classList.remove("menu-open")   
            }
        }
    }
    header.innerHTML = html
}