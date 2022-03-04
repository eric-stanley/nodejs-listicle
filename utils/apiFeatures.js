class APIFeatures {
  constructor(query, queryString, defaultField, defaultPage, defaultLimit) {
    this.query = query;
    this.filters = queryString.filters;
    this.options = queryString.options;
    this.fields = queryString.fields.select;

    this.defaultField = defaultField;
    this.defaultPage = defaultPage;
    this.defaultLimit = defaultLimit;
  }

  filter() {
    this.query = this.query.find(this.filters);
    return this;
  }

  sort() {
    if (this.options && this.options.sort) {
      const sortBy = this.options.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(this.defaultField);
    }
    return this;
  }

  select() {
    if (this.fields) {
      const selectFields = this.fields.split(',').join(' ');
      this.query = this.query.select(selectFields);
    } else {
      this.query = this.query.select(this.defaultField);
    }
    return this;
  }

  paginate() {
    let page = this.defaultPage;
    let limit = this.defaultLimit;

    if (this.options) {
      page = this.options.page;
      limit = this.options.limit;
    }

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
