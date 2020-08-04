/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('transfers', {
    id: 'id',
    amount: { type: 'integer', notNull: true },
    fromAccountId: { type: 'integer', notNull: true, references: '"accounts"' },
    toAccountId: { type: 'integer', notNull: true, references: '"accounts"' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  })
};

exports.down = pgm => {
  pgm.dropTable('transfers', {
    ifExists: true,
  })
};


