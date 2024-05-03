const bg = document.getElementById("presentation-bg");
const verifySticky = () => {
    const boundingTop = parseInt(bg.getBoundingClientRect().top);
    const styleTop = parseInt(getComputedStyle(bg).top);
    const isSticky = getComputedStyle(bg).position == "sticky";
    if (boundingTop <= styleTop && isSticky) {
        bg.setAttribute("sticky", "true");
    } else bg.removeAttribute("sticky");
};
onscroll = verifySticky;