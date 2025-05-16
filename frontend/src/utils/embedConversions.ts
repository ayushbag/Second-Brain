export function getId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

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

export function twitterTweetId(url: string): string {
    // Match the tweet ID from URLs like https://x.com/user/status/1234567890 or https://twitter.com/user/status/1234567890
    const match = url.match(/status\/(\d+)/);
    return (match && match[1]) ? match[1] : "";
}
