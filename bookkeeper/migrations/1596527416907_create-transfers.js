/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('transfers', {
    id: 'id',
    amount: { type: 'integer', notNull: true },
    from_account_id: { type: 'integer', notNull: true, references: '"accounts"' },
    to_account_id: { type: 'integer', notNull: true, references: '"accounts"' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  })
};

exports.down = pgm => {
  pgm.dropTable('transfers', {
    ifExists: true,
  })
};


