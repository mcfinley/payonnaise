/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('profiles', {
    id: 'id',
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    deleted: { type: 'boolean', notNull: true, default: false },
  })
};

exports.down = pgm => {
  pgm.dropTable('profiles', {
    ifExists: true,
  })
};


