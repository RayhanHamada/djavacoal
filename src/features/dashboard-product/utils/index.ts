export function extractYoutubeID(url: string) {
    const pattern =
        /^(?:.*(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/))?([a-zA-Z0-9_-]{11})$/;

    const match = url.match(pattern);
    return match?.[1];
}
