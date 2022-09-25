const ajax = new XMLHttpRequest();
const container = document.getElementById("root");
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store = {
    currentPage: 1,
};

function getData(url) {
    ajax.open("GET", url, false);
    ajax.send();

    return JSON.parse(ajax.response)
}

function newsFeed() {
    const newsFeed = getData(NEWS_URL);
    const newList = [];
    let template = `
        <div class="container mx-auto p-4">
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}      
            </ul>
            <div>
                <a href="#/page/{{__prev_page__}}">이전 페이지</a>
                <a href="#/page/{{__next_page__}}">다음 페이지</a>
            </div>
        </div>
    `;

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        newList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title} (${newsFeed[i].comments_count})
                </a>
            </li>
        `);
    };

    template = template.replace("{{__news_feed__}}", newList.join(""));
    template = template.replace("{{__prev_page__}}", store.currentPage - 1 < 1 ? 1 : store.currentPage - 1);
    template = template.replace("{{__next_page__}}", store.currentPage + 1 > 3 ? 3 : store.currentPage + 1);

    container.innerHTML = template;
};

function newsDetail() {
    const id = location.hash.substring(1);

    const newsContent = getData(CONTENT_URL.replace("@id", id));

    container.innerHTML = `
        <h1>${newsContent.title}</h1>

        <div>
            <a href=#>목록으로</a>
        </div>
    `;
};

function router() {
    const routePath = location.hash;

    if (routePath === "") {
        newsFeed();
    } else if (routePath.indexOf("#/page/") >= 0) {
        store.currentPage = Number(routePath.substring(7));
        newsFeed();
    } else {
        newsDetail();
    }
}

window.addEventListener("hashchange", router);

router();
