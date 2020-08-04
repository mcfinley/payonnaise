/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('accounts', {
    id: 'id',
    asset: { type: 'string', notNull: true },
    profileId: { type: 'integer', notNull: true, references: '"profiles"' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    deleted: { type: 'boolean', notNull: true, default: false },
  })
};

exports.down = pgm => {
  pgm.dropTable('accounts', {
    ifExists: true,
  })
};


