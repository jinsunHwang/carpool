

wijmo.setLicenseKey('lge-svc--c.container.force.com|lge-svc--c.vf.force.com|force.com|lge-svc.lightning.force.com|lge-svc--dev.sandbox.lightning.force.com|lge-svc--dev--c.sandbox.container.force.com|lge-svc--fs.sandbox.lightning.force.com|lge-svc--fs--c.sandbox.container.force.com,594147425523997#B0NZsxGLt36YuU6Yy3mZuIXZulWY496bj9yYt4yY6NXLldGbiojIz5GRiwiIkqI1QeJ1UeJ1oSJ1AeK1YeJ1iojIh94QiwiI7kTOzITN5IDN7QTM4kTNiojIklkIs4XXbpjInxmZiwiIyYnMyAjMiojIyVmdiwSZzxWYmpjIyNHZisnOiwmbBJye0ICRiwiI34TQqBFWz9EdEN7Y5NkbRRFO6R4MRBFa63ESu5mah9mdHJzY9JVYohUeD3GT4gEWMR6LDJmTTNDWN54aI9mWsF4KyoUb8IUcBtCMVFHRyU5Ksd6Svp4UWplYvhXW7RFRoZUcPlHe62STxgGSlRHdWVWY63USuhzcXB7ZQN4dEBVV5AjZsdjcDFUdxgzSFNEMVNWR9EHa7V5Upp6UwU5TysWc4EXU9RFWSlDS5gXZB5GTaBFdjd6Ywo6dwkUdvtkbpRDewglUOhGRCZEMVR7TYdjW4VjN4tmS0JUdxIFU0BnMYVTM7QkbDJlUtFlQ6pEThhmRBNEdwcnSnFHULlDdWJ4TiRlRiFUe4MFSJNHavxmM7MjUxZTSCZ6QTNkMIBjZCZDa5NFNZ96bx3mezZWYO34aoV4a6lGNFd7LWRVb9F6Z8d4L7JWVThGdFNFR8IzbGJXWsZXVvglI0IyUiwiI7kTRBNUO4YjI0ICSiwyM4cjMyIDN7ATM0IicfJye35XX3JSSwIjUiojIDJCLi86bpNnblRHeFBCI4VWZoNFelxmRg2Wbql6ViojIOJyes4nI5kkTRJiOiMkIsIibvl6cuVGd8VEIgIXZ7VWaWRncvBXZSBybtpWaXJiOi8kI1xSfis4N8gkI0IyQiwiIu3Waz9WZ4hXRgAydvJVa4xWdNBybtpWaXJiOi8kI1xSfiQjR6QkI0IyQiwiIu3Waz9WZ4hXRgACUBx4TgAybtpWaXJiOi8kI1xSfiMzQwIkI0IyQiwiIlJ7bDBybtpWaXJiOi8kI1xSfiUFO7EkI0IyQiwiIu3Waz9WZ4hXRgACdyFGaDxWYpNmbh9WaGBybtpWaXJiOi8kI1tlOiQmcQJCLiITM4MjMxAyMyUDMzIDMyIiOiQncDJCLi46bj9SZjJ7bm9icl9WahRnbvNmL83mYk9WYz9yYt4ycm5SLjZ7ctU6ZsxSbvNmLlNmcvZmLn9WauRHanlGbug7biRmbhNnLzZWLtMmdz5SZnxGLt36YuU6Yy3mZuIXZulWY496bj9CevJGZuF6cuMWLtYXZk5SLjZ7ctU6ZsxSbvNmLlNmcvZmLn9WauRHanlGbug7biRmbhNnL6VGZt4yY6NXLldGbs46bj9SZjJ7bm9yZulmb4h6ZpxmLjZ7ctU6ZsxSbvNmLlNmcvZGLt36YuU6Yy3mZuYmduMWLtMZdM1');

document.readyState === 'complete' ? init() : window.onload = init;
function init() {
    const refineURL = () => {
        const params = new Map();
        decodeURIComponent(window.location.search.substring(1)).split('?').map(variable => {
            const [key, value] = variable.split('=');
            params.set(key, value);
        });
        return params;
    };

    let TabId;

    if(refineURL().get('TabId') == undefined){
        TabId = 'newUnComplete';
    }
    else{
        refineURL().get('TabId').split('&',1);
        TabId = refineURL().get('TabId').split('&')[0];
    }

    switch(TabId){
        case 'unComplete':
            UnCompleteGrid.init();
            break;
        case 'complete':
            CompleteGrid.init();
            break;
        case 'newUnComplete' :
            newUnCompleteGrid.init();
            break;
    }

}
