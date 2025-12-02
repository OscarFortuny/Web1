export function logRequestParams(req, res, next) {

    console.log(JSON.stringify({
        routeParams: req.params,
        queryParams: req.query,
        bodyParams: req.body
    }));

    next();
}