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
    if (url.search("x")) {
        const link = url.replace('x', 'twitter')
        return link
    } else if (url.search('twitter')) {
        return url
    } else {
        return "Invalid Link"
    }
}