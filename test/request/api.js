import request from './request.js'

export const getPlace = (data) => {
    return request({
        method: 'GET',
        url: 'https://cdn.contentful.com/spaces/u0ol5so5qhwk/environments/master/entries',
        params: data
    });
};

export const get = (data) => {
    return request({
        method: 'GET',
        url: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        params: data
    });
}
