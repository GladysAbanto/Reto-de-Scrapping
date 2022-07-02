export const autoScroll = () => new Promise((res) => {
    let scrollUnit = 80;

    const intervalId = setInterval(() => {
        window.scrollTo(0, scrollUnit);
        scrollUnit += 80;
        if (scrollUnit > document.body.scrollHeight) {
            clearInterval(intervalId);
            res();
        }
    }, 100);

});