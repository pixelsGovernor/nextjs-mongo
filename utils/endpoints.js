export const urlGiphy = ( {endpoint, page = 25, search, token}) => `https://api.giphy.com/v1/gifs/${endpoint}?api_key=${token}&limit=${page}&rating=g&lang=en${search ? `&q=${search}` : ''}`;
