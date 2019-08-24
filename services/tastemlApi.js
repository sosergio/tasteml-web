import fetch from "isomorphic-unfetch";
var tinycolor = require("tinycolor2");


class TastemlApi {
  constructor() {
    this.baseUrl = "https://tasteml-api.herokuapp.com";
  }

  async getWines(country, minPrice, maxPrice, cluster) {
    const clusterFilter = cluster ? `&sort=to_${cluster}` : "";
    const countryFilter = country ? `&country=${country}` : "";
    const minPriceFilter = minPrice ? `&min_price=${minPrice}` : "";
    const maxPriceFilter = maxPrice ? `&max_price=${maxPrice}` : "";
    let qs = clusterFilter + countryFilter + minPriceFilter + maxPriceFilter;
    if (qs.length > 0) qs = "?" + qs.substring(1, qs.length);
    const res = await fetch(`${this.baseUrl}/tasting-notes${qs}`);
    return await res.json();
  }

  async getClusters() {
    const res = await fetch(`${this.baseUrl}/clusters/hierarchy`);
    const root = await res.json();
    return root;
  }

  async getFlavours() {
    const res = await fetch(`${this.baseUrl}/flavours`);
    const array = await res.json();
    let hashmap = {};
    
    for (let t of array) {
      let textColor = tinycolor(t.primary).isDark() ? '#fff' : '#000';
      hashmap[t.name] = [t.primary, textColor]
    };
    return hashmap;
  }

  async getTastingNote(id) {
    const url = `${this.baseUrl}/tasting-notes/${id}`;
    const res = await fetch(url);
    return res.json()
  }
}

export default TastemlApi;
