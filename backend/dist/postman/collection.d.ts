export declare const getPostmanCollection: (baseUrl?: string) => {
    info: {
        _postman_id: string;
        name: string;
        description: string;
        schema: string;
    };
    variable: {
        key: string;
        value: string;
        type: string;
    }[];
    item: {
        name: string;
        item: ({
            name: string;
            request: {
                method: string;
                header: {
                    key: string;
                    value: string;
                }[];
                body: {
                    mode: string;
                    raw: string;
                };
                url: {
                    raw: string;
                    host: string[];
                    path: string[];
                    query?: undefined;
                };
                description: string;
            };
        } | {
            name: string;
            request: {
                method: string;
                url: {
                    raw: string;
                    host: string[];
                    path: string[];
                    query: {
                        key: string;
                        value: string;
                    }[];
                };
                description: string;
                header?: undefined;
                body?: undefined;
            };
        } | {
            name: string;
            request: {
                method: string;
                url: {
                    raw: string;
                    host: string[];
                    path: string[];
                    query?: undefined;
                };
                description: string;
                header?: undefined;
                body?: undefined;
            };
        } | {
            name: string;
            request: {
                method: string;
                header: {
                    key: string;
                    value: string;
                }[];
                url: {
                    raw: string;
                    host: string[];
                    path: string[];
                    query?: undefined;
                };
                description: string;
                body?: undefined;
            };
        })[];
    }[];
};
