const authorize = (...roles) => {
    return (req, res, next) => {
        // TEMPORARY BYPASS FOR DEVELOPMENT AND POSTMAN TESTING
        next();
    };
};

export default authorize;
