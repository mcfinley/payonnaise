/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('accounts', {
    id: 'id',
    asset: { type: 'string', notNull: true },
    ownerId: { type: 'integer', notNull: true, references: '"users"' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  })
};

exports.down = pgm => {
  pgm.dropTable('accounts', {
    ifExists: true,
  })
};


