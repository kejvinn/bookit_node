export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findOne(conditions = {}, options = {}) {
    return await this.model.findOne({
      where: conditions,
      ...options
    });
  }

  async findAll(conditions = {}, options = {}) {
    return await this.model.findAll({
      where: conditions,
      ...options
    });
  }

  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const instance = await this.findById(id);
    if (!instance) return null;
    return await instance.update(data, options);
  }

  async delete(id, options = {}) {
    return await this.model.destroy({
      where: { id },
      ...options
    });
  }

  async softDelete(id) {
    return await this.update(id, { deleted: new Date() });
  }

  async count(conditions = {}, options = {}) {
    return await this.model.count({
      where: conditions,
      ...options
    });
  }

  async exists(conditions) {
    const count = await this.count(conditions);
    return count > 0;
  }
}