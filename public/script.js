$(document).ready(() => {

})

function getPosts() {
    var request = $.ajax({
        url: "/api/posts",
        method: "GET",
        dataType: "json"
    });

    request.done((data) => {
        if (data.error) {
            console.log('[LOAD] Failed');
            return;
        }

        data.posts.forEach((v) => {
            addPostToFeed(v.message);
        });
    });

    request.fail((jq, status) => {
        console.log('[LOAD] Failed: ' + status);
    });
}

function addPostToFeed(post) {

}

function mapMessageToParrots(msg) {
    var atoms = msg.split(' ');
    var img = '';

    atoms.forEach((v) => {
        if (v.startsWith(':') && v.endsWith(':')) {
            v = v.replace(/\:/g, '');
            img += '<img src="http://parrotnetwork-parrots.s3-eu-west-1.amazonaws.com/' + v + '.gif" />';
        }
    });

    return img;
}