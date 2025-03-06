export function generateIframeMarkup(url: string): string | null {
    function getId(url: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const videoId = getId(url);
    if (videoId) {
        const embedLink = `https://www.youtube.com/embed/${videoId}`
        return embedLink;
    }
    return null;
}

export function twitterTweet(url: string) {
    const cleanUrl = url.split('?')[0];
    if (cleanUrl.includes("x")) {
        const link = cleanUrl.replace('x', 'twitter');
        return link;
    } else if (cleanUrl.includes('twitter')) {
        return cleanUrl;
    } else {
        return "Invalid Link";
    }
}