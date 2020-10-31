// Burak Sekili - 2020 General Engineering Assignment
const Router = require('./router')

const linkArr = [
    { name: "Burak's Github", url: 'https://github.com/buraksekili' },
    { name: "Burak's Linkedin", url: 'https://www.linkedin.com/in/sekili/' },
    { name: "Burak's Medium", url: 'https://medium.com/@buraksekili0' },
]

class LinksTransformer {
    constructor(links) {
        this.links = links
    }

    async element(element) {
        const elementTagName = element.tagName
        if (elementTagName == 'div' && element.hasAttribute('id')) {
            const elAttribute = element.getAttribute('id')
            if (elAttribute == 'links') {
                linkArr.forEach(link =>
                    element.append(`<a href="${link.url}">${link.name}</a>`, {
                        html: true,
                    })
                )
            } else if (elAttribute == 'profile') {
                element.removeAttribute('style')
            } else if (elAttribute == 'social') {
                element.removeAttribute('style')
                element.append(
                    ` <a href="https://github.com/buraksekili">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>`,
                    { html: true }
                )
            }
        } else if (
            elementTagName == 'img' &&
            element.hasAttribute('id') &&
            element.getAttribute('id') == 'avatar'
        ) {
            // Declare your image source
            const imgSrc =
                'https://avatars3.githubusercontent.com/u/32663655?s=460&u=08b96c0d0e2a7550fa7023707a9f10bd0c8d77d4&v=4'
            element.setAttribute('src', imgSrc)
        } else if (
            elementTagName == 'h1' &&
            element.hasAttribute('id') &&
            element.getAttribute('id') == 'name'
        ) {
            element.setInnerContent('Burak Sekili')
        } else if (elementTagName == 'title') {
            element.setInnerContent('Burak Sekili - Cloudflare Application')
        } else if (elementTagName == 'body') {
            element.setAttribute('style', 'background-color: #FBD38D')
        }
    }
}

// handler() handles requests that come from from /links path.
function handler(request) {
    const init = {
        headers: { 'Content-type': 'application/json' },
    }
    const body = JSON.stringify(linkArr)
    return new Response(body, init)
}

// handleEvent() serves the transformed HTML page
async function handleEvent(event) {
    const URL = 'https://static-links-page.signalnerve.workers.dev'
    const content = await fetch(URL)

    const html = await new HTMLRewriter()
        .on('*', new LinksTransformer(linkArr))
        .transform(content)

    const init = {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    }
    const result = await html.text()
    return new Response(result, init)
}

async function handleRequest(request) {
    const r = new Router()

    r.get('/links', request => handler(request))
    r.get('.*', request => handler(request))

    const resp = await r.route(request)
    return resp
}

addEventListener('fetch', event => {
    if (event.request.url && event.request.url.endsWith('/links')) {
        return event.respondWith(handleRequest(event.request))
    }

    return event.respondWith(handleEvent(event))
})
